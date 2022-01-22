<template>
  <!-- 屏幕全屏  -->
  <div class="mx-video-player__btn-wrapper mx-video-player__fullscreen">
    <!-- TODO: 使用图标 -->
    <button type="button" class="mx-video-player__btn" @click="fullscreen">
      {{ screenStatus ? "取消全屏" : "全屏" }}
    </button>

    <div class="mx-video-player__btn-menu mx-video-player__fullscreen-menu">
      {{ screenStatus ? "取消全屏" : "全屏" }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 更改全屏状态
    toggleFullscreen: {
      type: Function,
      default: () => {},
    },
    // 全屏状态，由上级组件控制
    screenStatus: {
      type: Boolean,
      default: true,
      required: true,
    },
  },

  computed: {
    screenStatusClass() {
      // TODO: 使用图标
      return `bi bi-fullscreen${this.screenStatus ? "-exit" : ""}`;
    },
  },

  methods: {
    fullscreen() {
      this.toggleFullscreen();
    },
  },
};
</script>

<style></style>
