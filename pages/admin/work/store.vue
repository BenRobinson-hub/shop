<template>
	<view class="pagebox">
		<!-- #ifdef MP || APP-PLUS -->
		<NavBar titleText="工作台" :iconColor="iconColor" :textColor="iconColor" :isScrolling="isScrolling" showBack></NavBar>
		<!-- #endif -->
		<view class="headerBg">
			<view :style="{ height: `${getHeight.barTop}px` }"></view>
			<view :style="{ height: `${getHeight.barHeight}px` }"></view>
			<view class="inner"></view>
		</view>
		<view class="page-content">
			<view class="header acea-row row-middle">
				<image :src="staffInfo.avatar" class="avatar"></image>
				<view class="text-box">
					<view class="acea-row row-middle">
						<view class="name line1">{{ staffInfo.staff_name }}</view>
						<view class="manager" v-if="parseInt(staffInfo.is_manager)" @click="marTap">
							{{merId}}<text class="iconfont icon-ic_downarrow"></text>
							<view v-if="marShow">
								<view class="arrow-down"></view>
								<view class="marList">
									<view class="item" :class="index==current?'on':''" v-for="(item, index) in merList" :key="index" @click="merSwitch(index,item)">{{item.name}}</view>
								</view>
							</view>
						</view>
						<view class="manager" v-else>店员</view>
					</view>
					<view class="phone">{{ staffInfo.phone }}</view>
				</view>
				<!-- #ifdef MP-WEIXIN || APP-PLUS -->
				<view @click="scanCode">
					<text class="iconfont icon-ic_Scan"></text>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view v-if="isWeixin" @click="scanCode">
					<text class="iconfont icon-ic_Scan"></text>
				</view>
				<!-- #endif -->
			</view>
			<view class="today">
				<view class="title-box">
					<navigator class="link" :url='`/pages/admin/order/store?isManager=${isManager}`' hover-class="none">
						今日销售额(元)<text class="iconfont icon-ic_rightarrow"></text>
					</navigator>
					<view class="money">{{ todayPrice }}</view>
				</view>
				<view class="list acea-row">
					<view class="item" v-for="(item,indexs) in statistics" :key="indexs">
						<view class="num">{{ item.value }}</view>
						<view class="">{{item.title}}</view>
					</view>
				</view>
			</view>
			<view class="goods acea-row">
				<navigator url="/pages/admin/orderList/index?types=1" hover-class="none" class="item">
					<view class="img-box">
						<view class="img">
							<view v-if="unshipped_count" class="num">{{ unshipped_count > 99 ? '99+' : unshipped_count }}</view>
							<image :src="imgHost+'/statics/images/admin-work-order1.png'" mode=""></image>
						</view>
					</view>
					<view class="">待发货</view>
				</navigator>
				<navigator url="/pages/admin/refundOrderList/index" hover-class="none" class="item">
					<view class="img-box">
						<view class="img">
							<view v-if="refunding_count" class="num">{{ refunding_count > 99 ? '99+' : refunding_count }}</view>
							<image :src="imgHost+'/statics/images/admin-work-order2.png'" mode=""></image>
						</view>
					</view>
					<view class="">待售后</view>
				</navigator>
				<navigator url="/pages/admin/goods/index?type=4" hover-class="none" class="item">
					<view class="img-box">
						<view class="img">
							<view v-if="outofstock" class="num">{{ outofstock > 99 ? '99+' : outofstock }}</view>
							<image :src="imgHost+'/statics/images/admin-work-order3.png'" mode=""></image>
						</view>
					</view>
					<view class="">待补货</view>
				</navigator>
				<navigator url="/pages/admin/goods/index?type=5" hover-class="none" class="item">
					<view class="img-box">
						<view class="img">
							<view v-if="policeforce" class="num">{{ policeforce > 99 ? '99+' : policeforce }}</view>
							<image :src="imgHost+'/statics/images/admin-work-order4.png'" mode=""></image>
						</view>
					</view>
					<view class="">库存预警</view>
				</navigator>
			</view>
			<view class="manage">
				<view class="title-box">店铺管理</view>
				<view class="list acea-row">
					<navigator class="item" url="/pages/admin/goods/index" hover-class="none">
						<view class="icon">
							<image :src="imgHost+'/statics/images/admin-work-menu1.png'" mode=""></image>
						</view>
						<view class="">商品管理</view>
					</navigator>
					<navigator class="item" url="/pages/admin/orderList/index" hover-class="none">
						<view class="icon">
							<image :src="imgHost+'/statics/images/admin-work-menu2.png'" mode=""></image>
						</view>
						<view class="">订单管理</view>
					</navigator>
					<!-- #ifdef MP-WEIXIN || APP-PLUS -->
					<navigator class="item" url="/pages/admin/order_cancellation/index?auth=4" hover-class="none">
						<view class="icon">
							<image :src="imgHost+'/statics/images/admin-work-menu3.png'" mode=""></image>
						</view>
						<view class="">订单核销</view>
					</navigator>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<navigator v-if="isWeixin" class="item" url="/pages/admin/order_cancellation/index?auth=4" hover-class="none">
						<view class="icon">
							<image :src="imgHost+'/statics/images/admin-work-menu3.png'" mode=""></image>
						</view>
						<view class="">订单核销</view>
					</navigator>
					<!-- #endif -->
					<navigator class="item" url="/pages/admin/refundOrderList/index" hover-class="none">
						<view class="icon">
							<image :src="imgHost+'/statics/images/admin-work-menu4.png'" mode=""></image>
						</view>
						<view class="">售后维权</view>
					</navigator>
					<navigator class="item" url="/pages/admin/user/list" hover-class="none">
						<view class="icon">
							<image :src="imgHost+'/statics/images/admin-work-menu5.png'" mode=""></image>
						</view>
						<view class="">用户管理</view>
					</navigator>
				<!-- 	<navigator class="item" url="/pages/behalf/user_list/index" hover-class="none">
						<view class="icon">
							<image :src="imgHost+'/statics/images/admin-work-menu6.png'" mode=""></image>
						</view>
						<view class="">代客下单</view>
					</navigator> -->
				</view>
			</view>
		</view>
		<footerPage :isWork='0'></footerPage>
	</view>
</template>

<script>
	// #ifdef MP || APP-PLUS
	import NavBar from '@/components/NavBar.vue';
	// #endif
	import footerPage from '../components/footerPage/index.vue';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import {
		userInfo,
		staffStaging,
		orderVerific,
		deliveryInfo,
	} from '@/api/admin.js';
	export default {
		components: {
			// #ifdef MP || APP-PLUS
			NavBar,
			// #endif
			footerPage,
		},
		computed:{
			isManager(){
				let manager = parseInt(this.staffInfo.is_manager) && !this.current;
				return manager?1:0
			}
		},
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				merList:[
					{name:'店长'},
					{name:'店员'}
				],
				current:0,
				marShow:0,
				merId:'店长',
				staffInfo:{},
				statistics:[],
				outofstock:0,
				policeforce:0,
				unshipped_count:0,
				refunding_count:0,
				// #ifdef MP || APP-PLUS
				iconColor: '#FFFFFF',
				isScrolling: false,
				// #endif
				todayPrice: 0, // 今日销售额
				getHeight: this.$util.getWXStatusHeight(),
				verify_code: '',
				isWeixin: '',
			}
		},
		onLoad() {
			this.getInfo();
			this.$store.commit('SET_STORE', 0);
			// #ifdef H5
			this.isWeixin = this.$wechat.isWeixin()
			// #endif
		},
		methods: {
			// 扫码核
			scanCode() {
				var self = this;
				// #ifdef MP || APP
				uni.scanCode({
					success(res) {
						self.verify_code = res.result || '';
						if (res.path) {
							let path = decodeURIComponent(res.path);
							self.verify_code = path.split('code=')[1];
						}
						self.codeChange();
					},
				})
				// #endif
				//#ifdef H5
				this.$wechat.wechatEvevt('scanQRCode', {
					needResult: 1,
					scanType: ["qrCode", "barCode"]
				}).then(res => {
					let result = res.resultStr;
					if (result.includes(',')) {
						result = result.split(",")[1]
					}
					this.verify_code = result
					this.codeChange();
				});
				//#endif
			},
			// 立即核销
			codeChange() {
				let self = this
				self.$util.Tips({
					title: '查询中'
				});
				setTimeout(() => {
					orderVerific(this.verify_code, 4)
						.then(res => {
							let auth = res.data.auth;
							if (res.data.is_order_code) {
								if (res.data.product_type) {
									uni.navigateTo({
										url: '/pages/admin/writeOffCard/index?id=' + res.data.data[0].id + '&storeNum=0'
									})
								} else {
									if (res.data.data[0].status == 2) {
										uni.navigateTo({
											url: '/pages/admin/offOrderResult/index?id=' + res.data.data[0].order_id+'&storeNum=0'
										})
									} else {
										uni.navigateTo({
											url: '/pages/admin/distribution/scanning/detail/index?auth=' + auth + '&id=' + res.data.data[0].id + '&let=' + res.data.data.length +
												'&code=' + this.verify_code+'&storeNum=0'
										})
									}
								}
							} else {
								if (!res.data.product_type) {
									if (res.data.data.length) {
										// 跳转多订单核销页
										uni.navigateTo({
											url: '/pages/admin/distribution/scanning/index?auth=' + auth + '&code=' + this.verify_code
										})
									} else {
										// 跳转结果页
										uni.navigateTo({
											url: '/pages/admin/offOrderResult/index&storeNum='+this.storeNum
										})
									}
								}
							}
						})
						.catch(res => {
							self.verify_code = ''
							return self.$util.Tips({
								title: res
							});
						});
				}, 800);
			},
			marTap(){
				this.marShow = !this.marShow;
			},
			merSwitch(index,item){
				this.current = index;
				this.merId = item.name;
				this.getStaffStaging(!index?1:0)
			},
			// 获取店员信息
			getInfo(){
				userInfo().then(res=>{
					this.staffInfo = res.data
					this.getStaffStaging(res.data.is_manager);
				})
			},
			getStaffStaging(manager){
				staffStaging({
					is_manager:manager
				}).then(res=>{
					this.statistics = res.data.statistics;
					this.todayPrice = res.data.todayPrice;
					const {
						outofstock,
						policeforce,
						unshipped_count,
						refunding_count,
					} = res.data.staging;
					this.outofstock = Number(outofstock);
					this.policeforce = Number(policeforce);
					this.unshipped_count = Number(unshipped_count);
					this.refunding_count = Number(refunding_count);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pagebox {
		position: relative;
		overflow: hidden;
	}

	.headerBg {
		position: absolute;
		top: 0;
		left: -25%;
		width: 150%;
		border-bottom-right-radius: 100%;
		border-bottom-left-radius: 100%;
		background: linear-gradient(270deg, #01ABF8 0%, #2A7EFB 100%);

		.inner {
			height: 356rpx;
		}
	}

	.page-content {
		position: relative;
		padding: 0 20rpx;

		.header {
			padding: 22rpx 20rpx 32rpx 12rpx;

			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.text-box {
				flex: 1;
				padding-left: 16rpx;
				color: #FFFFFF;
				.manager{
					width: 88rpx;
					height: 34rpx;
					line-height: 34rpx;
					background: #FFFFFF;
					border-radius: 18rpx;
					text-align: center;
					font-size: 22rpx;
					color: #2A7EFB;
					margin-left: 16rpx;
					position: relative;
					.icon-ic_downarrow{
						font-size: 24rpx;
						color: #2A7EFB;
					}
					.arrow-down{
						position: absolute;
						right: 8rpx;
						top:48rpx;
						width: 0;
						height: 0;
						border-left: 10rpx solid transparent;
						border-right: 10rpx solid transparent;
						border-bottom: 16rpx solid #fff;
					}
					.marList{
						position: absolute;
						width: 120rpx;
						height: 152rpx;
						background-color: #fff;
						padding: 8rpx 0;
						box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.08);
						border-radius: 10rpx;
						left:50%;
						margin-left: -60rpx;
						top:62rpx;
						.item{
							font-size: 28rpx;
							color: #333;
							font-weight: 400;
							padding: 16rpx 0;
							&.on{
								color: #2A7EFB;
							}
						}
					}
				}
			}

			.name {
				font-weight: 500;
				font-size: 32rpx;
				line-height: 44rpx;
				max-width: 310rpx;
			}

			.phone {
				margin-top: 4rpx;
				font-size: 22rpx;
				line-height: 30rpx;
				color: rgba(255,255,255,0.6);
			}

			.iconfont {
				font-size: 40rpx;
				color: #FFFFFF;
			}
		}

		.today {
			border-radius: 24rpx;
			background: #FFFFFF;

			.title-box {
				padding: 40rpx 0 52rpx 40rpx;
			}

			.link {
				display: inline-block;
				vertical-align: middle;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999999;
			}

			.iconfont {
				margin-left: 4rpx;
				font-size: 24rpx;
			}

			.money {
				margin-top: 16rpx;
				font-family: SemiBold;
				font-size: 56rpx;
				line-height: 56rpx;
				color: #FF7E00;
			}

			.item {
				padding-bottom: 40rpx;
				text-align: center;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999999;
				width: 30%;
				margin-right: 32rpx;
				&:nth-of-type(3n){
					margin-right: 0;
				}
			}

			.num {
				margin-bottom: 12rpx;
				font-family: SemiBold;
				font-size: 36rpx;
				line-height: 36rpx;
				color: #333333;
			}
		}

		.goods {
			border-radius: 24rpx;
			margin-top: 20rpx;
			background: #FFFFFF;

			.item {
				flex: 1;
				padding: 30rpx 0 26rpx;
				text-align: center;
				font-size: 26rpx;
				line-height: 36rpx;
				color: #333333;
			}

			.img-box {
				position: relative;
				width: 76rpx;
				height: 76rpx;
				border-radius: 50%;
				margin: 0 auto 12rpx;
				// background: #F9A833;
				// text-align: center;
				// line-height: 76rpx;
			}

			.img {
				width: 100%;
				height: 100%;
				// border-radius: 50%;
				// background: rgba(255, 255, 255, 0.8);
			}

			.num {
				position: absolute;
				top: -6rpx;
				left: 58rpx;
				z-index: 2;
				min-width: 24rpx;
				height: 24rpx;
				padding: 0 8rpx;
				border-radius: 12rpx;
				background: #FF7E00;
				font-weight: 500;
				font-size: 18rpx;
				line-height: 24rpx;
				color: #FFFFFF;
			}

			image {
				width: 100%;
				height: 100%;
				// font-size: 38rpx;
				// color: #FF7E00;
			}
		}

		.manage {
			padding-bottom: 41rpx;
			border-radius: 24rpx;
			margin-top: 20rpx;
			background: #FFFFFF;

			.title-box {
				padding: 34rpx 0 11rpx 28rpx;
				font-weight: 500;
				font-size: 30rpx;
				line-height: 42rpx;
				color: #333333;
			}

			.item {
				flex: 0 0 25%;
				padding: 27rpx 0;
				text-align: center;
				font-size: 26rpx;
				line-height: 26rpx;
				color: #333333;

				.icon {
					width: 48rpx;
					height: 48rpx;
					margin: 0 auto 20rpx;
				}
			}

			image {
				width: 48rpx;
				height: 48rpx;
			}
		}
	}
</style>