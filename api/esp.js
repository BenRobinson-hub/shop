// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from "@/utils/request.js";

/**
 * erp设置
 * 
 */
export function erpConfig(id,data) {
	return request.get('admin/erp/config');
}

/**
 * 门店-erp设置
 * 
 */
export function storeErpConfig(id,data) {
	return request.get('store/erp/config');
}
