<template>
	<view :style="colorStyle">
		<view class="px-32">
			<view class="fs-36 fw-500 lh-54rpx mt-44">{{ articleInfo.title }}</view>
			<view class="flex fs-24 text--w111-999 mt-16">
				<text>{{ articleInfo.catename }}</text>
				<text class="px-16">|</text>
				<text>{{ articleInfo.add_time }}</text>
			</view>
			<view class="content fs-30 text--w111-333 lh-52rpx mt-32">
				<jyf-parser :html="content" ref="article" :tag-style="tagStyle"></jyf-parser>
			</view>
			<view class="bg--w111-f5f5f5 rd-24rpx w-full flex-between-center p-20 mt-32" @tap="goDetail" v-if="store_info.id">
				<image :src="store_info.image" class="w-160 h-160 rd-16rpx" mode="aspectFill"></image>
				<view class="flex-1 h-160 flex-col justify-between pl-20">
					<view class="w-full fs-28 lh-40rpx line2">{{ store_info.store_name }}</view>
					<view class="flex justify-between items-end">
						<baseMoney :money="store_info.price" symbolSize="28" integerSize="44" decimalSize="28" weight></baseMoney>
						<view class="w-136 h-52 rd-30rpx flex-center fs-22 text--w111-fff bg-gradient">立即购买</view>
					</view>
				</view>
			</view>
		</view>
		<view class="h-200"></view>
		<view class="bg--w111-fff w-full z-99 fixed-lb pb-safe">
			<view class="w-full h-128 pr-20 flex-y-center" v-if="store_info.id">
				<!-- #ifdef H5 -->
				<text class="iconfont icon-ic_transmit1 fs-44 ml-52" @tap="listenerActionSheet"></text>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button open-type="share" hover-class="none">
					<text class="iconfont icon-ic_transmit1 fs-44 ml-52"></text>
				</button>
				<!-- #endif -->
				<view class="ml-80 relative">
					<text class="iconfont icon-ic_Eyes fs-44"></text>
					<text class="fs-20 fw-500 abs-num">{{ articleInfo.visit }}</text>
				</view>
				<view class="ml-80 relative" :class="{ active: articleInfo.is_like }" @tap="giveLike">
					<text class="iconfont icon-ic_Like fs-44"></text>
					<text class="fs-20 fw-500 likes-num">{{ articleInfo.likes }}</text>
				</view>
				<view class="w-300 h-72 rd-36rpx flex-center bg--w111-f5f5f5 ml-80" @tap="goDetail">
					<image :src="store_info.image" class="w-48 h-48 rd-8rpx"></image>
					<view class="pl-12">
						<view class="fs-22 fw-500 w-172 line1">{{ store_info.store_name }}</view>
						<view class="fs-20 SemiBold">¥{{ store_info.price }}</view>
					</view>
				</view>
			</view>
			<view class="w-full px-120 h-128 flex-between-center" v-else>
				<!-- #ifdef H5 -->
				<text class="iconfont icon-ic_transmit1 fs-44" @tap="listenerActionSheet"></text>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<button open-type="share" hover-class="none">
					<text class="iconfont icon-ic_transmit1 fs-44"></text>
				</button>
				<!-- #endif -->
				<view class="relative">
					<text class="iconfont icon-ic_Eyes fs-44"></text>
					<text class="fs-20 fw-500 abs-num">{{ articleInfo.visit }}</text>
				</view>
				<view class="relative" :class="{ active: articleInfo.is_like }" @tap="giveLike">
					<text class="iconfont icon-ic_Like fs-44"></text>
					<text class="fs-20 fw-500 likes-num">{{ articleInfo.likes }}</text>
				</view>
			</view>
		</view>
		<shareInfo @setShareInfoStatus="setShareInfoStatus" :shareInfoStatus="shareInfoStatus"></shareInfo>
	</view>
</template>

<script>
import { getArticleDetails } from '@/api/api.js';
import { articleStarApi } from '@/api/user.js';
import shareInfo from '../components/shareInfo/index.vue';
import home from '@/components/home';
import parser from '@/components/jyf-parser/jyf-parser';
import colors from '@/mixins/color';
import { mapGetters } from 'vuex';
import { toLogin } from '@/libs/login.js';
import { HTTP_REQUEST_URL } from '@/config/app';
export default {
	components: {
		shareInfo,
		home,
		'jyf-parser': parser
	},
	mixins: [colors],
	data() {
		return {
			id: 0,
			articleInfo: [],
			store_info: {},
			content: '',
			shareInfoStatus: false,
			tagStyle: {
				img: 'width:100%;display:block;border-radius:8px;',
				table: 'width:100%',
				video: 'width:100%'
			}
		};
	},
	computed: mapGetters(['isLogin']),
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (options.hasOwnProperty('id')) {
			this.id = options.id;
		} else {
			// #ifndef H5
			uni.navigateBack({ delta: 1 });
			// #endif
			// #ifdef H5
			history.back();
			// #endif
		}
	},
	onShow: function () {
		uni.removeStorageSync('form_type_cart');
		this.getArticleOne();
	},
	methods: {
		getArticleOne: function () {
			let that = this;
			getArticleDetails(that.id).then((res) => {
				uni.setNavigationBarTitle({
					title: res.data.title.substring(0, 7) + '...'
				});
				that.$set(that, 'articleInfo', res.data);
				that.$set(that, 'store_info', res.data.store_info ? res.data.store_info : {});
				that.content = res.data.content;
				// #ifdef H5
				if (this.$wechat.isWeixin()) {
					this.setShareInfo();
				}
				// #endif
			});
		},
		giveLike() {
			if (!this.isLogin) {
				toLogin();
			} else {
				articleStarApi(this.id, {
					status: this.articleInfo.is_like ? 0 : 1
				}).then((res) => {
					let that = this;
					uni.showToast({
						title: this.articleInfo.is_like ? '取消点赞' : '点赞成功',
						icon: 'none',
						success: () => {
							if (this.articleInfo.is_like) {
								that.articleInfo.likes = that.articleInfo.likes - 1;
								that.articleInfo.is_like = 0;
							} else {
								that.articleInfo.likes = that.articleInfo.likes + 1;
								that.articleInfo.is_like = 1;
							}
						}
					});
				});
			}
		},
		goDetail() {
			uni.navigateTo({
				url: '/pages/goods_details/index?id=' + this.store_info.id
			});
		},
		listenerActionSheet() {
			if (this.$wechat.isWeixin()) {
				this.shareInfoStatus = true;
			} else {
				let that = this;
				uni.setClipboardData({
					data: HTTP_REQUEST_URL + '/pages/extension/news_details/index?id=' + that.id,
					success: () => {
						uni.showToast({
							title: '已复制页面链接'
						});
					}
				});
			}
		},
		setShareInfoStatus() {
			this.shareInfoStatus = false;
		},
		setShareInfo: function () {
			let href = location.href;
			let configAppMessage = {
				desc: this.articleInfo.synopsis,
				title: this.articleInfo.title,
				link: href,
				imgUrl: this.articleInfo.image_input.length ? this.articleInfo.image_input[0] : ''
			};
			this.$wechat.wechatEvevt(['updateAppMessageShareData', 'updateTimelineShareData'], configAppMessage);
		}
	}
};
</script>
<style>
page {
	background-color: #ffffff;
}
</style>
<style lang="scss">
.active {
	color: var(--view-theme);
}
.content {
	text-indent: 2em;
}
.ml-52 {
	margin-left: 52rpx;
}
.ml-80 {
	margin-left: 80rpx;
}
.abs-num {
	position: absolute;
	right: -26rpx;
	top: -10rpx;
}
.likes-num {
	position: absolute;
	right: -16rpx;
	top: -10rpx;
}
.SemiBold {
	font-family: 'SemiBold';
}
</style>
