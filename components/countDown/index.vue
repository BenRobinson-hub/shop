<template>
	<view class="time" :style="justifyLeft">
		<!-- 倒计时 -->
		<text class="title red" v-if="tipText.trim()">{{ tipText }}</text>
		<text class="styleAll" :style="'background-color:' + bgColor + ';color:' + colors + ';'" v-if="isDay === true">
			{{ day }}
			<text class="dayTxt">{{ inDayText }}</text>
		</text>
		<text class="timeTxt red" :style="'color:' + dotColor" v-if="dayText">{{ dayText }}</text>
		<text class="styleAll" :style="'background:' + bgColor + ';color:' + colors + ';'">{{ hour }}</text>
		<text class="timeTxt red" :style="'color:' + dotColor" v-if="hourText">{{ hourText }}</text>
		<text class="styleAll" :style="'background:' + bgColor + ';color:' + colors + ';'">{{ minute }}</text>
		<text class="timeTxt red" :style="'color:' + dotColor" v-if="minuteText">{{ minuteText }}</text>
		<text class="styleAll" :style="'background:' + bgColor + ';color:' + colors + ';'" v-if="isSecond === true">{{ second }}</text>
		<text class="timeTxt red" :style="'color:' + dotColor" v-if="secondText">{{ secondText }}</text>
		<slot name="bottom"></slot>
	</view>
</template>

<script>
export default {
	name: 'countDown',
	props: {
		justifyLeft: {
			type: String,
			default: ''
		},
		//距离开始提示文字
		tipText: {
			type: String,
			default: '倒计时'
		},
		inDayText: {
			type: String,
			default: '天'
		},
		dayText: {
			type: String,
			default: '天'
		},
		hourText: {
			type: String,
			default: '时'
		},
		minuteText: {
			type: String,
			default: '分'
		},
		secondText: {
			type: String,
			default: '秒'
		},
		datatime: {
			type: Number,
			default: 0
		},
		isDay: {
			type: Boolean,
			default: true
		},
		isSecond: {
			type: Boolean,
			default: true
		},
		bgColor: {
			type: String,
			default: ''
		},
		colors: {
			type: String,
			default: '#e93323'
		},
		dotColor: {
			type: String,
			default: '#ffffff'
		}
	},
	data: function () {
		return {
			day: '00',
			hour: '00',
			minute: '00',
			second: '00',
			times: null
		};
	},
	watch:{
		datatime:{
			handler(val){
				this.show_time();
			},
			immediate: true
		}
	},
	methods: {
		show_time: function () {
			let that = this;

			function runTime() {
				//时间函数
				let intDiff = that.datatime - Date.parse(new Date()) / 1000; //获取数据中的时间戳的时间差；
				let day = 0,
					hour = 0,
					minute = 0,
					second = 0;
				if (intDiff > 0) {
					//转换时间
					if (that.isDay === true) {
						day = Math.floor(intDiff / (60 * 60 * 24));
					} else {
						day = 0;
					}
					hour = Math.floor(intDiff / (60 * 60)) - day * 24;
					minute = Math.floor(intDiff / 60) - day * 24 * 60 - hour * 60;
					second = Math.floor(intDiff) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
					if (hour <= 9) hour = '0' + hour;
					if (minute <= 9) minute = '0' + minute;
					if (second <= 9) second = '0' + second;
					that.day = day;
					that.hour = hour;
					that.minute = minute;
					that.second = second;
				} else {
					that.day = '00';
					that.hour = '00';
					that.minute = '00';
					that.second = '00';
					clearInterval(that.times);
					that.times = null;
					that.$emit('endTime', 1);
				}
			}
			runTime();
			this.times = setInterval(runTime, 1000);
		}
	}
};
</script>

<style>
.time {
	display: flex;
	justify-content: center;
}
.timeTxt {
	margin: 0 4rpx;
}
</style>
