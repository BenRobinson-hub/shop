<template>
	<!-- 商品分类 -->
	<view :style="colorStyle">
		<storeCate1 v-if="popupVisible == 0" :info="info" :pageVisible="pageVisible" ref="refresh2"></storeCate1>
		<tuiModal :show="popupVisible == 1" custom>
			<view class="popup">
				<view class="body">
					<view class="title">请选择用餐人数</view>
					<view class="spinner-box acea-row">
						<view v-for="(item, index) in 6" :class="{ on: index + 1 === number }" class="btn" @click="onNumber(index + 1)">
							<view class="inner">{{ index + 1 }}</view>
						</view>
						<input v-model="inputNumber" :class="{ on: inputFocus }" type="number" placeholder="自定义" class="input" @focus="onFocus" @blur="onBlur" />
					</view>
				</view>
				<view class="foot acea-row">
					<button :class="{ disabled: !number }" class="btn" hover-class="none" @tap="addTableCode(number)">
						<view class="inner">开始点餐</view>
					</button>
				</view>
			</view>
		</tuiModal>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import colors from "@/mixins/color";
	import storeCate1 from './cart.vue'
	import tuiModal from '@/components/tui-modal/index.vue'
	import {
		getTableData,
		addTableCode,
		isTableCode,
		changeTable,
		getStoreData,
	} from '@/api/store.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import util from '../../../utils/util.js';
	export default {
		computed: mapGetters(['isLogin']),
		components: {
			storeCate1,
			tuiModal,
		},
		mixins: [colors],
		data() {
			return {
				info: {},
				number: 0,
				inputNumber: '',
				popupVisible: -1,
				pageVisible: true,
				inputFocus: false,
			}
		},
		watch: {
			inputNumber(val) {
				this.$nextTick(() => {
					this.number = Number(val);
					this.inputNumber = this.number || '';
				});
			}
		},
		onLoad(options) {
			if (options.scene) {
				options = util.getUrlParams(decodeURIComponent(options.scene));
			}
			const {
				store_id,
				qrcode_id
			} = options;
			this.info = {
				...this.info,
				store_id,
				qrcode_id
			};
		},
		onShow() {
			this.info.tableId = 0;
			if (this.isLogin) {
				this.getTableData();
			} else {
				toLogin()
			}
		},
		onHide() {
			this.pageVisible = false;
		},
		methods: {
			// 获取桌码配置
			getTableData() {
				getTableData({
					store_id: this.info.store_id
				}).then(res => {
					let data = res.data;
					if (Array.isArray(data)) {
						data = {};
					}
					const {
						store_code_switch,
						store_number_diners_window
					} = data;
					this.info = {
						...this.info,
						store_number_diners_window
					};
					// 门店是否开启桌码
					if (store_code_switch == 1) {
						this.isTableCode(store_number_diners_window);
					} else {
						this.$util.Tips({
							title: '当前门店未开启桌码'
						});
					}
				});
			},
			// 选择用餐人数
			changeNumber(value) {
				this.number += value;
			},
			// 记录桌码
			addTableCode(number) {
				const {
					store_id,
					qrcode_id,
					tableId: y_tableId
				} = this.info;
				let data = {
					store_id,
					qrcode_id
				};
				if (!number) {
					return;
				}
				data.number = number;
				return new Promise((resolve, reject) => {
					addTableCode(data).then(res => {
						this.info = {
							...this.info,
							tableId: res.data.tableId
						};
						this.getStore();
						resolve(y_tableId);
						if (number) {
							this.popupVisible = 0;
						}
					}).catch(err => {
						reject(y_tableId);
						this.$util.Tips({
							title: err
						});
					});
				});
			},
			// 检查桌码记录
			isTableCode(store_number_diners_window) {
				const {
					store_id,
					qrcode_id
				} = this.info;
				isTableCode({
					store_id,
					qrcode_id
				}).then(res => {
					const {
						code,
						tableId,
						number
					} = res.data;
					this.info = {
						...this.info,
						tableId
					};
					// 判断是不是换桌
					if (!code) {
						return uni.showModal({
							title: '确定要换桌吗？',
							content: '换桌后，您已点的商品会自动转移到新桌',
							success: (res) => {
								if (res.confirm) {
									this.changeTable(tableId,number);
								} else {
									uni.switchTab({
										url: '/pages/store_list/index'
									})
									// this.getStore();
								}
							}
						});
					}
					// 判断这桌是否记录桌码
					if (tableId) {
						this.popupVisible = 0;
						this.getStore();
					} else {
						// 是否弹出选择人数弹窗
						this.popupVisible = store_number_diners_window == 1 ? 1 : 0;
						if (!this.popupVisible) {
							this.addTableCode();
						}
					}
				});
			},
			// 处理换桌商品
			async changeTable(tableId,number) {
				await this.addTableCode(number);
				changeTable({
					tableId: this.info.tableId,
					y_tableId:tableId
				}).then(() => {
					this.$util.Tips({
						title: '换桌完成',
						success: this.getStore
					});
					this.getStore();
				}).catch(err => {
					this.$util.Tips({
						title: err
					});
				});
			},
			// 获取接口附近门店
			getStore() {
				getStoreData({
					store_id: this.info.store_id
				}).then(res => {
					this.info = {
						...this.info,
						...res.data
					};
					this.$refs.refresh2.getAllCategory();
				});
			},
			onNumber(number) {
				this.number = number;
			},
			onFocus() {
				this.inputFocus = true;
				let inputNumber = this.inputNumber;
				this.$nextTick(() => {
					this.inputNumber = inputNumber;
				})
			},
			onBlur() {
				this.inputFocus = false;
			}
		},
	}
</script>
<style scoped lang="scss">
	/deep/.scroll-list{
		margin-bottom: 60rpx !important;
	}
	/deep/.goodCate .uni-badge-left-margin .uni-badge--error {
		background-color: #fff !important;
		color: var(--view-theme);
		border-color: var(--view-theme);
		z-index: 8;
	}

	/deep/.goodCate .footer .cartIcon .uni-badge-left-margin .uni-badge--error {
		right: 0 !important;
		top: 10px !important;
	}

	/deep/.mask {
		z-index: 102;
	}

	/deep/.good-cate {
		padding: 80rpx;
	}

	.white {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 101;
		background: #FFFFFF;
	}

	.popup {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 103;
		width: 644rpx;
		padding: 56rpx 52rpx;
		border-radius: 32rpx;
		background: #FFFFFF;
		transform: translate(-50%, -50%);

		.title {
			text-align: center;
			font-weight: 500;
			font-size: 32rpx;
			line-height: 52rpx;
			color: #333333;
		}

		.passive {
			width: 112rpx;
			height: 56rpx;
			background: #F5F5F5;
			text-align: center;
			font-family: SemiBold;
			font-size: 31rpx;
			line-height: 56rpx;
			color: #333333;
		}

		.foot {
			margin-top: 64rpx;

			.btn {
				flex: 1;
				height: 80rpx;
				border: 0;
				border-radius: 40rpx;
				background: var(--view-theme);
				font-weight: 500;
				font-size: 28rpx;
				line-height: 80rpx;
				color: #FFFFFF;

				.inner {
					height: 80rpx;
					border-radius: 40rpx;
					background: transparent;
				}

				&.disabled {
					.inner {
						background: rgba(255, 255, 255, 0.5);
					}
				}
			}
		}
	}

	/deep/.cartList {
		z-index: 150 !important;
	}

	.spinner-box {
		margin: 48rpx -32rpx -40rpx 0;

		.btn {
			width: 111rpx;
			height: 80rpx;
			border-radius: 16rpx;
			margin: 0 32rpx 40rpx 0;
			background: #F5F5F5;
			text-align: center;
			font-family: SemiBold;
			font-size: 32rpx;
			line-height: 80rpx;
			color: #999999;

			.inner {
				width: 111rpx;
				height: 80rpx;
				border: 2rpx solid transparent;
				border-radius: 16rpx;
				background-color: transparent;
				background-clip: content-box;
			}

			&.on {
				background: var(--view-theme);
				color: var(--view-theme);

				.inner {
					background-color: rgba(255, 255, 255, 0.9);
				}
			}
		}

		.input {
			width: 254rpx;
			height: 80rpx;
			border: 2rpx solid #CCCCCC;
			border-radius: 16rpx;
			text-align: center;
			font-family: SemiBold;
			font-size: 32rpx;
			line-height: 80rpx;
			color: #999999;

			&.on {
				border-color: var(--view-theme);
				color: var(--view-theme);
			}
		}

		/deep/.input-placeholder {
			font-weight: 500;
			font-size: 28rpx;
			color: #CCCCCC;
		}
	}
</style>