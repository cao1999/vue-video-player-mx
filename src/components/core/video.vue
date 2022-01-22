<template>
  <div class="mx-video-player">
    <div
      class="mx-video-player__wrapper"
      :style="videoStyle"
      ref="videoWrapperRef"
      @mouseenter="mouseEnterScreen"
      @mousemove="mouseMoveScreen"
      @mouseleave="mouseLeaveScreen"
    >
      <!-- 组件核心标签video -->
      <video
        class="mx-video-player__core"
        ref="videoRef"
        :src="src"
        :loop="loop"
        :controls="false"
        :autoplay="autoPlay"
        :poster="poster"
        :muted="mute"
        :preload="preload"
        @click="clickScreen"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @seeked="onSeeked"
        @seeking="onSeeking"
        @playing="onPlaying"
        @waiting="onWaiting"
        @timeupdate="onTimeUpdate"
        @loadeddata="onFirstFrameLoaded"
        @loadedmetadata="onMetaDataLoaded"
        @progress="onDownloadResource"
        @ratechange="onRateChange"
        @volumechange="onVolumeChange"
        @durationchange="onDurationChange"
      ></video>

      <!-- 视频整屏的播放状态显示 -->
      <div class="mx-video-player__state" v-show="showStateIcon">
        <!-- TODO: 使用图标 -->
        <button
          type="button"
          class="icon-button mx-video-player__state-button"
          @click="play"
        ></button>
      </div>

      <!-- 视频弹幕组件 -->
      <div class="mx-video-player__screenShot"></div>

      <!-- 播放器控件 -->
      <video-controller
        :show="showControls"
        :video="$refs.videoRef"
        :videoWrapper="videoWrapperRef"
        :videoStatus="videoInfo.state"
        v-bind="{ ...videoInfo, ...controlsOptions }"
        :play="play"
        :mute="mute"
        :pause="pause"
        :screenStatus="screenStatus"
        :showControls="showControls"
        :toggleFullscreen="toggleFullscreen"
        :toggleWebFullscreen="toggleWebFullscreen"
        :toggleVideoStatus="toggleVideoStatus"
        @progressChange="progressChange"
      >
      </video-controller>

      <!-- controller隐藏后显示在底部的一个进度条，仅作为显示 -->
      <mask-progress :show="showMaskProgress" v-bind="videoInfo">
      </mask-progress>
    </div>
  </div>
</template>

<script>
import VideoController from "../controls/index.vue";
import MaskProgress from "../mask-progress/index.vue";
import { debounce, FullScreen } from "@/utils";

// 鼠标在视频上move事件的防抖函数
let mouseMoveDebounce = null;

/**
 * 自定义事件
 * play  视频播放事件
 * pause  视频暂停事件
 * ended  视频播放结束事件
 * playing
 * waiting
 * loadeddata
 * loadedmetadata
 * seeked
 * seeking
 * timeUpdate
 * enterFullscreen  进入全屏事件
 * cancelFullscreen  退出全屏事件
 * enterWebFullscreen  进入网页全屏事件
 * cancelWebFullscreen  退出网页全屏事件
 * rateChange  视频播放速率变化事件
 * volumeChange  视频音量变化事件
 * progressChange  视频进度发生变化事件，快进、拖动等操作
 */
export default {
  data() {
    return {
      // 网页全屏的状态
      webFullscreenStatus: false,
      // 全屏功能实例
      fullscreen: null,
      // 屏幕的状态，true为全屏，false相反
      screenStatus: false,
      // 是否显示controls
      showControls: false,
      // 是否显示屏幕上的视频state的icon
      showStateIcon: true,
      // 是否显示mask progress
      showMaskProgress: true,
      // 200ms内点击屏幕的次数
      clickScreenTimes: 0,
      // 点击屏幕的定时器
      clickScreenTimer: null,
      // videoWrapper dom
      videoWrapperRef: null,
      // 当前视频信息，将单独的属性整合起来，方便管理
      videoInfo: {
        // 当前的播放状态，false暂停，true播放
        state: false,
        // 当前播放的时间
        currentTime: 0,
        // 缓存的视频时间
        cacheTime: 0,
        // 视频的总时长
        duration: 0,
        // 视频是否已经播放结束了
        isFinished: false,
        // 视频音量
        // 视频播放速率
      },
    };
  },

  components: {
    VideoController,
    MaskProgress,
  },

  props: {
    src: {
      type: String,
      require: true,
    },
    width: {
      type: String,
      default: "800px",
    },
    height: {
      type: String,
      default: "300px",
    },
    controlsOptions: {
      type: Object,
      default: () => ({
        // 是否允许全屏，TODO: 仅仅是隐藏了全屏按钮，双击屏幕还是可以全屏
        enableFullscreen: true,
        // 是否允许网页全屏
        enableWebFullscreen: true,
        // 是否允许弹幕功能
        enableScreenShot: false,
        // 是否允许设置播放速率
        enablePlayRate: true,
        // 是否允许设置音量
        enableVolume: true,
        // 播放倍速选项
        playRateOptions: [2, 1.5, 1, 0.5],
      }),
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    poster: {
      type: String,
      default: "",
    },
    loop: {
      type: Boolean,
      default: false,
    },
    mute: {
      type: Boolean,
      default: false,
    },
    preload: {
      type: String,
      default: "auto",
    },
  },

  mounted() {
    const $video = this.$refs.videoRef;

    // 重要：给wrapper全屏，不是给video标签全屏
    this.fullscreen = new FullScreen(this.$refs.videoWrapperRef);

    // 注册全屏change的函数
    this.fullscreen.registerFullscreenChangeFunc((currScreenStatus) => {
      // 更新全屏状态变量
      this.screenStatus = currScreenStatus;

      if (currScreenStatus) {
        // 触发enterFullscreen自定义事件
        this.$emit("enterFullscreen");
      } else {
        // 触发cancelFullscreen自定义事件
        this.$emit("cancelFullscreen");
      }
    });

    // 注册全屏失败的函数
    this.fullscreen.registerFullscreenErrorFunc(() => {
      this.screenStatus = false;
    });

    this.videoWrapperRef = this.$refs.videoWrapperRef;

    // 监听空格事件，控制视频播放状态
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 32) {
        if (this.videoInfo.state) {
          this.pause();
        } else {
          this.play();
        }
      }
    });
  },

  computed: {
    videoStyle() {
      const { width, height } = this;
      return { width, height };
    },
  },

  methods: {
    // 鼠标进入播放器，隐藏maskProgress
    mouseEnterScreen() {
      this.showMaskProgress = false;
    },

    // 鼠标在播放器上移动
    mouseMoveScreen() {
      // 鼠标3s内不移动，controls隐藏
      !mouseMoveDebounce &&
        (mouseMoveDebounce = debounce(() => {
          this.hideControls();
        }, 3000));

      // 鼠标在播放器上移动时动态修改controls和mask-progress的显示状态
      !this.showControls && (this.showControls = true);
      this.showMaskProgress && (this.showMaskProgress = false);
      mouseMoveDebounce();
    },

    // 鼠标离开播放器，隐藏controls，显示maskProgress
    mouseLeaveScreen() {
      this.hideControls();
    },

    // 点击屏幕，判断是单击还是双击
    clickScreen() {
      this.clickScreenTimes += 1;
      if (this.clickScreenTimes === 1) {
        // 单击屏幕
        this.clickScreenTimer = setTimeout(() => {
          this.toggleVideoStatus();
          this.clickScreenTimes = 0;
        }, 200);
      } else if (this.clickScreenTimes === 2) {
        // 双击屏幕，只要开启屏幕全屏，双击会切换屏幕全屏的状态
        clearTimeout(this.clickScreenTimer);
        if (this.enableFullscreen) {
          this.toggleFullscreen();
        } else if (this.enableWebFullscreen) {
          this.toggleWebFullscreen();
        }
        this.clickScreenTimes = 0;
      }
    },

    // 隐藏controls组件的同时，显示mask-progress组件
    hideControls() {
      this.showControls = false;
      // 等controls隐藏后在显示maskProgress
      setTimeout(() => {
        this.showMaskProgress = true;
      }, 500);
    },

    // 切换视频播放状态，播放、暂停
    toggleVideoStatus() {
      const {
        videoInfo: { state, isFinished },
      } = this;

      if (state) {
        this.pause();
      } else {
        if (isFinished) {
          this.repeat();
        } else {
          this.play();
        }
      }
    },

    // 播放进度变化
    progressChange(progressInfo) {
      const { currentTime } = progressInfo;
      this.videoInfo.currentTime = currentTime;
      // 更新video标签currentTime的操作可能有防抖操作
      this.$refs.videoRef.currentTime = currentTime;
      // 触发progressChange自定义事件
      this.$emit("progressChange", progressInfo);
    },

    // 播放
    play() {
      const $video = this.$refs.videoRef;
      $video && $video.play();
      this.videoInfo.state = true;
      this.showStateIcon = false;
    },

    // 暂停
    pause() {
      const $video = this.$refs.videoRef;
      $video && $video.pause();
      this.videoInfo.state = false;
      this.showStateIcon = true;
    },

    // 重播
    repeat() {
      const $video = this.$refs.videoRef;
      // 重置视频时间
      $video.currentTime = 0;
      this.videoInfo = {
        ...this.videoInfo,
        currentTime: 0,
        isFinished: false,
      };
      this.play();
    },

    // 播放速率发生变化
    onRateChange() {
      const $video = this.$refs.videoRef;
      this.$emit("rateChange", $video.playbackRate);
    },

    // 音量发生改变
    onVolumeChange() {
      const $video = this.$refs.videoRef;
      this.$emit("volumeChange", $video.volume);
    },

    // 播放完成事件
    onEnded() {
      this.videoInfo = {
        ...this.videoInfo,
        state: false,
        isFinished: true,
      };
      // 触发finish自定义事件
      this.$emit("ended");
    },

    // 开始播放事件
    onPlay() {
      // 触发play自定义事件
      this.$emit("play", this.videoInfo);
    },

    // 暂停播放事件
    onPause() {
      // 触发pause自定义事件
      this.$emit("pause", this.videoInfo);
    },

    // 视频第一帧资源被加载触发
    onFirstFrameLoaded() {
      this.$emit("loadeddata");
    },

    onMetaDataLoaded() {
      this.$emit("loadedmetadata");
    },

    // 跳转操作完成时执行，相当于手动跨度大的更新currentTime
    onSeeked() {
      this.$emit("seeked", this.videoInfo);
    },

    // 跳转操作开始时执行
    onSeeking() {
      this.$emit("seeking", this.videoInfo);
    },

    // 由于缺少资源导致的播放停止后重新播放，就是视频卡住后又开始播放
    onPlaying() {
      this.$emit("playing", this.videoInfo);
    },

    // 由于缺少资源导致视频暂停播放，卡住了
    onWaiting() {
      this.$emit("waiting", this.videoInfo);
    },

    // 下载视频资源，就是已经缓存下来的资源
    onDownloadResource() {
      // 获取到总时长后，在计算缓存
      if (this.videoInfo.duration <= 0) {
        return;
      }

      const $video = this.$refs.videoRef;
      const buffered = $video.buffered;
      let maxEndTime = 0;

      // 遍历buffered，取出缓冲的最大时间
      for (let i = 0; i < buffered.length; i++) {
        // 获取某个缓冲的某个时间段的结束时间，最终取最大的
        const endTime = buffered.end(i) || 0;
        maxEndTime = Math.max(endTime, maxEndTime);
      }

      this.videoInfo.cacheTime = maxEndTime;

      // 触发下载资源的自定义事件
      this.$emit("downloadResource", maxEndTime);
    },

    // video.currentTime变化时执行，视频只要播放就会发生变化
    onTimeUpdate() {
      this.videoInfo.isFinished && (this.videoInfo.isFinished = false);
      const currentTime = this.$refs.videoRef.currentTime;
      this.videoInfo.currentTime = currentTime;
      this.$emit("timeUpdate", this.videoInfo);
    },

    // 总时长发生变化„
    onDurationChange() {
      this.videoInfo.duration = this.$refs.videoRef.duration;
      this.$emit("durationchange", this.videoInfo);
    },

    // 全屏和非全屏切换
    toggleFullscreen() {
      if (this.screenStatus) {
        this.cancelFullscreen();
      } else {
        this.enterFullscreen();
      }
      return this.screenStatus;
    },

    // 全屏
    enterFullscreen() {
      this.fullscreen.enterFullscreen();
    },

    // 退出全屏
    cancelFullscreen() {
      this.fullscreen.cancelFullscreen();
    },

    /**
     * 网页全屏切换
     * @param {callback} callback 网页全屏切换的回调，参数是当前网页全屏的状态
     */
    toggleWebFullscreen(callback) {
      if (this.screenStatus) {
        return;
      }

      if (this.webFullscreenStatus) {
        this.cancelWebFullscreen();
      } else {
        this.enterWebFullscreen();
      }

      callback && callback(this.webFullscreenStatus);
    },

    // 进入网页全屏
    enterWebFullscreen() {
      const videoWrapper = this.$refs.videoWrapperRef;
      if (videoWrapper) {
        videoWrapper.classList.add("web-fullscreen");
        this.webFullscreenStatus = true;
        // 触发enterWebFullscreen自定义事件
        this.$emit("enterWebFullscreen");
      }
    },

    // 取消网页全屏
    cancelWebFullscreen() {
      const videoWrapper = this.$refs.videoWrapperRef;
      if (videoWrapper) {
        videoWrapper.classList.remove("web-fullscreen");
        this.webFullscreenStatus = false;
        // 触发cancelWebFullscreen自定义事件
        this.$emit("cancelWebFullscreen");
      }
    },
  },
};
</script>

<style lang="less">
@import "@/assets/css/global.less";
@import "./style.less";
</style>
