<template>
	<groupGoodsList :goodsList="goodsList"></groupGoodsList>
</template>

<script>
	import groupGoodsList from '../components/groupGoodsList/index.vue';
	import {
		getCollagePartake
	} from '@/api/store.js';

	export default {
		components: {
			groupGoodsList
		},
		data() {
			return {
				goodsList: []
			}
		},
		onLoad(option) {
			this.collage_id = option.collage_id;
			this.getCollagePartake();
		},
		methods: {
			getCollagePartake() {
				getCollagePartake({
					collage_id: this.collage_id
				}).then(res => {
					this.goodsList = res.data;
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.goods-list {
		margin: 20rpx 30rpx;
	}
</style>
