<template>
	<!-- 打卡日历页面 -->
	<view class="all">
		<view class="bar">
			<!-- 上一个月 -->
			<view class="previous barbtn" @click="changeMonth(-1)">
				<view class="iconfont icon-ic_left2"></view>
			</view>
			<!-- 显示年月 -->
			<view class="date">{{ nowYear || '--' }} 年 {{ nowMonth || '--' }} 月</view>
			<!-- 下一个月 -->
			<view class="next barbtn" @click="changeMonth(1)">
				<view class="iconfont icon-ic_right2"></view>
			</view>
		</view>
		<!-- 显示星期 -->
		<view class="week-area">
			<view class="week-txt" v-for="(item, index) in weeksTxt[langType]" :key="index">{{ item }}</view>
		</view>

		<view class="myDateTable">
			<view v-for="(item, j) in calendarDays" :key="j" class="dateCell">
				<view v-if="item.date == undefined || item.date == null" class="cell"></view>
				<template v-else>
					<!-- 已签到日期 -->
					<view v-if="item.isSign == true" class="cell signColor bgWhite">
						<!-- {{ item.date }} -->
						<image class="sign-today" src="@/pages/users/static/sign-today.png" mode=""></image>
						<view class="sign">已签</view>
					</view>
					<!-- 漏签 -->
					<view @click="clickSign(item.date, 0)" class="cell outSignStyle" v-else-if="item.isBeforeToday && item.isThisMonth">
						<!-- redColor bgGray -->
						{{ item.date }}
						<!-- <view class="redDot"></view> -->
					</view>
					<!-- 今日未签到-->
					<view @click="clickSign(item.date, 1)" class="cell whiteColor" v-else-if="item.date == today && nowMonth == toMonth && nowYear == toYear">今</view>
					<!-- 当前日期之后 -->
					<view class="whiteColor cell" v-else>
						{{ item.date }}
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				calendarDays: [],
				SignData: [], // 已经签到的数据
				nowYear: 0, //当前选的年
				nowMonth: 0, //当前选的月
				today: parseInt(new Date().getDate()), //系统本日
				toMonth: parseInt(new Date().getMonth() + 1), //系统本月
				toYear: parseInt(new Date().getFullYear()), //系统本年
				weeksTxt: {
					ch: ['日', '一', '二', '三', '四', '五', '六'],
					en: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
				}
			};
		},
		props: {
			isReplenishSign: {
				// 是否允许过期补签
				type: Boolean,
				default: false
			},
			isFullCalendar: {
				// 是否需要填满日历，前后空的格子填入上/下个月的日期
				type: Boolean,
				default: false
			},
			yearMonth: {
				// 2022-01 这种格式，默认当前年月
				type: String,
				default: new Date().getFullYear() + '-' + new Date().getMonth() + 1
			},
			dataSource: {
				//已签到的数据源，例： 5、6号已签到： ["2022-01-05","2022-01-06"]，兼容个位数前可加可不加0
				type: Array,
				default: () => {
					return [];
				}
			},
			langType: {
				//只是示例一个翻译而已，要想所有都翻译自己可以再加加
				type: String,
				default: 'ch' //en
			}
		},
		created() {
			if (!/en|ch/g.test(this.langType)) {
				this.langType = 'ch'; // 非中英，则固定中文
			}
			const ymArr = this.yearMonth.split('-');
			this.buildCalendar(ymArr[0], ymArr[1]);
			this.onSignDataChange(this.dataSource);
		},
		watch: {
			dataSource: 'onSignDataChange'
		},
		methods: {
			clickSign(date, type) {
				//type=0补签，type=1当日签到
				var strTip = '签到';

				if (type == 0) {
					if (!this.isReplenishSign) {
						// 未开启补签，阻止继续执行
						console.log('————补签功能未开启————');
						return;
					}
					strTip = '补签';
				}
				uni.showToast({
					title: date + '号' + strTip + '成功',
					icon: 'success',
					position: 'bottom'
				});
				this.$emit('clickChange', this.nowYear + '-' + this.nowMonth + '-' + date); //传给调用模板页面
				// 父页面要在clickChange里去修改输入的数据源dataSource，否则视图不更新的!
			},
			//构建日历数据
			buildCalendar(y, m) {
				this.nowYear = y;
				this.nowMonth = m;
				this.calculateEmptyGrids(y, m);
				this.calculateDays(y, m);
				if (this.isFullCalendar) {
					this.fullCell();
				}
			},
			// 监听到签到数据源改变
			onSignDataChange(newData, oldData = []) {
				this.SignData = newData;
				this.matchSign();
			},
			//匹配标记已经签到的日子
			matchSign() {
				var signs = this.SignData;
				var daysArr = this.calendarDays;
				for (var i = 0; i < signs.length; i++) {
					var current = new Date(this.toIOSDate(signs[i])).getTime(); // ios只认/格式的日期
					for (var j = 0; j < daysArr.length; j++) {
						if (current == new Date(this.toIOSDate(daysArr[j].fullDate)).getTime()) {
							daysArr[j].isSign = true;
						}
					}
				}
				this.calendarDays = daysArr;
				// console.log(this.calendarDays );
			},
			// 计算当月1号前空了几个格子，把它填充在calendarDays数组的前面
			calculateEmptyGrids(year, month) {
				//计算每个月时要清零
				this.calendarDays = [];
				const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
				if (firstDayOfWeek > 0) {
					for (let i = 0; i < firstDayOfWeek; i++) {
						this.calendarDays.push({
							date: null, // 显示的日期
							fullDate: null, // 日期yyyy-mm-dd格式
							isBeforeToday: true, // 今日之前
							isSign: false, // 是否签到
							isThisMonth: false // 是本月
						});
					}
				}
			},
			// 绘制当月天数占的格子，并把它放到days数组中
			calculateDays(year, month) {
				const thisMonthDays = this.getMonthDayLength(year, month);
				const toDate = new Date(this.toYear + '/' + this.toMonth + '/' + this.today);
				for (let i = 1; i <= thisMonthDays; i++) {
					const fullDate = year + '-' + month + '-' + i;
					const isBeforeToday = new Date(this.toIOSDate(fullDate)) < toDate;
					this.calendarDays.push({
						date: i,
						fullDate,
						isBeforeToday,
						isSign: false,
						isThisMonth: true
					});
				}
				//console.log(this.calendarDays);
			},
			// 切换控制年月，上一个月，下一个月
			changeMonth(type) {
				console.log(type)
				const nowYear = parseInt(this.nowYear);
				const nowMonth = parseInt(this.nowMonth);
				const newObj = this.getOperateMonthDate(nowYear, nowMonth, type);
				this.buildCalendar(newObj.year, newObj.month); // 重新构建日历数据
				this.$emit('dateChange', this.nowYear + '-' + this.nowMonth); //传给调用模板页面去拿新数据
			},
			// 获取当月共多少天，也就是获取月的最后一天
			getMonthDayLength(year, month) {
				return new Date(year, month, 0).getDate();
			},
			// 获取当月第一天星期几
			getFirstDayOfWeek(year, month, day = 1) {
				return new Date(Date.UTC(year, month - 1, day)).getDay();
			},
			toIOSDate(strDate) {
				// iso不认识"-"拼接的日期，所以转/
				return strDate ? strDate.replace(/-/g, '/') : strDate;
			},
			// 需要填满格子，上/下个月的日期拉出来填满格子
			fullCell() {
				const endDay = this.getMonthDayLength(this.nowYear, this.nowMonth);
				const beforeEmptyLength = this.getFirstDayOfWeek(this.nowYear, this.nowMonth);
				const afterEmptyLength = 6 - this.getFirstDayOfWeek(this.nowYear, this.nowMonth, endDay);

				const last = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
				const lastMonthEndDay = this.getMonthDayLength(last.year, last.month);
				for (let i = 0; i < beforeEmptyLength; i++) {
					const date = lastMonthEndDay - beforeEmptyLength + i + 1;
					this.calendarDays[i].date = date;
					this.calendarDays[i].fullDate = last.year + '-' + last.month + '-' + date;
				}
				const next = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
				for (let i = 1; i <= afterEmptyLength; i++) {
					this.calendarDays.push({
						date: i, // 显示的日期
						fullDate: next.year + '-' + next.month + '-' + i, // 日期yyyy-mm-dd格式
						isBeforeToday: false, // 今日之前
						isSign: false, // 是否签到
						isThisMonth: false // 是本月
					});
				}
				// console.log(beforeEmptyLength,afterEmptyLength,lastMonthEndDay);

				// console.log(this.calendarDays);
			},
			// 获取加/减一个月的日期
			getOperateMonthDate(yy, mm, num) {
				let month = parseInt(mm) + parseInt(num);
				let year = parseInt(yy);
				if (month > 12) {
					month = 1;
					year++;
				} else if (month < 1) {
					month = 12;
					year--;
				}
				return {
					month,
					year
				};
			}
		}
	};
</script>

<style scoped lang="scss">
	.all {

		// margin-top: 20rpx;
		.cir-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 324rpx;
			height: 230rpx;
			background: #fee3de;
			opacity: 1;
			filter: blur(133px);
		}
	}

	.all .bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 60rpx 64rpx 64rpx;
	}

	.bar .barbtn {
		width: 52rpx;
		height: 52rpx;
		background: rgba(233, 51, 35, 0.1);
		border-radius: 50%;
		display: flex;

		.iconfont {
			margin: auto;
			color: rgba(233, 51, 35, 0.8);
		}
	}

	.all .week-area {
		display: flex;
		justify-content: space-between;
		padding: 10px 0;
		box-sizing: border-box;
		width: 91vw;
		margin: 10px auto;
		border-radius: 10px;
	}

	.all .week-txt {
		text-align: center;
		width: 88rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}

	.myDateTable {
		margin: 0 auto;
		width: 91vw;
		border-radius: 10px;
	}

	.myDateTable .dateCell {
		width: 13vw;
		padding: 1vw;
		display: inline-block;
		text-align: center;
		font-size: 36rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.dateCell .cell {
		display: flex;
		border-radius: 16rpx;
		height: 120rpx;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		flex-direction: column;
		font-family: 'SemiBold';

		.sign-today {
			width: 40rpx;
			height: 40rpx;
		}

		.sign {
			font-size: 18rpx;
			font-weight: 500;
			color: #e93323;
			margin-top: 10rpx;
		}
	}

	.whiteColor {
		color: #981007;
	}

	.signColor {
		color: #ffffff;
	}

	.bgWhite {
		background-color: #fceae9;
	}

	.bgGray {
		background-color: rgba(255, 255, 255, 0.42);
	}

	.bgBlue {
		font-size: 14px;
		background-color: #4b95e6;
	}

	.redColor {
		color: #ff0000;
	}

	.outSignStyle {
		// border: 1px solid #981007;
		color: #981007;
	}

	.redDot {
		width: 3px;
		height: 3px;
		border-radius: 16rpx;
		background-color: red;
	}

	.date {
		font-size: 36rpx;
		font-family: PingFang SC-Medium, PingFang SC;
		font-weight: 500;
		color: #981007;
	}
</style>