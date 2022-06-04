/*
 * @Author: victorsun
 * @Date: 2022-06-04 14:21:31
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-04 16:18:12
 * @Descripttion: 华容道常量定义配置
 */

// 武将类型
const WARRIOR_TYPE = {
  BLOCK: 1, // 1x1
  V_BAR: 2, // 1x2
  H_BAR: 3, // 2x1
  BOX: 4, // 2x2
};

enum WarriorType {
  BLOCK = 1, // 1x1
  V_BAR = 2, // 1x2
  H_BAR = 3, // 2x1
  BOX = 4, // 2x2
};

const BOARD_CELL_EMPTY = 0; // 格子空置代码
const BOARD_CELL_BORDER = -1; // 边缘哨兵代码
const MAX_WARRIOR_TYPE = 1 + Object.keys(WARRIOR_TYPE).length; // 格子被武将占据的状态，空格或武将类型序号，1+4

const HRD_GAME_ROW = 5; // 棋盘实际行数
const HRD_GAME_COL = 4; // 棋盘实际列数
const BOARD_WIDTH = HRD_GAME_COL + 2; // 棋盘宽度(含哨兵)
const BOARD_HEIGHT = HRD_GAME_ROW + 2; // 棋盘高度(含哨兵)

const CAO_ESCAPE_LEFT = 1; // 出口(曹操)
const CAO_ESCAPE_TOP = 3; // 出口(曹操)

// 不同方向上的移动距离 上右下左
const DIRECTION = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export {
  WARRIOR_TYPE,
  WarriorType,
  BOARD_CELL_EMPTY,
  BOARD_CELL_BORDER,
  MAX_WARRIOR_TYPE,
  HRD_GAME_ROW,
  HRD_GAME_COL,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  CAO_ESCAPE_LEFT,
  CAO_ESCAPE_TOP,
  DIRECTION,
}
