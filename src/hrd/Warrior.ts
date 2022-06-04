/*
 * @Author: victorsun
 * @Date: 2022-06-04 15:23:05
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-04 15:57:22
 * @Descripttion: 武将类
 */

import { WarriorType } from './config';

class Warrior {

  type: number;
  left: number;
  top: number;

  constructor(type: WarriorType, left: number, top: number) {
    this.type = type;
    this.left = left;
    this.top = top;
  }
}

export default Warrior;
