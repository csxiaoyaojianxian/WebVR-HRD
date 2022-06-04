/*
 * @Author: victorsun
 * @Date: 2022-06-04 14:49:42
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-04 15:36:59
 * @Descripttion: 
 */

import HrdGame, { Warrior, WARRIOR_TYPE } from './hrd/index';

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

const game = new HrdGame(2, list1);
const initState = game.states[0];
console.dir(initState.board);

// 求解
game.resolve();
