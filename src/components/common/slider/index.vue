<template>
  <!-- 进度条 -->
  <div :style="sliderStyle" :class="sliderWrapperClass">
    <div
      class="mx-slider-railway"
      ref="railway"
      @mouseenter="sliderMouseover"
      @mouseleave="sliderMouseleave"
      @mousedown="sliderMousedown"
      @mouseup="sliderMouseup"
      @mousemove="sliderMousemove"
    >
      <!-- 视频当前播放进度显示条 -->
      <div class="mx-slider-railway__current" :style="progressStyle"></div>

      <!-- 视频缓存进度显示条 -->
      <div
        v-if="showCacheBar"
        class="mx-slider-railway__cache"
        :style="cacheProgressStyle"
      ></div>

      <!-- 鼠标所指位置popover -->
      <div
        class="mx-slider-railway__popover"
        v-if="showPopover"
        v-show="showSlideBlock"
        :style="{ left: popoverPos }"
      >
        {{ formatHoverToastText }}
      </div>

      <!-- 滑块 -->
      <slider-block
        v-if="ifShowSliderBlock"
        :show="alwaysShowSlideBlock || showSlideBlock"
        :railway="railway"
        :progress="progress"
        @blockMove="blockMove"
        @blockMouseDown="blockDown"
        @blockMouseUp="blockUp"
      ></slider-block>
    </div>
  </div>
</template>

<script>
import { progressValidator, cacheProgressValidator } from "@/utils";
import SliderBlock from "./slideBlock.vue";

/**
 * 组件事件
 * endClickSlider  点击slider鼠标抬起后执行
 * change  slider进度变化时执行，拖动滑块或者点击slider
 * startChange  鼠标按下开始更新进度事件
 * endChange  鼠标抬起结束更新进度事件
 * hoverMove 鼠标在slider上移动事件
 */
export default {
  data() {
    return {
      showSlideBlock: false,
      popoverPos: 0,
      popoverTextInside: 0,
      railway: null,
      railwayWidth: 0,
      // 当前railway的clientRect对象
      railwayRect: {},
    };
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
      validator: cacheProgressValidator,
    },
    sliderStyle: {
      type: Object,
      default: null,
    },
    // popover Text
    popoverText: {
      type: String,
      default: "",
    },
    // 总值
    totalValue: {
      type: Number,
      default: 100,
    },
    // 是否显示slider block，表示block节点是否出现在dom中
    ifShowSliderBlock: {
      type: Boolean,
      default: true,
    },
    // 是否需要一直显示block，如果为false则通过mouseover等事件控制block的显示
    alwaysShowSlideBlock: {
      type: Boolean,
      default: true,
    },
    // 是否显示popover
    showPopover: {
      type: Boolean,
      default: false,
    },
    showCacheBar: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    this.railway = this.$refs.railway;
  },

  components: {
    SliderBlock,
  },

  computed: {
    // 更新当前进度div的style
    progressStyle() {
      const style = {};
      style.width = `${this.getProgress() * 100}%`;
      return style;
    },

    // 更新缓存进度div的style
    cacheProgressStyle() {
      const style = {};
      style.width = `${this.getProgress("cache") * 100}%`;
      return style;
    },

    /* slider外层布局div */
    sliderWrapperClass() {
      // TODO: hover时是否修改slider的高度
      return `mx-slider`;
    },

    // 整理hover toast的时间格式
    formatHoverToastText() {
      const { popoverText, popoverTextInside } = this;
      // 优先使用prop的popoverText
      return popoverText || popoverTextInside;
    },
  },

  methods: {
    getProgress(type = "current") {
      let progress = 0;

      if (type === "current") {
        progress = this.progress;
      } else if (type === "cache") {
        progress = this.cacheProgress;
      }

      if (progress < 0) {
        progress = 0;
      } else if (progress > 1) {
        progress = 1;
      }

      return progress;
    },

    // 鼠标进入slider
    sliderMouseover(e) {
      e.stopPropagation();
      const { clientX } = e;
      this.showSlideBlockEl();
      // 获取railway元素的clientRect对象
      const clientRect = this.$refs.railway.getBoundingClientRect();
      this.railwayRect = clientRect;
      this.updatePopoverPos(clientX - clientRect.left);
    },

    // 鼠标离开slider
    sliderMouseleave(e) {
      e.stopPropagation();
      this.hideSlideBlockEl();
    },

    // 点击进度条，会更新当前进度条位置
    sliderMousedown(e) {
      e.stopPropagation();
      const { $refs } = this;
      // 获取railway元素在视口的位置
      const { left } = $refs.railway.getBoundingClientRect();
      // 获取点击的位置
      const clickPos = e.clientX;
      // 当前点击位置相对于railway左侧的距离
      const railwayCurrentWidth = clickPos - left;
      // 获取进度条的总宽度
      const railwayWidth = $refs.railway.clientWidth;
      // 执行回调
      this.$emit("change", railwayCurrentWidth / railwayWidth);
      this.$emit("startChange");
    },

    sliderMouseup(e) {
      const { left } = this.railwayRect;
      const railwayCurrentWidth = e.clientX - left;
      // 获取进度条的总宽度
      const railwayWidth = this.$refs.railway.clientWidth;
      this.$emit("endChange", railwayCurrentWidth / railwayWidth);
    },

    // 鼠标在slider上移动，显示popover并实时更新其位置
    sliderMousemove(e) {
      // e.stopPropagation(); 这里不能禁止冒泡，因为window上也有move事件
      if (this.alwaysShowSlideBlock) {
        return;
      }

      const { clientX } = e;
      const {
        updatePopoverPos,
        railwayWidth,
        railwayRect: { left },
      } = this;
      const railwayCurrentWidth = clientX - left;
      const percent = railwayCurrentWidth / railwayWidth;
      this.popoverTextInside = percent * this.totalValue;

      updatePopoverPos(percent);
      this.$emit("hoverMove", percent);
    },

    // 更新popover的位置
    updatePopoverPos(percent) {
      this.popoverPos = percent * 100 + "%";
    },

    showSlideBlockEl() {
      if (this.alwaysShowSlideBlock) {
        return;
      }

      this.showSlideBlock = true;
      this.railwayWidth = this.railway.clientWidth;
    },

    hideSlideBlockEl() {
      // 当alwaysShowSlideBlock为true时表示需要一直显示block，因此不需要动态更新block的状态了
      if (this.alwaysShowSlideBlock) {
        return;
      }

      this.showSlideBlock = false;
    },

    blockDown(percent) {
      this.$emit("startChange", percent);
    },

    // 拖动滑动，鼠标移动的回调
    blockMove(percent) {
      this.$emit("change", percent);
      this.updatePopoverPos(percent);
      !this.showSlideBlock && (this.showSlideBlock = true);
    },

    /**
     * 滑块抬起的回调
     * @param {number} percent 滑块相对slider的比例
     */
    blockUp(percent) {
      !this.showSlideBlock && (this.showSlideBlock = false);
      this.$emit("endChange", percent);
    },
  },
};
</script>

<style lang="less">
@import "./style.less";
</style>
