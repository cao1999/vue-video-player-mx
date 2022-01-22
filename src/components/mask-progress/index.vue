<template>
  <!-- 控制器隐藏后显示在底部的进度条，仅仅是显示不能操作 -->
  <div :class="maskProgressClass">
    <!-- 视频播放的进度条 -->
    <player-slider
      :progress="progress"
      :cacheProgress="cacheProgress"
      :showPopover="false"
      :ifShowSliderBlock="false"
      :alwaysShowSlideBlock="false"
      :totalValue="duration"
      :sliderStyle="{ padding: 0 }"
    ></player-slider>
  </div>
</template>

<script>
import PlayerSlider from "../common/slider/index.vue";

export default {
  components: {
    PlayerSlider,
  },

  props: {
    // 是否显示该进度条
    show: {
      type: Boolean,
      default: true,
    },
    // 视频当前播放的时间秒
    currentTime: {
      type: Number,
      default: 0,
      required: true,
    },
    // 视频缓存了多长时间的视频
    cacheTime: {
      type: Number,
      default: 0,
      required: true,
    },
    // 视频总时长
    duration: {
      type: Number,
      default: 0,
      required: true,
    },
  },

  computed: {
    // 计算当前进度
    progress() {
      return this.currentTime / this.duration;
    },

    cacheProgress() {
      return this.cacheTime / this.duration;
    },

    maskProgressClass() {
      const statusClass = `mx-video-player__mask-progress_${
        this.show ? "show" : "hide"
      }`;
      return `mx-video-player__mask-progress ${statusClass}`;
    },
  },
};
</script>

<style lang="less">
@import "./style.less";
</style>
