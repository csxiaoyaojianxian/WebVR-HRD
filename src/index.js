/*
 * @Author: victorsun
 * @Date: 2022-06-04 14:49:42
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-13 19:20:26
 * @Descripttion: 
 */

import HrdGame, { Warrior, WARRIOR_TYPE } from './hrd/index';
import render3D, { doMove, hrdGetAvailableCell, resolve } from './tools/render3D';

import './components/positionLimit/positionLimit';
import './components/highlighter';
import './components/raycasterListenCell';
import './components/raycasterListenWarrior';
import './components/triggerdownResolve';

import './components/handControl';

window.render3D = render3D;
window.doMove = doMove;
window.hrdGetAvailableCell = hrdGetAvailableCell;

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

window.currentWarriorIndex = -1;

const puzzleIndex = 2;
const caoIndex = 1
window.hrdGame = new HrdGame(caoIndex, window.HrdList[puzzleIndex]);
const initState = hrdGame.states[0];
// console.dir(initState.board);

window.resolve = function() {
  window.hrdGame = new HrdGame(caoIndex, window.HrdList[puzzleIndex]);
  render3D(initState, true);
  resolve(window.hrdGame, () => {
    setTimeout(() => {
      window.hrdGame = new HrdGame(caoIndex, window.HrdList[puzzleIndex]);
      render3D(initState, true);
    }, 3000);
  });
}

render3D(initState, true);
