/**
 * props校验函数
 */

export function progressValidator(progress) {
  if (progress < 0 || progress > 1) {
    console.error("The value of progress props should between 0 and 1");
    return false;
  }
  return true;
}

export function cacheProgressValidator(progress) {
  if (progress < 0 || progress > 1) {
    console.error("The value of cacheProgress props should between 0 and 1");
    return false;
  }
  return true;
}
