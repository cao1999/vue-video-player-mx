<template>
  <!-- 视频音量调节 -->
  <div
    class="mx-video-player__btn-wrapper mx-video-player__volume"
    @mouseenter="showVolumeSlider"
    @mouseleave="hideVolumeSlider"
  >
    <!-- 音量的图标 -->
    <button
      class="mx-video-player__btn mx-video-player__volume-btn"
      type="button"
      @click="toggleMute"
    >
      音量
    </button>
    <!-- 音量的slider -->
    <div :class="volumeSliderClass">
      <player-slider
        :progress="volume"
        :showCacheBar="false"
        :showSlideBlock="true"
        @change="changeVolume"
        @endChange="endChangeVolume"
        @startChange="startChangeVolume"
      ></player-slider>
    </div>
  </div>
</template>

<script>
import PlayerSlider from "@/components/common/slider/index.vue";

/**
 * emit事件
 * volumeChange  音量变化事件
 */
export default {
  data() {
    return {
      // false隐藏，true相反
      volumeSliderStatus: false,
      // 音量，默认是0.5
      volume: 0.5,
      // 音量的上一个状态
      lastVolume: 0.5,
      // 在提高音量还是降低音量
      volumeStatus: "off",
      // 是否静音
      isMute: false,
      // 鼠标的范围是否超出音量组件本身
      isOverflow: false,
    };
  },

  components: {
    PlayerSlider,
  },

  props: {
    showControls: {
      type: Boolean,
      default: false,
      required: true,
    },
    video: {
      type: HTMLVideoElement,
      default: null,
    },
    mute: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    // slider的class
    volumeSliderClass() {
      let animationClass = "";

      // 判断是不是组件初始化，初始化不显示动画效果
      if (typeof this.volumeSliderStatus === "boolean") {
        animationClass = `mx-video-player__volume-slider--${
          this.volumeSliderStatus ? "show" : "hide"
        }`;
      }

      return `mx-video-player__volume-slider ${animationClass}`;
    },
  },

  mounted() {
    // TODO: 触发emit时机
    // 初始化视频的音量
    const volume =
      JSON.parse(localStorage.getItem("mx-video-player-volume")) || 0.5;
    this.lastVolume = volume;
    this.changeVolume(volume, false);
  },

  methods: {
    showVolumeSlider(e) {
      e.stopPropagation();
      if (this.volumeSliderStatus) return;

      this.isOverflow = false;
      this.volumeSliderStatus = true;
    },

    // TODO: 需不需要防抖操作
    hideVolumeSlider(e) {
      e.stopPropagation();
      this.isOverflow = true;
      this.volumeSliderStatus = false;
    },

    startChangeVolume(percent) {},

    // 结束调整音量
    endChangeVolume(percent) {
      this.volumeStatus = percent <= 0 ? "mute" : "off";
      this.lastVolume = percent;
      // 音量调节结束后隐藏音量的silder
      this.isOverflow && (this.volumeSliderStatus = false);
      // 将当前音量存到本地
      localStorage.setItem("mx-video-player-volume", percent);
    },

    /**
     * 改变音量，滑动slider中改变
     * @param {number} percent 当前位置相对于轨道的百分比　0-1
     * @param {boolean} switchIcon　是否替换icon
     */
    changeVolume(percent, switchIcon = true) {
      // 更改音量图标
      let volumeStatus = "";
      if (percent <= 0) {
        volumeStatus = "mute";
      } else if (percent < this.volume) {
        volumeStatus = "down";
      } else if (percent > this.volume) {
        volumeStatus = "up";
      }

      switchIcon &&
        percent !== this.volume &&
        (this.volumeStatus = volumeStatus);
      // 滑动过程中不隐藏音量的slider
      this.volumeSliderStatus = true;
      const volume = Number(percent.toFixed(2));
      // 给video元素设置音量
      this.video && (this.video.volume = volume);
      this.volume = volume;
      // 执行调整音量的回调
      console.log(123456, volume);
      this.$emit("volumeChange", volume);
    },

    // 静音非静音切换
    toggleMute() {
      let volume = 0;
      if (this.isMute) {
        volume = this.lastVolume;
      }

      this.isMute = !this.isMute;
      this.changeVolume(volume, false);
      this.volumeStatus = this.isMute ? "mute" : "off";
    },
  },

  watch: {
    // 当controls bar显示的时候，volume slider的隐藏不是用动画
    showControls(status) {
      if (status) {
        this.volumeSliderStatus = "";
      }
    },
    mute: {
      handler(isMute) {
        isMute && this.changeVolume(0, false);
        this.isMute = isMute;
      },
      immediate: true,
    },
  },
};
</script>
