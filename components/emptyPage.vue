<template>
	<!-- 无数据时显示 -->
	<view class="empty-page w-full flex-col flex-center pt-82 bg--w111-fff rd-24rpx">
		<image class="empty-img" :src="imgSrc"></image>
		<view class="fs-26 text--w111-999 lh-36rpx pt-16">{{title}}</view>
		<slot name="bottom"></slot>
	</view>
</template>

<script>
	import {HTTP_REQUEST_URL} from '@/config/app';
	export default{
		props: {
			title: {
				type: String,
				default: '暂无记录',
			},
			src:{
				type: String,
				default: '/statics/images/empty-box.gif',
			}
		},
		data(){
			return{
				imgHost:HTTP_REQUEST_URL
			}
		},
		computed:{
			imgSrc(){
				return HTTP_REQUEST_URL + this.src
			}
		}
	}

</script>

<style lang="scss">
	.pt-82{
		padding: 82rpx 0 160rpx;
	}
	.empty-img{
		width: 440rpx;
		height: 360rpx;
	}
</style>
