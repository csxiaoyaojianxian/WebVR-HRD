/*
 * @Author: victorsun
 * @Date: 2022-06-04 15:21:06
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-04 15:56:29
 * @Descripttion: Zobrist-hash编码表(三维数组)
 */
import {
  MAX_WARRIOR_TYPE,
  HRD_GAME_ROW,
  HRD_GAME_COL,
} from './config';
import HrdGameState from './HrdGameState';

class Zobrist {

  zobHash: Array<Array<Array<number>>>; // hash编码表(定义为一个三维数组)

  constructor() {
    this.zobHash = [];
    // 初始化zobHash
    for (let i = 0; i < HRD_GAME_ROW; i++) {
      this.zobHash.push([]);
      for (let j = 0; j < HRD_GAME_COL; j++) {
        this.zobHash[i].push([]);
        for (let k = 0; k < MAX_WARRIOR_TYPE; k++) {
          let tmp = 0;
          do {
            tmp = Math.floor(Math.random() * Math.pow(2, 31)); // 区32位随机整数值
          } while (!tmp); // 跳过零值
          this.zobHash[i][j].push(tmp);
        }
      }
    }
  }

  // 在三维数组中获取编码
  get(i: number, j: number, k: number) {
    return this.zobHash[i][j][k];
  }

  // 计算棋局Zobrist哈希值
  // 逐个处理棋盘格子，获取格子的武将类型及该类型对应的编码值，并参与哈希值的异或运算
  getZobristHash(state: HrdGameState) {
    let hash = 0;
    let heroes = state.heroes;
    for (let i = 1; i <= HRD_GAME_ROW; i++) {
      for (let j = 1; j <= HRD_GAME_COL; j++) {
        let index = state.board[i][j] - 1;
        let type = (index >= 0 && index < heroes.length) ? heroes[index].type : 0;
        hash ^= this.get(i - 1, j - 1, type);
      }
    }
    return hash;
  }

  // 取镜像Zobrist哈希值
  getMirrorZobristHash(state: HrdGameState) {
    let hash = 0;
    let heroes = state.heroes;
    for (let i = 1; i <= HRD_GAME_ROW; i++) {
      for (let j = 1; j <= HRD_GAME_COL; j++) {
        let index = state.board[i][j] - 1;
        let type = (index >= 0 && index < heroes.length) ? heroes[index].type : 0;
        //(HRD_GAME_COL - 1) - (j - 1))
        hash ^= this.get(i - 1, HRD_GAME_COL - j, type);
      }
    }
    return hash;
  }
}

export default Zobrist;
