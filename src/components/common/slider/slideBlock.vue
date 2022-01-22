<template>
  <!-- 进度条的滑块 -->
  <div
    class="mx-slider-railway__block"
    :style="blockStyle"
    v-show="show"
    @mousedown="blockMouseDown"
  ></div>
</template>

<script>
import { progressValidator } from "@/utils";

// 进度条的宽度
let sliderWidth = 0;
// 滑块的当前位置
let blockPos = 0;
let startPos = 0;
let endPos = 0;
let relativeStartPos = 0;
// 鼠标水平移动的距离
let moveDis = 0;

export default {
  props: {
    // 当前slider的进度，0 - 1
    progress: {
      type: Number,
      default: 0,
      required: true,
      validator: progressValidator,
    },
    // 是否显示block
    show: {
      type: Boolean,
      default: true,
    },
    // 轨道dom元素
    railway: {
      type: Element,
      default: null,
    },
  },

  computed: {
    // 更新滑块的style
    blockStyle() {
      const style = {};
      let progress = this.progress;

      if (this.progress > 1) {
        progress = 1;
      } else if (this.progress < 0) {
        progress = 0;
      }

      style.left = `calc(${progress} * 100%)`;
      return style;
    },
  },

  methods: {
    // 滑块上鼠标点击事件
    blockMouseDown(e) {
      e.stopPropagation();

      if (!this.railway) {
        return;
      }

      // 记录进度条的宽度
      sliderWidth = this.railway.clientWidth;
      startPos = e.clientX;
      blockPos = this.progress * sliderWidth;
      relativeStartPos = blockPos;

      const percent = blockPos / sliderWidth;
      // 点击block时，执行回调
      this.$emit("blockMouseDown", percent);

      // 当按下block后监听mousemove和mouseup事件，获取鼠标移动的距离
      window.addEventListener("mousemove", this.windowMouseMove);
      window.addEventListener("mouseup", this.windowMouseUp);
    },

    windowMouseMove(e) {
      e.stopPropagation();
      endPos = e.clientX;
      moveDis = endPos - startPos;
      blockPos = relativeStartPos + moveDis;

      if (blockPos >= sliderWidth) {
        blockPos = sliderWidth;
      } else if (blockPos <= 0) {
        blockPos = 0;
      }

      // 滑块移动中，执行blockMove回调
      this.$emit("blockMove", blockPos / sliderWidth);
    },

    windowMouseUp(e) {
      e.stopPropagation();
      this.$emit("blockMouseUp", blockPos / sliderWidth);

      // 松开鼠标后，移除这些事件
      window.removeEventListener("mousemove", this.windowMouseMove);
      window.removeEventListener("mouseup", this.windowMouseUp);
    },
  },
};
</script>
