/*
 * @Author: victorsun
 * @Date: 2022-06-13 01:57:21
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-13 19:21:28
 * @Descripttion: 
 */
AFRAME.registerComponent('highlighter', {
  schema: {
    type: {type: 'number', default: 1},
  },
  init: function () {
    if (this.data.type === 1) {
      const self = this;
      this.material = null;
      this.el.addEventListener('model-loaded', function () {
        // var mat = self.el.getObject3D('mesh').children[0].children[0].children[0].children[0].children[0].children[8].material;
        var mat = self.el.getObject3D('mesh').children[0].children[0].children[0].material;
        mat.emissiveMap = mat.map;
        mat.emissive.set('#fff');

        mat = self.el.getObject3D('mesh').children[1].children[0].children[0].material;
        mat.emissiveMap = mat.map;
        mat.emissive.set('#fff');

        mat = self.el.getObject3D('mesh').children[1].children[1].material;
        mat.emissiveMap = mat.map;
        mat.emissive.set('#fff');

        mat = self.el.getObject3D('mesh').children[2].children[0].children[0].material;
        mat.emissiveMap = mat.map;
        mat.emissive.set('#fff');

        mat = self.el.getObject3D('mesh').children[2].children[0].children[1].material;
        mat.emissiveMap = mat.map;
        mat.emissive.set('#fff');
      });
    } else if (this.data.type === 2) {
      const self = this;
      this.material = null;
      this.el.addEventListener('model-loaded', function () {
        try {
          var mat = self.el.getObject3D('mesh').children[0].children[0].children[0].children[1].material;
          if (mat) {
            mat.emissiveMap = mat.map;
            mat.emissive.set('#222');
          }
        } catch(e){}

        try {
          var mat = self.el.getObject3D('mesh').children[0].children[0].children[0].children[0].children[0].material;
          if (mat) {
            mat.emissiveMap = mat.map;
            mat.emissive.set('#222');
          }
        } catch(e){}

        // var mat = self.el.getObject3D('mesh').children[1].material;
        // mat.emissiveMap = mat.map;
        // mat.emissive.set('#fff');
      });

    } else if (this.data.type === 3) {
      const self = this;
      this.el.addEventListener('model-loaded', function () {
        for (let i = 0; i < 9; i++) {
          var mat = self.el.getObject3D('mesh').children[i].material;
          mat.emissiveMap = mat.map;
          mat.emissive.set('#fff');
        }
      });
    }
  }
});