/*
 * @Author: victorsun
 * @Date: 2022-06-04 15:18:58
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-05 01:43:17
 * @Descripttion: 华容道棋局类
 */
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BOARD_CELL_EMPTY,
  BOARD_CELL_BORDER,
  WARRIOR_TYPE,
  WarriorType,
  DIRECTION,
} from './config';
import HrdGame from './HrdGame';
import Warrior from './Warrior';
import _ from 'lodash';

interface Move {
  heroIdx: number,
  dirIdx: number,
}

// 棋局状态
class HrdGameState {
  board: Array<Array<number>>; // 棋盘描述(空格0、边缘哨兵-1、武将1-4)
  heroes: Array<Warrior>; // 武将列表
  parent: HrdGameState | null; // 父节点，用于构建演化链
  step: number; // 演化计数
  move: Move; //演化方式（武将移动方式）

  constructor() {
    this.board = [];
    this.heroes = [];
    this.parent = null;
    this.step = 0;
    this.move = {
      heroIdx: 0,
      dirIdx: 0,
    };

    // 空棋盘初始化并在周围设置一圈哨兵
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      this.board.push([]);
      for (let j = 0; j < BOARD_WIDTH; j++) {
        let cell = BOARD_CELL_EMPTY; // 默认置空
        if (i == 0 || j == 0 || i == BOARD_HEIGHT - 1 || j == BOARD_WIDTH - 1) {
          cell = BOARD_CELL_BORDER; // 边缘哨兵
        }
        this.board[i].push(cell); // this.board[i][j]
      }
    }
  }

  // 新增棋局
  addNewStatePattern(game: HrdGame) {
    const l2rHash = game.zobHash.getZobristHash(this); // 计算棋局哈希值
    // 棋局不存在，缓存hash值
    if (!game.zhash[l2rHash]) {
      game.zhash[l2rHash] = l2rHash; // 缓存棋局哈希
      const r2lHash = game.zobHash.getMirrorZobristHash(this); // 处理镜像zhash
      game.zhash[r2lHash] = r2lHash; // 缓存棋局镜像哈希
      game.states.push(this); // 存储棋局
      return true;
    }
    // 棋局已经存在，忽略
    return false;
  }

  // 武将列表初始化
  initState(heroes: Array<Warrior>) {
    for(let i = 0; i < heroes.length; i++) {
      // 检测给定位置是否能放置该武将
      if(this.isPositionAvailable(heroes[i].type, heroes[i].left, heroes[i].top)) {
        this.takePosition(this, i, heroes[i].type, heroes[i].left, heroes[i].top); // 放置武将到棋盘上
        this.heroes.push(heroes[i]); // 将武将存入列表中
      } else {
        return false;
      }
    }
    return true;
  }

  // 检测棋局中指定位置能否放置武将
  isPositionAvailable(type: WarriorType, left: number, top: number) {
    let isOK = false;
    switch (type) {
      case WARRIOR_TYPE.BLOCK:
        isOK = (this.board[top + 1][left + 1] == BOARD_CELL_EMPTY);
        break;
      case WARRIOR_TYPE.V_BAR:
        isOK = (this.board[top + 1][left + 1] == BOARD_CELL_EMPTY) &&
          (this.board[top + 2][left + 1] == BOARD_CELL_EMPTY);
        break;
      case WARRIOR_TYPE.H_BAR:
        isOK = (this.board[top + 1][left + 1] == BOARD_CELL_EMPTY) &&
          (this.board[top + 1][left + 2] == BOARD_CELL_EMPTY);
        break;
      case WARRIOR_TYPE.BOX:
        isOK = (this.board[top + 1][left + 1] == BOARD_CELL_EMPTY) &&
          (this.board[top + 1][left + 2] == BOARD_CELL_EMPTY) &&
          (this.board[top + 2][left + 1] == BOARD_CELL_EMPTY) &&
          (this.board[top + 2][left + 2] == BOARD_CELL_EMPTY);
        break;
      default:
        isOK = false;
        break;
    }

    return isOK;
  }

  // 放置武将
  takePosition(gameState: HrdGameState, heroIdx: number, type: WarriorType, left: number, top: number) {
    switch (type) {
      case WARRIOR_TYPE.BLOCK:
        gameState.board[top + 1][left + 1] = heroIdx + 1;
        break;
      case WARRIOR_TYPE.V_BAR:
        gameState.board[top + 1][left + 1] = heroIdx + 1;
        gameState.board[top + 2][left + 1] = heroIdx + 1;
        break;
      case WARRIOR_TYPE.H_BAR:
        gameState.board[top + 1][left + 1] = heroIdx + 1;
        gameState.board[top + 1][left + 2] = heroIdx + 1;
        break;
      case WARRIOR_TYPE.BOX:
        gameState.board[top + 1][left + 1] = heroIdx + 1;
        gameState.board[top + 1][left + 2] = heroIdx + 1;
        gameState.board[top + 2][left + 1] = heroIdx + 1;
        gameState.board[top + 2][left + 2] = heroIdx + 1;
        break;
      default:
        break;
    }
  }

  // 新棋局生成
  // 根据华容道规则，对一个武将棋子连续移动只算一步，因此在每一步移动成功后，需要继续对该棋子尝试移动，但是移动的方向有限制，不能向原方向移动
  trySearchHeroNewState(game: HrdGame, heroIdx: number, dirIdx: number, tryContinue: boolean = true) {
    let newState = this.moveHeroToNewState(heroIdx, dirIdx); //新棋局产生
    if (newState) {
      if (newState.addNewStatePattern(game)) { //处理新棋局，判重，添加到状态链中
        // 尝试连续移动，根据华容道游戏规则，连续的移动也只算一步
        tryContinue && newState.tryHeroContinueMove(game, heroIdx, dirIdx);
        return;
      } else if (!tryContinue) {
        // 自由移动(非求解)模式下，仍然存储棋局
        game.states.push(newState);
      }
    }
  }

  // 移动武将并产生新棋局
  moveHeroToNewState(heroIdx: number, dirIdx: number) {
    if (this.canHeroMove(heroIdx, dirIdx)) {
      const newState = new HrdGameState(); // 新建棋局
      if (newState) {
        newState.board = _.cloneDeep(this.board);
        newState.heroes = _.cloneDeep(this.heroes);
        newState.step = this.step + 1; // 移动步数加一
        newState.parent = this; // 形成演化链
        newState.move.heroIdx = heroIdx; // 记录移动方法
        newState.move.dirIdx = dirIdx;

        // 修改当前武将数据
        const hero = newState.heroes[heroIdx]; // 取得武将
        const dir = DIRECTION[dirIdx]; // 取得方向
        this.clearPosition(newState, hero.type, hero.left, hero.top); // 清除棋局旧信息
        this.takePosition(newState, heroIdx, hero.type, hero.left + dir[0], hero.top + dir[1]); // 生成新棋局数据
        hero.left = hero.left + dir[0]; // 武将新位置设定
        hero.top = hero.top + dir[1];

        return newState; //返回新棋局
      }
    }
    return null;
  }

  // 判断指定武将是否能向指定方向移动
  canHeroMove(heroIdx: number, dirIdx: number) {
    let cv1, cv2, cv3, cv4;
    let canMove = false;
    const hero = this.heroes[heroIdx];
    const dir = DIRECTION[dirIdx];
  
    switch (hero.type) {
      case WARRIOR_TYPE.BLOCK:
        canMove = (this.board[hero.top + dir[1] + 1][hero.left + dir[0] + 1] == BOARD_CELL_EMPTY);
        break;
      case WARRIOR_TYPE.V_BAR:
        cv1 = this.board[hero.top + dir[1] + 1][hero.left + dir[0] + 1];
        cv2 = this.board[hero.top + dir[1] + 2][hero.left + dir[0] + 1];
        canMove = (cv1 == BOARD_CELL_EMPTY || cv1 == heroIdx + 1) && (cv2 == BOARD_CELL_EMPTY || cv2 == heroIdx + 1);
        break;
      case WARRIOR_TYPE.H_BAR:
        cv1 = this.board[hero.top + dir[1] + 1][hero.left + dir[0] + 1];
        cv2 = this.board[hero.top + dir[1] + 1][hero.left + dir[0] + 2];
        canMove = (cv1 == BOARD_CELL_EMPTY || cv1 == heroIdx + 1) && (cv2 == BOARD_CELL_EMPTY || cv2 == heroIdx + 1);
        break;
      case WARRIOR_TYPE.BOX:
        cv1 = this.board[hero.top + dir[1] + 1][hero.left + dir[0] + 1];
        cv2 = this.board[hero.top + dir[1] + 1][hero.left + dir[0] + 2];
        cv3 = this.board[hero.top + dir[1] + 2][hero.left + dir[0] + 1];
        cv4 = this.board[hero.top + dir[1] + 2][hero.left + dir[0] + 2];
        canMove = (cv1 == BOARD_CELL_EMPTY || cv1 == heroIdx + 1) && (cv2 == BOARD_CELL_EMPTY || cv2 == heroIdx + 1) &&
          (cv3 == BOARD_CELL_EMPTY || cv3 == heroIdx + 1) && (cv4 == BOARD_CELL_EMPTY || cv4 == heroIdx + 1);
        break;
      default:
        canMove = false;
        break;
    }
  
    return canMove;
  }

  // 清除父棋局信息
  clearPosition(gameState: HrdGameState, type: WarriorType, left: number, top: number) {
    switch (type) {
      case WARRIOR_TYPE.BLOCK:
        gameState.board[top + 1][left + 1] = BOARD_CELL_EMPTY;
        break;
      case WARRIOR_TYPE.V_BAR:
        gameState.board[top + 1][left + 1] = BOARD_CELL_EMPTY;
        gameState.board[top + 2][left + 1] = BOARD_CELL_EMPTY;
        break;
      case WARRIOR_TYPE.H_BAR:
        gameState.board[top + 1][left + 1] = BOARD_CELL_EMPTY;
        gameState.board[top + 1][left + 2] = BOARD_CELL_EMPTY;
        break;
      case WARRIOR_TYPE.BOX:
        gameState.board[top + 1][left + 1] = BOARD_CELL_EMPTY;
        gameState.board[top + 1][left + 2] = BOARD_CELL_EMPTY;
        gameState.board[top + 2][left + 1] = BOARD_CELL_EMPTY;
        gameState.board[top + 2][left + 2] = BOARD_CELL_EMPTY;
        break;
      default:
        break;
    }
  }

  // 尝试连续移动，根据华容道游戏规则，连续的移动也只算一步
  tryHeroContinueMove(game: HrdGame, heroIdx: number, lastDirIdx: number) {
    function isReverseDirection(dirIdx1: number, dirIdx2: number) {
      return (((dirIdx1 + 2) % DIRECTION.length) == dirIdx2);
    }
    let d = 0;
    for (d = 0; d < DIRECTION.length; d++) { // 向四个方向试探移动
      if (!isReverseDirection(d, lastDirIdx)) { // 不向原方向移动
        let newState = this.moveHeroToNewState(heroIdx, d);
        if (newState) {
          if (this.addNewStatePattern(game)) {
            newState.step--;
          }
          return; // 连续移动只能朝一个方向移动一次
        }
      }
    }
  }

}

export default HrdGameState;
