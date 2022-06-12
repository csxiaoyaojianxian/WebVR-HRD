/*
 * @Author: victorsun
 * @Date: 2022-06-13 02:00:05
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-13 02:16:19
 * @Descripttion: 
 */
AFRAME.registerComponent('triggerdown-resolve', {
  init () {
    this.raycaster = null;
    this.isStart = false; // 一次性
  },
  play() {
    this.el.addEventListener('raycaster-intersected', this.onIntersected.bind(this));
    this.el.addEventListener('raycaster-intersected-cleared', this.onIntersectedCleared.bind(this));
    this.el.addEventListener('triggerdown', this.onTriggerdown.bind(this));
  },
  pause() {
    this.el.removeEventListener('raycaster-intersected', this.onIntersected.bind(this));
    this.el.removeEventListener('raycaster-intersected-cleared', this.onIntersectedCleared.bind(this));
    this.el.removeEventListener('triggerdown', this.onTriggerdown.bind(this));
  },
  onIntersected: function(evt) {
    this.raycaster = evt.detail.el;
    this.el.querySelector('a-text').setAttribute('color', 'red');
  },
  onIntersectedCleared: function(evt) {
    this.raycaster = null;
    this.el.querySelector('a-text').setAttribute('color', 'white');
  },
  onTriggerdown: function(evt) {
    if (this.raycaster && !this.isStart) {
      this.isStart = true;
      window.resolve(window.hrdGame);
    }
  },
});