<template>
	<view :style="colorStyle">
		<view class='apply-return'>
			<splitOrder :splitGoods="returnGoodsList" @getList="getCheckList" :select_all="false"></splitOrder>
			<view style="height: 140rpx;"></view>
			<view class="bntCon acea-row row-center-wrapper">
				<button class='returnBnt bg-color' @click="subRefund">申请退款</button>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		refundGoodsList
	} from '@/api/order.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import splitOrder from '@/components/splitOrder';
	import colors from '@/mixins/color.js';
	export default {
		components: {
			splitOrder
		},
		mixins: [colors],
		data() {
			return {
				returnGoodsList: [],
				id: 0,
				cartList: [],
				orderId: "",
				isShowAuth: false,
				store_id: 0
			};
		},
		computed: mapGetters(['isLogin']),
		watch: {
			isLogin: {
				handler: (newV, oldV) => {
					if (newV) {
						// this.getGoodsList();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			if (!options.id) return this.$util.Tips({
				title: '缺少订单id,无法选择商品'
			}, {
				tab: 3,
				url: 1
			});
			this.id = options.id;
			this.orderId = options.orderId;
			this.store_id = options.store_id;

		},
		onShow() {
			uni.removeStorageSync('form_type_cart');
			this.cartList = []
			this.returnGoodsList = []
			if (this.isLogin) {
				this.getGoodsList();
			} else {
				toLogin()
			}
		},
		methods: {
			/**
			 * 获取商品列表
			 */
			getGoodsList() {
				let that = this;
				refundGoodsList(that.id).then(res => {
					let list = res.data,goods = []
					list.forEach((item) => {
						item.checked = false
						item.numShow = item.surplus_num
						if(!item.is_gift){
							goods.push(item)
						}
					})
					that.$set(that, 'returnGoodsList', goods);
				});
			},
			getCheckList(val) {
				let that = this;
				that.returnGoodsList = val;
				this.cartList = [];
				val.forEach((item) => {
					if (item.checked) {
						// item.cart_num = item.surplus_num
						this.cartList.push({
							cart_id:item.cart_id,
							cart_num:item.surplus_num
						})
					}
				})
			},
			/**
			 * 申请退货
			 */
			subRefund(e) {
				let that = this
				//收集form表单
				if (!this.cartList.length) return this.$util.Tips({
					title: '请先选择退货商品'
				});
				let obj = JSON.stringify(this.cartList);
				uni.navigateTo({
					url: `/pages/goods/goods_return/index?orderId=` + this.orderId + '&id=' + this.id + '&cartIds=' + obj + '&store_id=' + this.store_id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	/deep/.splitOrder uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked{
		border: 1px solid var(--view-theme)!important;
		background-color: var(--view-theme)!important;
	}
	/deep/.splitOrder checkbox .wx-checkbox-input.wx-checkbox-input-checked{
		border: 1px solid var(--view-theme)!important;
		background-color: var(--view-theme)!important;
	}
	.apply-return .list {
		background-color: #fff;
		margin-top: 18rpx;
	}

	.apply-return .list .item {
		margin-left: 30rpx;
		padding-right: 30rpx;
		min-height: 90rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 30rpx;
		color: #333;
	}

	.apply-return .list .item .num {
		color: #282828;
		width: 427rpx;
		text-align: right;
	}

	.apply-return .list .item .num .picker .reason {
		width: 385rpx;
	}

	.apply-return .list .item .num .picker .iconfont {
		color: #666;
		font-size: 30rpx;
		margin-top: 2rpx;
	}

	.apply-return .list .item.textarea {
		padding: 30rpx 30rpx 30rpx 0;
	}

	.apply-return .list .item textarea {
		height: 100rpx;
		font-size: 30rpx;
	}

	.apply-return .list .item .placeholder {
		color: #bbb;
	}

	.apply-return .list .item .title {
		height: 95rpx;
		width: 100%;
	}

	.apply-return .list .item .title .tip {
		font-size: 30rpx;
		color: #bbb;
	}

	.apply-return .list .item .upload {
		padding-bottom: 36rpx;
	}

	.apply-return .list .item .upload .pictrue {
		margin: 22rpx 23rpx 0 0;
		width: 156rpx;
		height: 156rpx;
		position: relative;
		font-size: 24rpx;
		color: #bbb;
	}

	.apply-return .list .item .upload .pictrue:nth-of-type(4n) {
		margin-right: 0;
	}

	.apply-return .list .item .upload .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 3rpx;
	}

	.apply-return .list .item .upload .pictrue .icon-guanbi1 {
		position: absolute;
		font-size: 45rpx;
		top: -10rpx;
		right: -10rpx;
	}

	.apply-return .list .item .upload .pictrue .icon-icon25201 {
		color: #bfbfbf;
		font-size: 50rpx;
	}

	.apply-return .list .item .upload .pictrue:nth-last-child(1) {
		border: 1rpx solid #ddd;
		box-sizing: border-box;
	}
	
	.apply-return .bntCon{
		width: 100%;
		height: 112rpx;
		background: #FFFFFF;
		position: fixed;
		left:0;
		bottom: 0;
		bottom: calc(0rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(0rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.apply-return .returnBnt {
		font-size: 32rpx;
		color: #fff;
		width: 710rpx;
		height: 80rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
	}

	.goodsStyle .text .name {
		align-self: flex-start;
	}
</style>
