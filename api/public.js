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
import wechat from "@/libs/wechat.js";

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function getWechatConfig() {
	return request.get(
		"wechat/config", {
			url: wechat.signLink()
		}, {
			noAuth: true
		}
	);
}

/**
 * 小程序手机号登录
 * @param {Object} data
 */
export function phoneLogin(data) {
	return request.post('v2/routine/phone_login', data, {
		noAuth: true
	});
}

/**
 * 小程序绑定手机号（最新）
 * @param {Object} data
 */
export function routineBindingPhone(data) {
	return request.post('v2/routine/auth_binding_phone', data, {
		noAuth: true
	});
}


/**
 * 公众号绑定手机号
 * @param {Object} data
 */
export function wechatBindingPhone(data) {
	return request.post('v2/wechat/auth_binding_phone', data, {
		noAuth: true
	});
}


/**
 * code生成用户
 * @returns {*}
 */

export function authType(data) {
	return request.get("v2/routine/auth_type", data, {
		noAuth: true
	});
}

/**
 * 公众号登录
 * @returns {*}
 */
export function wechatAuthLogin(data) {
	return request.get("v2/wechat/auth_login", data, {
		noAuth: true
	});
}

/**
 * 获取登录授权login
 * 
 */
export function getLogo() {
	return request.get('wechat/get_logo', {}, {
		noAuth: true
	});
}

/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function login(data) {
	return request.post("wechat/mp_auth", data, {
		noAuth: true
	});
}

/**
 * 静默授权
 * @param {Object} data
 */
export function silenceAuth(data) {
	//#ifdef MP
	return request.get("v2/wechat/silence_auth", data, {
		noAuth: true
	});
	//#endif
	//#ifdef H5
	return request.get("v2/wechat/wx_silence_auth", data, {
		noAuth: true
	});
	//#endif
}

/**
 * 分享
 * @returns {*}
 */
export function getShare() {
	return request.get("share", {}, {
		noAuth: true
	});
}

/**
 * 获取关注海报
 * @returns {*}
 */
export function follow() {
	return request.get("wechat/follow", {}, {
		noAuth: true
	});
}
/**
 * 授权登录
 * @returns {*}
 */
export function authLogin(data) {
	return request.get("v2/routine/auth_login", data, {
		noAuth: true
	});
}

/**
 * 获取图片base64
 * @retins {*}
 * */
export function imageBase64(image, code) {
	return request.post(
		"image_base64", {
			image: image,
			code: code
		}, {
			noAuth: true
		}
	);
}

/**
 * 自动复制口令功能
 * @returns {*}
 */
export function copyWords() {
	return request.get("copy_words", {}, {
		noAuth: true
	});
}

/**
 * 获取商城是否强制绑定手机号
 */
export function getShopConfig() {
	return request.get('v2/bind_status', {}, {
		noAuth: true
	});
}

/**
 * 小程序绑定手机号
 * @param {Object} data
 */
export function getUserPhone(data) {
	return request.post('v2/auth_bindind_phone', data, {
		noAuth: true
	});
}

/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function routineLogin(data) {
	return request.get("v2/wechat/routine_auth", data, {
		noAuth: true
	});
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function wechatAuthV2(code, spid) {
	return request.get(
		"v2/wechat/auth", {
			code: code,
			spread_spid: spid
		}, {
			noAuth: true
		}
	);
}

/**
 * 获取组件底部菜单
 * @param data object 获取组件底部菜单
 */
export function getNavigation(data) {
	return request.get("navigation", data, {
		noAuth: true
	});
}
export function getSubscribe() {
	return request.get("subscribe", {}, {
		noAuth: true
	});
}