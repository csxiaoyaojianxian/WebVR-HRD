/*
 * @Author: victorsun
 * @Date: 2022-06-13 01:59:02
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-13 02:12:45
 * @Descripttion: 
 */
AFRAME.registerComponent('raycaster-listen-cell', {
  init() {
    this.raycaster = null;
    this.cells = []; // top_left|top_left
  },
  play() {
    this.el.addEventListener('raycaster-intersected', this.onIntersected.bind(this));
    this.el.addEventListener('raycaster-intersected-cleared', this.onIntersectedCleared.bind(this));
    this.el.addEventListener('triggerupRight', this.onTriggerupRight.bind(this));
  },
  pause() {
    this.el.removeEventListener('raycaster-intersected', this.onIntersected.bind(this));
    this.el.removeEventListener('raycaster-intersected-cleared', this.onIntersectedCleared.bind(this));
    this.el.removeEventListener('triggerupRight', this.onTriggerupRight.bind(this));
  },
  onIntersected: function(evt) {
    this.raycaster = evt.detail.el;
    const availableCell = window.hrdGetAvailableCell(window.hrdGame, window.currentWarriorIndex)
    if (!availableCell) {
      return;
    }
    const cur = `${this.el.dataset.rowIndex}_${this.el.dataset.colIndex}`;
    availableCell.forEach(cellStr => {
      if (cellStr.startsWith(cur)) {
        const cells = cellStr.split('|');
        this.cells = cells;
        cells.forEach(cell => {
          const [top, left] = cell.split('_');
          // this.el.setAttribute('material', 'opacity', '1');
          document.querySelector(`[data-row-index="${top}"][data-col-index="${left}"]`).setAttribute('material', 'opacity', '1');
        });
      }
    });
  },
  onIntersectedCleared: function(evt) {
    this.raycaster = null;
    this.cells.forEach(cell => {
      const [top, left] = cell.split('_');
      // this.el.setAttribute('material', 'opacity', '0');
      document.querySelector(`[data-row-index="${top}"][data-col-index="${left}"]`).setAttribute('material', 'opacity', '0');
    });
    this.cells = [];
  },
  onTriggerupRight: function(evt) {
    if (this.raycaster && currentWarriorIndex >= 0) {
      window.doMove(window.hrdGame, window.currentWarriorIndex, this.el.dataset.rowIndex, this.el.dataset.colIndex)
      document.querySelector(`.hero-${currentWarriorIndex}`).setAttribute('material', 'opacity', '1');
      currentWarriorIndex = -1;
    }
  },
});