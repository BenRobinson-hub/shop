<template>
	<form class="form" @submit="checkForm">
		<view class="input-section">
			<view class="section-hd">支付金额</view>
			<view class="section-bd">
				<view class="input-group">
					￥
					<input v-model.number="money" class="input" name="money" type="digit" placeholder="0.00" />
				</view>
				<view v-if="payPrice" class="discount">会员优惠价：￥{{ payPrice }}</view>
			</view>
		</view>
		<view class="radio-section">
			<view class="section-hd">支付方式</view>
			<radio-group class="section-bd" name="method">
				<label class="item" v-if="yuePay">
					<text class="iconfont icon-yue"></text>
					<text class="name">
						余额支付
						<text class="money">可用余额:{{ now_money || 0 }}￥</text>
					</text>
					<radio value="yue" :checked="payType === 'yue'" />
				</label>
				<label v-if="wxpay" class="item">
					<text class="iconfont icon-weixinzhifu"></text>
					<text class="name">微信支付</text>
					<radio value="weixin" :checked="payType === 'weixin'" />
				</label>
			</radio-group>
		</view>
		<button class="button" form-type="submit">确认</button>
		<view class="alipay" v-html="alipayHtml"></view>
	</form>
</template>

<script>
	import {
		offlineCheckPrice,
		offlineCreate,
		orderOfflinePayType
	} from '@/api/order.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	const app = getApp();
	export default {
		data() {
			return {
				money: '',
				payPrice: '',
				payType: 'weixin',
				alipayHtml: '',
				alipay: false,
				wxpay: false,
				yuePay: false,
				paying: false,
				now_money: 0,
				isWeixin: false,
				site_name: '',
				isCommitted: false,
				isShowAuth: false
			};
		},
		watch: {
			money(newValue, oldValue) {
				if (newValue && typeof newValue === 'number') {
					this.checkPrice();
				} else {
					this.payPrice = '';
				}
			}
		},
		computed: mapGetters(['isLogin']),
		onLoad(options) {
			// #ifdef H5
			if (options.code) {
				let spid = app.globalData.spid ? app.globalData.spid : '';
				wechatAuthV2(options.code, spid).then(res => {
					location.href = decodeURIComponent(
						decodeURIComponent(options.back_url)
					)
				})
			}
			// #endif
		},
		onShow() {
			if (this.isLogin) {
				this.getPayType();
			}else{
				toLogin()
			}
			//#ifdef H5
			this.isWeixin = this.$wechat.isWeixin();
			//#endif
		},
		methods: {
			getPayType() {
				orderOfflinePayType()
					.then(res => {
						const {
							ali_pay_status,
							pay_weixin_open,
							yue_pay_status,
							offline_pay_status,
							site_name,
							now_money
						} = res.data;
						this.alipay = ali_pay_status === '1' ? true : false;
						this.wxpay = pay_weixin_open === 1 ? true : false;
						this.yuePay = yue_pay_status === 1 ? true : false;
						this.now_money = now_money;
						this.site_name = site_name;
						if (!offline_pay_status) {
							uni.showModal({
								title: '支付提醒',
								content: '线下支付已关闭，请点击确认按钮返回主页',
								showCancel: false,
								success() {
									uni.switchTab({
										url: '/pages/index/index'
									})
								}
							});
						}
						if (site_name) {
							uni.setNavigationBarTitle({
								title: site_name
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						});
					});
			},
			checkForm(e) {
				const {
					money,
					method
				} = e.detail.value;
				if (money) {
					this.combData(method);
				} else {
					uni.showToast({
						title: '请输入支付金额',
						icon: 'none'
					});
				}
			},
			// 优惠价
			checkPrice() {
				offlineCheckPrice({
						pay_price: this.money
					})
					.then(res => {
						this.payPrice = res.data.pay_price;
					})
					.catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						});
					});
			},
			// 组合数据
			combData(payType) {
				let data = {
					type: 3,
					pay_type: payType,
					from: 'weixinh5',
					price: this.payPrice || this.money,
					money: this.money
				};

				// #ifdef H5
				if (this.isWeixin) {
					data.from = 'weixin';
				}
				// #endif
				// #ifdef MP
				data.from = 'routine';
				// #endif
				if (this.paying) {
					return;
				}
				this.paying = true;
				uni.showLoading({
					title: '正在确认…'
				});
				offlineCreate(data)
					.then(res => {
						uni.hideLoading();
						this.callPay(res);
					})
					.catch(err => {
						this.paying = false;
						uni.showToast({
							title: err,
							icon: 'none'
						});
					});
			},
			// 调用支付
			callPay(res) {
				const {
					status,
					result
				} = res.data, {
						orderId,
						jsConfig
					} = result,
					goPages = '/pages/annex/offline_result/index?site_name=' + this.site_name;
				switch (status) {
					case 'ORDER_EXIST':
					case 'EXTEND_ORDER':
					case 'PAY_ERROR':
						this.paying = false;
						this.$util.Tips({
							title: res.msg
						}, {
							tab: 5,
							url: goPages
						});
						break;
					case 'SUCCESS':
						this.paying = false;
						this.money = '';
						this.$util.Tips({
							title: res.msg,
							icon: 'success'
						}, {
							tab: 5,
							url: goPages
						});
						break;
					case 'WECHAT_PAY':
						// #ifdef MP
						let that = this;
						let mp_pay_name=''
						if(uni.requestOrderPayment){
							mp_pay_name='requestOrderPayment'
						}else{
							mp_pay_name='requestPayment'
						}
						uni[mp_pay_name]({
							timeStamp: jsConfig.timestamp,
							nonceStr: jsConfig.nonceStr,
							package: jsConfig.package,
							signType: jsConfig.signType,
							paySign: jsConfig.paySign,
							success: function(res) {
								that.$util.Tips({
									title: '支付成功',
									icon: 'success'
								}, {
									tab: 5,
									url: '/pages/annex/offline_result/index'
								});
							},
							fail: function() {
								uni.showToast({
									title: '取消支付',
									icon: 'none',
									success: function() {
										that.paying = false;
									}
								});
							},
							complete: function() {
								that.paying = false;
								uni.hideLoading();
							}
						});
						// #endif
						// #ifndef MP
						this.$wechat
							.pay(result.jsConfig)
							.then(res => {
								this.paying = false;
								this.$util.Tips({
									title: '支付成功',
									icon: 'success'
								}, {
									tab: 5,
									url: '/pages/annex/offline_result/index'
								});
							})
							.catch(err => {
								this.paying = false;
								if (err.errMsg == 'chooseWXPay:cancel') {
									uni.showToast({
										title: '取消支付',
										icon: 'none'
									});
								}
							});
						// #endif
						break;
					case 'PAY_DEFICIENCY':
						this.paying = false;
						this.$util.Tips({
							title: res.msg
						});
						break;
					case 'WECHAT_H5_PAY':
						this.paying = false;
						uni.showToast({
							title: res.msg,
							success() {
								location.href = jsConfig.mweb_url;
							}
						});
						break;
					case 'ALIPAY_PAY':
						this.paying = false;
						// #ifdef H5
						if (this.$wechat.isWeixin()) {
							uni.navigateTo({
								url: `/pages/users/alipay_invoke/index?id=${orderId}&link=${jsConfig.qrCode}`
							});
						} else {
							this.alipayHtml = jsConfig;
							this.$nextTick(() => {
								document.getElementById('alipaysubmit').submit();
							});
						}
						// #endif
						// #ifdef MP
						uni.navigateTo({
							url: `/pages/users/alipay_invoke/index?id=${orderId}&link=${jsConfig.qrCode}`
						});
						// #endif
						break;
				}
			}
		}
	};
</script>

<style>
	page {
		background-color: #ffffff;
	}
</style>

<style lang="scss" scoped>
	/deep/uni-radio .uni-radio-input.uni-radio-input-checked {
	    border: 1px solid #FDC383 !important;
	    background-color: #FDC383 !important;
	}
	.input-section {
		.section-hd {
			padding: 30rpx;
			font-size: 28rpx;
			color: #666666;
		}

		.section-bd {
			padding-right: 30rpx;
			padding-left: 30rpx;
		}

		.input-group {
			display: flex;
			align-items: flex-end;
			padding: 45rpx 20rpx 47rpx;
			font-size: 80rpx;
			color: #999999;
		}

		.input {
			flex: 1;
			height: 110rpx;
			margin-left: 15rpx;
			font-size: 100rpx;
			color: #282828;
		}

		.discount {
			padding: 27rpx 20rpx;
			border-top: 1rpx solid #eeeeee;
			font-size: 28rpx;
			color: #e93323;
		}
	}

	.radio-section {
		border-top: 20rpx solid #f5f5f5;

		.section-hd {
			padding: 30rpx;
			font-size: 28rpx;
			color: #666666;
		}

		.section-bd {
			padding-left: 50rpx;
		}

		.item {
			display: flex;
			align-items: center;
			padding-top: 30rpx;
			padding-right: 30rpx;
			padding-bottom: 30rpx;
			border-bottom: 1rpx solid #f5f5f5;
		}

		.iconfont {
			font-size: 44rpx;
		}

		.icon-yue {
			color: #fe960f;
		}

		.icon-weixinzhifu {
			color: #41b035;
		}

		.icon-zhifubao {
			color: #099bdf;
		}

		.name {
			flex: 1;
			margin-left: 30rpx;
			font-size: 30rpx;
			color: #333333;
		}

		.money {
			float: right;
			padding-right: 20rpx;
			font-size: 20rpx;
		}
	}

	.button {
		height: 86rpx;
		border-radius: 43rpx;
		margin: 114rpx 30rpx 30rpx;
		background: linear-gradient(90deg, #FEE2B7 0%, #FDC383 100%);
		font-size: 30rpx;
		line-height: 86rpx;
		color: #5D3324;
	}
	.alipay {
		display: none;
	}
</style>
