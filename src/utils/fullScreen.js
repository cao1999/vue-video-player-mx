/**
 * 封装元素全屏的类
 * @param {Object} $node 需要全屏的元素
 */
export function FullScreen($node) {
  const { prefix, fullscreenEnabled } = getFullscreenInfo();

  // 当前浏览器的前缀
  this.prefix = prefix;
  // 当前浏览器是否支持全屏
  this.fullscreenEnabled = fullscreenEnabled;
  // 需要全屏的元素
  this.$node = $node;
  // 全屏的状态，true为全屏，false相反
  this.screenStatus = false;

  /**
   * 获取当前浏览器fullscreen的信息
   * @return {Object}
   */
  function getFullscreenInfo() {
    let fullscreenEnabled = false;
    let prefix = "";

    // 兼容不同浏览器
    if (document.fullscreenEnabled) {
      fullscreenEnabled = document.fullscreenEnabled;
    } else if (document.webkitFullscreenEnabled) {
      fullscreenEnabled = document.webkitFullscreenEnabled;
      prefix = "webkit";
    } else if (document.mozFullscreenEnabled) {
      fullscreenEnabled = document.mozFullscreenEnabled;
      prefix = "moz";
    } else if (document.msFullscreenEnabled) {
      fullscreenEnabled = msFullscreenEnabled;
      prefix = "ms";
    }

    return {
      fullscreenEnabled,
      prefix,
    };
  }
}

/**
 * 当前浏览器是否支持全屏操作
 * @return {boolean | error} 支持返回true，不支持抛出error
 */
FullScreen.prototype.isSupportFullscreen = function () {
  if (this.fullscreenEnabled) {
    return true;
  }

  throw new Error("Your browser do not support fullscreen!");
};

/**
 * 进入全屏
 * @param {function} enterFullscreen 进入全屏的回调
 */
FullScreen.prototype.enterFullscreen = function (enterFullscreen) {
  if (this.screenStatus || !this.isSupportFullscreen()) {
    return;
  }

  if (this.$node.requestFullscreen) {
    this.$node.requestFullscreen();
  } else {
    const funcName = `${this.prefix}RequestFullscreen`;
    this.$node[funcName]();
  }

  enterFullscreen && enterFullscreen();
  this.screenStatus = true;
};

/**
 * 取消全屏
 * @param {function} cancelFullscreen 取消全屏的回调
 */
FullScreen.prototype.cancelFullscreen = function (cancelFullscreen) {
  if (!this.screenStatus || !this.isSupportFullscreen()) {
    return;
  }

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullscreen) {
    document.mozCancelFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen;
  }

  cancelFullscreen && cancelFullscreen();
  this.screenStatus = false;
};

/**
 * Dom中是否有全屏的元素节点
 * @return {boolean}
 */
FullScreen.prototype.hasFullscreenNode = function () {
  if (!this.isSupportFullscreen()) {
    return;
  }

  const hasFullscreenNode =
    document.fullscreenElement || document[`${this.prefix}FullscreenElement`];

  // 不存在返回undefined
  if (!hasFullscreenNode) {
    return false;
  }

  return true;
};

/**
 * 注册全屏状态切换的函数
 * @param {function} fullscreenStatusChange
 */
FullScreen.prototype.registerFullscreenChangeFunc = function (
  fullscreenStatusChange
) {
  if (!this.isSupportFullscreen()) {
    return;
  }

  // 兼容浏览器函数名称
  const methodName = `on${this.prefix}fullscreenchange`;

  document[methodName] = () => {
    // 判断当前是否有全屏元素
    const currScreenStatus = this.hasFullscreenNode();
    fullscreenStatusChange && fullscreenStatusChange(currScreenStatus);
    this.screenStatus = currScreenStatus;
  };
};

/**
 * 注册全屏失败的回调函数
 * @param {function} enterFullscreenError
 */
FullScreen.prototype.registerFullscreenErrorFunc = function (
  enterFullscreenError
) {
  if (!this.isSupportFullscreen()) {
    return;
  }

  const methodName = `on${this.prefix}fullscreenerror`;

  document[methodName] = (e) => {
    enterFullscreenError && enterFullscreenError(e);
    this.screenStatus = false;
  };
};
