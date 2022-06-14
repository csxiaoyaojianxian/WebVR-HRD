/*
 * @Author: victorsun
 * @Date: 2022-06-04 21:03:33
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-13 19:28:50
 * @Descripttion: 2D渲染 state.board => DOM
 */
import { HRD_GAME_ROW, HRD_GAME_COL } from '../hrd/config';
// 最小单位尺寸
const cellWidth = 0.6;
const cellHeight = 0.6;
const cellDepth = 0.008;

// type1-4尺寸定义(固定)
const warriorSize = [
  [],
  [1, 1], // 1 1x1 BLOCK
  [1, 2], // 2 1x2 V_BAR
  [2, 1], // 3 2x1 H_BAR
  [2, 2], // 4 2x2 BOX
];

function render3D(state, init = false) {
  if (!state) {
    return;
  }
  
  const nameList = [
    [],
    ['卒', '卒', '卒', '卒'], // type 1 block
    ['张\n飞', '黄\n忠', '马\n超', '赵\n云'], // type 2 vbar
    ['关羽'], // type 3 hbar
    ['曹操'], // type 4 box
  ];
  
  const modelList = [
    [],
    ['zu', 'zu', 'zu', 'zu'], // type 1 block
    ['zhangfei', 'huangzhong', 'machao', 'zhaoyun'], // type 2 vbar
    ['guanyu'], // type 3 hbar
    ['caocao'], // type 4 box
  ];

  const colorList = [
    [],
    ['#220757', '#220757', '#220757', '#220757'], // type 1 block
    ['#073C57', '#666300', '#42064D', '#573C07'], // type 2 vbar
    ['#850B0B'], // type 3 hbar
    ['#420303'], // type 4 box
  ];

  if (init) {
    $('.container-3D').html('');
    for(let i = 0; i < state.board.length - 2; i++) {
      for(let j = 0; j < state.board[i].length - 2; j++) {
        $('.container-3D').append(`<a-plane class="cell" raycaster-listen-cell data-row-index="${i}" data-col-index="${j}" width="${cellWidth}" height="${cellHeight}" position="${j * cellWidth + cellWidth / 2} 0.1 ${i * cellHeight + cellHeight / 2}" mixin="blank-cell"></a-plane>`);
      }
    }
  }
  state.heroes.forEach((hero, index) => {
    const size = warriorSize[hero.type];
    // const name = nameList[hero.type].shift();
    const color = colorList[hero.type].shift();
    const model = modelList[hero.type].shift();
    if (init) {
      // mixin="warrior-mixin"
      $('.container-3D').append(`<a-entity
          data-index=${index}
          raycaster-listen-warrior
          mixin="warrior-mixin2"
          material="color: ${color}"
          class="warrior hero-${index}" geometry="width: ${size[0] * cellWidth}; height: ${cellDepth}; depth: ${size[1] * cellHeight}"
          position="${hero.left * cellWidth + size[0] * cellWidth / 2} ${cellDepth / 2} ${hero.top * cellHeight + size[1] * cellHeight / 2}">
          <a-entity highlighter="type: 2;" scale="0.00295 0.00295 0.00295" position="0 0.125 0" rotation="-90 0 0" shadow gltf-model="#${model}" animation-mixer></a-entity>
        </a-entity>`);
    } else {
      $(`.container-3D .hero-${index}`).attr('position', `${hero.left * cellWidth + size[0] * cellWidth / 2} ${cellDepth / 2} ${hero.top * cellHeight + size[1] * cellHeight / 2}`);
    }
  });
}

function hrdGetAvailableCell(hrdGame, warriorIndex) {
  if (warriorIndex < 0 ) {
    return null;
  }
  const retData = []; // top_left|top_left   1_1|2_3
  const state = hrdGame.states[hrdGame.states.length - 1];
  const heroData = state.heroes[warriorIndex];
  const boardData = state.board;
  switch(heroData.type) {
    case 1: // 1x1
      if(heroData.top - 1 >= 0) {
        boardData[heroData.top - 1 + 1][heroData.left + 1] === 0 && retData.push(`${heroData.top - 1}_${heroData.left}`);
      }
      if(heroData.left - 1 >= 0) {
        boardData[heroData.top + 1][heroData.left -1 + 1] === 0 && retData.push(`${heroData.top}_${heroData.left - 1}`);
      }
      if(heroData.top + 1 < HRD_GAME_ROW) {
        boardData[heroData.top + 1 + 1][heroData.left + 1] === 0 && retData.push(`${heroData.top + 1}_${heroData.left}`);
      }
      if(heroData.left + 1 < HRD_GAME_COL) {
        boardData[heroData.top + 1][heroData.left + 1 + 1] === 0 && retData.push(`${heroData.top}_${heroData.left + 1}`);
      }
      break;
    case 2: // 1x2 v
      if(heroData.top - 1 >= 0) {
        boardData[heroData.top - 1 + 1][heroData.left + 1] === 0 && retData.push(`${heroData.top - 1}_${heroData.left}`);
      }
      if(heroData.left - 1 >= 0) {
        if (boardData[heroData.top + 1][heroData.left - 1 + 1] === 0 && boardData[heroData.top + 1 + 1][heroData.left - 1 + 1] === 0) {
          retData.push(`${heroData.top}_${heroData.left - 1}|${heroData.top + 1}_${heroData.left - 1}`);
          retData.push(`${heroData.top + 1}_${heroData.left - 1}|${heroData.top}_${heroData.left - 1}`);
        }
      }
      if(heroData.top + 2 < HRD_GAME_ROW) {
        boardData[heroData.top + 2 + 1][heroData.left + 1] === 0 && retData.push(`${heroData.top + 2}_${heroData.left}`);
      }
      if(heroData.left + 1 < HRD_GAME_COL) {
        if (boardData[heroData.top + 1][heroData.left + 1 + 1] === 0 && boardData[heroData.top + 1 + 1][heroData.left + 1 + 1] === 0) {
          retData.push(`${heroData.top}_${heroData.left + 1}|${heroData.top + 1}_${heroData.left + 1}`);
          retData.push(`${heroData.top + 1}_${heroData.left + 1}|${heroData.top}_${heroData.left + 1}`);
        }
      }
      break;
    case 3: // 2x1 h
      if(heroData.top - 1 >= 0) {
        if (boardData[heroData.top - 1 + 1][heroData.left + 1] === 0 && boardData[heroData.top - 1 + 1][heroData.left + 1 + 1] === 0) {
          retData.push(`${heroData.top - 1}_${heroData.left}|${heroData.top - 1}_${heroData.left + 1}`);
          retData.push(`${heroData.top - 1}_${heroData.left + 1}|${heroData.top - 1}_${heroData.left}`);
        }
      }
      if(heroData.left - 1 >= 0) {
        boardData[heroData.top + 1][heroData.left - 1 + 1] === 0 && retData.push(`${heroData.top}_${heroData.left - 1}`);
      }
      if(heroData.top + 1 < HRD_GAME_ROW) {
        if (boardData[heroData.top + 1 + 1][heroData.left + 1] === 0 && boardData[heroData.top + 1 + 1][heroData.left + 1 + 1] === 0) {
          retData.push(`${heroData.top + 1}_${heroData.left}|${heroData.top + 1}_${heroData.left + 1}`);
          retData.push(`${heroData.top + 1}_${heroData.left + 1}|${heroData.top + 1}_${heroData.left}`);
        }
      }
      if(heroData.left + 2 < HRD_GAME_COL) {
        boardData[heroData.top + 1][heroData.left + 2 + 1] === 0 && retData.push(`${heroData.top}_${heroData.left + 2}`);
      }
      break;
    case 4: // 2x2
      if(heroData.top - 1 >= 0) {
        if (boardData[heroData.top - 1 + 1][heroData.left + 1] === 0 && boardData[heroData.top - 1 + 1][heroData.left + 1 + 1] === 0) {
          retData.push(`${heroData.top - 1}_${heroData.left}|${heroData.top - 1}_${heroData.left + 1}`);
          retData.push(`${heroData.top - 1}_${heroData.left + 1}|${heroData.top - 1}_${heroData.left}`);
        }
      }
      if(heroData.left - 1 >= 0) {
        if (boardData[heroData.top + 1][heroData.left - 1 + 1] === 0 && boardData[heroData.top + 1 + 1][heroData.left - 1 + 1] === 0) {
          retData.push(`${heroData.top}_${heroData.left - 1}|${heroData.top + 1}_${heroData.left - 1}`);
          retData.push(`${heroData.top + 1}_${heroData.left - 1}|${heroData.top}_${heroData.left - 1}`);
        }
      }
      if(heroData.top + 2 < HRD_GAME_ROW) {
        if (boardData[heroData.top + 2 + 1][heroData.left + 1] === 0 && boardData[heroData.top + 2 + 1][heroData.left + 1 + 1] === 0) {
          retData.push(`${heroData.top + 2}_${heroData.left}|${heroData.top + 2}_${heroData.left + 1}`);
          retData.push(`${heroData.top + 2}_${heroData.left + 1}|${heroData.top + 2}_${heroData.left}`);
        }
      }
      if(heroData.left + 2 < HRD_GAME_COL) {
        if (boardData[heroData.top + 1][heroData.left + 2 + 1] === 0 && boardData[heroData.top + 1 + 1][heroData.left + 2 + 1] === 0) {
          retData.push(`${heroData.top}_${heroData.left + 2}|${heroData.top + 1}_${heroData.left + 2}`);
          retData.push(`${heroData.top + 1}_${heroData.left + 2}|${heroData.top}_${heroData.left + 2}`);
        }
      }
      break;
  }
  
  return retData;
}

function doMove(hrdGame, warriorIndex = -1, targetRowIndex = -1, targetColIndex = -1) {
  
  const warrior = hrdGame.states[hrdGame.states.length - 1].heroes[warriorIndex];
  let dirIdx = -1; // 0上 1右 2下 3左
  if (targetRowIndex > warrior.top && targetColIndex > warrior.left) {
    switch(warrior.type) {
      case 2: // 1x2
        dirIdx = 1;
        break;
      case 3: // 2x1
        dirIdx = 2;
        break;
      case 4: // 2x1
        if (targetRowIndex - warrior.top > 1) {
          dirIdx = 2;
        } else if (targetColIndex - warrior.left > 1) {
          dirIdx = 1;
        }
        break;
    }
  } else if (targetRowIndex > warrior.top && targetColIndex < warrior.left) {
    dirIdx = 3;
  } else if (targetRowIndex < warrior.top && targetColIndex > warrior.left) {
    dirIdx = 0;
  } else if (targetRowIndex > warrior.top) {
    dirIdx = 2;
  } else if (targetRowIndex < warrior.top) {
    dirIdx = 0;
  } else if (targetColIndex > warrior.left) {
    dirIdx = 1;
  } else if (targetColIndex < warrior.left) {
    dirIdx = 3;
  }

  if (hrdGame.states[hrdGame.states.length - 1].trySearchHeroNewState(hrdGame, warriorIndex, dirIdx, false)) {
    const newState = hrdGame.states[hrdGame.states.length - 1];
    const hero = newState.heroes[warriorIndex];
    const size = warriorSize[hero.type];
    switch(dirIdx) {
      case 0:
      case 2:
        $('.container-3D .warrior').eq(warriorIndex).attr('animation', `property: object3D.position.z; to: ${hero.top * cellHeight + size[1] * cellHeight / 2}; dur: 500`);
        break;
      case 1:
      case 3:
        $('.container-3D .warrior').eq(warriorIndex).attr('animation', `property: object3D.position.x; to: ${hero.left * cellWidth + size[0] * cellWidth / 2}; dur: 500`);
        break;
    }
    setTimeout(() => {
      render3D(newState, false);
    }, 500);
  };

  // 判断是否成功
  if (hrdGame.isEscaped(hrdGame.states[hrdGame.states.length - 1])) {
    document.querySelector('.button a-text').setAttribute('value', 'success');
    document.querySelector('#model-box').setAttribute("animation-mixer", 'loop: once; clampWhenFinished: true;');
  }
  
}


function resolve(hrdGame, callback) {
  const result = hrdGame.resolve();
  if (result.length > 0) {
    let res = result[0]; // 仅取第一个最佳结果
    let index = 0;
    const timer = setInterval(function() {
      if (index >= res.length) {
        document.querySelector('.button a-text').setAttribute('value', 'success');
        document.querySelector('#model-box').setAttribute("animation-mixer", 'loop: once; clampWhenFinished: true;');
        clearInterval(timer);
        callback && callback()
      }
      console.log('step', index);
      const state = res[++index];
      if (!state) {
        return;
      }
      const heroToMove = state.heroes[state.move.heroIdx];
      const size = warriorSize[heroToMove.type];
      switch(state.move.dirIdx) {
        case 0:
        case 2:
          $('.container-3D .warrior').eq(state.move.heroIdx).attr('animation', `property: object3D.position.z; to: ${heroToMove.top * cellHeight + size[1] * cellHeight / 2}; dur: 500`);
          break;
        case 1:
        case 3:
          $('.container-3D .warrior').eq(state.move.heroIdx).attr('animation', `property: object3D.position.x; to: ${heroToMove.left * cellWidth + size[0] * cellWidth / 2}; dur: 500`);
          break;
      }
      // setTimeout(() => {
      //   render3D(state, false);
      // }, 500);
    }, 500);
  }
}

export default render3D;
export { doMove, hrdGetAvailableCell, resolve };
