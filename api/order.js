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
 * 获取购物车列表
 * @param numType boolean true 购物车数量,false=购物车产品数量
 */
export function getCartCounts(numType,storeId) {
	return request.get("cart/count", {
		numType: numType === undefined ? 0 : numType,
		store_id:storeId
	});
}

/**
 * 获取购物车列表
 * 
 */
export function getCartList(data) {
	return request.get("cart/list", data);
}

/**
 * 购物车计算
 * 
 */
export function cartCompute(data) {
	return request.post("cart/compute", data);
}

/**
 * 修改购物车
 * 
 */
export function getResetCart(data) {
	return request.post("v2/reset_cart", data);
}

/**
 * 修改购物车数量
 * @param int cartId  购物车id
 * @param int number 修改数量
 */
export function changeCartNum(cartId, number) {
	return request.post("cart/num", {
		id: cartId,
		number: number
	});
}
/**
 * 清除购物车
 * @param object ids join(',') 切割成字符串
 */
export function cartDel(ids,storeId) {
	if (typeof ids === 'object')
		ids = ids.join(',');
	return request.post('cart/del', {
		ids: ids,
		store_id: storeId
	});
}
/**
 * 订单列表
 * @param object data
 */
export function getOrderList(data) {
	return request.get('order/list', data);
}

/**
 * 新订单列表 2.1版本
 * @param object data
 */
export function getNewOrderList(data) {
	return request.get('order/refund/list', data);
}

/**
 * 订单产品信息
 * @param string unique 
 */
export function orderProduct(unique) {
	return request.post('order/product', {
		unique: unique
	});
}

/**
 * 订单评价
 * @param object data
 * 
 */
export function orderComment(data) {
	return request.post('order/comment', data);
}

/**
 * 订单支付
 * @param object data
 */
export function orderPay(data) {
	return request.post('order/pay', data);
}

/**
 * 订单统计数据
 */
export function orderData(data) {
	return request.get('order/data',data)
}

/**
 * 订单取消
 * @param string id
 * 
 */
export function orderCancel(id) {
	return request.post('order/cancel', {
		id: id
	});
}

/**
 * 删除已完成订单
 * @param string uni
 * 
 */
export function orderDel(uni) {
	return request.post('order/del', {
		uni: uni
	});
}

/**
 * 删除已退款和拒绝退款的订单
 * @param string uni
 * 
 */
export function refundOrderDel(uni) {
	return request.get('order/refund/del/' + uni, {});
}


/**
 * 订单详情
 * @param string uni 
 */
export function getOrderDetail(uni) {
	return request.get('order/detail/' + uni);
}

/**
 * 退款订单详情
 * @param string uni 
 */
export function getRefundOrderDetail(uni) {
	return request.get('order/refund/detail/' + uni);
}

/**
 * 放弃申请退款
 * @param string uni 
 */
export function cancelRefundOrder(uni) {
	return request.post('order/refund/cancel/' + uni);
}

/**
 * 再次下单
 * @param string uni
 * 
 */
export function orderAgain(uni) {
	return request.post('order/again', {
		uni: uni
	});
}

//再次申请售后
export function orderRefundAgain(id) {
	return request.post('order/refund/again/' + id);
}

/**
 * 订单收货
 * @param string uni
 * 
 */
export function orderTake(uni) {
	return request.post('order/take', {
		uni: uni
	});
}

/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(uni, type) {
	return request.get("order/express/" + uni + (type ? '/' + type : ''));
}

/**
 * 获取退款理由
 * 
 */
export function ordeRefundReason() {
	return request.get('order/refund/reason');
}

/**
 * 订单退款审核
 * @param object data
 */
export function orderRefundVerify(data) {
	return request.post('order/refund/verify', data);
}

/**
 * 订单确认获取订单详细信息
 * @param string cartId
 */
export function orderConfirm(cartId, news, addressId, shippingType, store_id, couponId, luckRecordId) {
	return request.post('order/confirm', {
		cartId,
		'new': news,
		addressId,
		'shipping_type': shippingType,
		store_id,
		'couponId':couponId,
		luckRecordId
	});
}

/**
 * 获取当前金额能使用的优惠卷
 * @param string price
 * 
 */
export function getCouponsOrderPrice(price, data) {
	return request.get('coupons/order/' + price, data)
}

/**
 * 订单创建
 * @param string key
 * @param object data
 * 
 */
export function orderCreate(key, data) {
	return request.post('order/create/' + key, data);
}

/**
 * 计算订单金额
 * @param key
 * @param data
 * @returns {*}
 */
export function postOrderComputed(key, data) {
	return request.post("order/computed/" + key, data);
}

/**
 * 订单优惠券
 * @param key
 * @param data
 * @returns {*}
 */
export function orderCoupon(orderId) {
	return request.post("v2/order/product_coupon/" + orderId);
}

/**
 * 计算会员线下付款金额
 * @param {Object} data
 */
export function offlineCheckPrice(data) {
	return request.post("order/offline/check/price", data);
}

/**
 * 线下扫码付款
 * @param {Object} data
 */
export function offlineCreate(data) {
	return request.post("order/offline/create", data);
}

/**
 * 支付方式开关
 */
export function orderOfflinePayType() {
	return request.get('order/offline/pay/type');
}

/**
 * 开票记录
 */
export function orderInvoiceList(data) {
	return request.get('v2/order/invoice_list', data);
}

/**
 * 开票订单详情
 * @param {Object} id
 */
export function orderInvoiceDetail(id) {
	return request.get(`v2/order/invoice_detail/${id}`);
}


/**
 * 支付宝支付
 * @param {Object} key
 * @param {Object} quitUrl
 */
export function aliPay(key, quitUrl) {
	return request.get('ali_pay', {
		key,
		quitUrl
	}, {
		noAuth: true
	});
}


/**
 * 退货物流单号提交
 * @param {Object} data
 */
export function refundExpress(data) {
	return request.post("order/refund/express", data);
}

/**
 * 分类购物车列表
 */
export function vcartList(data) {
	return request.get("v2/cart_list",data);
}

/**
 * 支付订单
 */
export function payCashier(storeId) {
	return request.get(`order/pay_cashier?store_id=${storeId}`);
}

/**
 * 退款商品列表
 */
export function refundGoodsList(orderId) {
	return request.get(`order/refund/cart_info/${orderId}`);
}

/**
 * 申请退款商品列表
 */
export function postRefundGoods(data) {
	return request.post(`order/refund/cart_info`, data);
}

/**
 * 退款商品提交
 */
export function returnGoodsSubmit(id, data) {
	return request.post(`order/refund/apply/${id}`, data);
}

/**
 * 确认订单详情（是否显示快递配送）
 */
export function checkShipping(data) {
	return request.post(`order/check_shipping`, data);
}

/**
 * 配送订单详情
 */
export function deliveryDetail(id) {
	return request.get(`delivery_order/detail/${id}`);
}

/**
 * 收银台订单信息
 * @param object data
 */
export function getCashierOrder(orderId, type) {
	return request.get(`order/cashier/${orderId}/${type}`);
}


/**
 * 获取订单下单奖励
 * @param object data
 */
export function getOrderPrizeApi(orderId) {
	return request.post(`order/prize/${orderId}`);
}

