<template>
  <!-- 视频播放的时间和总时间 -->
  <div class="mx-video-player__btn-wrapper">
    <button class="mx-video-player__btn mx-video-player__time">
      <span class="mx-video-player__time-current">{{ formatCurrentTime }}</span>
      <span class="mx-video-player__time-divider">&nbsp;/&nbsp;</span>
      <span class="mx-video-player__time-total">{{ formatTotalTime }}</span>
    </button>
  </div>
</template>

<script>
import { formatTime } from "@/utils";

export default {
  props: {
    currentTime: {
      type: Number,
      default: 0,
      required: true,
    },
    totalTime: {
      type: Number,
      default: 0,
      required: true,
    },
  },

  computed: {
    /* 当前时间 */
    formatCurrentTime() {
      return formatTime(this.currentTime);
    },

    /* 总时长 */
    formatTotalTime() {
      return formatTime(this.totalTime);
    },
  },
};
</script>

<style>
.mx-video-player__time {
  display: flex;
  align-items: center;
  color: #ddd;
  font-size: 14px;
  letter-spacing: 1px;
}

.mx-video-player__time:hover button {
  color: #fff;
}
</style>
