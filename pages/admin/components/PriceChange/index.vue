<template>
	<!-- 退款页、一键改价页、订单备注页、立即退款立即退货页 -->
	<view>
		<!-- <view class="priceChange" :class="[change === true ? 'on' : '',status == 2 && !isRefund?'goodsOn':'']"> -->
		<view class="priceChange" :class="[change === true ? 'on' : '']">
			<view class="priceChange-box">
				<!-- status == 0? orderInfo.refund_status === 1? "立即退款": "一键改价": "订单备注" -->
				<view class="priceTitle">
					{{
					status == 8?'退款原因': status == 0?"一键改价": status == 1?'订单备注': isRefund?'退款审核':'退款审核'
        }}
					<view class="btn acea-row row-center row-middle" @click="close">
						<span class="iconfont icon-ic_close"></span>
					</view>
				</view>
				<!-- 一键改价 -->
				<view class="listChange" v-if="status == 0">
					<view class="item acea-row row-between-wrapper" v-if="orderInfo.refund_status === 0">
						<view>商品原价</view>
						<view class="money">
							¥{{ orderInfo.total_price }}
						</view>
					</view>
					<view class="item acea-row row-between-wrapper" v-if="orderInfo.refund_status === 0">
						<view>商品邮费</view>
						<view class="money">
							¥{{ orderInfo.pay_postage }}
						</view>
					</view>
					<view class="item acea-row row-between-wrapper" v-if="orderInfo.refund_status === 0">
						<view>修改价格</view>
						<view class="money">
							<input type="text" v-model="price" :cursor-spacing="40" always-embed :class="focus === true ? 'on' : ''" @focus="priceChange" />
						</view>
						<text class="iconfont icon-ic_edit"></text>
					</view>
				</view>
				<!-- 立即退款 -->
				<!-- <view class="listChange" v-if="status == 2">
					<view v-if="isRefund" class="item acea-row row-between-wrapper">
						<view>实际支付(¥)</view>
						<view class="money">
							{{ orderInfo.pay_price }}<span class="iconfont icon-suozi"></span>
						</view>
					</view>
					<view v-if="isRefund" class="item acea-row row-between-wrapper">
						<view>退款金额(¥)</view>
						<view class="money">
							<input type="text" v-model="refund_price" :class="focus === true ? 'on' : ''" @focus="priceChange" />
						</view>
					</view>
					<view class="title" v-if="!isRefund">同意退货退款</view>
				</view> -->
				<!-- 退款审核 -->
				<view class="listChange" v-if="status == 2">
					<view class="item acea-row row-between-wrapper">
						<view>审核状态</view>
						<view class="money acea-row row-right">
							<view class="radio-item acea-row row-middle" :class="{ on: isAgree }" @click="agreeChange(true)">
								<text class="iconfont" :class="isAgree?'icon-ic_Selected':'icon-ic_unselect'"></text>同意退{{isRefund?'款':'货'}}
							</view>
							<view v-if="orderInfo.refund_type != 4 && orderInfo.refund_type != 5" class="radio-item acea-row row-middle" :class="{ on: !isAgree }" @click="agreeChange(false)">
								<text class="iconfont" :class="isAgree?'icon-ic_unselect':'icon-ic_Selected'"></text>拒绝退款
							</view>
						</view>
					</view>
					<view class="item acea-row row-between-wrapper" v-if="isAgree && isRefund">
						<view>退款金额</view>
						<view class="money">
							<input type="text" v-model="refund_price" :cursor-spacing="50" :class="focus === true ? 'on' : ''" always-embed @focus="priceChange" />
						</view>
						<text class="iconfont icon-ic_edit"></text>
					</view>
					<view class="item acea-row row-between" v-if="!isAgree">
						<view>拒绝原因</view>
						<view class="money acea-row row-right">
							<textarea class="reason" placeholder="请输入" v-model="refuse_reason" fixed :cursor-spacing="100"></textarea>
						</view>
					</view>
				</view>
				<view class="listChange" v-if="status == 1">
					<textarea placeholder="请填写备注信息..." v-model="remark" fixed :cursor-spacing="100"></textarea>
				</view>
				<!-- <view class="listChange" v-if="status == 8">
					<textarea placeholder="请填写退款原因..." v-model="refuse_reason"></textarea>
				</view> -->
				<view class="modify-box acea-row">
					<view class="cancel btn-box" @click="close">取消</view>
					<view class="modify btn-box" @click="refuse" v-if="status == 8">确定</view>
					<view class="modify btn-box" @click="onConfirm" v-if="status == 2 && !isRefund">确定</view>
					<view class="modify btn-box" @click="save" v-if="status == 1 || status == 0">确定</view>
					<view class="modify btn-box" @click="onConfirm" v-if="status == 2 && isRefund">确定</view>
				</view>
				<slot name="bottom"></slot>
			</view>
			<view class="safe-area-inset-bottom"></view>
		</view>
		<view class="mask" @touchmove.prevent v-show="change === true"></view>
	</view>
</template>
<style lang="scss" scoped>
	.safe-area-inset-bottom {
		height: 0;
		height: constant(safe-area-inset-bottom);
		height: env(safe-area-inset-bottom);
	}

	.mask {
		z-index: 99;
	}

	.priceChange .reGoods {
		padding: 0 25upx;
		margin-top: 50upx;
	}

	.priceChange .reGoods .bnt {
		width: 250upx;
		height: 90upx;
		background-color: #2291f8;
		font-size: 32upx;
		color: #fff;
		text-align: center;
		line-height: 90upx;
		border-radius: 45upx;
	}

	.priceChange .reGoods .bnt.grey {
		background-color: #eee;
		color: #312b2b;
	}

	.priceChange {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99999;
		width: 100%;
		border-radius: 40rpx 40rpx 0 0;
		background: #FFFFFF;
		transform: translateY(100%);
		transition: transform 0.3s;
	}

	.priceChange.on {
		transform: translateY(0);
	}

	.priceChange-box {}

	.priceChange.goodsOn {
		height: 380upx;
	}

	.priceChange .priceTitle {
		position: relative;
		height: 108rpx;
		text-align: center;
		font-weight: 500;
		font-size: 32rpx;
		line-height: 108rpx;
		color: #333333;
	}

	.priceChange .priceTitle .btn {
		position: absolute;
		top: 50%;
		right: 32rpx;
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		margin-top: -18rpx;
		background: #EEEEEE;
		text-align: center;
		line-height: 36rpx;
	}

	.priceChange .priceTitle .iconfont {
		vertical-align: text-bottom;
		font-weight: normal;
		font-size: 24rpx;
	}

	.priceChange .listChange {
		padding: 32rpx;
		min-height: 260rpx;
	}

	.priceChange .listChange .item {
		margin-bottom: 64rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333333;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.priceChange .listChange .title {
		font-size: 32rpx;
		text-align: center;
		margin-top: 52rpx;
	}

	.priceChange .listChange .item .money {
		flex: 1;
		text-align: right;
		font-family: Regular;
		font-size: 36rpx;
	}

	.priceChange .listChange .item .iconfont {
		margin-left: 8rpx;
		font-size: 32rpx;
	}

	.priceChange .listChange .item .money input {
		color: #FF7E00;
	}

	.priceChange .listChange .item .money input.on {
		// color: #666;
	}

	.priceChange .modify-box {
		padding: 20rpx;
	}

	.priceChange .btn-box {
		flex: 1;
		height: 72rpx;
		border: 2rpx solid #4C88FF;
		border-radius: 36rpx;
		margin-right: 16rpx;
		text-align: center;
		font-weight: 500;
		font-size: 26rpx;
		line-height: 68rpx;
		color: #4C88FF;

		&:last-child {
			margin-right: 0;
		}
	}

	.priceChange .modify {
		border-color: #2A7EFB;
		background: #2A7EFB;
		color: #FFFFFF;
	}

	.priceChange .modify1 {
		font-size: 32upx;
		color: #312b2b;
		width: 490upx;
		height: 90upx;
		text-align: center;
		line-height: 90upx;
		border-radius: 45upx;
		background-color: #eee;
		margin: 30upx auto 0 auto;
	}

	.priceChange .listChange textarea {
		box-sizing: border-box;
		border: 2rpx solid #CCCCCC;
		width: 100%;
		height: 224rpx;
		padding: 20rpx;
		border-radius: 16rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		color: #333;
	}

	.radio-item {
		font-size: 28rpx;
		color: #999999;

		+.radio-item {
			margin-left: 48rpx;
		}

		.iconfont {
			margin-right: 12rpx;
			font-size: 32rpx;
		}

		&.on {
			color: #333333;

			.iconfont {
				color: #2A7EFB;
			}
		}
	}

	.reason {
		width: 462rpx !important;
		height: 80rpx !important;
		padding: 0 !important;
		border: 0 !important;
	}
</style>
<script>
	export default {
		name: "PriceChange",
		components: {},
		props: {
			change: {
				type: Boolean,
				default: false
			},
			orderInfo: {
				type: Object,
				default: () => {}
			},
			status: {
				type: String,
				default: ""
			},
			isRefund: {
				type: Number || String,
				default: 0
			}
		},
		data: function() {
			return {
				focus: false,
				price: 0,
				refund_price: 0,
				remark: "",
				refuse_reason: '',
				isAgree: true,
			};
		},
		watch: {
			orderInfo: function(nVal) {
				this.price = this.orderInfo.pay_price;
				this.refund_price = this.orderInfo.pay_price;
				this.remark = this.orderInfo.remark;
			},
			change(val) {
				if (val) {
					this.isAgree = true
					this.refuse_reason = ''
				}
			},
			isRefund(val) {
				console.log(val)
			},
		},
		methods: {
			priceChange: function() {
				this.focus = true;
			},
			close: function() {
				this.price = this.orderInfo.pay_price;
				this.$emit("closechange", false);
			},
			save: function() {
				let that = this;
				// if (!that.isAgree) {
				// 	that.refuse();
				// 	return
				// }
				that.$emit("savePrice", {
					price: that.price,
					refund_price: that.refund_price,
					type: 1,
					remark: that.remark
				});
			},
			refuse: function() {
				let that = this;
				that.$emit("savePrice", {
					price: that.price,
					refund_price: that.refund_price,
					type: 2,
					remark: that.remark,
					refuse_reason: that.refuse_reason
				});
			},
			agreeChange(value) {
				this.isAgree = value;
				if (this.isAgree) {
					this.refuse_reason = '';
				}
			},
			onConfirm() {
				if (this.status == 1) {
					this.save();
				}
				if (this.status == 2) {
					if (this.isRefund) {
						if (this.isAgree) {
							this.save();
						} else {
							this.refuse();
						}
					} else {
						if (this.isAgree) {
							this.save();
						} else {
							this.refuse();
						}
					}
				}
			},
		}
	};
</script>