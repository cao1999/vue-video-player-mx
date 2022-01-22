<template>
  <!-- 视频播放的进度条 -->
  <player-slider
    :progress="progress"
    :cacheProgress="cacheProgress"
    :showPopover="true"
    :popoverText="sliderPopOverText"
    :totalValue="duration"
    :alwaysShowSlideBlock="false"
    @change="progressChange"
    @hoverMove="onHoverMove"
    @startChange="progressStartChange"
    @endChange="progressEndChange"
  ></player-slider>
</template>

<script>
import PlayerSlider from "@/components/common/slider/index.vue";
import { progressValidator, cacheProgressValidator, formatTime } from "@/utils";

/**
 * emit事件
 * change 监听滚动条变化事件
 */
export default {
  data() {
    return {
      sliderPopOverText: "",
    };
  },
  components: {
    PlayerSlider,
  },

  props: {
    progress: {
      type: Number,
      default: 0,
      required: true,
      validator: progressValidator,
    },
    cacheProgress: {
      type: Number,
      default: 0,
      required: true,
      validator: cacheProgressValidator,
    },
    onChange: {
      type: Function,
      default: () => {},
    },
    play: {
      type: Function,
      default: () => {},
    },
    pause: {
      type: Function,
      default: () => {},
    },
    currentTime: {
      type: Number,
      default: 0,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    progressStartChange() {
      this.pause && this.pause();
    },

    progressChange(percent) {
      const { duration } = this;

      // 进度变化后更新currentTime
      this.$emit("change", {
        percent,
        currentTime: percent * duration,
        duration,
      });
    },

    progressEndChange() {
      this.play && this.play();
    },

    // 监听鼠标在slider上move的事件，动态修改popoverText
    onHoverMove(percent) {
      this.sliderPopOverText = formatTime(percent * this.duration);
    },
  },
};
</script>

<style></style>
