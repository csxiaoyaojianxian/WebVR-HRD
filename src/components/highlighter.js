/*
 * @Author: victorsun
 * @Date: 2022-06-13 01:57:21
 * @LastEditors: victorsun
 * @LastEditTime: 2022-06-13 01:57:35
 * @Descripttion: 
 */
AFRAME.registerComponent('highlighter', {
  init: function () {
    var self = this;
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
  }
});