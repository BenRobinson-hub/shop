<template>
	<view  :style="colorStyle">
		<view class="w-full relative z-99 gradient-box" :style="{'padding-top': sysHeight + 'px'}">
			<view class="w-full px-20 pl-20 h-80 flex-between-center">
				<text class="iconfont icon-ic_leftarrow fs-40 text--w111-fff" @click="goPage(3)"></text>
				<text class="fs-34 fw-500 text--w111-fff">提交订单</text>
				<text></text>
			</view>
			<view class="header" v-if="tableId">
				<view class="top acea-row row-middle">
					<view class="name">{{ codeData.storeName.storeName }}</view>
					<view class="number"><text class="light">{{ codeData.category.name }}{{ codeData.table_number }}</text>号桌</view>
				</view>
				<view>{{ codeData.serial_number }}</view>
			</view>
			<view class="px-20 mt-30" v-if="!tableId">
				<view class="allAddress">
					<!-- isDisplay 支持的配送方式数组 -->
					<!-- store_self_mention 自提开关 -->
					<view class="h-96 relative" v-if="isDisplay.length>1">
						<view class="w-full abs-lb rd-t-24rpx flex bg--w111-fff fs-26 text--w111-666 fw-400">
							<view class="flex-center w-50p h-76 rd-lt-24rpx z-2"
								:class="deliveryType == 1 ? 'bg--w111-fff font-num fs-28 fw-500' : 'bg-primary-light bg-horn'"
								v-if="isDisplay.includes('1')"
								@tap="addressType(0,1)">商城配送</view>
							<view class="flex-center w-50p h-76 z-2"
								:class="[deliveryType == 2 ? 'bg--w111-fff font-num fs-28 fw-500' : 'bg-primary-light',styleType]"
								v-if="isDisplay.includes('2')"
								@tap="addressType(1,2)"
								>门店自提</view>
							<view class="flex-center w-50p h-76 rd-rt-24rpx z-2"
								:class="deliveryType == 3 ? 'bg--w111-fff font-num fs-28 fw-500' : 'bg-primary-light bg-horn-r'"
								v-if="isDisplay.includes('3')"
								@tap="addressType(0,3)"
								>门店配送</view>
						</view>
						<!-- 选中放大样式 2项的-->
						<view v-if="isDisplay.length==2" class="w-50p rd-t-24rpx bg--w111-fff h-96"
							:class="(deliveryType == 1 || (deliveryType == 2 && !isDisplay.includes('1'))) ? 'abs-lt' : 'abs-rt'">
							<view class="w-full h-full relative active-card"></view>
						</view>
						<!-- 选中放大样式 3项的-->
						<view v-if="isDisplay.length==3" class="w-33-33p rd-t-24rpx bg--w111-fff h-96"
							:class="deliveryType == 1 ? 'abs-lt' : deliveryType == 2?'abs-ct':'abs-rt'">
							<view class="w-full h-full relative active-card"></view>
						</view>
					</view>
					<view v-else class="bg--w111-fff rd-t-24rpx text--w111-999 fs-24">
						<view v-if="Array.isArray(isDisplay) && isDisplay.includes('1')" class="acea-row row-middle h-88 lh-88rpx ml-34 mr-34 border-b b--w111-f5f5f5 border-b-s">
							<text class="iconfont icon-icon_truck font-num fs-36 mr-12"></text>
							<text class="font-num fs-28 mr-12">商城配送</text>
							线上下单，商城为您配送
						</view>
						<view v-else-if="Array.isArray(isDisplay) && isDisplay.includes('2')" class="acea-row row-middle h-88 lh-88rpx ml-34 mr-34 border-b b--w111-f5f5f5 border-b-s">
							<text class="iconfont icon-a-icon_trailcar font-num fs-36 mr-12"></text>
							<text class="font-num fs-28 mr-12">门店自提</text>
							线上下单，到店自提
						</view>
						<view v-else class="acea-row row-middle h-88 lh-88rpx ml-34 mr-34 border-b b--w111-f5f5f5 border-b-s">
							<text class="iconfont icon-icon_truck font-num fs-36 mr-12"></text>
							<text class="font-num fs-28 mr-12">门店配送</text>
							线上下单，门店为您配送
						</view>
					</view>
					<view class='address add1 flex-between-center'
						:class="[1,2].includes(isDisplay) ? 'rd-24rpx' : 'rd-b-24rpx'"
						@tap='onAddress(addressInfo.real_name)' v-if='deliveryType == 1'>
						<view v-if="addressInfo.real_name">
							<view class="fs-30 text--w111-333 fw-500 acea-row row-middle">
								<text>{{addressInfo.real_name}}</text> <text class='pl-20'>{{addressInfo.phone}}</text>
								<text class='default font-num acea-row row-center-wrapper ml-8' v-if="addressInfo.is_default">默认</text>
							</view>
							<view class="fs-24 text--w111-666 mt-12">{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.street}}{{addressInfo.detail}}</view>
						</view>
						<view class='fs-30 text--w111-333 fw-500 lh-42rpx flex-y-center' v-else>
							<view class="iconfont icon-ic_location2 fs-32 text-w111-000"></view>
							<text class="pl-8">设置收货地址</text>
						</view>
						<text class="iconfont icon-ic_rightarrow fs-32 text--w111-666 ml-20"></text>
					</view>
					<view class='address add1 acea-row row-between-wrapper'
						:class="[1,2].includes(isDisplay) ? 'rd-24rpx' : 'rd-b-24rpx'" v-else>
						<block v-if="storeList.length>0">
							<view class="w-full">
								<view class="w-full flex-between-center">
									<view @click="goStore">
										<view class="fs-30 line1 fw-500 lh-42rpx acea-row row-middle">
											<text class="line1 max-w-368">{{system_store.name}}</text>
											<text class="iconfont icon-ic_rightarrow ml-12" v-if="!collage_id && !isStore"></text>
										</view>
										<view class="fs-24 w-410 line2 text--w111-666 lh-30rpx mt-12">{{system_store.address}}{{system_store.detailed_address}}</view>
									</view>
									<view class="_map relative"
										:style="{backgroundImage:'url('+imgHost+'/statics/images/order/order_map_bg.png'+')'}"
										@tap="showMaoLocation(system_store)">
										<view class="store_distance flex-center bg--w111-fff rd-8rpx fs-20 fw-500 line1">距您{{range}}km</view>
										<view class="store-horn"></view>
										<view class="store_logo bg--w111-fff rd-8rpx">
											<image class="w-full h-full rd-8rpx relative z-2" :src="site_logo"></image>
										</view>
										<view class="store-spot"></view>
									</view>
								</view>
							</view>
						</block>
						<block v-else>
							<view>暂无门店信息</view>
						</block>
					</view>
					<view class='line'>
						<image src='/static/images/line.jpg'></image>
					</view>
				</view>
			</view>
		</view>
		<view class="address flex-1 ml-20 mr-20 rd-16rpx mt-20 p-32 border-top" v-if="deliveryType == 2 && !tableId">
			<view class="flex">
				<view class="flex-1">
					<view class="fs-24 text--w111-999 lh-34rpx">我的姓名</view>
					<view class="flex-y-center mt-6">
						<input type="text" v-model="contacts" :focus="contactsFocus" class="w-78 h-36 fs-26 fw-500 lh-36rpx" />
						<text class="iconfont icon-ic_edit fs-28 text--w111-999 pl-16" @tap="clearInput(0)"></text>
					</view>
				</view>
				<view class="pl-46 flex-1">
					<view class="fs-24 text--w111-999 lh-34rpx">我的电话</view>
					<view class="flex-y-center mt-6">
						<input type="number" v-model="contactsTel" :focus="telFocus" class="w-222 h-36 fs-30 fw-500 lh-30rpx SemiBold" />
						<text class="iconfont icon-ic_edit fs-28 text--w111-999 pl-16" @tap="clearInput(1)"></text>
					</view>
				</view>
			</view>
		</view>
		<view class='address add1 flex-between-center ml-20 mr-20 rd-16rpx mt-20'
			@tap='onAddress(addressInfo.real_name)' v-if='deliveryType == 3 && !tableId'>
			<view v-if="addressInfo.real_name">
				<view class="fs-30 text--w111-333 fw-500 acea-row row-middle">
					<text>{{addressInfo.real_name}}</text> <text class='pl-20'>{{addressInfo.phone}}</text>
					<text class='default font-num acea-row row-center-wrapper ml-8' v-if="addressInfo.is_default">默认</text>
				</view>
				<view class="fs-24 text--w111-666 mt-12">{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.street}}{{addressInfo.detail}}</view>
			</view>
			<view class='fs-30 text--w111-333 fw-500 lh-42rpx flex-y-center' v-else>
				<view class="iconfont icon-ic_location2 fs-32 text-w111-000"></view>
				<text class="pl-8">设置收货地址</text>
			</view>
			<text class="iconfont icon-ic_rightarrow fs-32 text--w111-666 ml-20"></text>
		</view>
		<view class='order-submission'>
			<view class="px-20 mt-20">
				<groupGoodsList :goodsList="goodsList" v-if="collage_id"></groupGoodsList>
				<view class="bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32" v-else>
					<view class="flex order_goods" v-for="(item,index) in cartInfo" :key="index">
						<view class="w-176 h-176 relative">
							<image class="w-176 h-176 rd-16rpx" :src='item.productInfo.attrInfo.image' v-if="item.productInfo.attrInfo"></image>
							<image class="w-176 h-176 rd-16rpx" :src='item.productInfo.image' v-else></image>
							<view class="over flex-center fs-24 text--w111-fff" v-if="!item.is_valid">{{shippingType == 1 ? '非自提' : '不送达'}}</view>
						</view>
						<view class="flex-1 flex-col justify-between pl-20">
							<view @click="goDetail(item.product_id)">
								<view class="w-464 line1 fs-28 lh-40rpx"
								:class="item.is_valid ? 'text--w111-333' : 'text--w111-ccc'"
								>{{item.productInfo.store_name}}</view>
								<view class='w-322 fs-22 lh-30rpx line1 mt-12'
								:class="item.is_valid ? 'text--w111-999' : 'text--w111-ccc'"
								 v-if="item.productInfo.attrInfo">{{item.productInfo.attrInfo.suk}}</view>
								<view class="flex items-end flex-wrap mt-12 w-full">
									<BaseTag
										:text="label.label_name"
										:color="label.color"
										:background="label.bg_color"
										:borderColor="label.border_color"
										:circle="label.border_color ? true : false"
										:imgSrc="label.icon"
										v-for="(label, idx) in item.productInfo.store_label" :key="idx"></BaseTag>
								</view>
							</view>
							<view class="flex-between-center">
								<baseMoney :money="item.productInfo.attrInfo ? item.productInfo.attrInfo.price : item.productInfo.price" symbolSize="20" integerSize="36" decimalSize="20" :color="item.is_valid ? '#333' : '#cccccc' " weight></baseMoney>
								<view class="flex-y-center" v-if="[0,6].includes(goodsType) && item.is_valid">
									<text class="iconfont icon-ic_Reduce fs-24" :class="item.cart_num > 1 ? 'text--w111-333' : 'text--w111-999'" @click.stop="addCart(0,item)"></text>
									<input type="number" maxlength="3" class="w-72 h-36 rd-4rpx bg--w111-f5f5f5 flex-center text-center fs-24 text--w111-333 mx-6" @input="setValue($event,item)" v-model="item.cart_num" />
									<text class="iconfont icon-ic_increase fs-24 text--w111-333" @click.stop="addCart(1,item)"></text>
								</view>
								<view v-if="![0,6].includes(goodsType)">
									<text class="fs-28 text--w111-666">️x{{item.cart_num}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="cell flex justify-between mt-32" v-if="giftCount > 0">
						<text class="text--w111-333 fs-28">赠品</text>
						<view class="w-460 flex-y-center justify-end" @tap="showGiftDrawer = true">
							<view class="flex flex-1" style="min-width: 0;overflow: hidden;">
								<view class="w-64 h-64 mr-8" style="flex-shrink: 0;" v-for="(item, index) in giveCartInfo" :key="index">
									<image class="h-full w-full rd-8rpx" :src="item.productInfo.attrInfo.image" v-if="item.productInfo.attrInfo"></image>
									<image class="h-full w-full rd-8rpx" :src="item.productInfo.image" v-else></image>
								</view>
								<view class="w-64 h-64 rd-8rpx bg--w111-f5f5f5 flex-center mr-8" v-if="giveData.give_coupon.length">
									<text class="gold iconfont icon-a-ic_discount1"></text>
								</view>
								<view class="w-64 h-64 rd-8rpx bg--w111-f5f5f5 flex-center mr-8" v-if="giveData.give_integral>0">
									<text class="gold iconfont icon-ic_badge11"></text>
								</view>
							</view>
							<view class="fs-26 text--w111-666">共{{giftCount}}件 <text class="iconfont icon-ic_rightarrow"></text> </view>
						</view>
					</view>
					<view class="cell flex justify-between flex-y-center mt-32" v-if="textareaStatus">
						<text class="text--w111-333 fs-28">留言</text>
						<textarea class="w-450 fs-28 text-right h-auto" :auto-height="true" wrap-style="wrap" max-height="100px" placeholder-class='placeholder' placeholder="请先与商家沟通一致再留言哦～" :always-embed="true" :adjust-position="true" cursor-spacing="30" v-if="!coupon.coupon"
							 @input='bindHideKeyboard' :value="mark" :maxlength="150" name="mark">
						</textarea>
					</view>
				</view>
				<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
					<view class="cell flex-between-center"
						v-if="[0, 6, 10].includes(type) && !noCoupon && goodsType != 7 && priceGroup.firstOrderPrice==0"
						@tap='couponTap'>
						<text class="text--w111-333 fs-28">优惠券</text>
						<view>
							<text class="text--w111-333 fs-28">{{couponTitle}}</text>
							<text class="iconfont icon-ic_rightarrow fs-24 text--w111-999 pl-8"></text>
						</view>
					</view>
					<view class="cell flex-between-center"
						v-if="[0, 6, 10].includes(type) && integral_ratio_status == 1">
						<text class="text--w111-333 fs-28">积分抵扣</text>
						<view class="flex-y-center">
							<view> {{useIntegral ? "剩余积分":"当前积分"}}
								<text class='Regular font-num fs-36 pl-8 pr-12'>{{integral || 0}}</text>
							</view>
							<checkbox-group @change="ChangeIntegral">
								<checkbox :disabled="integral<=0 && !useIntegral" :checked='useIntegral ? true : false' />
							</checkbox-group>
						</view>
					</view>
					<view class="cell flex-between-center"
						v-if="(invoice_func || special_invoice) && !tableId" @tap='goInvoice'>
						<text class="text--w111-333 fs-28">开具发票</text>
						<view>
							<text class="text--w111-333 fs-28">{{invTitle}}</text>
							<text class="iconfont icon-ic_rightarrow fs-24 text--w111-999 pl-8"></text>
						</view>
					</view>
				</view>
				<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32" v-if="type == 4">
					<view class="cell flex-between-center">
						<text class="text--w111-333 fs-28">可用积分</text>
						<text>{{userInfo.integral}}</text>
					</view>
					<view class="cell flex-between-center">
						<text class="text--w111-333 fs-28">抵扣积分</text>
						<text>{{totalIntegral}}</text>
					</view>
				</view>
				<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32" v-if="confirm.length">
					<view class="cell flex justify-between" v-for="(item,index) in confirm" :key="index">
						<text class="relative text--w111-333 fs-28" :class="item.titleShow.val ? 'pl-16' : ''">
							<text class="asterisk" v-if="item.titleShow.val">*</text>
							{{ item.titleConfig.value }}
						</text>
						<!-- radio -->
						<view v-if="item.name=='radios'" class="discount">
							<radio-group @change="radioChange(e, index, item)" class="acea-row row-middle row-right">
							  <label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
								<view class="acea-row row-middle">
								  <!-- #ifndef MP -->
								  <radio :value="jindex.toString()" :checked='j.show'/>
								  <!-- #endif -->
								  <!-- #ifdef MP -->
								  <radio :value="jindex" :checked='j.show'/>
								  <!-- #endif -->
								  <view>{{j.val}}</view>
								</view>
							  </label>
							</radio-group>
						</view>
						<!-- checkbox -->
						<view v-if="item.name=='checkboxs'" class="discount">
							<checkbox-group @change="checkboxChange($event, index, item)" class="acea-row row-middle row-right">
							  <label class="radio" v-for="(j,jindex) in item.wordsConfig.list" :key="jindex">
								<view class="acea-row row-middle">
								  <!-- #ifndef MP -->
								  <checkbox :value="jindex.toString()" :checked="j.show" style="transform:scale(0.9)" />
								  <!-- #endif -->
								  <!-- #ifdef MP -->
								  <checkbox :value="jindex" :checked="j.show" style="transform:scale(0.9)" />
								  <!-- #endif -->
								  <view>{{j.val}}</view>
								</view>
							  </label>
							</checkbox-group>
						</view>
						<!-- text -->
						<view v-if="item.name=='texts' && item.valConfig.tabVal == 0" class="discount">
						  <input type="text" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
						</view>
						<!-- number -->
						<view v-if="item.name=='texts' && item.valConfig.tabVal == 4" class="discount">
						  <input type="number" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
						</view>
						<!-- email -->
						<view v-if="item.name=='texts' && item.valConfig.tabVal == 3" class="discount">
						  <input type="text" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
						</view>
						<!-- data -->
						<view v-if="item.name=='dates'" class="discount">
						  <picker mode="date" :value="item.value" @change="bindDateChange($event,index)">
						    <view class="acea-row row-between-wrapper">
						      <view v-if="item.value == ''">{{item.tipConfig.value}}</view>
						      <view v-else>{{item.value}}</view>
						      <text class='iconfont icon-jiantou'></text>
						    </view>
						  </picker>
						</view>
						<!-- dateranges -->
						<view v-if="item.name=='dateranges'" class="discount">
							<uni-datetime-picker v-model="item.value" type="daterange" @maskClick="maskClick">
							{{item.value.length?item.value[0]+' - '+item.value[1]:item.tipConfig.value}}
							<text class='iconfont icon-jiantou'></text>
							</uni-datetime-picker>
						</view>
						<!-- time -->
						<view v-if="item.name=='times'" class="discount">
						  <picker mode="time" :value="item.value" @change="bindTimeChange($event,index)"
						    :placeholder="item.tipConfig.value">
						    <view class="acea-row row-between-wrapper">
						      <view v-if="item.value == ''">{{item.tipConfig.value}}</view>
						      <view v-else>{{item.value}}</view>
						      <text class='iconfont icon-jiantou'></text>
						    </view>
						  </picker>
						</view>
						<!-- timeranges -->
						<view v-if="item.name=='timeranges'" class="discount acea-row row-between-wrapper" @click="getTimeranges(index)">
							<view v-if="item.value">{{item.value}}</view>
							<view v-else>{{item.tipConfig.value}}</view>
							<text class='iconfont icon-jiantou'></text>
						</view>
						<!-- select -->
						<view v-if="item.name=='selects'" class="discount">
							<picker :value="item.value" :range="item.wordsConfig.list" @change="bindSelectChange($event,index,item)" range-key="val">
							 <view class="acea-row row-between-wrapper">
							    <view v-if="item.value == ''">请选择</view>
							    <view v-else>{{item.value}}</view>
							    <text class='iconfont icon-jiantou'></text>
							  </view>
							</picker>
						</view>
						<!-- city -->
						<view v-if="item.name=='citys'" class="discount" @click="changeRegion(index)">
							<view class="acea-row row-middle row-right">
								<view class="city" v-if="item.value == ''">{{item.tipConfig.value}}</view>
								<view class="city" v-else>{{item.value}}</view>
								<text class='iconfont icon-jiantou'></text>
							</view>
						</view>
						<!-- id -->
						<view v-if="item.name=='texts' && item.valConfig.tabVal == 2" class="discount">
						  <input type="idcard" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
						</view>
						<!-- phone -->
						<view v-if="item.name=='texts' && item.valConfig.tabVal == 1" class="discount">
						  <input type="number" :placeholder="item.tipConfig.value" placeholder-class="placeholder" v-model="item.value" />
						</view>
						<!-- img -->
						<view v-if="item.name=='uploadPicture'" class="flex-1">
							<view class="flex justify-end" v-if="item.value.length < 3">
								<view class="relative" v-for="(items,indexs) in item.value" :key="indexs">
									<image class="w-128 h-128 rd-12rpx ml-16" :src="items"></image>
									<view class="abs-rt w-32 h-32 bg--w111-bbb clear-btn flex-center fs-24 text--w111-fff" @click="DelPic(index,indexs)">
										<text class="iconfont icon-ic_close"></text>
									</view>
								</view>
								 <view class="w-128 h-128 rd-12rpx bg--w111-f5f5f5 flex-col flex-center ml-16"
									v-if="item.value.length < item.numConfig.val" @tap="uploadpic(index)">
									 <text class='iconfont icon-ic_camera fs-40'></text>
									 <view class="fs-20 text--w111-333">上传图片</view>
								 </view>
							</view>
							<view class="flex justify-end" v-else>
								<scroll-view scroll-x="true" scroll-with-animation
									class="white-nowrap vertical-middle w-508" show-scrollbar="false">
									<view class="w-full h-full flex">
										<view class="inline-block h-128 mr-12">
											<view class="w-128 h-128 rd-12rpx bg--w111-f5f5f5 ml-16 flex-col flex-center"
												v-if="item.value.length < item.numConfig.val" @tap="uploadpic(index)">
												 <text class='iconfont icon-ic_camera fs-40'></text>
												 <view class="fs-20 text--w111-333">上传图片</view>
											</view>
										</view>
										<view class="inline-block mr-12 relative" v-for="(items,indexs) in item.value" :key="index">
											<image class="w-128 h-128 rd-12rpx" :src="items"></image>
											<view class="abs-rt w-32 h-32 bg--w111-bbb rd-rt-12rpx flex-center fs-24 text--w111-fff" @click="DelPic(index,indexs)">
												<text class="iconfont icon-ic_close"></text>
											</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
				<view class="mt-20 bg--w111-fff rd-16rpx pt-32 pr-24 pl-24 pb-32">
					<view class="cell flex-between-center">
						<text class="text--w111-333 fs-28">商品总价</text>
						<text class="text--w111-333 fs-36 Regular">￥{{priceGroup.sumPrice}}</text>
					</view>
					<view class="cell flex-between-center" v-if="priceGroup.firstOrderPrice>0">
						<text class="text--w111-333 fs-28">新人首单优惠</text>
						<text class="text--w111-333 fs-36 Regular font-num"> -￥{{priceGroup.firstOrderPrice}}</text>
					</view>
					<view class="cell flex-between-center" v-if="priceGroup.storePostage > 0">
						<text class="text--w111-333 fs-28">配送运费</text>
						<text class="text--w111-333 fs-36 Regular font-num">￥{{(parseFloat(priceGroup.storePostage)+parseFloat(priceGroup.storePostageDiscount)).toFixed(2)}}</text>
					</view>
					<view class="cell flex-between-center"
						v-if="priceGroup.vipPrice > 0 && userInfo.vip && [0, 6, 9].includes(type)">
						<text class="text--w111-333 fs-28">用户等级优惠</text>
						<text class="text--w111-333 fs-36 Regular font-num">-￥{{parseFloat(priceGroup.vipPrice).toFixed(2)}}</text>
					</view>
					<view class="cell flex-between-center" v-if="priceGroup.storePostageDiscount > 0">
						<text class="text--w111-333 fs-28">会员运费优惠</text>
						<text class="text--w111-333 fs-36 Regular font-num">-￥{{parseFloat(priceGroup.storePostageDiscount).toFixed(2)}}</text>
					</view>
					<view class="cell flex-between-center" v-if="coupon_price > 0">
						<text class="text--w111-333 fs-28">优惠券抵扣</text>
						<text class="text--w111-333 fs-36 Regular font-num">-￥{{parseFloat(coupon_price).toFixed(2)}}</text>
					</view>
					<view class="cell flex-between-center" v-if="integral_price > 0">
						<text class="text--w111-333 fs-28">积分抵扣</text>
						<text class="text--w111-333 fs-36 Regular font-num">-￥{{parseFloat(integral_price).toFixed(2)}}</text>
					</view>
					<view class="cell flex-between-center" v-for="(item,index) in promotions_detail" :key="index" v-show="parseFloat(item.promotions_price)">
						<text class="text--w111-333 fs-28">{{item.title}}</text>
						<text class="text--w111-333 fs-36 Regular font-num">-￥{{parseFloat(item.promotions_price).toFixed(2)}}</text>
					</view>
				</view>
			</view>
			<view class="height-add"></view>
			<view class='fixed-lb w-full bg--w111-fff pb-safe'>
				<view class="h-80 bg--w111-FFF0D1 flex-between-center px-20" v-if="!svip_status && svip_price > 0">
					<view class="flex-y-center">
						<image src="@/static/img/vip_leval.png" class="w-36 h-36"></image>
						<view class="pl-8">
							<text class="fs-24 text--w111-7E4B06">开通 SVIP会员 预计省</text>
							<text class="font-color fs-28">¥{{svip_price}}</text>
							<text class="fs-24 text--w111-7E4B06">元</text>
						</view>
					</view>
					<view class="fs-24 text--w111-7E4B06" @click="goPage(1,'/pages/annex/vip_paid/index')">
						<text>立即开通</text>
						<text class="iconfont icon-ic_rightarrow fs-24"></text>
					</view>
				</view>
				<view class="pl-32 pr-20 h-96 flex-between-center">
					<view class="flex items-baseline">
						<text class="fs-24 fw-500 text--w111-333">合计</text>
						<baseMoney :money="totalPrice || 0" symbolSize="26" integerSize="44" decimalSize="26" weight></baseMoney>
						<text class="pl-12" v-if="type == 4 && totalIntegral > 0">+{{totalIntegral}}积分</text>
					</view>
					<view class="w-168 h-72 rd-36rpx flex-center text--w111-fff fs-26 bg-gradient z-10"
					@tap.stop="goPay" v-if="(((valid_count>0&&!discount_id) || (valid_count==cartInfo.length&&discount_id)) && shippingType) || (!shippingType && addressId) || product_type != 0">提交订单</view>
					<view class="w-168 h-72 rd-36rpx flex-center text--w111-fff fs-26 bg-color-hui" v-else>提交订单</view>
				</view>
			</view>
		</view>
		<view class="alipaysubmit" v-html="formContent"></view>
		<tuiModal
			:show="isAddress"
			title="更新地址"
			content="当前地址功能已更新，请重新修改"
			@click="handleClick"
			@cancel="hideModal"></tuiModal>
		<!-- 赠品抽屉 -->
		<giftDrawer :visible="showGiftDrawer" :giveCartInfo="giveCartInfo" :giveData="giveData" @closeDrawer="closeDrawer"></giftDrawer>
		<couponListWindow
		:coupon='coupon'
		@ChangCouponsClone="ChangCouponsClone"
		:openType='openType'
		:cartId='cartId'
		@ChangCoupons="ChangCoupons"
		@ruleToggle="ruleToggle"></couponListWindow>
		<addressWindow ref="addressWindow" @changeTextareaStatus="changeTextareaStatus" :news='news' :address='address'
			:pagesUrl="pagesUrl" @OnChangeAddress="OnChangeAddress" @changeClose="changeClose"></addressWindow>
		<invoice-picker :inv-show="invShow" :inv-list="invList" :inv-checked="invChecked" :is-special="special_invoice"
			:url-query="urlQuery" @inv-close="invClose" @inv-change="invChange" @inv-cancel="invCancel">
		</invoice-picker>
		<timeranges :isShow='isShow' :time='timeranges' @confrim="confrim" @cancel="cancels"></timeranges>
		<areaWindow ref="areaWindow" :display="display" :address='addressInfoArea' :cityShow='cityShow' @submit="OnAreaAddress" @changeClose="changeAddressClose"></areaWindow>
	</view>
</template>
<script>
	const CACHE_CITY = {};
	let sysHeight = uni.getSystemInfoSync().statusBarHeight;
	import dayjs from '@/plugin/dayjs/dayjs.min.js';
	import {
		orderConfirm,
		getCouponsOrderPrice,
		orderCreate,
		postOrderComputed,
		checkShipping
	} from '@/api/order.js';
	import {
		getAddressDefault,
		getAddressDetail,
		invoiceList,
		invoiceOrder
	} from '@/api/user.js';
	import { openPaySubscribe } from '@/utils/SubscribeMessage.js';
	import {
		storeListApi,
		postCartAdd,
		getCodeData,
		getCollagePartake,
	} from '@/api/store.js';
	import {
		CACHE_LONGITUDE,
		CACHE_LATITUDE
	} from '@/config/cache.js';
	import couponListWindow from '@/components/couponListWindow';
	import addressWindow from '@/components/addressWindow';
	import invoicePicker from '../components/invoicePicker';
	import timeranges from '@/components/timeranges';
	import areaWindow from '@/components/areaWindow';
	import giftDrawer from '../components/giftDrawer/index.vue'
	import tuiModal from "@/components/tui-modal/index.vue"
	import groupGoodsList from "../components/groupGoodsList/index.vue"
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from "vuex";
	import colors from "@/mixins/color";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import { Debounce } from '@/utils/validate.js'
	export default {
		components: {
			invoicePicker,
			couponListWindow,
			addressWindow,
			timeranges,
			areaWindow,
			giftDrawer,
			tuiModal,
			groupGoodsList
		},
		mixins: [colors],
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				sysHeight:sysHeight,
				addressInfoArea: [],
				cityShow: 2,
				display: false,
				timeranges:[],
				isShow:false,
				giveData:{
					give_integral:0,
					give_coupon:[]
				},
				giveCartInfo: [],
				confirm: [], //自定义留言
				id: 0,
				isAddress: false,
				textareaStatus: true,
				formContent: '',
				payType: 'weixin', //支付方式
				openType: 1, //优惠券打开方式 1=使用
				active: 0, //支付方式切换
				coupon: {
					coupon: false,
					list: [],
					statusTile: '立即使用'
				}, //优惠券组件
				address: {
					address: false
				}, //地址组件
				addressInfo: {}, //地址信息
				pinkId: 0, //拼团id
				addressId: 0, //地址id
				couponId: 0, //优惠券id
				cartId: '', //购物车id
				type: 0,//活动类型
				activityId: 0,//活动ID
				BargainId: 0,
				combinationId: 0,
				seckillId: 0,
				discountId: 0,
				userInfo: {}, //用户信息
				mark: '', //备注信息
				couponTitle: '请选择', //优惠券
				coupon_price: 0, //优惠券抵扣金额
				promotions_detail:[], //优惠活动金额明细
				useIntegral: false, //是否使用积分
				integral_price: 0, //积分抵扣金额
				integral: 0,
				ChangePrice: 0, //使用积分抵扣变动后的金额
				formIds: [], //收集formid
				status: 0,
				is_address: false,
				shippingType: 0,
				system_store: {},
				storePostage: 0,
				contacts: '',
				contactsTel: '',
				mydata: {},
				storeList: [],
				store_self_mention: 0,
				cartInfo: [],
				priceGroup: {},
				animated: false,
				totalPrice: 0,
				totalIntegral:0,
				integralRatio: "0",
				pagesUrl: "",
				orderKey: "",
				// usableCoupon: {},
				offlinePostage: "",
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				from: '',
				news: 1,
				invTitle: '不开发票',
				special_invoice: false,
				invoice_func: false,
				integral_ratio_status : 1,
				header_type: '',
				invShow: false,
				invList: [],
				invChecked: '',
				urlQuery: '',
				pay_close: false,
				noCoupon: 0,
				valid_count: 0,
				discount_id: 0,
				storeId: 0,
				product_type:1,
				newImg: [],
				isDisplay: 0,
				goodsType:0,
				timerangesIndex:0,
				isFocus:false,
				latitude:'',
				longitude:'',
				site_logo:'',
				range:'',
				showGiftDrawer:false,
				svip_status: false,
				svip_price: 0,
				contactsFocus: false,
				telFocus: false,
				
				deliveryType:1,
				product_id:0,
				collage_id:0,
				tableId:0,
				codeData:{},
				goodsList:[],
				isStore: 0
			};
		},
		computed: {
			...mapGetters(['isLogin']),
			giftCount(){
				let count = 0;
				if(this.giveCartInfo.length){
					count = this.giveCartInfo.length
				}
				if(this.giveData.give_coupon.length){
					count = count + this.giveData.give_coupon.length
				}
				if(this.giveData.give_integral > 0){
					count = count + 1
				}
				return count
			},
			styleType(){
				let obj = this.isDisplay.includes('2') && this.isDisplay.length == 2 && this.deliveryType != 2?(this.isDisplay.includes('1')?'bg-horn-r':'bg-horn'):'';
				return obj
			}
		},
		onLoad: function(options) {
			// this.getLocation();
			// #ifdef H5
			this.from = this.$wechat.isWeixin() ? 'weixin' : 'weixinh5'
			// #endif
			// #ifdef MP
			this.from = 'routine'
			// 桌码
			this.tableId = options.tableId || 0;
			if (this.tableId) {
				this.getCodeData();
			}
			// #endif
			if (!options.cartId) return this.$util.Tips({
				title: '请选择要购买的商品'
			}, {
				tab: 3,
				url: 1
			});
			this.deliveryType = options.delivery_type || 1;
			this.isStore = options.is_store ? parseInt(options.is_store) : 0;
			this.storeId = parseInt(options.store_id) || 0;
			if(this.deliveryType == 1 || this.deliveryType == 3){
				this.addressId = options.addressId || 0;
				this.system_store.name = options.store_name;
			}
			if(this.deliveryType == 2 || this.deliveryType == 3){
				this.storeId = parseInt(options.store_id) || 0;
				this.system_store.id = parseInt(options.store_id) || 0;
			}
			this.couponId = options.couponId || 0;
			this.noCoupon = parseInt(options.noCoupon) || 0;
			this.product_id = options.product_id || 0;
			this.pinkId = options.pinkId ? parseInt(options.pinkId) : 0;
			this.addressId = options.addressId || 0;
			this.cartId = options.cartId;
			this.is_address = options.is_address ? true : false;
			this.news = !options.new || options.new === '0' ? 0 : 1;
			this.invChecked = options.invoice_id || '';
			this.header_type = options.header_type || '1';
			this.couponTitle = options.couponTitle || '请选择'
			this.luckRecordId = options.luckRecordId || ''
			switch (options.invoice_type) {
				case '1':
					this.invTitle = '增值税电子普通发票';
					break;
				case '2':
					this.invTitle = '增值税电子专用发票';
					break;
			}
			if(options.invoice_name){
				this.invTitle = options.invoice_name;
			}
			// #ifndef APP-PLUS
			this.textareaStatus = true;
			// #endif
			if (this.isLogin) {
				this.getCheckShipping();
			} else {
				toLogin();
			}
			// #ifdef H5 || MP
			// 拼单
			this.collage_id = options.collage_id || 0;
			if (this.collage_id) {
				this.getCollagePartake();
			}
			// #endif
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let _this = this
			uni.$on("activeFn", res => {
				if (res) {
					_this.system_store = res
					_this.storeId = _this.system_store.id
					_this.range = _this.system_store.range
					_this.site_logo = _this.system_store.image
					// _this.cartId = res.cartId
					// _this.news = res.new
					// _this.pinkId = Number(res.pinkId)
					// _this.couponId = res.couponId
					_this.getConfirm()
				}
				// 清除监听
				uni.$off('activeFn');
			})
			let current = (dayjs(new Date(Number(new Date().getTime()))).format('HH:mm')).split(':');
			let currentArray = current;
			currentArray.push(0);
			let arrayNew = [];
			[...currentArray,...current].forEach(item=>{
					 arrayNew.push(Number(item))
			})
			this.timeranges = arrayNew;
		},
		methods: {
			goStore(){
				if (!this.collage_id && !this.isStore) {
					uni.navigateTo({
						url:'/pages/store/list/index?type=1&isCollage=1&storeId='+this.system_store.id
					})
				}
			},
			// 是否显示快递配送
			getCheckShipping(){
				let data = {
					cartId: this.cartId,
					new: this.news
				}
				checkShipping(data).then(res=>{
					 // 1：快递配送，2：到店自提，3：门店配送
					 res.data.type.sort((x,y)=>x - y)//正序
					 let isDisplay = res.data.type;
					 if(this.luckRecordId>0){
						 this.deliveryType = isDisplay[0];
					 }
					 if (this.collage_id) {
					 	isDisplay = [this.deliveryType];
					 }
					 this.isDisplay = isDisplay;
					 if (!this.isDisplay.includes(this.deliveryType)) {
						 this.deliveryType = this.isDisplay[0] || '1';
					 }
					 if (this.deliveryType == '2') {
						this.shippingType = 1;
					 } else{
						 this.shippingType = 0;
					 }
					 if(isDisplay.indexOf('2') != -1 || isDisplay.indexOf('3') != -1){
						 this.getConfirm('',1);
					 }
					 if(isDisplay.indexOf('1') !=-1 || isDisplay.indexOf('3') !=-1){
						 this.getaddressInfo();
						 if(isDisplay.indexOf('1') !=-1 && isDisplay.length == 1){
							 this.getConfirm();
						 }
						 this.$nextTick(function() {
							 this.$refs.addressWindow.getAddressList();
						 })
					 }
				}).catch(err=>{
					uni.showToast({
						title: err,
						icon: 'none'
					});
				})
			},
			OnAreaAddress(address){
			  let addr = '';
			  if (address.length==4){
				  addr = address[0].label+'/'+address[1].label+'/'+address[2].label+'/'+address[3].label;
			  }else if (address.length==3){
				 addr = address[0].label+'/'+address[1].label+'/'+address[2].label;
			  }else if(address.length==2){
				 addr = address[0].label+'/'+address[1].label;
			  }else{
				 addr = address[0].label;
			  }
			  this.confirm[this.timerangesIndex].value = addr;
			  CACHE_CITY[this.timerangesIndex] = address;
			},
			changeRegion(index){
			   if(!this.confirm[index].value){
				 this.addressInfoArea = [];
			   }
			   this.timerangesIndex = index;
			   this.cityShow = Number(this.confirm[index].valConfig.tabVal) + 1;
			   this.display = true;
			   if(CACHE_CITY[index]){
				 this.addressInfoArea = CACHE_CITY[index];
			   }
			},
			// 关闭地址弹窗；
			changeAddressClose: function() {
			   this.display = false;
			},
			maskClick(e) {
				console.log(e);
			},
			// 授权关闭
			authColse: function(e) {
			  this.isShowAuth = e
			},
			/**
			 * 删除图片
			 *
			 */
			DelPic: function(index, indexs) {
				let that = this,
					pic = this.confirm[index].value;
				that.confirm[index].value.splice(indexs, 1);
				that.$set(that.confirm[index], 'value', that.confirm[index].value);
			},

			/**
			 * 上传文件
			 *
			 */
			uploadpic: function(index) {
				let that = this;
				this.$util.uploadImageOne('upload/image', function(res) {
					that.newImg.push(res.data.url);
					that.$set(that.confirm[index], 'value', that.newImg);
				});
			},
			// 不开发票
			invCancel() {
				this.invChecked = '';
				this.invTitle = '不开发票';
				this.invShow = false;
			},
			// 选择发票
			invChange(id) {
				this.invChecked = id;
				this.invShow = false;
				const result = this.invList.find(item => item.id === id);
				let name = '';
				name += result.header_type === 1 ? '个人' : '企业';
				name += result.type === 1 ? '普通' : '专用';
				name += '发票';
				this.invTitle = name;
			},
			// 关闭发票
			invClose() {
				this.invShow = false;
				this.getInvoiceList()
			},
			getInvoiceList() {
				uni.showLoading({
					title: '正在加载…'
				})
				invoiceList().then(res => {
					uni.hideLoading();
					this.invList = res.data.map(item => {
						item.id = item.id.toString();
						return item;
					});
					const result = this.invList.find(item => item.id == this.invChecked);
					if (result) {
						let name = '';
						name += result.header_type === 1 ? '个人' : '企业';
						name += result.type === 1 ? '普通' : '专用';
						name += '发票';
						this.invTitle = name;
					}
				}).catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
				});
			},
			/**
			 * 开发票
			 */
			goInvoice: function() {
				this.getInvoiceList()
				this.invShow = true;
				this.urlQuery =
					`new=${this.news}&cartId=${this.cartId}&pinkId=${this.pinkId}&couponId=${this.couponId}&addressId=${this.addressId}&specialInvoice=${this.special_invoice}&couponTitle=${this.couponTitle}`;
			},
			goPay() {
				this.formVerify();
			},
			/**
			 * 获取门店列表数据
			 */
			getList: function() {
				let longitude = uni.getStorageSync("user_longitude"); //经度
				let latitude = uni.getStorageSync("user_latitude"); //纬度
				let data = {
					page: 1,
					limit: 100,
					latitude:latitude,
					longitude:longitude,
					is_store: this.deliveryType, //判断是否为到店自提
					product_id:this.product_id,  //判断商品是否适用这个门店
					type: this.seckillId>0?1:0, //商品类型：1是秒杀（有自己单独的适用门店）0是普通
				}
				storeListApi(data).then(res => {
					let list = res.data.list.list || [];
					this.$set(this, 'storeList', list);
					this.$set(this, 'storeId', this.storeId !=0?this.storeId:list[0].id);
					list.forEach(item=>{
						if(this.storeId == item.id){
							this.$set(this, 'system_store', item);
							this.range = item.range;
							this.site_logo = item.image;
						}
					})
				}).catch(err => {})

			},
			// 关闭地址弹窗；
			changeClose: function() {
				this.$set(this.address, 'address', false);
			},
			computedPrice: function() {
				let shippingType = this.shippingType;
				postOrderComputed(this.orderKey, {
					addressId: this.addressId,
					useIntegral: this.useIntegral ? 1 : 0,
					couponId: this.priceGroup.couponPrice==0?0:this.couponId,
					shipping_type: parseInt(shippingType) + 1,
					payType: this.payType
				}).then(res => {
					let result = res.data.result;
					if (result) {
						this.totalPrice = result.pay_price;
						this.totalIntegral = result.pay_integral;
						this.integral_price = result.deduction_price;
						this.coupon_price = result.coupon_price;
						this.promotions_detail = result.promotions_detail;
						this.integral = this.useIntegral ? result.SurplusIntegral : this.userInfo.integral;
						this.$set(this.priceGroup, 'storePostage', shippingType == 1 ? 0 : result.pay_postage);
						this.$set(this.priceGroup, 'storePostageDiscount', result.storePostageDiscount);
					}
				}).catch(err=>{
					return this.$util.Tips({
						title: err
					});
				})
			},
			addressType: function(e,num) {
				//e：0：商城和门店配送 1：门店自提
				//num：配送方式
				this.shippingType = parseInt(e);
				this.deliveryType = num;
				this.getConfirm();
			},
			bindPickerChange: function(e) {
				let value = e.detail.value;
				this.shippingType = value;
				this.computedPrice();
			},
			ChangCouponsClone: function() {
				this.$set(this.coupon, 'coupon', false);
			},
			changeTextareaStatus: function() {
				for (let i = 0, len = this.coupon.list.length; i < len; i++) {
					this.coupon.list[i].use_title = '';
					this.coupon.list[i].is_use = 0;
				}
				this.textareaStatus = true;
				this.status = 0;
				this.$set(this.coupon, 'list', this.coupon.list);
			},
			/**
			 * 处理点击优惠券后的事件
			 *
			 */
			ChangCoupons: function(index) {
				let list = this.coupon.list;
				if(list[index].is_use){
					list[index].use_title = '';
					list[index].is_use = 0;
					this.couponTitle = '请选择';
					this.couponId = 0;
				}else{
					list[index].use_title = '不使用';
					list[index].is_use = 1;
					this.couponTitle = list[index].title;
					this.couponId = list[index].id;
				}
				this.$set(this.coupon, 'coupon', false);
				this.$set(this.coupon, 'list', list);
				this.getConfirm(1);
			},
			ruleToggle(index){
				this.coupon.list[index].ruleshow = !this.coupon.list[index].ruleshow;
			},
			/**
			 * 使用积分抵扣
			 */
			ChangeIntegral: function() {
				this.useIntegral = !this.useIntegral;
				this.computedPrice();
			},
			/**
			 * 选择地址后改变事件
			 * @param object e
			 */
			OnChangeAddress: function(e) {
				this.textareaStatus = true;
				this.addressId = e;
				this.address.address = false;
				this.getConfirm();
				this.getaddressInfo();
				this.computedPrice();
			},
			bindHideKeyboard: function(e) {
				this.mark = e.detail.value;
			},
			// 对象转数组
			objToArr(data) {
				let obj = Object.keys(data);
				let m = obj.map(key => data[key]);
				return m;
			},
			/**
			 * 获取当前订单详细信息
			 *
			 */
			getConfirm: function(numType,num) {
				let that = this;
				let shippingType = parseInt(this.shippingType) + 1;
				let addressId = 0,storeid;
				if(this.deliveryType == 1){
					addressId = that.addressId
					storeid = 0
				}else if(this.deliveryType == 2){
					storeid = that.storeId
					addressId = ''
				}else{
					storeid = that.storeId
					addressId = that.addressId
				}
				orderConfirm(that.cartId, that.news, addressId, shippingType,storeid,that.couponId,that.luckRecordId).then(res => {
					if(res.data.upgrade_addr == 1){
						that.id = res.data.addressInfo.id
						this.isAddress = true
					}
					if (numType != 1) {
					  let confirm = this.objToArr(res.data.custom_form);
					  confirm.forEach((item, index, arr)=>{
					  	CACHE_CITY[index] = ''; //清空省市区
					  	if(item.name == 'texts'){
					  	  if(item.defaultValConfig.value){
					  		  item.value = item.defaultValConfig.value
					  	  }else{
					  		  item.value = ''
					  	  }
					  	}else if(item.name == 'radios'){
					  		item.value = item.wordsConfig.list[0].val
					  	}else if(item.name == 'uploadPicture'){
					  	  item.value = [];
					  	}else if(item.name == 'dateranges'){
					  		if(item.valConfig.tabVal==0){
					  		  if(item.valConfig.tabData==0){
					  			 let obj = dayjs(new Date(Number(new Date().getTime()))).format('YYYY-MM-DD');
					  			 item.value = [obj,obj]
					  		  }else{
					  			  let data1 = dayjs(new Date(Number(new Date(item.valConfig.specifyDate[0]).getTime()))).format('YYYY-MM-DD');
					  			  let data2 = dayjs(new Date(Number(new Date(item.valConfig.specifyDate[1]).getTime()))).format('YYYY-MM-DD');
					  		      item.value = [data1,data2];
					  		  }
					  		}else{
					  		  item.value = [];
					  		}
					  	}else{
					  		if(['times','dates','timeranges'].indexOf(item.name) != -1){
					  		  if(item.valConfig.tabVal==0){
					  			  if(item.valConfig.tabData==0){
					  				if(item.name == 'times'){
					  				  item.value = dayjs(new Date(Number(new Date().getTime()))).format('HH:mm');
					  				}else if(item.name == 'dates'){
					  				  item.value = dayjs(new Date(Number(new Date().getTime()))).format('YYYY-MM-DD');
					  				}else{
					  				  let current = dayjs(new Date(Number(new Date().getTime()))).format('HH:mm');
					  				  item.value = current+' - '+current;
					  				}
					  			  }else{
					  				if(item.name == 'times' || item.name == 'dates'){
					  				  item.value = item.valConfig.specifyDate;
					  				}else{
					  				  item.value = item.valConfig.specifyDate[0]+' - '+item.valConfig.specifyDate[1];
					  				}
					  			  }
					  		  }else{
					  			item.value = '';
					  		  }
					  		}else{
					  		  item.value = '';
					  		}
					  	}
					  })
					  function sortNumber(a, b) {
					  	return a.timestamp - b.timestamp;
					  }
					  confirm.sort(sortNumber);
					  that.$set(that, 'confirm', confirm);
					}
					that.$set(that, 'goodsType', res.data.type);
					that.$set(that, 'userInfo', res.data.userInfo);
					that.$set(that, 'integral', res.data.userInfo.integral);
					that.$set(that, 'integralRatio', res.data.integralRatio);
					that.$set(that, 'offlinePostage', res.data.offlinePostage);
					that.$set(that, 'orderKey', res.data.orderKey);
					that.$set(that, 'valid_count', res.data.valid_count);
					that.$set(that, 'discount_id', res.data.discount_id)
					that.$set(that, 'priceGroup', res.data.priceGroup);
					that.$set(that, 'type', parseInt(res.data.type));
					that.$set(that, 'activityId', parseInt(res.data.activityId));
					that.$set(that, 'seckillId', parseInt(res.data.seckill_id));
					that.$set(that, 'BargainId', parseInt(res.data.bargain_id));
					that.$set(that, 'combinationId', parseInt(res.data.combination_id));
					that.$set(that, 'discountId', parseInt(res.data.discount_id));
					that.$set(that, 'invoice_func', res.data.invoice_func);
					that.$set(that, 'integral_ratio_status', res.data.integral_ratio_status);
					that.$set(that, 'special_invoice', res.data.special_invoice);
					that.$set(that, 'store_self_mention', res.data.store_self_mention);
					that.$set(that, 'svip_status', res.data.svip_status);
					that.$set(that, 'svip_price', res.data.svip_price);
					that.$set(that,'contacts',res.data.userInfo.real_name);
					that.$set(that,'contactsTel',res.data.userInfo.record_pone);
					that.giveData.give_integral = res.data.give_integral;
					that.giveData.give_coupon = res.data.give_coupon;
					let cartInfo = res.data.cartInfo;
					let cartObj = [],giftObj = [];
					cartInfo.forEach(item=>{
						if(item.is_gift == 1){
							giftObj.push(item)
						}else{
							cartObj.push(item)
						}
					})
					that.$set(that, 'cartInfo', cartObj);
					that.$set(that, 'giveCartInfo', giftObj);
					let giveType = -1;
					giftObj.forEach(item=>{
						if(item.product_type==0){
							 return giveType = 0
						}
					})
					that.$set(that, 'product_type', (res.data.product_type==0 || giveType == 0 || res.data.product_type == 4)?0:1);
					that.$set(that, 'ChangePrice', that.totalPrice);
					that.getCouponList();
					that.computedPrice();
					if (this.addressId || this.couponId) {
						// this.computedPrice();
					}else{
						that.$set(that, 'totalPrice', that.$util.$h.Add(parseFloat(res.data.priceGroup.totalPrice),
							parseFloat(res.data
								.priceGroup.storePostage)));
					}
					if(num){
						this.getList();
					}
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				});
			},
			/**
			 * 获取当前金额可用优惠券
			 *
			 */
			getCouponList: function() {
				let that = this;
				let data = {
					cartId: this.cartId,
					'new': this.news,
					shipping_type: that.$util.$h.Add(that.shippingType, 1),
					store_id: (that.system_store && this.deliveryType !=1) ? that.system_store.id : 0
				};
				getCouponsOrderPrice(this.totalPrice, data).then(res => {
					res.data.map(item=>{
						this.$set(item,'ruleshow',false);
					})
					that.$set(that.coupon, 'list', res.data);
					that.openType = 1;
				});
			},
			/*
			 * 获取默认收货地址或者获取某条地址信息
			 */
			getaddressInfo: function() {
				let that = this;
				if (that.addressId) {
					getAddressDetail(that.addressId).then(res => {
						res.data.is_default = parseInt(res.data.is_default);
						that.addressInfo = res.data || {};
						that.addressId = res.data.id || 0;
						that.address.addressId = res.data.id || 0;
					})
				} else {
					getAddressDefault().then(res => {
						res.data.is_default = parseInt(res.data.is_default);
						that.addressInfo = res.data || {};
						that.addressId = res.data.id || 0;
						that.address.addressId = res.data.id || 0;
					})
				}
			},
			showMaoLocation(e) {
				let self = this;
				// #ifdef H5
				if (self.$wechat.isWeixin()) {
					self.$wechat.seeLocation({
						latitude: Number(e.latitude),
						longitude: Number(e.longitude),
						name: e.name,
						scale: 13,
						address: `${e.address}-${e.detailed_address}`,
					}).then(res => {})
				} else {
					// #endif	
					uni.openLocation({
						latitude: Number(e.latitude),
						longitude: Number(e.longitude),
						name: e.name,
						address: `${e.address}-${e.detailed_address}`,
						success: function() {
							Number
						}
					});
					// #ifdef H5	
				}
				// #endif
			},
			couponTap: function() {
				this.coupon.coupon = true;
				this.coupon.list.forEach((item, index) => {
					if (item.id == this.couponId) {
						item.is_use = 1
					} else {
						item.is_use = 0
					}
				})
				this.$set(this.coupon, 'list', this.coupon.list);
			},
			car: function() {
				let that = this;
				that.animated = false;
			},
			onAddress: function(name) {
				let that = this;
				if(name){
					that.textareaStatus = false;
					that.address.address = true;
					that.pagesUrl = '/pages/users/user_address_list/index?news=' + this.news + '&cartId=' + this.cartId +
						'&pinkId=' +
						this.pinkId +
						'&couponId=' +
						this.couponId +
						'&store_id=' +
						this.storeId;
				}else{
					uni.navigateTo({
						url:'/pages/users/user_address/index?new='+this.news + '&cartId=' + this.cartId + '&pinkId=' +
						this.pinkId + '&couponId=' + this.couponId + '&store_id=' + this.storeId
					})
				}
			},
			payment: function(data) {
				let that = this;
				orderCreate(that.orderKey, data).then(res => {
					uni.hideLoading();
					uni.redirectTo({
						url: `/pages/goods/cashier/index?order_id=${res.data.result.order_id}&from_type=order`
					})
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
			},
			clickTextArea() {
				this.$refs.textarea.focus()
			},
			bindDateChange: function(e, index) {
				this.confirm[index].value = e.target.value
			},
			bindTimeChange: function(e, index) {
				this.confirm[index].value = e.target.value
			},
			bindSelectChange: function(e, index, item) {
				this.confirm[index].value = item.wordsConfig.list[e.detail.value].val
			},
			getTimeranges(index){
				this.isShow = true
				this.timerangesIndex = index
			},
			confrim(e){
			  this.isShow = false;
			  this.confirm[this.timerangesIndex].value = e.time;
			  let arrayNew = [];
			  e.val.forEach(item=>{
			    arrayNew.push(Number(item))
			  })
			  this.timeranges = arrayNew;
			},
			cancels(){
				this.isShow = false;
			},
			// 单选
			radioChange(e, index, item){
				this.confirm[index].value = item.wordsConfig.list[e.detail.value].val
			},
			// 多选
			checkboxChange(e, index, item){
				let obj = e.detail.value;
				  let val = '';
				  item.wordsConfig.list.forEach((j,jindex)=>{
					  obj.forEach(x=>{
						  if(jindex == x){
						  	 val = val +(val?',':'') + j.val;
						  }
					  })
				  })
				this.confirm[index].value = val
			},
			formVerify(){
				let that = this;
				if (that.tableId) {
					return this.SubOrder();
				}
				if (!that.addressId && !that.shippingType && !that.product_type) return that.$util.Tips({
				  title: '请选择收货地址'
				});
				if (that.shippingType == 1) {
				  if (that.contacts == "" || that.contactsTel == "") {
				    return that.$util.Tips({
				      title: '请填写联系人或联系人电话'
				    });
				  }
				  if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(that.contactsTel)) {
				    return that.$util.Tips({
				      title: '请填写正确的手机号'
				    });
				  }
				  if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(that.contacts)) {
				    return that.$util.Tips({
				      title: '请填写您的真实姓名'
				    });
				  }
				  if (that.storeList.length == 0) return that.$util.Tips({
				    title: '暂无门店,请选择其他方式'
				  });
				}
				for (var i = 0; i < that.confirm.length; i++) {
				  let data = that.confirm[i]
				  if (['radios'].indexOf(data.name) == -1 && (data.titleShow.val || (['uploadPicture','dateranges'].indexOf(data.name) == -1 && data.value && data.value.trim()))) {
				    if ((data.name === 'texts' && data.valConfig.tabVal == 0) || ['dates','times','selects','citys','checkboxs'].indexOf(data.name) != -1) {
				      if (!data.value || (data.value && !data.value.trim())) {
				        return that.$util.Tips({
				          title: `请填写${data.titleConfig.value}`
				        });
				      }
				    }
					if(data.name === 'timeranges'){
						if(!data.value){
							return that.$util.Tips({
							  title: `请选择${data.titleConfig.value}`
							});
						}
					}
					if (data.name === 'dateranges') {
					  if (!data.value.length) {
					    return that.$util.Tips({
					      title: `请选择${data.titleConfig.value}`
					    });
					  }
					}
				    if (data.name === 'texts' && data.valConfig.tabVal == 4) {
				      if (data.value <= 0) {
				        return that.$util.Tips({
				          title: `请填写大于0的${data.titleConfig.value}`
				        });
				      }
				    }
				    if (data.name === 'texts' && data.valConfig.tabVal == 3) {
				      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(data.value)) {
				        return that.$util.Tips({
				          title: `请填写正确的${data.titleConfig.value}`
				        });
				      }
				    }
				    if (data.name === 'texts' && data.valConfig.tabVal == 1) {
				      if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(data.value)) {
				        return that.$util.Tips({
				          title: `请填写正确的${data.titleConfig.value}`
				        });
				      }
				    }

				    if (data.name === 'texts' && data.valConfig.tabVal == 2) {
				      if (!
				        /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i
				        .test(data.value)) {
				        return that.$util.Tips({
				          title: `请填写正确的${data.titleConfig.value}`
				        });
				      }
				    }

				    if (data.name === 'uploadPicture') {
				      if (!data.value.length) {
				        return that.$util.Tips({
				          title: `请上传${data.titleConfig.value}`
				        });
				      }
				    }
				  }
				}
				if(this.type == 4 && this.totalIntegral > this.userInfo.integral){
					return that.$util.Tips({
					  title: '您的积分不足以抵扣本单积分金额'
					});
				}
				this.SubOrder();
			},
			SubOrder: function(e) {
				let that = this,data = {};
				data = {
					collate_code_id: that.collage_id || that.tableId,
					custom_form: that.confirm,
					real_name: that.contacts,
					phone: that.contactsTel,
					addressId: that.addressId,
					formId: '',
					couponId: that.priceGroup.couponPrice==0?0:that.couponId,
					payType: that.payType,
					useIntegral: that.useIntegral,
					bargainId: that.BargainId,
					combinationId: that.combinationId,
					discountId: that.discountId,
					pinkId: that.pinkId,
					seckill_id: that.seckillId,
					mark: that.mark,
					store_id: that.deliveryType == 1 ? 0 :that.system_store.id||0,
					'from': that.from,
					shipping_type: that.tableId ? 4 : that.$util.$h.Add(that.shippingType, 1),  // 桌码订单为：4
					'new': that.news,
					'invoice_id': that.invChecked,
					// #ifdef H5
					quitUrl: location.protocol + '//' + location.hostname +
						'/pages/goods/order_pay_status/index?' +
						'&type=3' + '&totalPrice=' + this.totalPrice
					// #endif
					// #ifdef APP-PLUS
					quitUrl: '/pages/goods/order_details/index'
					// #endif
				};
				uni.showLoading({
					title: '订单支付中'
				});
				// #ifdef MP
				openPaySubscribe().then(() => {
					that.payment(data);
				});
				// #endif
				// #ifndef MP
				that.payment(data);
				// #endif
			},
			// 去详情页
			goDetail(id) {
				uni.navigateTo({
					url: `/pages/goods_details/index?id=${id}`
				});
			},
			addCart(type,item){
				if(type == 1){
					if(item.productInfo.stock == item.cart_num) return this.$util.Tips({
						title: '该产品没有更多库存了！'
					});
					item.cart_num ++
				}else{
					if(item.cart_num == 1) return
					item.cart_num --
				}
				let data = {
					cartNum: item.cart_num,
					new:this.news,
					uniqueId:item.product_attr_unique,
					productId:item.productInfo.id,
					key: this.news ? item.id : '',
					is_set:1
				};
				postCartAdd(data).then(res => {
					this.getConfirm();
					setTimeout(()=>{
						this.computedPrice();
					},500)
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				});
			},
			setValue: Debounce(function(e,item){
				let num = e.detail.value;
				if (item.productInfo.limit_num > 0 && num > item.productInfo.limit_num) {
					item.cart_num = item.productInfo.limit_num;
					return this.$util.Tips({
						title: '购物车数量不能大于限购数量'
					});
				}
				let data = {
					cartNum: num,
					new:this.news,
					uniqueId:item.product_attr_unique,
					productId:item.productInfo.id,
					key: this.news ? this.cartId : '',
					is_set:1
				};
				postCartAdd(data).then(res => {
					this.getConfirm();
					setTimeout(()=>{
						this.computedPrice();
					},500)
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				});
			}),
			goPage(type, url){
				if(type == 1){
					uni.navigateTo({
						url
					})
				}else if(type == 2){
					uni.switchTab({
						url
					})
				}else if(type == 3){
					uni.navigateBack();
				}

			},
			closeDrawer(){
				this.showGiftDrawer = false;
			},
			hideModal(){
				this.isAddress = false;
			},
			handleClick(e){
				let index = e.index;
				if(index == 1){
					uni.navigateTo({
						url: '/pages/users/user_address/index?id='+this.id +'&new=' + this.news + '&cartId=' + this.cartId +'&pinkId=' +this.pinkId +'&couponId=' +this.couponId
					})
				}
				this.isAddress = false;
			},
			clearInput(type){
				if(type == 0){
					this.contacts = '';
					this.contactsFocus = true;
				}else{
					this.contactsTel = '';
					this.telFocus = true;
				}
			},
			getCodeData() {
				getCodeData({
					tableId: this.tableId
				}).then(res => {
					this.codeData = res.data;
				});
			},
			getCollagePartake() {
				getCollagePartake({
					collage_id: this.collage_id
				}).then(res => {
					this.goodsList = res.data;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.uni-date-x--border{
		border: 0;
	}
	/deep/.uni-icons{
		font-size: 0 !important;
	}
	/deep/.uni-date-x{
		color: #999;
		font-size: 15px;
	}
	/deep/.uni-date__x-input{
		font-size: 15px;
	}
	.footer-box{
		position: fixed;
		bottom: 12rpx;
		bottom: calc(12rpx + constant(safe-area-inset-bottom));
		bottom: calc(12rpx + env(safe-area-inset-bottom));
		z-index: 5;
		right: 20rpx; 
		width: 168rpx;
		height: 72rpx;
		text-align: center;
		line-height: 72rpx;
		font-size: 26rpx;
		color: #fff;
		border-radius: 36rpx;
		background-color: var(--view-theme);
	}
	.height-add {
		height: calc(176rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(176rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	/deep/uni-checkbox[disabled] .uni-checkbox-input {
		background-color: #eee;
	}
	.alipaysubmit {
		display: none;
	}
	.abs-lt .active-card{
		&:after{
			right: -67rpx;
		}
	}
	
	.abs-ct .active-card{
		&:after{
			right: -67rpx;
		}
		
		&:before{
			left:-67rpx;
			transform:scaleX(-1);
		}
	}
	
	.abs-rt .active-card{
		&:after{
			left: -67rpx;
			-moz-transform:scaleX(-1);
			-webkit-transform:scaleX(-1);
			-o-transform:scaleX(-1);
			transform:scaleX(-1);
		}
	}
	.active-card{
		&:after,&:before{
			content:"";
			width: 67rpx;
			height: 76rpx;
			background-image: url('../static/nav_circle_left.png');
			background-size: contain;
			background-repeat: no-repeat;
			position: absolute;
			bottom: 0;
			z-index: 4;
		}
		
	}
	.line {
		width: 680rpx;
		margin: auto;
		height: 3rpx;
	}

	.line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.address {
		background-color: #fff;
		box-sizing: border-box;
		.default{
			width: 60rpx;
			height: 34rpx;
			background: var(--view-minorColorT);
			border-radius: 8rpx;
			color: var(--view-theme);
			font-size: 22rpx;
		}
	}
	.add1{
		padding: 24rpx 20rpx 32rpx 32rpx;
	}
	.add2{
		padding: 36rpx 20rpx 0 32rpx;
	}

	.footer .transparent {
		opacity: 0
	}
	._map{
		width:188rpx;
		height:104rpx;
		background-size:100%;
		background-repeat: no-repeat;
	}
	.store_distance{
		position: absolute;
		top: -4rpx;
		left:30rpx;
		width: 130rpx;
		height: 36rpx;
		box-shadow: 0px 0px 16rpx 0px rgba(0,0,0,0.0784);
	}
	.store-horn{
		position: absolute;
		top:32rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-top: 6rpx solid #fff;
		border-right: 6rpx solid transparent;
		border-left: 6rpx solid transparent;
	}
	.store_logo{
		position: absolute;
		top: 40rpx;
		left:68rpx;
		width: 52rpx;
		height:52rpx;
		box-shadow: 0px 0px 16rpx 0px rgba(0,0,0,0.0784);
		padding: 6rpx;
		&:after{
			content:'';
			position: absolute;
			bottom:-8rpx;
			left:50%;
			transform: translateX(-50%);
			width: 0;
			height: 0;
			border-top: 8rpx solid #fff;
			border-right: 6rpx solid transparent;
			border-left: 6rpx solid transparent;
		}
		&:before{
			content:'';
			position: absolute;
			bottom:-12rpx;
			left:50%;
			transform: translateX(-50%);
			width: 6rpx;
			height: 6rpx;
			border-radius: 50%;
			background-color: var(--view-theme);
		}
	}
	.dashed-b{
		border-bottom: 1px dashed #eee;
	}
	.w-322{
		width:322rpx;
	}
	.w-450{
		width: 450rpx;
	}
	.order_goods{
		transform: translate(0px,0);
	}
	.order_goods ~ .order_goods{
		margin-top: 32rpx;
	}
	.cell input{
		width: 450rpx;
		text-align:right;
	}
	.cell .radio {
		margin: 0 22rpx;
		padding: 10rpx 0;
	}
	.cell ~ .cell{
		margin-top: 40rpx;
	}
	.SemiBold {
	  font-family: SemiBold;
	}
	.Regular{
		font-family: 'Regular';
	}
	.placeholder {
		color: #ccc;
	}
	.asterisk{
		position: absolute;
		color:red;
		left:0;
	}
	.gradient-box{
		background: linear-gradient(180deg, var(--view-theme) 0%, var(--view-theme) 52%, rgba(233,51,35,0) 100%);
	}
	.h-auto{
		height:auto;
	}
	.bg-primary-light{
		background: var(--view-minorColorT);
	}
	.bg-horn{
		position: relative;
		&:before{
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			background-color: var(--view-minorColorT);
			left:0;
			bottom: -20rpx;
		}
		&::after{
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			background-color: #fff;
			left:0;
			bottom: -20rpx;
			border-radius: 20rpx 0 0 0;
		}
	}
	.bg-horn-r{
		position: relative;
		&:before{
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			background-color: var(--view-minorColorT);
			right:0;
			bottom: -20rpx;
		}
		&::after{
			position: absolute;
			content: '';
			width: 20rpx;
			height: 20rpx;
			background-color: #fff;
			right:0;
			bottom: -20rpx;
			border-radius: 0 20rpx 0 0;
		}
	}
	.rd-lt-24rpx{
		border-radius: 24rpx 0 0 0;
	}
	.rd-rt-24rpx{
		border-radius: 0 24rpx 0 0;
	}
	.z-2{
		z-index: 2;
	}
	.gold{
		color: #DCA658;
	}
	.over{
		width:104rpx;
		height:104rpx;
		border-radius: 50%;
		background-color: rgba(51, 51, 51, 0.6);
		position: absolute;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
	}
	.con-border{
		border: 1px solid var(--view-theme);
	}
	.clear-btn{
		border-radius: 0 12rpx 0 12rpx;
	}
	.header {
		padding: 32rpx;
		border-radius: 24rpx;
		margin: 20rpx;
		background: #FFFFFF;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	
		.top {
			margin-bottom: 12rpx;
		}
	
		.name {
			flex: 1;
			min-width: 0;
			font-weight: 500;
			font-size: 30rpx;
			line-height: 42rpx;
			color: #333333;
		}
	
		.number {
			font-size: 22rpx;
			line-height: 42rpx;
			color: #333333;
		}
	
		.light {
			font-weight: 500;
			font-size: 30rpx;
			color: var(--view-theme);
		}
	}
	
	.dining {
		height: 100rpx;
		padding: 0 24rpx 0 32rpx;
		border-radius: 24rpx;
		margin: 20rpx;
		background: #FFFFFF;
		font-size: 24rpx;
		color: #333333;
	
		.total {
			font-weight: 500;
			font-size: 30rpx;
			color: #3D3D3D;
		}
	}
	
	.dinner {
		border-radius: 24rpx;
		margin: 20rpx;
		background: #FFFFFF;
	
		.head {
			padding: 35rpx 24rpx;
			font-size: 28rpx;
			color: #333333;
	
			.image {
				display: block;
				width: 36rpx;
				height: 36rpx;
				border-radius: 50%;
			}
	
			.name {
				flex: 1;
				min-width: 0;
				padding: 0 10rpx;
			}
		}
	
		.body {
			padding: 0 24rpx 32rpx;
		}
	
		.item {
			position: relative;
			margin-top: 32rpx;
	
			&:first-child {
				margin-top: 0;
			}
	
			&.gray {
				background-color: #EEEEEE;
			}
	
			.image {
				display: block;
				width: 136rpx;
				height: 136rpx;
				border-radius: 16rpx;
			}
	
			.text {
				flex: 1;
				min-width: 0;
				padding: 0 20rpx;
			}
	
			.name {
				font-size: 28rpx;
				line-height: 40rpx;
				color: #333333;
			}
	
			.attr {
				margin-top: 12rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999999;
			}
	
			.number {
				margin-top: 10rpx;
				text-align: right;
				font-size: 24rpx;
				line-height: 34rpx;
				color: #999999;
			}
		}
	}
	.border-top {
		.flex-1{
			position: relative;
			min-width: 0;
			&::before{
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				border-left: 1rpx solid #EEEEEE;
				transform: rotateZ(360deg);
			}
			&:first-child{
				padding-right: 28rpx;
				&::before{
					display: none;
				}
			}
		}
	}
</style>
