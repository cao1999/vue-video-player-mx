## 介绍

以学习为目的开发了该`vue`视频组件

## 安装

```bash
npm i vue-video-player-mx --save
```

## 示例

```html
<template>
  <video-player
    :src="'https://1251316161.vod2.myqcloud.com/007a649dvodcq1251316161/aaea48415285890816071408130/ckc0XDawqmgA.mp4'"
    :loop="false"
    :width="'800px'"
    :height="'500px'"
    @play="onPlay"
    @pause="onPause"
    @ended="onFinish"
  ></video-player>
</template>

<script>
  // 引入VideoPlayer组件
  import VideoPlayer from "vue-video-player-mx";
  // 重要：引入video组件的css
  import "vue-video-player-mx/dist/index.css";

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
    },
  };
</script>
```

## Props

| 属性名          | 描述                                 | 默认值                                                                                                                                                           | 类型      | 是否必填 |
| --------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- |
| src             | 视频资源地址                         | `''`                                                                                                                                                             | `string`  | `true`   |
| poster          | 视频封面图                           | `''`                                                                                                                                                             | `string`  | `false`  |
| muted           | 是否静音                             | `false`                                                                                                                                                          | `boolean` | `false`  |
| loop            | 是否循环播放                         | `true`                                                                                                                                                           | `boolean` | `false`  |
| autoPlay        | 是否自动播放                         | `false`                                                                                                                                                          | `boolean` | `false`  |
| preload         | 是否预加载视频资源                   | `auto`                                                                                                                                                           | `string`  | `false`  |
| controls        | 是否显示 controls 组件               | `true`                                                                                                                                                           | `boolean` | `false`  |
| width           | 视频组件宽度                         | `700px`                                                                                                                                                          | `string`  | `false`  |
| height          | 视频组件高度                         | `500px`                                                                                                                                                          | `string`  | `false`  |
| supportMobile   | 是否适配移动端                       | `true`                                                                                                                                                           | `boolean` | `false`  |
| controlsOptions | control 组件的选项                   | `{enableFullscreen: true, enableWebFullscreen: true, enableVolume: true, enableShotScreen: false, enableSpeedSetting: true, playSpeedOptions: [2, 1.5, 1, 0.5]}` | `object`  | `false`  |
| customizeStyle  | 自定义视频滚动条和 controls 的背景色 | `{}`                                                                                                                                                             | `object`  | `false`  |

## Events

| 事件名              | 描述                                                                 | 示例                     |
| ------------------- | -------------------------------------------------------------------- | ------------------------ |
| play                | 视频由暂停状态变成播放状态时触发                                     | `() => {}`               |
| pause               | 视频由播放状态变成暂停状态时触发                                     | `() => {}`               |
| ended               | 视频播放结束时触发                                                   | `() => {}`               |
| playing             | 由于缺少数据导致暂停播放，再次播放时执行。就是卡了一下，继续播放     | `() => {}`               |
| waiting             | 由于缺少数据导致暂停播放时执行，就是卡了                             | `() => {}`               |
| timeUpdate          | video 标签的 currentTime 更新时触发                                  |                          |
| loadeddata          | 视频第一帧资源加载完成时执行                                         | `() => {}`               |
| loadedmetadata      | 视频元数据加载完后后执行，元数据包括时长、尺寸（仅视频）以及文本轨道 | `(duration, size) => {}` |
| seeked              | 当视频进度发生跳转后触发                                             | `() => {}`               |
| seeking             | 视频进度发生跳转时触发                                               | `() => {}`               |
| enterFullscreen     | 进入全屏时触发                                                       | `() => {}`               |
| cancelFullscreen    | 退出全屏时触发                                                       | `() => {}`               |
| enterWebFullscreen  | 进入网页全屏时触发                                                   | `() => {}`               |
| cancelWebFullscreen | 退出网页全屏时触发                                                   | `() => {}`               |
| rateChange          | 播放倍速变化时触发，`speed`参数表示变化后的倍速                      | `(rate) => {}`           |
| volumeChange        | 音量变化时触发，`volume`参数表示变化后的音量                         | `(volume) => {}`         |
| progressChange      | 播放进度发生变化时触发                                               | `() => {}`               |
| downloadResource    | 下载视频资源时触发，资源是一段一段的下载的                           | `() => {}`               |
