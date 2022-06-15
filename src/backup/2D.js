/*
 * @Author: victorsun
 * @Date: 2022-06-04 14:49:42
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-05 02:04:50
 * @Descripttion: 
 */

import HrdGame, { Warrior, WARRIOR_TYPE } from './hrd/index';
import render2D from './tools/render2D';
import './style/index.css'

// 构建武将列表，初始棋局
const list1 = [
  new Warrior(WARRIOR_TYPE.BLOCK, 0, 0),
  new Warrior(WARRIOR_TYPE.BOX, 1, 0),
  new Warrior(WARRIOR_TYPE.BLOCK, 3, 0),
  new Warrior(WARRIOR_TYPE.V_BAR, 0, 1),
  new Warrior(WARRIOR_TYPE.H_BAR, 1, 2),
  new Warrior(WARRIOR_TYPE.V_BAR, 3, 1),
  new Warrior(WARRIOR_TYPE.V_BAR, 0, 3),
  new Warrior(WARRIOR_TYPE.BLOCK, 1, 3),
  new Warrior(WARRIOR_TYPE.BLOCK, 2, 3),
  new Warrior(WARRIOR_TYPE.V_BAR, 3, 3),
];
const list2 = [
  new Warrior(WARRIOR_TYPE.V_BAR, 0, 0),
  new Warrior(WARRIOR_TYPE.BOX, 1, 0),
  new Warrior(WARRIOR_TYPE.V_BAR, 3, 0),
  new Warrior(WARRIOR_TYPE.BLOCK, 0, 2),
  new Warrior(WARRIOR_TYPE.H_BAR, 1, 2),
  new Warrior(WARRIOR_TYPE.BLOCK, 3, 2),
  new Warrior(WARRIOR_TYPE.V_BAR, 0, 3),
  new Warrior(WARRIOR_TYPE.BLOCK, 1, 3),
  new Warrior(WARRIOR_TYPE.BLOCK, 2, 3),
  new Warrior(WARRIOR_TYPE.V_BAR, 3, 3),
];
const list3 = [
  new Warrior(WARRIOR_TYPE.BOX, 0, 0),
  new Warrior(WARRIOR_TYPE.V_BAR, 2, 0),
  new Warrior(WARRIOR_TYPE.V_BAR, 3, 0),
  new Warrior(WARRIOR_TYPE.H_BAR, 0, 2),
  new Warrior(WARRIOR_TYPE.BLOCK, 2, 2),
  new Warrior(WARRIOR_TYPE.V_BAR, 3, 2),
  new Warrior(WARRIOR_TYPE.V_BAR, 0, 3),
  new Warrior(WARRIOR_TYPE.BLOCK, 1, 3),
  new Warrior(WARRIOR_TYPE.BLOCK, 1, 4),
  new Warrior(WARRIOR_TYPE.BLOCK, 3, 4),
];
const list4 = [
  new Warrior(WARRIOR_TYPE.V_BAR, 0, 0),
  new Warrior(WARRIOR_TYPE.V_BAR, 1, 0),
  new Warrior(WARRIOR_TYPE.BOX, 2, 0),
  new Warrior(WARRIOR_TYPE.V_BAR, 0, 2),
  new Warrior(WARRIOR_TYPE.BLOCK, 1, 2),
  new Warrior(WARRIOR_TYPE.H_BAR, 2, 2),
  new Warrior(WARRIOR_TYPE.BLOCK, 2, 3),
  new Warrior(WARRIOR_TYPE.V_BAR, 3, 3),
  new Warrior(WARRIOR_TYPE.BLOCK, 0, 4),
  new Warrior(WARRIOR_TYPE.BLOCK, 2, 4),
];

window.HrdList = [];
window.HrdList.push(list1); // 2
window.HrdList.push(list2); // 2
window.HrdList.push(list3); // 1
window.HrdList.push(list4); // 3

window.hrdGame = new HrdGame(1, window.HrdList[2]);
const initState = hrdGame.states[0];
// console.dir(initState.board);

render2D(initState, true);

// 求解
window.resolve = function() {
  const result = hrdGame.resolve();
  console.log(result);
  if (result.length > 0) {
    let index = 0;
    let res = result[0];
    const timer = setInterval(function() {
      if (index >= res.length) {
        clearInterval(timer);
      }
      console.log('step', index);
      render2D(res[++index], false);
    }, 500);
  }
}

