<template>
	<view :style="[shortVideoWrapStyle]" v-if="videoList.length">
		<view class="shortVideo" :style="[shortVideoStyle]">
			<view class="nav acea-row row-between-wrapper" :style="[navStyle]">
				<view v-if="dataConfig.titleConfig.tabVal" class="title" :style="[titleStyle]">{{ dataConfig.titleTxtConfig.value }}</view>
				<easy-loadimage v-else mode="widthFix" :image-src="dataConfig.imgConfig.url" width="104rpx" height="32rpx"></easy-loadimage>
				<view class="more" :style="[buttonStyle]" @click="more(0)">
					{{ dataConfig.rightBntConfig.value }}
					<text class="iconfont icon-ic_rightarrow" :style="[buttonStyle]"></text>
				</view>
			</view>
			<view v-if="dataConfig.styleConfig.tabVal" class="list" :style="[listStyle]">
				<scroll-view scroll-x="true" class="scroll" show-scrollbar="false">
					<view class="item" v-for="item in videoList" :key="item.id" @click="more(item.id)" :style="[itemStyle]">
						<easy-loadimage mode="widthFix" :image-src="item.image" width="226rpx" height="300rpx" :borderRadius="imageRadius"></easy-loadimage>
					</view>
				</scroll-view>
			</view>
			<view v-else class="list-column" :style="[listStyle]">
				<view class="item acea-row" v-for="item in videoList" :key="item.id" :style="[itemStyle]" @click="more(item.id)">
					<easy-loadimage mode="widthFix" :image-src="item.image" width="226rpx" height="300rpx" :borderRadius="imageRadius"></easy-loadimage>
					<view class="text acea-row row-column">
						<view class="conter">
							<view class="header acea-row row-middle">
								<easy-loadimage mode="widthFix" :image-src="item.type_image" width="36rpx" height="36rpx" borderRadius="18rpx"></easy-loadimage>
								<view class="name line1">{{ item.type_name }}</view>
							</view>
							<view class="info line2">{{ item.desc }}</view>
						</view>
						<view class="goodsList acea-row row-middle">
							<template v-for="(goodsItem, index) in item.product_info">
								<view v-if="index < 3" :key="goodsItem.id" class="pictrue" @click.stop="goGoods(goodsItem.id)">
									<easy-loadimage mode="widthFix" :image-src="goodsItem.image" width="128rpx" height="128rpx" borderRadius="8rpx"></easy-loadimage>
									<view v-if="index < 2" class="money acea-row row-center-wrapper">
										<text>¥{{ goodsItem.price }}</text>
									</view>
									<view v-else class="num acea-row row-center-wrapper">
										<text>+{{ item.product_num - 2 }}</text>
									</view>
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		diyVideoList
	} from '@/api/short-video.js';
	export default {
		name: 'shortVideo',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			isSortType: {
				type: String | Number,
				default: 0
			}
		},
		data() {
			return {
				videoList: [],
				bgColor: '',
				titleColor: '',
				infoColor: '',
				mbCongfig: 0,
				prConfig: 0, //背景边距
				// itemStyle: 0,
				numConfig: 0
			}
		},
		computed: {
			navStyle() {
				return {
					'background': `linear-gradient(90deg, ${this.dataConfig.headerBgColor.color[0].item} 0%, ${this.dataConfig.headerBgColor.color[1].item} 100%)`,
				};
			},
			titleStyle() {
				let fontStyle = 'normal';
				let fontWeight = 'normal';
				switch (this.dataConfig.titleText.tabVal) {
					case 0:
						fontWeight = 'bold'
						break;
					case 2:
						fontStyle = 'italic'
						fontWeight = 'bold'
						break;
				}
				return {
					'font-style': fontStyle,
					'font-style': fontWeight,
					'font-size': `${this.dataConfig.titleNumber.val * 2}rpx`,
				};
			},
			buttonStyle() {
				return {
					'font-size': `${this.dataConfig.bntNumber.val * 2}rpx`,
					'color': this.dataConfig.headerBntColor.color[0].item,
				};
			},
			itemStyle() {
				let marginTop = 0;
				let marginLeft = 0;
				let marginRight = 0;
				if (this.dataConfig.styleConfig.tabVal) {
					marginLeft = `${this.dataConfig.videoSpace2.val * 2}rpx`;
					marginRight = `${this.dataConfig.videoSpace2.val * 2}rpx`;
				} else {
					marginTop = `${this.dataConfig.videoSpace.val * 2}rpx`;
				}
				return {
					'margin-top': marginTop,
					'margin-left': marginRight,
					'margin-right': marginRight,
				};
			},
			itemLastStyle() {
				let marginRight = 0;
				if (this.dataConfig.styleConfig.tabVal) {
					marginRight = `${this.dataConfig.videoSpace2.val * 2}rpx`;
				}
				return {
					'margin-right': marginRight,
				};
			},
			imageRadius() {
				let borderRadius = [`${this.dataConfig.filletImg.val * 2}rpx`];
				if (this.dataConfig.filletImg.type) {
					borderRadius = [];
					for (let i = 0; i < this.dataConfig.filletImg.valList.length; i++) {
						borderRadius.push(`${this.dataConfig.filletImg.valList[i].val * 2}rpx`);
					}
				}
				return borderRadius.join(' ');
			},
			shortVideoWrapStyle() {
				return {
					'padding': `${this.dataConfig.topConfig.val * 2}rpx ${this.dataConfig.prConfig.val * 2}rpx ${this.dataConfig.bottomConfig.val * 2}rpx`,
					'margin-top': `${this.dataConfig.mbConfig.val * 2}rpx`,
				};
			},
			shortVideoStyle() {
				let borderRadius = [`${this.dataConfig.fillet.val * 2}rpx`];
				if (this.dataConfig.fillet.type) {
					borderRadius = [];
					for (let i = 0; i < this.dataConfig.fillet.valList.length; i++) {
						borderRadius.push(`${this.dataConfig.fillet.valList[i].val * 2}rpx`);
					}
				}
				return {
					'border-radius': borderRadius,
				};
			},
			listStyle() {
				return {
					'background': `linear-gradient(90deg, ${this.dataConfig.moduleColor.color[0].item} 0%, ${this.dataConfig.moduleColor.color[1].item} 100%)`,
				};
			},
		},
		created() {},
		mounted() {
			this.getVideoList();
		},
		methods: {
			getVideoList: function() {
				let that = this;
				let limit = this.$config.LIMIT;
				diyVideoList({
					page: 1,
					limit: this.dataConfig.numberConfig.val >= limit ? limit : this.dataConfig.numberConfig.val
				}).then(res => {
					that.videoList = res.data;
				});
			},
			more(id) {
				uni.navigateTo({
					//#ifdef APP
					url: '/pages/short_video/appSwiper/index?id=' + id,
					//#endif
					//#ifndef APP
					url: '/pages/short_video/nvueSwiper/index?id=' + id,
					//#endif
				})
			},
			goGoods(id) {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${id}`
				});
			}
		}
	}
</script>

<style lang="scss">
	.shortVideo {
		overflow: hidden;

		.nav {
			width: 100%;
			padding: 0 24rpx;
			height: 96rpx;
			background: linear-gradient(270deg, #FFFFFF 0%, #FFFFFF 100%);

			.title {
				font-weight: 500;
				font-size: 32rpx;
				color: #333333;
			}

			.more {
				font-size: 24rpx;
				color: #999999;

				.iconfont {
					font-size: 24rpx;
				}
			}
		}

		.list {
			padding: 24rpx 0;
			border-radius: 0rpx 0rpx 16rpx 16rpx;
			background: #FFFFFF;

			.scroll {
				white-space: nowrap;
			}

			.item {
				display: inline-block;
				margin: 0 24rpx;

				+.item {
					margin-left: 0 !important;
				}

				.text {
					flex: 1;
				}
			}
		}

		.list-column {
			padding: 32rpx 20rpx;
			background: #FFFFFF;

			.item {
				margin-top: 40rpx;

				&:first-child {
					margin-top: 0 !important;
				}
			}

			.text {
				flex: 1;
				padding-left: 20rpx;
			}

			.conter {
				flex: 1;
			}

			.pictrue {
				position: relative;
			}

			.goodsList {
				margin-right: -20rpx;
			}

			.goodsList .pictrue {
				margin-right: 20rpx;
			}

			.name {
				margin-left: 10rpx;
				font-weight: 500;
				font-size: 28rpx;
				color: #333333;
			}

			.info {
				margin-top: 20rpx;
				font-size: 24rpx;
				line-height: 28rpx;
				color: #666666;
			}

			.money {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 46rpx;
				padding: 10rpx 0 6rpx;
				border-radius: 0rpx 0rpx 8rpx 8rpx;
				background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
				font-size: 22rpx;
				color: #FFFFFF;
			}

			.num {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				background: rgba(0, 0, 0, 0.3);
				font-size: 30rpx;
				color: #FFFFFF;
			}
		}
	}
</style>