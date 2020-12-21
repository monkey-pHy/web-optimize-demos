/*
 * @Descripttion: 
 * @version: 
 * @Author: pengheyan
 * @Date: 2020-12-21 16:09:11
 * @LastEditors: pengheyan
 * @LastEditTime: 2020-12-21 16:54:53
 */
class LazyLoad {
  constructor(selector) {
    console.log('selector', selector);
    //图片列表,将维数组转为数组，一遍可以使用数组的api
    this.lazyImages = Array.prototype.slice.call(document.querySelectorAll(selector))
    this.init();
  }
  //不支持IntersectionObserver api的情况下判断图片是否出现在可视区域内
  inViewShow() {
    let len = this.lazyImages.length;
    for (let i = 0; i < len; i++) {
      const rect = lazyImages.getBoundingClientRect();
      if (rect.top < document.documentElement.clientHeight) {
        lazyImages.src = lazyImages.data.dataset.src;
        //移除已经显示的
        this.lazyImages.splice(i, 1)
        len--;
        i--;
        if (this.lazyImages.length === 0) {
          document.removeEventListener('scroll', this._throttleFn);
        }
      }
    }
  }

  throttle(fn, delay = 15, mustRun = 30) {
    let t_start = null
    let timer = null
    let context = this
    return function () {
      let t_current = +(new Date())
      let args = Array.prototype.slice.call(arguments)
      clearTimeout(timer)
      if (!t_start) {
        t_start = t_current
      }
      if (t_current - t_start > mustRun) {
        fn.apply(context, args)
        t_start = t_current
      } else {
        timer = setTimeout(() => {
          fn.apply(context, args)
        }, delay)
      }
    }
  }

  init() {
    if ("IntersectionObserver" in window) {
      let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          //判断元素是否可见
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImageObserver.unobserve(lazyImage);
          }
        })
      });
      this.lazyImages.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
      })
    } else {
      this.inViewShow();
      this._throttleFn = this.throttle(this.inViewShow);
      document.addEventListener('scroll', this._throttleFn);
    }
  }

}