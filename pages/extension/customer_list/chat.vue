<template>
	<view class="chat-box" :style="colorStyle">
		<!-- #ifdef MP -->
		<view class="head-box">
			<view class="system-head" :style="{ height: sysHead }"></view>
			<view class="title-hd">
				<view class="iconfont icon-fanhui" @click="goBack"></view>
				<view>{{ titleName }}</view>
			</view>
		</view>
		<!-- #endif -->
		<view class="broadcast-details_order">
			<!-- 商品信息 -->
			<view class="broadcast-details_box" v-if="productId && productInfo.id">
				<view class="broadcast_details_img">
					<image class="goods-img" :src="productInfo.image" />
				</view>
				<view class="broadcast_details_picBox">
					<view class="broadcast_details_tit" v-text="productInfo.store_name"></view>
					<view class="bottom acea-row row-between">
						<view class="broadcast_details_pic">
							￥{{ productInfo.price }}
							<text class="broadcast_details_pic_num"
								v-if="productInfo.ot_price">￥{{ productInfo.ot_price }}</text>
						</view>
						<view class="broadcast_details_btn" @click="sendProduct">发送客服</view>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="broadcast_box" v-if="orderId && orderInfo.id">
				<view class="broadcast-details_num broadcast_num">
					<text>订单号：{{ orderInfo.order_id }}</text>
					<text>{{ orderInfo.add_time_y }} {{ orderInfo.add_time_h }}</text>
				</view>
				<view class="broadcast-details_box" v-if="orderInfo.cartInfo">
					<view class="broadcast_details_img">
						<image class="goods-img"
							:src="orderInfo.cartInfo[0].productInfo.attrInfo?orderInfo.cartInfo[0].productInfo.attrInfo.image:orderInfo.cartInfo[0].productInfo.image" />
						<view class="broadcast_details_model">
							{{ orderInfo.cartInfo ? orderInfo.cartInfo.length : 0 }}件商品
						</view>
					</view>
					<view class="broadcast_details_picBox">
						<view class="broadcast_details_tit">{{ orderInfo.cartInfo[0].productInfo.store_name }}</view>
						<view class="bottom acea-row row-between">
							<view class="broadcast_details_pic">
								￥{{ orderInfo.cartInfo[0].productInfo.attrInfo?orderInfo.cartInfo[0].productInfo.attrInfo.price:orderInfo.cartInfo[0].productInfo.price }}
								<text class="broadcast_details_pic_num">￥{{ orderInfo.cartInfo[0].costPrice }}</text>
							</view>
							<view class="broadcast_details_btn" @click="sendOrder">发送客服</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="chat-scroll-box">
			<scroll-view scroll-y="true" style="height: 100%;" :scroll-top="scrollTop" @scrolltoupper="scrollToTop">
				<Loading :loaded="status" :loading="loading"></Loading>
				<view id="box" class="chat" ref="chat">
					<view v-for="(item, index) in records" :key="index" :id="`msg-${item.id}`" class="msgItem">
						<view class="day-box" v-if="item.show">{{item._add_time}}</view>
						<view class="chat-item" :class="{ 'right-box': item.uid == myUid }">
							<image class="avatar" :src="item.avatar" mode=""></image>
							<!-- 消息 -->
							<view class="msg-box" v-if="item.msn_type <= 2" v-html="item.msn"></view>
							<!-- 图片 -->
							<view class="img-box" v-if="item.msn_type == 3">
								<image :src="item.msn" mode="widthFix" @tap="previewImage(item.msn)"></image>
							</view>
							<!-- 商品 -->
							<view class="product-box" v-if="item.msn_type == 5" @click="goProduct(item)">
								<image v-if="Array.isArray(item.productInfo)" src="../static/product-off.png" mode="aspectFit" class="product-off"></image>
								<template v-else>
									<image
										:src="item.productInfo.cartInfo?item.productInfo.cartInfo.image:item.productInfo.image"
										mode="widthFix"></image>
									<view class="info">
										<view class="price">
											<text>￥</text>
											{{ item.productInfo.cartInfo?item.productInfo.cartInfo.price:item.productInfo.price }}
										</view>
										<view class="name line2">{{ item.productInfo.store_name }}</view>
									</view>
								</template>
							</view>
							<!-- 订单 -->
							<view class="order-box"
								v-if="(item.msn_type == 6 || item.msn_type == 7) && item.orderInfo.cartInfo"
								@click="goOrder(item)">
								<view class="title">订单号: {{ item.orderInfo.order_id }}</view>
								<view class="info">
									<image
										:src="item.orderInfo.cartInfo[0].productInfo.attrInfo?item.orderInfo.cartInfo[0].productInfo.attrInfo.image:item.orderInfo.cartInfo[0].productInfo.image">
									</image>
									<view class="product-info">
										<view class="name line2">{{ item.orderInfo.cartInfo[0].productInfo.store_name }}
										</view>
										<view class="price">
											¥{{ item.orderInfo.cartInfo[0].productInfo.attrInfo?item.orderInfo.cartInfo[0].productInfo.attrInfo.price:item.orderInfo.cartInfo[0].productInfo.price }}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="pb-safe bg--w111-f5f5f5">
			<view class="footer-box">
				<view class="words" @click="uploadImg"><text class="iconfont icon-ic_picture"></text></view>
				<view class="input-box">
					<view class="flex-1 pl-20 h-full fs-28 text--w111-999 flex-y-center" @tap="showInputDrawer">请输入内容</view>
					<!-- <input type="text" placeholder="请输入内容" v-model="con" confirm-type="send" @confirm="sendText" /> -->
					<text class="iconfont icon-ic_send" @click="sendText" :class="{ isSend: isSend }"></text>
				</view>
				<view class="emoji" @click="isSwiper = !isSwiper"><span class="iconfont icon-ic_expression"></span></view>
			</view>
		</view>
		<!-- 表情 -->
		<view class="banner slider-banner" v-if="isSwiper && httpUrl">
			<swiper class="swiper-wrapper" :autoplay="autoplay" :circular="circular" :interval="interval"
				:duration="duration" v-if="emojiGroup.length > 0">
				<block v-for="(emojiList, index) in emojiGroup" :key="index">
					<swiper-item><i class="em" :class="emoji" :style="'background-image:url('+ httpUrl +')'"
							v-for="emoji in emojiList" :key="emoji" @click="addEmoji(emoji)"></i></swiper-item>
				</block>
			</swiper>
		</view>
		<canvas canvas-id="canvas" v-if="canvasStatus"
			:style="{width: canvasWidth + 'px', height: canvasHeight + 'px',position: 'absolute',left:'-100000px',top:'-100000px'}"></canvas>
		<tui-drawer mode="bottom" :visible="showInput" background-color="transparent" mask maskClosable @close="showInputDrawer">
			<view class="w-full bg--w111-fff drawer-text pt-32 pl-32 pr-32">
				<view class="bg--w111-f5f5f5 rd-32rpx pt-16 pr-14 pb-16 pl-24 relative">
					<textarea class="w-528 fs-28 h-auto"
						:auto-height="true"
						wrap-style="wrap"
						max-height="100px"
						placeholder-class='placeholder'
						placeholder="请输入内容"
						:always-embed="true"
						:adjust-position="true"
						cursor-spacing="85rpx"
						v-model="con"
						:maxlength="150"
						name="mark">
					</textarea>
					<view class="reply-confirm-btn w-96 h-48 rd-24rpx flex-center bg-color text--w111-fff fs-24 ml-24"
						@tap="sendText">发送</view>
				</view>
			</view>
		</tui-drawer>
	</view>
</template>

<script>
	const app = getApp();
	import {HTTP_REQUEST_URL} from "@/config/app.js";
	import {getChatRecord} from '@/api/user';
	import {getProductDetail} from '@/api/store';
	import {getOrderDetail,getRefundOrderDetail} from '@/api/order';
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';

	const chunk = function(arr, num) {
		num = num * 1 || 1;
		var ret = [];
		arr.forEach(function(item, i) {
			if (i % num === 0) {
				ret.push([]);
			}
			ret[ret.length - 1].push(item);
		});
		return ret;
	};
	import emojiList from '@/utils/emoji';
	import Loading from '@/components/Loading';
	import tuiDrawer from "@/components/tui-drawer/tui-drawer.vue"
	import colors from "@/mixins/color";
	export default {
		name: 'adminChat_index',
		data() {
			return {
				httpUrl: '',
				status: false,
				loading: false,
				sysHead: statusBarHeight,
				isTool: false,
				isSwiper: false,
				isWords: false,
				autoplay: false,
				circular: true,
				interval: 3000,
				duration: 500,
				emojiGroup: chunk(emojiList, 21),
				wordsList: [],
				con: '',
				toUid: 0,
				limit: 15,
				upperId: 0,
				chatList: [],
				kefuInfo: {},
				scrollTop: 0,
				active: true,
				isScroll: true,
				oldHeight: 0,
				myUid: 0,
				productId: 0,
				productInfo: {},
				orderId: 0,
				page: 1,
				orderInfo: {},
				uidTo: 0,
				titleName: '',
				chatStatus: false,
				userType: 0,
				canvasWidth: "",
				canvasHeight: "",
				canvasStatus: false,
				isReturen: 0,
				showInput: false
			};
		},
		mixins: [colors],
		components: {
			Loading,
			tuiDrawer
		},
		computed: {
			isSend() {
				if (this.con.length == 0) {
					return false;
				} else {
					return true;
				}
			},
			records() {
				return this.chatList.map((item, index) => {
					if (index) {
						if (item.add_time - this.chatList[index - 1].add_time >= 300) {
							item.show = true;
						} else {
							item.show = false;
						}
					} else {
						item.show = true;
					}
					return item;
				});
			}
		},
		onLoad(options) {
			this.isReturen = options.isReturen;
			this.myUid = this.$store.state.app.uid;
			this.toUid = options.to_uid
			this.productId = parseInt(options.productId) || 0;
			this.orderId = options.orderId || 0;
			this.userType = options.type
			this.getproductInfo();
			this.getOrderInfo();
			this.getChatList();
		},
		onUnload() {
			this.$socket.clearPing();
			app.globalData.isWsOpen = false;
			// uni.$off()
		},
		onReady() {
			this.httpUrl = `${HTTP_REQUEST_URL}/statics/images/look.png`;
			// #ifdef H5
			let dom = document.querySelector(".chat-box");
			dom.style.height = window.innerHeight + 'px'
			// #endif
			// 监听客服转接
			uni.$on('to_transfer', data => {
				this.toUid = data.toUid;
				this.$socket.send({
					data: {
						id: this.toUid
					},
					type: 'to_chat'
				});
				this.chatList.forEach(el => {
					if (el.uid != this.myUid) {
						el.avatar = data.avatar
					}
				})
			});
			// 链接成功
			uni.$on('success', () => {
				app.globalData.isWsOpen = true;
				uni.hideLoading();
				this.$socket.send({
					data: {
						id: this.toUid
					},
					type: 'to_chat'
				});
			});
			// 消息接收
			uni.$on(['reply', 'chat'], data => {
				if (data.msn_type == 1) {
					data.msn = this.replace_em(data.msn);
				}
				data._add_time = data._add_time.substring(0, data._add_time.length - 3);
				this.chatList.push(data);
				this.$nextTick(() => {
					this.height();
				});
			});
			uni.$on('socket_error', () => {
				this.$util.Tips({
					title: '连接失败'
				});
			});
			uni.$on('err_tip', (e) => {
				this.$util.Tips({
					title: e.msg
				});
			});
			uni.$on('online', data => {
				if (data.online == 0) {
					uni.showModal({
						title: '提示',
						content: '客服已下线，是否需要反馈？',
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages/extension/customer_list/feedback'
								});
							} else if (res.cancel) {}
						}
					});
				}
			});
			this.$nextTick(() => {
				this.height();
			});
		},
		onShow(){
			uni.removeStorageSync('form_type_cart');
		},
		methods: {
			previewImage(n) {
				uni.previewImage({
					urls: [n]
				});
			},
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1,
					fail(){
						uni.switchTab({
						  url: '/pages/index/index'
						})
					}
				});
			},
			// 商品信息
			getproductInfo() {
				let that = this;
				if (!this.productId) return;
				getProductDetail(this.productId).then(res => {
					that.productInfo = res.data.storeInfo;
				});
			},
			// 商品信息
			goProduct(item) {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${item.msn}`
				});
			},
			// 订单详情
			goOrder(item) {
				if (this.userType) {
					if (item.msn_type == 7) {
						uni.navigateTo({
							url: `/pages/admin/orderDetail/index?id=${item.msn}&isReturen=1`
						});
					} else {
						uni.navigateTo({
							url: `/pages/admin/orderDetail/index?id=${item.msn}`
						});
					}
				} else {
					if (item.msn_type == 7) {
						uni.navigateTo({
							url: `/pages/goods/order_details/index?order_id=${item.msn}&isReturen=1`
						});
					} else {
						uni.navigateTo({
							url: `/pages/goods/order_details/index?order_id=${item.msn}`
						});
					}
				}

			},
			// 订单消息
			getOrderInfo() {
				if (!this.orderId) return;
				let obj = '';
				if (this.isReturen == 1) {
					obj = getRefundOrderDetail(this.orderId);
				} else {
					obj = getOrderDetail(this.orderId);
				}
				obj.then(res => {
					this.orderInfo = res.data;
					if (this.orderInfo.add_time_h) {
						this.orderInfo.add_time_h = this.orderInfo.add_time_h.substring(0, this.orderInfo
							.add_time_h.lastIndexOf(':'));
					}
					if (this.orderInfo.cartInfo.length) {
						this.cartInfo = this.orderInfo.cartInfo[0];
					}
				});

			},
			// 表情点击
			addEmoji(item) {
				let val = `[${item}]`;
				this.con += val;
			},
			// 聊天表情转换
			replace_em(str) {
				str = str.replace(/\[em-([\s\S]*?)\]/g, "<span class='em em-$1' style='background-image:url(" + this
					.httpUrl + ")'></span>");
				return str;
			},
			// 获取聊天列表
			getChatList() {
				let self = this;
				getChatRecord({
						limit: this.limit,
						uidTo: this.uidTo,
						toUid: this.toUid
					})
					.then(res => {
						let selector = '';
						if (res.data.serviceList.length) {
							if (this.uidTo == 0) {
								selector = `#msg-${res.data.serviceList[res.data.serviceList.length - 1].id}`;
							} else {
								selector = `#msg-${this.chatList[0].id}`;
							}
						}
						let arr = [];
						var sH = 0;
						uni.hideLoading();
						uni.setNavigationBarTitle({
							title: res.data.nickname
						});
						this.titleName = res.data.nickname;
						this.toUid = res.data.uid;
						res.data.serviceList.forEach(el => {
							el._add_time = el._add_time.substring(0, el._add_time.length - 3);
							if (el.msn_type == 1 || el.msn_type == 2) {
								el.msn = this.replace_em(el.msn);
							}
						});

						this.loading = false;
						this.chatList = [...res.data.serviceList, ...this.chatList];

						if (!app.globalData.isWsOpen) {
							uni.showLoading({
								title: '客服连接中...',
							});
							this.$socket.startConnect();
							//5秒后还是没有连接自动关闭
							setTimeout(() => {
								uni.hideLoading();
							}, 5000);
						}

						this.$nextTick(() => {
							this.setPageScrollTo(selector);
							this.isScroll = res.data.serviceList.length >= this.limit;
						});
					})
					.catch(error => {
						uni.hideLoading();
						this.$util.Tips({
							title: error
						});
						this.loading = false;
						this.isScroll = false
						uni.redirectTo({
							// url: '/pages/columnGoods/HotNewGoods/feedback'
							url: '/pages/extension/customer_list/feedback'
						});
					});
			},

			// 设置页面滚动位置
			setPageScrollTo(selector) {
				try {
					if (this.chatList.length) {
						let view = uni
							.createSelectorQuery()
							.in(this)
							.select(selector);
						view.boundingClientRect(res => {
							this.scrollTop = parseFloat(res.top) - 60;
						}).exec();
					}
				} catch (e) {
					console.log(e);
				}
			},
			showInputDrawer(){
				this.showInput = !this.showInput;
			},
			// 发送消息
			sendText() {
				if (!this.isSend || this.con.trim() === '') {
					return this.$util.Tips({
						title: '请输入内容'
					});
				}
				this.sendMsg(this.con, 1);
				this.con = '';
			},
			// ws发送
			sendMsg(msn, type) {
				this.$socket.send({
					data: {
						msn,
						type,
						to_uid: this.toUid
					},
					//#ifdef MP || APP-PLUS
					form_type: 2,
					//#endif
					//#ifdef H5
					form_type: this.$wechat.isWeixin() ? 1 : 3,
					//#endif
					type: 'chat'
				});
				this.showInput = false;
			},
			uploadImg() {
				let self = this;
				self.canvasStatus = true
				self.$util.uploadImageChange('upload/image', function(res) {
					if (res.status == 200) {
						self.sendMsg(res.data.url, 3);
					}
				}, (res) => {
					this.canvasStatus = false
				}, (res) => {
					this.canvasWidth = res.w
					this.canvasHeight = res.h
				});
			},
			// 发送商品
			sendProduct() {
				this.sendMsg(this.productId, 5);
				this.productId = 0;
				this.productInfo = {};
			},
			// 发送订单
			sendOrder() {
				let num = 0;
				if (this.isReturen == 1) {
					num = 7;
				} else {
					num = 6;
				}
				this.sendMsg(this.orderId, num);
				this.orderId = 0;
				this.orderInfo = {};
			},
			// 滚动到底部
			height() {
				let self = this;
				var scrollTop = 0;
				let info = uni.createSelectorQuery().select('.chat');
				setTimeout(res => {
					info.boundingClientRect(function(data) {
						//data - 各种参数
						scrollTop = data.height;
						if (self.active) {
							self.scrollTop = parseInt(scrollTop) + 500;
						} else {
							self.scrollTop = parseInt(scrollTop) + 100;
						}
					}).exec();
				}, 200);
			},
			// 滚动到顶部
			scrollToTop() {
				let self = this;
				if (this.isScroll) {
					this.loading = true;
					this.uidTo = this.chatList[0].id;
					this.isScroll = false;
					setTimeout(res => {
						this.getChatList();
					}, 800);
				}
			}
		}
	};
</script>
<style>
	/* #ifdef MP || APP-PLUS || H5 */
	page,
	uni-page-body,
	html,
	body {
		height: 100%;
	}

	/* #endif */
	.em {
		display: inline-block;
		width: 50rpx;
		height: 50rpx;
		margin: 40rpx 0 0 50rpx;
		/* background-size: 4100%!important;
		background-position: 2.5% 62.5%!important; */
	}
	
	.emoji-outer {
		position: absolute;
		right: 50rpx;
		bottom: 30rpx;
		width: 50rpx;
		height: 50rpx;
	}
</style>
<style lang="scss">
	.chat-box {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #f0f1f2;
		/* #ifdef H5 */
		height: 100vh;

		/* #endif */
		.head-box {
			/* #ifdef H5 */
			height: 86rpx;
			/* #endif */
			background: linear-gradient(85deg, $kf-star 0%, $kf-end 100%);

			.title-hd {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				height: 43px;
				padding: 0 30rpx;
				color: #fff;

				.icon-fanhui {
					position: absolute;
					left: 30rpx;
					top: 50%;
					transform: translateY(-50%);
				}

				.icon-gengduo2 {
					/* #ifdef MP */
					position: absolute;
					right: 210rpx;
					top: 50%;
					transform: translateY(-50%);
					/* #endif */
				}
			}
		}

		.scroll-box {
			flex: 1;
		}

		.footer-box {
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			color: rgba(0, 0, 0, 0.8);
			background: #f5f5f5;
			height: 100rpx;
			// height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
			// height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/

			.words .icon-ic_picture {
				font-size: 50rpx;
			}

			.input-box {
				display: flex;
				align-items: center;
				flex: 1;
				height: 64rpx;
				padding-right: 5rpx;
				margin-left: 18rpx;
				background-color: #fff;
				border-radius: 32rpx;

				input {
					flex: 1;
					padding-left: 20rpx;
					height: 100%;
					font-size: 28rpx;
					font-weight: normal;
				}

				.icon-ic_send {
					font-size: 50rpx;
					color: #ccc;
					font-weight: normal;
					margin-left: 30rpx;
				}

				.isSend {
					color: $kf-theme;
				}
			}

			.emoji .icon-ic_expression {
				margin-left: 18rpx;
				font-size: 50rpx;
			}

			.more .icon-gengduozhankai {
				margin-left: 18rpx;
				font-size: 50rpx;
			}
		}
	}

	.tool-wrapper {
		display: flex;
		justify-content: space-between;
		padding: 45rpx 60rpx;
		background: #fff;
		font-size: 24rpx;

		.tool-item {
			text-align: center;

			image {
				width: 104rpx;
				height: 104rpx;
			}
		}
	}

	.slider-banner {
		background: #fff;
		padding-bottom: 25rpx;
	}

	.words-mask {
		z-index: 50;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);

		.content {
			position: absolute;
			left: 0;
			right: 0;
			top: 114rpx;
			bottom: 0;
			display: flex;
			flex-direction: column;
			padding: 0 30rpx;
			background: #fff;
			border-radius: 6rpx 6rpx 0px 0px;

			.title-box {
				position: relative;
				height: 125rpx;
				line-height: 125rpx;
				text-align: center;
				font-size: 32rpx;

				.icon-cha1 {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.scroll-box {
				flex: 1;
				overflow: hidden;

				.msg-item {
					padding: 25rpx 0;
					border-bottom: 1px solid #eceff8;
				}
			}
		}
	}

	.chat-scroll-box {
		flex: 1;
		padding: 0 30rpx 0;
		overflow: hidden;

		.chat-item {
			display: flex;
			margin-bottom: 16rpx;
			padding-bottom: 20rpx;

			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.msg-box {
				display: flex;
				align-items: center;
				max-width: 452rpx;
				margin-left: 22rpx;
				padding: 10rpx 24rpx;
				background: #fff;
				border-radius: 14rpx;
				word-break: break-all;
			}

			.img-box {
				width: 270rpx;
				margin-left: 22rpx;

				image {
					width: 270rpx;
				}
			}

			.product-box {
				width: 452rpx;
				margin-left: 22rpx;
				background-color: #fff;
				border-radius: 14rpx;
				overflow: hidden;

				image {
					width: 452rpx;
				}

				.info {
					padding: 16rpx 26rpx;

					.price {
						font-size: 36rpx;
						color: var(--view-priceColor);

						text {
							font-size: 28rpx;
						}
					}
				}
			}

			.order-box {
				width: 452rpx;
				margin-left: 22rpx;
				background-color: #fff;
				border-radius: 14rpx;

				.title {
					padding: 15rpx 20rpx;
					font-size: 26rpx;
					color: #282828;
					border-bottom: 1px solid #eceff8;
				}

				.info {
					display: flex;
					padding: 20rpx;

					image {
						width: 124rpx;
						height: 124rpx;
						border-radius: 6rpx;
					}

					.product-info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 16rpx;

						.name {
							font-size: 26rpx;
						}

						.price {
							font-size: 30rpx;
							color: var(--view-priceColor);
						}
					}
				}
			}

			&.right-box {
				flex-direction: row-reverse;

				.msg-box {
					margin-left: 0;
					margin-right: 22rpx;
					background-color: #9cec60;
				}

				.img-box {
					margin-left: 0;
					margin-right: 22rpx;
				}

				.product-box {
					margin-left: 0;
					margin-right: 22rpx;
				}

				.order-box {
					margin-left: 0;
					margin-right: 22rpx;
				}
			}

			.em {
				margin: 0;
			}
		}
	}

	.broadcast-details_box {
		display: flex;
		background: #fff;
		border-radius: 6px;
		padding: 24rpx;
	}

	.broadcast_details_img {
		width: 140rpx;
		height: 140rpx;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
	}

	.broadcast_details_img .goods-img {
		width: 100%;
		height: 100%;
	}

	.broadcast_details_picBox {
		width: 75%;
		margin-left: 24rpx;

		.bottom {
			margin-top: 12rpx;
		}
	}

	.broadcast_details_tit {
		font-size: 28rpx;
		color: #333333;
		height: 76rpx;
		font-weight: 800;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		text-align: left !important;
	}

	.broadcast_details_pic {
		font-size: 36rpx;
		color: var(--view-priceColor);
		text-align: left;
	}

	.broadcast_details_pic_num {
		text-decoration: line-through;
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.5);
		margin-left: 0.1rem;
	}

	.broadcast_details_btn {
		width: 130rpx;
		height: 50rpx;
		background: var(--view-theme);
		opacity: 1;
		border-radius: 125rpx;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
		line-height: 50rpx;
	}

	.broadcast-details_num {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		color: #000000;
		font-size: 26rpx;
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
		padding: 0 24rpx;
	}

	.day-box {
		font-size: 24rpx;
		color: #999;
		text-align: center;
		margin-bottom: 36rpx;
	}

	.msgItem {
		&:first-child {
			.day-box {
				padding-top: 30rpx;
			}
		}
	}
	.reply-confirm-btn{
		position: absolute;
		bottom: 10rpx;
		right: 14rpx;
	}
	.drawer-text{
		padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
	}
</style>
