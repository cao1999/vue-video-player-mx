<template>
  <!-- 视频的倍速 -->
  <div class="mx-video-player__btn-wrapper mx-video-player__speed">
    <!-- 倍速按钮 -->
    <button
      @click="clickSelectedItem"
      class="mx-video-player__btn"
      type="button"
    >
      {{ playRate.toFixed(1) }}
    </button>

    <!-- 选择速率options -->
    <div class="mx-video-player__btn-menu mx-video-player__speed-options">
      <ul class="mx-video-player__speed-list">
        <li
          v-for="(rate, index) in rateOptions"
          :key="index"
          :class="optionsItemClass(rate)"
          @click="changePlayRate(rate)"
        >
          {{ rate.toFixed(1) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/**
 * emit事件
 * rateChange  监听播放速率变化事件
 */
export default {
  name: "speedControl",

  data() {
    return {
      // 视频播放速率
      playRate: 1,
      // 播放速率的可选项
      rateOptions: null,
    };
  },

  props: {
    video: {
      type: HTMLVideoElement,
      default: null,
    },
    onRateChange: {
      type: Function,
      default: null,
    },
    playRateOptions: {
      type: Array,
      default: null,
    },
  },

  computed: {
    optionsItemClass() {
      return function (rate) {
        return `mx-video-player__speed-options-item ${
          rate === this.playRate ? "mx-video-player__speed-item_active" : ""
        }`;
      };
    },
  },

  methods: {
    // 点击hover选项更改视频播放速度
    changePlayRate(rate) {
      if (rate === this.playRate) {
        return;
      }

      this.setPlayRate(rate);
    },

    // 点击当前选中项，更改倍速
    clickSelectedItem() {
      const length = this.rateOptions.length;

      // options为空，return
      if (!length) {
        return;
      }

      const index = this.rateOptions.indexOf(this.playRate);
      let rate;

      if (index < length - 1) {
        rate = this.rateOptions[index + 1];
      } else {
        rate = this.rateOptions[0];
      }

      this.setPlayRate(rate);
    },

    // 设置视频的播放速度
    setPlayRate(rate) {
      rate = rate || 1.0;
      this.playRate = rate;
      this.video && (this.video.playbackRate = rate);
      this.$emit("rateChange", rate);
      // 存储播放速率到本地
      localStorage.setItem("mx-video-player-rate", rate);
    },
  },

  watch: {
    playRateOptions: {
      handler(rateOptions) {
        // 从大到小排序，最多取四个
        const newRateOptions = [...rateOptions];
        newRateOptions.sort((i, j) => j - i);
        this.rateOptions = newRateOptions.slice(0, 4);
        // 判断options中是否有1这一项，没有的话，取倒数第二个小的值，如果这个值也不存在，取第一个值，还不存在，取1
        this.playRate = newRateOptions.some((item) => Number(item) === 1)
          ? 1
          : newRateOptions[this.rateOptions.length - 2] ||
            newRateOptions[0] ||
            1;
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
