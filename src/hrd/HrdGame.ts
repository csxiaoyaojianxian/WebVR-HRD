/*
 * @Author: victorsun
 * @Date: 2022-06-04 15:18:58
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-05 01:53:54
 * @Descripttion: 华容道核心类
 */
import {
  CAO_ESCAPE_LEFT,
  CAO_ESCAPE_TOP,
  DIRECTION,
} from './config';
import HrdGameState from './HrdGameState';
import Zobrist from './Zobrist';

class HrdGame {

  caoIdx: number; // 曹操在武将列表中的序号
  states: Array<HrdGameState>; // 存储所有棋局状态，广度搜索的状态空间
  result: number; // 解的总数

  zhash: Record<number, number>; // 棋局及其镜像哈希，判重空间
  zobHash: Zobrist; // hash编码表实例

  constructor(caoIdx: number, heroes: Array<any>) {
    this.caoIdx = caoIdx;
    const startState = new HrdGameState(); // 新建开局棋局
    startState.initState(heroes); // 开局棋局初始化

    this.states = [];
    this.result = 0;

    this.zhash = {};
    this.zobHash = new Zobrist();

    // 开局处理，游戏初始化
    startState.addNewStatePattern(this);
  }

  // 棋局搜索，广度搜索主函数
  resolve() {
    let index = 0;
    const result = []; // 存储多个执行链
    while (index < this.states.length) {
      // 依次选定棋局状态
      const gameState = this.states[index];
      // 找到解，输出
      if (this.isEscaped(gameState)) {
        this.result++;
        console.log('result:' + this.result + ', step:' + gameState.step + ', index:' + index, this.states[index]);
        // 反查执行链
        const res = [];
        res.unshift(this.states[index]);
        while(res[0].parent) {
          res.unshift(res[0].parent);
        }
        result.push(res);
        // break;
      } else {
        // 搜索新棋局 武将移动产生新棋局 // 选定棋局搜索所有新棋局
        for (let i = 0; i < gameState.heroes.length; i++) { // 遍历武将
          for (let j = 0; j < DIRECTION.length; j++) { // 遍历所有方向
            gameState.trySearchHeroNewState(this, i, j); // 移动武将产生新棋局
          }
        }
      }
      index++;
    }

    // return this.result > 0;
    return result;
  }

  // 解的判定, 曹操的位置到达 (1, 3)
  isEscaped(gameState: HrdGameState) {
    return (gameState.heroes[this.caoIdx - 1].left == CAO_ESCAPE_LEFT) && (gameState.heroes[this.caoIdx - 1].top == CAO_ESCAPE_TOP)
  }

}

export default HrdGame;
