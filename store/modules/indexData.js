// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import {CART_NUM} from '@/config/cache';
import Cache from '@/utils/cache';
export default {
	namespaced: true,
	state: {
		cartNum: Cache.get(CART_NUM) || 0
	},
	getters: {},
	mutations: {
		setCartNum(state, data) {
			Cache.set(CART_NUM, data);
			state.cartNum = data;
		}
	}
}
