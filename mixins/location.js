// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { getGeocoder } from '@/api/user.js';
import { getnearbyStore } from '@/api/new_store.js';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
		location: {},
		addressInfo:'选择地址',
		addressInfos:"选择地址",
		storeName: '',
		storeId:0
	};
  },
  watch: {
  	location(value) {
  		this.getnearbyStore(value);
  	}
  },
  mounted(){
	uni.$off('activeFn');
	uni.$on('activeFn', data => {
		if(data){
			this.storeName = data.name;
			this.storeId = data.id;
			this.SET_NEARBY(data.id);
		}
	});  
  },
  methods: {
	...mapMutations(['SET_NEARBY']),
	selfLocation() {
		let self = this
		// #ifdef MP || APP-PLUS
		uni.getLocation({
			type: 'gcj02',
			success: (res) => {
				try {
					uni.setStorageSync('user_latitude', res.latitude);
					uni.setStorageSync('user_longitude', res.longitude);
					self.getGeocoderCity(res.latitude,res.longitude);
					self.location = { latitude: res.latitude, longitude: res.longitude };
				} catch {}
			},
			fail:(res)=>{
				// #ifdef MP
				uni.getSetting({
					success: res=>{
						if(typeof(res.authSetting['scope.userLocation']) != 'undefined' && !res.authSetting['scope.userLocation']){
						  uni.setStorageSync('refuseLocation', true);
						}
					}
				})
				// #endif
			}
		});
		// #endif
		// #ifdef H5
		if (this.$wechat.isWeixin()) {
			this.$wechat.location().then(res => {
				uni.setStorageSync('user_latitude', res.latitude);
				uni.setStorageSync('user_longitude', res.longitude);
				self.getGeocoderCity(res.latitude,res.longitude);
			})
		} else {
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					try {
						uni.setStorageSync('user_latitude', res.latitude);
						uni.setStorageSync('user_longitude', res.longitude);
						self.getGeocoderCity(res.latitude,res.longitude);
					} catch {}
				}
			});
		}
		// #endif
	},
	getGeocoderCity(latitude,longitude){
		getGeocoder({
			lat: latitude,
			long: longitude
		}).then(res=>{
			let address = res.data.address_component;
			this.addressInfo = address?address.city.slice(0,4) : '选择地址';
			this.addressInfos = address?(address.city+address.district).slice(0,7) : '选择地址';
		})
	},
	chooseLocation: function() {
		let that = this;
		if(that.fixConfig == 0){
			uni.navigateTo({
				url:'/pages/store/list/index?type=1&isCollage=1&storeId='+this.storeId
			})
		}else{
			uni.chooseLocation({
				success: (res) => {
					let address = that.$util.addressInfo(res.address);
					this.addressInfo = address?address.city.slice(0,4) : '选择地址';
					this.addressInfos = address?(address.city+address.district).slice(0,7) : '选择地址';
					that.location = { latitude: res.latitude, longitude: res.longitude };
				},
				fail: (err)=>{
					console.log(err)
				}
			})
		}
	},
	getnearbyStore(data) {
		getnearbyStore(data).then(res => {
			this.storeId = res.data.info.id;
			this.SET_NEARBY(res.data.info.id);
			this.storeName = res.data.info.name;
		});
	}
  }
};