<template>
  <!-- 网页全屏  -->
  <div class="mx-video-player__btn-wrapper mx-video-player__webfullscreen">
    <button
      type="button"
      class="mx-video-player__btn"
      @click="switchWebFullscreen"
    >
      {{ screenStatus ? "取消网页全屏" : "网页全屏" }}
    </button>

    <div class="mx-video-player__btn-menu mx-video-player__webfullscreen-menu">
      {{ screenStatus ? "取消网页全屏" : "网页全屏" }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenStatus: false,
    };
  },

  props: {
    toggleWebFullscreen: {
      type: Function,
      default: null,
    },
  },

  computed: {
    webFullscreenIconClass() {
      // TODO: 使用图标
      return `bi bi-arrows-angle-${this.screenStatus ? "contract" : "expand"}`;
    },
  },

  methods: {
    switchWebFullscreen() {
      this.toggleWebFullscreen((newStatus) => {
        this.screenStatus = newStatus;
      });
    },
  },
};
</script>

<style>
/* 实现网页全屏的class */
.web-fullscreen {
  position: fixed !important;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999999;
  margin: auto;
  width: 100vw !important;
  height: 100vh !important;
}
</style>
