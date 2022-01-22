<script>
import PcVideoController from "./pc/index.vue";

export default {
  name: "VideoController",
  components: {
    PcVideoController,
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
      default: true,
    },
    enableScreenShot: {
      type: Boolean,
      default: false,
    },
    enableVolume: {
      type: Boolean,
      default: true
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
  methods: {
    progressChange(percent) {
      // 作用是将progress组件的值向上传递
      this.$emit("progressChange", percent);
    },
  },
  render: function (createElement) {
    /* TODO: 移动端和pc端的controller组件不同 */
    return createElement(PcVideoController, {
      props: this.$props,
      on: {
        progressChange: this.progressChange,
      },
    });
  },
};
</script>
