/**
 * 工具函数
 */

/**
 *
 * @param {*} fn
 * @param {*} timeout
 */
export function debounce(fn, timeout) {
  let timer = null;

  return function () {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn && fn.apply(this, arguments);
    }, timeout);
  };
}
