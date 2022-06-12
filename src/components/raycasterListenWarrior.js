/*
 * @Author: victorsun
 * @Date: 2022-06-13 01:59:39
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-13 02:18:09
 * @Descripttion: 
 */
AFRAME.registerComponent('raycaster-listen-warrior', {
  init () {
    this.raycaster = null;
    this.originPosition = null;
  },
  play() {
    this.el.addEventListener('raycaster-intersected', this.onIntersected.bind(this));
    this.el.addEventListener('raycaster-intersected-cleared', this.onIntersectedCleared.bind(this));
    this.el.addEventListener('triggerdownRight', this.onTriggerdownRight.bind(this));
  },
  pause() {
    this.el.removeEventListener('raycaster-intersected', this.onIntersected.bind(this));
    this.el.removeEventListener('raycaster-intersected-cleared', this.onIntersectedCleared.bind(this));
    this.el.removeEventListener('triggerdownRight', this.onTriggerdownRight.bind(this));
  },
  onIntersected: function(evt) {
    this.raycaster = evt.detail.el;
  },
  onIntersectedCleared: function(evt) {
    this.raycaster = null;
  },
  onTriggerdownRight: function(evt) {
    if (this.raycaster && this.raycaster.dataset.hand === 'right') {
      // const position = document.querySelector('#leftHand').object3D.position;
      this.el.setAttribute('material', 'opacity', '0.7');
      currentWarriorIndex = parseInt(this.el.dataset.index);
    }
  },
});