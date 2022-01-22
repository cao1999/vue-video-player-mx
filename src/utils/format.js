/**
 * 整理各种格式
 */

/**
 * 整理时间格式。00:00:00
 * @param {*} time 表示秒的数值
 */
export function formatTime(time) {
  let hour = Math.floor(time / 3600) + "";
  time = time % 3600;
  let minute = Math.floor(time / 60) + "";
  time = time % 60;
  let second = Math.floor(time) + "";

  while (hour.length < 2) hour = 0 + hour;
  while (minute.length < 2) minute = 0 + minute;
  while (second.length < 2) second = 0 + second;

  // 如果hour为0，则不显示
  return `${hour === "00" ? "" : `${hour}:`}${minute}:${second}`;
}
