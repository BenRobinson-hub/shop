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
 * 获取用户信息
 *
 */
export function getUserInfo() {
	return request.get('user');
}

/**
 * 运营统计数据
 *
 */
export function getMenuData() {
	return request.get('menu/date');
}

/**
 * 登录成功后更新公众号用户信息
 */
export function updateWechatInfo(data) {
	return request.get('v2/user/wechat', data);
}

/**
 * 设置用户分享
 *
 */
export function userShare() {
	return request.post('user/share');
}

/**
 * h5用户登录
 * @param data object 用户账号密码
 */
export function loginH5(data) {
	return request.post("login", data, {
		noAuth: true
	});
}

/**
 * h5用户手机号登录
 * @param data object 用户手机号 也只能
 */
export function loginMobile(data) {
	return request.post("login/mobile", data, {
		noAuth: true
	});
}

/**
 * 验证码key
 */
export function getCodeApi() {
	return request.get("verify_code", {}, {
		noAuth: true
	});
}

/**
 * h5用户发送验证码
 * @param data object 用户手机号
 */
export function registerVerify(data) {
	return request.post("register/verify", data, {
		noAuth: true
	});
}

/**
 * h5用户手机号注册
 * @param data object 用户手机号 验证码 密码
 */
export function register(data) {
	return request.post("register", data, {
		noAuth: true
	});
}

/**
 * 用户手机号修改密码
 * @param data object 用户手机号 验证码 密码
 */
export function registerReset(data) {
	return request.post("register/reset", data, {
		noAuth: true
	});
}

/**
 * 获取用户中心菜单
 *
 */
export function getMenuList() {
	return request.get("menu/user", {}, {
		noAuth: true
	});
}

/*
 * 签到用户信息
 * */
export function postSignUser(sign) {
	return request.post("sign/user", sign);
}

/**
 * 获取签到状态
 *
 */
export function getSignStatus() {
	return request.get('sign/status')
}

/**
 * 获取签到配置
 *
 */
export function getSignConfig() {
	return request.get('sign/config')
}

/**
 * 获取签到列表
 * @param object data
 */
export function getSignList(data) {
	return request.get('sign/list', data);
}

/**
 * 用户签到
 */
export function setSignIntegral() {
	return request.post('sign/integral')
}

/**
 * 签到列表(年月)
 * @param object data
 *
 */
export function getSignMonthList(data) {
	return request.get('sign/month', data)
}

/**
 * 签到日历
 * @param {Object} data
 */
export function getSignCalendar(data) {
	return request.get('sign/calendar', data)
}

/**
 * 活动状态
 *
 */
export function userActivity() {
	return request.get('user/activity');
}

/*
 * 资金明细（types|0=全部,1=消费,2=充值,3=返佣,4=提现）这个接口暂时废弃
 * */
export function getCommissionInfo(q, types) {
	return request.get("spread/commission/" + types, q);
}

// 资金明细（types|0=全部,1=消费,2=充值,3=返佣,4=提现）
export function moneyList(q, types) {
	return request.get("v2/user/money_list/" + types, q);
}

/*
 * 积分记录
 * */
export function getIntegralList(q) {
	return request.get("integral/list", q);
}

/**
 * 获取分销海报图片
 *
 */
export function spreadBanner() {
	//#ifdef H5 || APP-PLUS
	return request.get('spread/banner', {
		type: 2
	});
	//#endif
	//#ifdef MP
	return request.get('spread/banner', {
		type: 1
	});
	//#endif

}

/**
 *
 * 获取推广用户一级和二级
 * @param object data
 */
export function spreadPeople(data) {
	return request.post('spread/people', data);
}

/**
 *
 * 推广佣金/提现总和
 * @param int type
 */
export function spreadCount(type) {
	return request.get('spread/count/' + type);
}

/*
 * 推广数据
 * */
export function getSpreadInfo() {
	return request.get("commission");
}


/**
 *
 * 推广订单
 * @param object data
 */
export function spreadOrder(data) {
	return request.post('spread/order', data);
}

/*
 * 获取推广人排行
 * */
export function getRankList(q) {
	return request.get("rank", q);
}

/*
 * 获取佣金排名
 * */
export function getBrokerageRank(q) {
	return request.get("brokerage_rank", q);
}

/**
 * 提现申请
 * @param object data
 */
export function extractCash(data) {
	return request.post('extract/cash', data)
}

/**
 * 提现银行/提现最低金额
 *
 */
export function extractBank() {
	return request.get('extract/bank');
}

/**
 * 会员等级列表
 *
 */
export function userLevelGrade() {
	return request.get('user/level/grade');
}

/**
 * 获取某个等级任务
 * @param int id 任务id
 */
export function userLevelTask(id) {
	return request.get('user/level/task/' + id);
}


/**
 * 检查用户是否可以成为会员
 *
 */
export function userLevelDetection() {
	return request.get('user/level/detection');
}

/**
 *
 * 地址列表
 * @param object data
 */
export function getAddressList(data) {
	return request.get('address/list', data);
}

/**
 * 设置默认地址
 * @param int id
 */
export function setAddressDefault(id) {
	return request.post('address/default/set', {
		id: id
	})
}

/**
 * 修改 添加地址
 * @param object data
 */
export function editAddress(data) {
	return request.post('address/edit', data);
}

/**
 * 删除地址
 * @param int id
 *
 */
export function delAddress(id) {
	return request.post('address/del', {
		id: id
	})
}

/**
 * 获取单个地址
 * @param int id
 */
export function getAddressDetail(id) {
	return request.get('address/detail/' + id);
}

/**
 * 修改用户信息
 * @param object
 */
export function userEdit(data) {
	return request.post('user/edit', data);
}

/*
 * 退出登录
 * */
export function getLogout() {
	return request.get("logout");
}

/*
 * 充值订单信息
 * */
export function rechargeAPi(data) {
	return request.post("recharge/recharge", data);
}

/*
 * 充值支付
 * */
export function rechargePayAPi(data) {
	return request.post("recharge/pay", data);
}

/**
 * 获取默认地址
 *
 */
export function getAddressDefault() {
	return request.get('address/default');
}

/**
 * 充值金额选择
 */
export function getRechargeApi() {
	return request.get("recharge/index");
}

/**
 * 登陆记录
 */
export function setVisit(data) {
	return request.post('user/set_visit', {
		...data
	}, {
		noAuth: true
	});
}

/**
 * 客服列表
 */
export function serviceList() {
	return request.get("user/service/list");
}
/**
 * 客服详情
 */
export function getChatRecord(data) {
	return request.get("v2/user/service/record", data);
}

/**
 * 静默绑定推广人
 * @param {Object} puid
 */
export function spread(puid) {
	return request.post("user/spread", puid);
}

/**
 * 会员详情
 */
export function getlevelInfo() {
	return request.get("user/level/info");
}

/**
 * 会员经验列表
 */
export function getlevelExpList(data) {
	return request.get("user/level/expList", data);
}

/**
 * 修改用户信息
 * @param {Object} data
 */
export function updateUserInfo(data) {
	return request.post('v2/user/user_update', data);
}

/**
 * 微信直接手机号登录
 */
export function phoneWxSilenceAuth(data) {
	return request.post('v2/phone_wx_silence_auth', data, {
		noAuth: true
	});
}

/**
 * 小程序直接手机号登录
 */
export function phoneSilenceAuth(data) {
	return request.post('v2/phone_silence_auth', data, {
		noAuth: true
	});
}

/**
 * 用户发票列表
 * @param {Object} data
 */
export function invoiceList(data) {
	return request.get('v2/invoice', data, {
		noAuth: true
	});
}

/**
 * 用户添加|修改发票
 * @param {Object} data
 */
export function invoiceSave(data) {
	return request.post('v2/invoice/save', data, {
		noAuth: true
	});
}

/**
 * 用户删除发票
 * @param {Object} data
 */
export function invoiceDelete(id) {
	return request.get('v2/invoice/del/' + id);
}

/**
 * 获取用户默认发票
 * @param {Object} type
 */
export function invoiceDefault(type) {
	return request.get('v2/invoice/get_default/' + type);
}

/**
 * 用户单个发票详情
 * @param {Object} id
 */
export function invoiceDetail(id) {
	return request.get('v2/invoice/detail/' + id);
}

/**
 * 订单申请开票
 * @param {Object} id
 */
export function invoiceOrder(data) {
	return request.post('v2/order/make_up_invoice', data);
}

/**
 * 订单详情中申请开票
 * @param {Object} id
 */
export function makeUpinvoice(data) {
	return request.post('v2/order/make_up_invoice', data);
}

/**
 * 会员卡主界面
 */
export function memberCard() {
	return request.get('user/member/card/index');
}

/**
 * 卡密领取会员卡
 * @param {Object} data
 */
export function memberCardDraw(data) {
	return request.post('user/member/card/draw', data);
}

/**
 * 购买会员卡
 * @param {Object} data
 */
export function memberCardCreate(data) {
	return request.post('user/member/card/create', data);
}

/**
 * 购买会员卡支付
 * @param {Object} data
 */
export function memberCardPayApi(data) {
	return request.post('user/member/card/pay', data);
}

/**
 * 会员优惠券
 */
export function memberCouponsList(page, limit) {
	return request.get('user/member/coupons/list', {
		page,
		limit
	});
}

/**
 * svip推荐商品
 * @param {Object} id
 */
export function groomList(id, data) {
	return request.get(`groom/list/${id}`, data);
}

/**
 * 付费会员结束
 * @param {Object} data
 */
export function memberOverdueTime(data) {
	return request.get('user/member/overdue/time', data);
}

/**
 * 新版分享海报信息获取
 * 
 */
export function spreadMsg() {
	return request.get('user/spread_info');
}

/**
 * 已邀请/已下单好友
 * 
 */
export function agentUserList(type, page, limit) {
	return request.get(`v2/agent/agent_user_list/${type}?page=${page}&limit=${limit}`);
}

/**
 * 获取用户推广获得收益，佣金轮播，分销规则

 * 
 */
export function agentInfo() {
	return request.get(`v2/agent/agent_info`);
}

/**
 * 图片链接转base64
 * 
 */
export function imgToBase(data) {
	return request.post('image_base64', data);
}

/**
 * 获取小程序二维码
 * 
 */
export function routineCode(data) {
	return request.get('user/routine_code', data);
}

/**
 * 消息中心
 */
export function serviceRecord(data) {
	return request.get('user/message', data);
}

/**
 * 消息中心-站内信列表
 */
export function messageSystem(data) {
	return request.get('user/message_system/list', data);
}

/**
 * 消息中心-站内信列表详情
 */
export function getMsgDetails(id) {
	return request.get('user/message_system/detail/' + id);
}

/**
 * 苹果账号登录
 * @param {Object} data
 */
export function appleLogin(data) {
	return request.post('apple_login', data, {
		noAuth: true
	});
}

/*
 * 获取隐私协议
 * */
export function getUserAgreement(type) {
	return request.get(`user_agreement/${type}`, {}, {
		noAuth: true
	});
}

/*
 * 获取分销说明
 * */
export function getDistributionInfo(type) {
	return request.get(`agreement/2`, {}, {
		noAuth: true
	});
}

/**
 * 获取分销等级列表
 * @param int id 任务id
 */
export function agentLevelList() {
	return request.get('v2/agent/level_list');
}

/**
 * 获取分销任务列表
 * @param int id 任务id
 */
export function agentLevelTaskList(id) {
	return request.get('v2/agent/level_task_list?id=' + id);
}

/**
 * 获取定位详细地址
 * @param int id
 *
 */
export function getGeocoder(data) {
	return request.get(`geoLbscoder?location=${data.lat},${data.long}`, {}, {
		noAuth: true
	});
}

/**
 * 获取当前定位选中的地址
 * @param int id
 *
 */
export function getCityList(address) {
	return request.get('v2/cityList', {
		address
	}, {
		noAuth: true
	});
}

/**
 * 获取版权
 *
 */
export function getCopyRight() {
	return request.get('get_copyright', {}, {
		noAuth: true
	});
}

/**
 * 获取code码
 * @param int id
 *
 */
export function getRandCode() {
	return request.get('user/rand_code');
}

/**
 * 注销用户
 * @param int id
 *
 */
export function cancelUser() {
	return request.get('cancel/user');
}

/**
 * 获取激活会员卡需要的信息
 * @param int id
 *
 */
export function levelInfo() {
	return request.get('user/level/activate_info');
}

/**
 * 用户激活会员卡
 * @param int id
 *
 */
export function levelActivate(data) {
	return request.post('user/level/activate', data);
}

/**
 * 用户设置签到提醒
 */
export function signRemind(status) {
	return request.get(`sign/remind/${status}`);
}

/**
 * 供应商入住
 * @param data
 * 
 */
export function spplyCreateApi(id, data) {
	return request.post(`user/apply/supplier/${id}`, data);
}

/**
 * 供应商详情接口
 *
 */
export function userApply(id) {
	return request.get("user/apply/" + id);
}

/**
 * 供应商记录接口
 *
 */
export function recordList() {
	return request.get("user/apply/record");
}

/**
 * 文章点赞
 *
 */
export function articleStarApi(id, data) {
	return request.get(`article/like/${id}`, data);
}