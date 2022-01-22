<template>
  <!-- 视频控件 -->
  <div :class="controlsClass">
    <!-- 控件区的第一层，主要是进度条 -->
    <div class="mx-video-player__controls-top">
      <div class="mx-video-player__progress">
        <progress-slider
          :progress="calcProgress"
          :cacheProgress="calcCacheProgress"
          :play="play"
          :pause="pause"
          :currentTime="currentTime"
          :duration="duration"
          @change="progressChange"
        ></progress-slider>
      </div>
    </div>

    <!-- 控件区的第二层，主要是各种设置 -->
    <div class="mx-video-player__controls-bottom">
      <!-- 左侧的设置选项 -->
      <div class="mx-video-player__controls-bottom--left">
        <div class="mx-video-player__btn-wrapper">
          <!-- TODO: 使用图标 -->
          <button
            type="button"
            @click="toggleVideoStatus"
            class="mx-video-player__btn"
          >
            {{ videoStatus ? "播放" : "暂停" }}
          </button>
        </div>
        <!-- 当前时间/总时间 -->
        <time-panel
          :currentTime="currentTime"
          :totalTime="duration"
        ></time-panel>
      </div>
      <!-- 右侧的设置选项 -->
      <div class="mx-video-player__controls-bottom--right">
        <shot-screen v-if="enableScreenShot"></shot-screen>
        <volume-control
          v-if="enableVolume"
          :showControls="show"
          :video="video"
          :mute="mute"
          @volumeChange="onVolumeChange"
        ></volume-control>
        <speed-control
          v-if="enablePlayRate"
          :video="video"
          :playRateOptions="playRateOptions"
          @rateChange="onRateChange"
        ></speed-control>
        <web-fullscreen
          v-if="enableWebFullscreen"
          :toggleWebFullscreen="toggleWebFullscreen"
        ></web-fullscreen>
        <fullscreen-control
          v-if="enableFullscreen"
          :toggleFullscreen="toggleFullscreen"
          :screenStatus="screenStatus"
        ></fullscreen-control>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressSlider from "./progress.vue";
import VolumeControl from "./volume.vue";
import FullscreenControl from "./fullscreen.vue";
import TimePanel from "./time.vue";
import SpeedControl from "./speed.vue";
import WebFullscreen from "./webFullscreen.vue";
import ShotScreen from "./shot-screen-switch";

export default {
  name: "PcVideoController",

  data() {
    return {
      // 当前视频是否静音
      isMuted: false,
      // 播放总时间
      totalTime: 0,
      //
      currentProgress: 0,
      // 判断组件是不是第一次加载，主要是为了实现第一次加载取消组件的动画效果
      isFirstLoad: true,
    };
  },

  components: {
    ProgressSlider,
    VolumeControl,
    TimePanel,
    SpeedControl,
    FullscreenControl,
    WebFullscreen,
    ShotScreen,
  },

  props: {
    video: {
      type: HTMLVideoElement,
      default: null,
    },
    videoWrapper: {
      type: Element,
      default: null,
    },
    videoStatus: {
      type: Boolean,
      default: false,
    },
    // 是否显示controls组件
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    screenStatus: {
      type: Boolean,
      default: false,
      required: true,
    },
    isFinished: {
      type: Boolean,
      default: false,
    },
    enableFullscreen: {
      type: Boolean,
      default: true,
    },
    enableWebFullscreen: {
      type: Boolean,
      default: false,
    },
    enableScreenShot: {
      type: Boolean,
      default: false,
    },
    enableVolume: {
      type: Boolean,
      default: true,
    },
    enablePlayRate: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    mute: {
      type: Boolean,
      default: false,
    },
    currentTime: {
      type: Number,
      default: 0,
      required: true,
    },
    cacheTime: {
      type: Number,
      default: 0,
      required: true,
    },
    toggleFullscreen: {
      type: Function,
      default: () => {},
    },
    toggleWebFullscreen: {
      type: Function,
      default: () => {},
    },
    toggleVideoStatus: {
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
    onRateChange: {
      type: Function,
      default: () => {},
    },
    onVolumeChange: {
      type: Function,
      default: () => {},
    },
    playRateOptions: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    // 当前视频播放状态
    videoStatusClass() {
      const status = this.videoStatus
        ? "pause"
        : this.isFinished
        ? "repeat"
        : "play";

      // TODO: 使用图标
      return `bi bi-${status}-fill`;
    },

    controlsClass() {
      let animation = `mx-video-player__controls_${
        this.show ? "show" : "hide"
      }`;

      // 第一次加载取消动画效果
      animation = this.isFirstLoad ? "" : animation;
      this.isFirstLoad = false;

      return `mx-video-player__controls ${animation}`;
    },

    // 计算当前视频播放进度
    calcProgress() {
      return this.currentTime / this.duration || 0;
    },

    // 计算当前视频缓存的进度
    calcCacheProgress() {
      // 0/0 => NaN
      return this.cacheTime / this.duration || 0;
    },
  },

  methods: {
    progressChange(progressInfo) {
      // 当进度条进度发生变化时更新currentTime
      this.$emit("progressChange", progressInfo);
    },
  },

  // 监听
  watch: {
    videoStatus(newStatus) {
      this.videoStatus = newStatus;
    },

    isFinished(newStatus) {
      this.isFinished = newStatus;
    },
  },
};
</script>

<style lang="less">
@import "./style.less";
</style>
