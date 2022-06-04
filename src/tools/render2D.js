/*
 * @Author: victorsun
 * @Date: 2022-06-04 21:03:33
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-05 02:06:53
 * @Descripttion: 2D渲染 state.board => DOM
 */

const cellWidth = 90;
const cellHeight = 90;
// 记录拖动的位置坐标
let originObj = null;
let originPosition = {
  x: 0,
  y: 0,
};
let targetPosition = {
  x: 0,
  y: 0,
};

function render2D(state, init = false) {
  if (!state) {
    return;
  }
  const nameList = [
    [],
    ['卒', '卒', '卒', '卒'], // type 1 block
    ['张<br>飞', '黄<br>忠', '马<br>超', '赵<br>云'], // type 2 vbar
    ['关羽'], // type 3 hbar
    ['曹操'], // type 4 box
  ]; 
  const imgList = [
    [],
    ['zu', 'zu', 'zu', 'zu'], // type 1 block
    ['zhangfei', 'huangzhong', 'machao', 'zhaoyun'], // type 2 vbar
    ['guanyu'], // type 3 hbar
    ['caocao'], // type 4 box
  ]

  if (init) {
    $('.container-2D').html('');
  }
  state.heroes.forEach((hero, index) => {
    const name = nameList[hero.type].shift();
    const img = imgList[hero.type].shift();
    if (init) {
      $('.container-2D').append(`<div class="warrior hero-${index} type-${hero.type}" data-index="${index}" data-name="${name}" style="top: ${hero.top * cellHeight}px; left: ${hero.left * cellWidth}px; background-image: url(./public/img/${img}.png);"></div>`);
      $(`.container-2D .hero-${index}`).off('mousedown').on('mousedown', function(e) {
        originObj = e.currentTarget;
        originPosition.x = e.clientX;
        originPosition.y = e.clientY;
      });
      $(`.container-2D .hero-${index}`).off('touchstart').on('touchstart', function(e) {
        originObj = e.currentTarget;
        originPosition.x = e.originalEvent.touches[0].clientX;
        originPosition.y = e.originalEvent.touches[0].clientY;
      });
      $(`.container-2D`).off('mouseup').on('mouseup', function(e) {
        targetPosition.x = e.clientX;
        targetPosition.y = e.clientY;
        doMove();
        originPosition.x = 0;
        originPosition.y = 0;
      });
      $(`.container-2D`).off('touchend').on('touchend', function(e) {
        targetPosition.x = e.originalEvent.changedTouches[0].clientX;
        targetPosition.y = e.originalEvent.changedTouches[0].clientY;
        doMove();
        originPosition.x = 0;
        originPosition.y = 0;
      });
    } else {
      $(`.container-2D .hero-${index}`).css('top', `${hero.top * cellHeight}px`).css('left', `${hero.left * cellWidth}px`);
    }
  });
}

function doMove() {
  if (originPosition.x !== 0 && originPosition.y !== 0) {
    const diffX = targetPosition.x - originPosition.x;
    const diffY = targetPosition.y - originPosition.y;
    let dirIdx = -1; // 0上 1右 2下 3左
    if (Math.abs(diffX) > 0 || Math.abs(diffY) > 0) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        dirIdx = diffX > 0 ? 1 : 3;
      } else {
        dirIdx = diffY > 0 ? 2 : 0;
      }

      const heroIdx = parseInt(originObj.dataset.index);

      window.hrdGame.states[window.hrdGame.states.length - 1].trySearchHeroNewState(hrdGame, heroIdx, dirIdx, false);
      render2D(window.hrdGame.states[window.hrdGame.states.length - 1], false);

      // 判断是否成功
      if (window.hrdGame.isEscaped(window.hrdGame.states[window.hrdGame.states.length - 1])) {
        alert('恭喜你过关');
      }
    }
  }
}

export default render2D;
