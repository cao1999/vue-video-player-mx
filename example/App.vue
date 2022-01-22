<template>
  <div class="player">
    <video-player
      :src="'https://1251316161.vod2.myqcloud.com/007a649dvodcq1251316161/aaea48415285890816071408130/ckc0XDawqmgA.mp4'"
      :loop="false"
      :width="'800px'"
      :height="'500px'"
      @play="onPlay"
      @pause="onPause"
      @ended="onFinish"
      @seeked="onSeeked"
      @timeUpdate="onTimeUpdate"
      @rateChange="onRateChange"
      @volumeChange="onVolumeChange"
      @progressChange="onProgressChange"
      @downloadResource="onDownloadResource"
      @enterFullscreen="onEnterFullscreen"
      @cancelFullscreen="onCancelFullscreen"
      @enterWebFullscreen="onEnterWebFullscreen"
      @cancelWebFullscreen="onCancelWebFullscreen"
    ></video-player>
  </div>
</template>

<script>
// import VideoPlayer from "../src/index";
// import VideoPlayer from "../dist/vue-video-player-mx";
import VideoPlayer from "vue-video-player-mx";
// 引入video组件的css
import "vue-video-player-mx/dist/index.css";

// https://1251316161.vod2.myqcloud.com/007a649dvodcq1251316161/aaea48415285890816071408130/ckc0XDawqmgA.mp4

export default {
  components: {
    VideoPlayer,
  },

  methods: {
    onPlay(info) {
      console.log("视频开始播放了...", info.currentTime);
    },

    onPause(info) {
      console.log("视频暂停播放了...", info.currentTime);
    },

    onFinish() {
      console.log("视频播放完毕了...");
    },

    onRateChange(rate) {
      console.log("视频播放速率变化了，当前速率是", rate);
    },

    onVolumeChange(volume) {
      console.log("视频音量变化了，当前音量是", volume);
    },

    onProgressChange(progress) {
      console.log("视频进度变化了，当前进度是", progress);
    },

    onEnterFullscreen() {
      console.log("进入全屏模式");
    },

    onCancelFullscreen() {
      console.log("退出全屏模式");
    },

    onEnterWebFullscreen() {
      console.log("进入网页全屏");
    },

    onCancelWebFullscreen() {
      console.log("退出网页全屏");
    },

    onSeeked(info) {
      console.log("跳转操作结束", info.currentTime);
    },

    onDownloadResource() {
      console.log("加载资源");
    },

    onTimeUpdate(info) {
      console.log("视频播放中", info.currentTime);
    },
  },
};
</script>

<style>
.player {
  position: absolute;
  top: 50%;
  left: 50%;
  /* transform: translate3d(-50%, -50%, 0); */
  margin-left: -400px;
  margin-top: -250px;
  width: 800px;
  height: 500px;
}
</style>
