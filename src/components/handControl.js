/**
 * 提取6DoF控件的手动控件组件
 * 将按钮事件转换为与手相关的语义事件名称：gripclose, gripopen, thumbup, thumbdown, pointup, pointdown
 * 合上、合上、向上、向下、指向上、指向下
 * 
 * 注意添加 tracked-controls="controller: 0; idPrefix: OpenVR"
 *
 * @property {string} Hand mapping (`left`, `right`).
 */

// Found at https://github.com/aframevr/assets.
var MODEL_URLS = {
  toonLeft: 'https://cdn.aframe.io/controllers/hands/leftHand.glb',
  toonRight: 'https://cdn.aframe.io/controllers/hands/rightHand.glb',
  lowPolyLeft: 'https://cdn.aframe.io/controllers/hands/leftHandLow.glb',
  lowPolyRight: 'https://cdn.aframe.io/controllers/hands/rightHandLow.glb',
  highPolyLeft: 'https://cdn.aframe.io/controllers/hands/leftHandHigh.glb',
  highPolyRight: 'https://cdn.aframe.io/controllers/hands/rightHandHigh.glb'
};

// 姿势动画合集，需要在模型中实现相应动画
var ANIMATIONS = {
  // 默认张开
  open: 'Open',

  // 指点 point: grip active, trackpad surface active, trigger inactive.
  point: 'Point',

  // pointThumb: grip active, trigger inactive, trackpad surface inactive.
  pointThumb: 'Point + Thumb',

  // 握拳 fist: grip active, trigger active, trackpad surface active.
  fist: 'Fist',

  // hold: trigger active, grip inactive.
  hold: 'Hold',

  // 点赞 thumbUp: grip active, trigger active, trackpad surface inactive.
  thumbUp: 'Thumb Up'
};

// 根据动画名对应的手势事件名 Map animation to public events for the API.
var EVENTS = {};
EVENTS[ANIMATIONS.fist] = 'grip';
EVENTS[ANIMATIONS.thumbUp] = 'pistol';
EVENTS[ANIMATIONS.point] = 'pointing';

window.AFRAME.registerComponent('hand-control', {
  schema: {
    color: { default: 'white', type: 'color' },
    hand: { default: 'left' },
    // [old]
    handModelStyle: { default: 'lowPoly', oneOf: ['lowPoly', 'highPoly', 'toon'] }
  },

  init: function () {
               
    var self = this;
    var el = this.el;

    // 当前姿势
    this.gesture = ANIMATIONS.open;

    // 记录激活的按键状态  Active buttons populated by events provided by the attached controls.
    this.pressedButtons = {};
    this.touchedButtons = {};

    this.loader = new window.THREE.GLTFLoader();
    this.loader.setCrossOrigin('anonymous');

    this.onGripDown = function () {
      this.logAdd('onGripDown');
      self.handleButton('grip', 'down');
    };
    this.onGripUp = function () {
      this.logAdd('onGripUp');
      self.handleButton('grip', 'up');
    };
    this.onTrackpadDown = function () {
      this.logAdd('onTrackpadDown');
      self.handleButton('trackpad', 'down');
    };
    this.onTrackpadUp = function () {
      this.logAdd('onTrackpadUp');
      self.handleButton('trackpad', 'up');
    };
    this.onTrackpadTouchStart = function () {
      this.logAdd('onTrackpadTouchStart');
      self.handleButton('trackpad', 'touchstart');
    };
    this.onTrackpadTouchEnd = function () {
      this.logAdd('onTrackpadTouchEnd');
      self.handleButton('trackpad', 'touchend');
    };
    this.onTriggerDown = function () {
      this.logAdd('onTriggerDown');
      self.handleButton('trigger', 'down');
    };
    this.onTriggerUp = function () {
      this.logAdd('onTriggerUp');
      self.handleButton('trigger', 'up');
    };
    this.onTriggerTouchStart = function () {
      this.logAdd('onTriggerTouchStart');
      self.handleButton('trigger', 'touchstart');
    };
    this.onTriggerTouchEnd = function () {
      this.logAdd('onTriggerTouchEnd');
      self.handleButton('trigger', 'touchend');
    };
    this.onGripTouchStart = function () {
      this.logAdd('onGripTouchStart');
      self.handleButton('grip', 'touchstart');
    };
    this.onGripTouchEnd = function () {
      this.logAdd('onGripTouchEnd');
      self.handleButton('grip', 'touchend');
    };
    this.onThumbstickDown = function () {
      this.logAdd('onThumbstickDown');
      self.handleButton('thumbstick', 'down');
    };
    this.onThumbstickUp = function () {
      this.logAdd('onThumbstickUp');
      self.handleButton('thumbstick', 'up');
    };
    this.onAorXTouchStart = function () {
      this.logAdd('onAorXTouchStart');
      self.handleButton('AorX', 'touchstart');
    };
    this.onAorXTouchEnd = function () {
      this.logAdd('onAorXTouchEnd');
      self.handleButton('AorX', 'touchend');
    };
    this.onBorYTouchStart = function () {
      this.logAdd('onBorYTouchStart');
      self.handleButton('BorY', 'touchstart');
    };
    this.onBorYTouchEnd = function () {
      this.logAdd('onBorYTouchEnd');
      self.handleButton('BorY', 'touchend');
    };
    this.onSurfaceTouchStart = function () {
      this.logAdd('onSurfaceTouchStart');
      self.handleButton('surface', 'touchstart');
    };
    this.onSurfaceTouchEnd = function () {
      this.logAdd('onSurfaceTouchEnd');
      self.handleButton('surface', 'touchend');
    };

    // 手柄连接/断开
    this.onControllerConnected = this.onControllerConnected.bind(this);
    this.onControllerDisconnected = this.onControllerDisconnected.bind(this);
    el.addEventListener('controllerconnected', this.onControllerConnected);
    el.addEventListener('controllerdisconnected', this.onControllerDisconnected);
    // 默认隐藏
    el.object3D.visible = false;
  },

  play: function () {
    this.addCustomEventListeners();
    this.addEventListeners();
  },

  pause: function () {
    this.removeCustomEventListeners();
    this.removeEventListeners();
  },

  tick: function (time, delta) {
    var mesh = this.el.getObject3D('mesh');

    if (!mesh || !mesh.mixer) { return; }

    mesh.mixer.update(delta / 1000);
  },

  // 手柄连接/断开时展示/隐藏手模型
  onControllerConnected: function () {
    this.el.object3D.visible = true;
  },
  onControllerDisconnected: function () {
    this.el.object3D.visible = false;
  },

  // 摇杆处理
  onAxisMove: function (e) {
    this.logAdd('onAxisMove, ' + JSON.stringify(e.detail));
  },

  // tracked-controls 触发的事件
  addCustomEventListeners: function () {
    var el = this.el;

    // 摇杆
    el.addEventListener('axismove', this.onAxisMove);

    // 控制器已连接并设置
    // el.addEventListener('controllerconnected', function(e) {});

    // 控制器已断开连接
    // el.addEventListener('controllerdisconnected', function(e) {});

    // 任何触摸或按下按钮触发
    // el.addEventListener('buttonchanged', function(e) {});
    
    // 按下按钮
    // el.addEventListener('buttondown', function(e) {});

    // 按钮松开
    // el.addEventListener('buttonup', function(e) {});

    // 触摸按钮开始触摸
    // el.addEventListener('touchstart', function(e) {});
                 
    // 触摸按钮停止触摸
    // el.addEventListener('touchend', function(e) {});
  },

  removeCustomEventListeners: function () {
    var el = this.el;
    // 摇杆
    el.removeEventListener('axismove', this.onAxisMove);
  },

  addEventListeners: function () {
    var el = this.el;

    // 握把 grid
    el.addEventListener('gripdown', this.onGripDown);
    el.addEventListener('gripup', this.onGripUp);
    el.addEventListener('griptouchstart', this.onGripTouchStart);
    el.addEventListener('griptouchend', this.onGripTouchEnd);

    // 板机 trigger
    el.addEventListener('triggerdown', this.onTriggerDown);
    el.addEventListener('triggerup', this.onTriggerUp);
    el.addEventListener('triggertouchstart', this.onTriggerTouchStart);
    el.addEventListener('triggertouchend', this.onTriggerTouchEnd);

    // 拇指方向摇杆
    el.addEventListener('thumbstickdown', this.onThumbstickDown);
    el.addEventListener('thumbstickup', this.onThumbstickUp);

    // right A/B
    el.addEventListener('abuttontouchstart', this.onAorXTouchStart);
    el.addEventListener('abuttontouchend', this.onAorXTouchEnd);
    el.addEventListener('bbuttontouchstart', this.onBorYTouchStart);
    el.addEventListener('bbuttontouchend', this.onBorYTouchEnd);

    // left X/Y
    el.addEventListener('xbuttontouchstart', this.onAorXTouchStart);
    el.addEventListener('xbuttontouchend', this.onAorXTouchEnd);
    el.addEventListener('ybuttontouchstart', this.onBorYTouchStart);
    el.addEventListener('ybuttontouchend', this.onBorYTouchEnd);

    el.addEventListener('trackpaddown', this.onTrackpadDown);
    el.addEventListener('trackpadup', this.onTrackpadUp);
    el.addEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
    el.addEventListener('trackpadtouchend', this.onTrackpadTouchEnd);

    el.addEventListener('surfacetouchstart', this.onSurfaceTouchStart);
    el.addEventListener('surfacetouchend', this.onSurfaceTouchEnd);
  },

  removeEventListeners: function () {
    var el = this.el;
    el.removeEventListener('gripdown', this.onGripDown);
    el.removeEventListener('gripup', this.onGripUp);
    el.removeEventListener('trackpaddown', this.onTrackpadDown);
    el.removeEventListener('trackpadup', this.onTrackpadUp);
    el.removeEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
    el.removeEventListener('trackpadtouchend', this.onTrackpadTouchEnd);
    el.removeEventListener('triggerdown', this.onTriggerDown);
    el.removeEventListener('triggerup', this.onTriggerUp);
    el.removeEventListener('triggertouchstart', this.onTriggerTouchStart);
    el.removeEventListener('triggertouchend', this.onTriggerTouchEnd);
    el.removeEventListener('griptouchstart', this.onGripTouchStart);
    el.removeEventListener('griptouchend', this.onGripTouchEnd);
    el.removeEventListener('thumbstickdown', this.onThumbstickDown);
    el.removeEventListener('thumbstickup', this.onThumbstickUp);
    el.removeEventListener('abuttontouchstart', this.onAorXTouchStart);
    el.removeEventListener('abuttontouchend', this.onAorXTouchEnd);
    el.removeEventListener('bbuttontouchstart', this.onBorYTouchStart);
    el.removeEventListener('bbuttontouchend', this.onBorYTouchEnd);
    el.removeEventListener('xbuttontouchstart', this.onAorXTouchStart);
    el.removeEventListener('xbuttontouchend', this.onAorXTouchEnd);
    el.removeEventListener('ybuttontouchstart', this.onBorYTouchStart);
    el.removeEventListener('ybuttontouchend', this.onBorYTouchEnd);
    el.removeEventListener('surfacetouchstart', this.onSurfaceTouchStart);
    el.removeEventListener('surfacetouchend', this.onSurfaceTouchEnd);
  },

  update: function (previousHand) {
    var controlConfiguration;
    var el = this.el;
    var hand = this.data.hand;
    var handModelStyle = this.data.handModelStyle;
    var handColor = this.data.color;
    var self = this;

    // Get common configuration to abstract different vendor controls.
    controlConfiguration = {
      hand: hand,
      model: false
    };

    // Set model.
    if (hand !== previousHand) {
      var handmodelUrl = MODEL_URLS[handModelStyle + hand.charAt(0).toUpperCase() + hand.slice(1)];
      this.loader.load(handmodelUrl, function (gltf) {
        var mesh = gltf.scene.children[0];
        var handModelOrientation = hand === 'left' ? Math.PI / 2 : -Math.PI / 2;
        mesh.mixer = new window.THREE.AnimationMixer(mesh);
        self.clips = gltf.animations;
        el.setObject3D('mesh', mesh);

        var handMaterial = mesh.children[1].material;
        handMaterial.color = new window.THREE.Color(handColor);
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, handModelOrientation);
        el.setAttribute('magicleap-controls', controlConfiguration);
        el.setAttribute('vive-controls', controlConfiguration);
        el.setAttribute('oculus-touch-controls', controlConfiguration);
        el.setAttribute('windows-motion-controls', controlConfiguration);
        el.setAttribute('hp-mixed-reality-controls', controlConfiguration);
      });
    }
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  },

  // 输出日志
  logAdd(data) {
    console.log(data);
  },

  /**
   * 处理按钮状态事件
   * Play model animation, based on which button was pressed and which kind of event.
   *
   * 1. 处理按钮 Process buttons.
   * 2. 确定手势 Determine gesture (this.determineGesture()).
   * 3. 播放手势动画 Animation gesture (this.animationGesture()).
   * 4. 触发手势事件 Emit gesture events (this.emitGestureEvents()).
   *
   * @param {string} button - Name of the button.
   * @param {string} evt - Type of event for the button (i.e., down/up/touchstart/touchend).
   */
  handleButton: function (button, evt) {
    var lastGesture;
    var isPressed = evt === 'down';
    var isTouched = evt === 'touchstart';

    // 记录按钮状态 Update objects.
    if (evt.indexOf('touch') === 0) {
      // Update touch object.
      if (isTouched === this.touchedButtons[button]) { return; }
      this.touchedButtons[button] = isTouched;
    } else {
      // Update button object.
      if (isPressed === this.pressedButtons[button]) { return; }
      this.pressedButtons[button] = isPressed;
    }

    // 确定手势 Determine the gesture.
    lastGesture = this.gesture;
    this.gesture = this.determineGesture();

    // Same gesture.
    if (this.gesture === lastGesture) { return; }
    // 播放手势动画 Animate gesture.
    this.animateGesture(this.gesture, lastGesture);

    // 触发手势事件 Emit events.
    this.emitGestureEvents(this.gesture, lastGesture);
  },

  /**
   * 确定手势
   * Determine which pose hand should be in considering active and touched buttons.
   */
  determineGesture: function () {
    var gesture;
    var isGripActive = this.pressedButtons.grip;
    var isSurfaceActive = this.pressedButtons.surface || this.touchedButtons.surface;
    var isTrackpadActive = this.pressedButtons.trackpad || this.touchedButtons.trackpad;
    var isTriggerActive = this.pressedButtons.trigger || this.touchedButtons.trigger;
    var isABXYActive = this.touchedButtons.AorX || this.touchedButtons.BorY;
    var isVive = isViveController(this.el.components['tracked-controls']);

    // Works well with Oculus Touch and Windows Motion Controls, but Vive needs tweaks.
    if (isVive) {
      if (isGripActive || isTriggerActive) {
        gesture = ANIMATIONS.fist;
      } else if (isTrackpadActive) {
        gesture = ANIMATIONS.point;
      }
    } else {
      if (isGripActive) {
        if (isSurfaceActive || isABXYActive || isTrackpadActive) {
          gesture = isTriggerActive ? ANIMATIONS.fist : ANIMATIONS.point;
        } else {
          gesture = isTriggerActive ? ANIMATIONS.thumbUp : ANIMATIONS.pointThumb;
        }
      } else if (isTriggerActive) {
        gesture = ANIMATIONS.hold;
      }
    }

    return gesture;
  },

  /**
   * 从模型 clips 动画列表中根据手势获取动画 clip
   * Play corresponding clip to a gesture
   */
  getClip: function (gesture) {
    var clip;
    var i;
    for (i = 0; i < this.clips.length; i++) {
      clip = this.clips[i];
      if (clip.name !== gesture) { continue; }
      return clip;
    }
  },

  /**
   * 播放手势动画
   * Play gesture animation.
   *
   * @param {string} gesture - Which pose to animate to. If absent, then animate to open.
   * @param {string} lastGesture - Previous gesture, to reverse back to open if needed.
   */
  animateGesture: function (gesture, lastGesture) {
    if (gesture) {
      this.playAnimation(gesture || ANIMATIONS.open, lastGesture, false);
      return;
    }

    // If no gesture, then reverse the current gesture back to open pose.
    this.playAnimation(lastGesture, lastGesture, true);
  },

  /**
   * 触发事件
   * Emit `hand-controls`-specific events.
   */
  emitGestureEvents: function (gesture, lastGesture) {
    var el = this.el;
    var eventName;

    if (lastGesture === gesture) { return; }

    // Emit event for lastGesture not inactive.
    eventName = getGestureEventName(lastGesture, false);
    if (eventName) { el.emit(eventName); }

    // Emit event for current gesture now active.
    eventName = getGestureEventName(gesture, true);
    if (eventName) { el.emit(eventName); }
  },

  /**
   * 播放手势动画
   * Play hand animation based on button state.
   *
   * @param {string} gesture - Name of the animation as specified by the model.
   * @param {string} lastGesture - Previous pose.
   * @param {boolean} reverse - Whether animation should play in reverse.
   */
  playAnimation: function (gesture, lastGesture, reverse) {
    var clip;
    var fromAction;
    var mesh = this.el.getObject3D('mesh');
    var toAction;

    if (!mesh) { return; }

    // Stop all current animations.
    mesh.mixer.stopAllAction();

    // Grab clip action.
    clip = this.getClip(gesture);
    toAction = mesh.mixer.clipAction(clip);
    toAction.clampWhenFinished = true;
    toAction.loop = window.THREE.LoopRepeat;
    toAction.repetitions = 0;
    toAction.timeScale = reverse ? -1 : 1;
    toAction.time = reverse ? clip.duration : 0;
    toAction.weight = 1;

    // No gesture to gesture or gesture to no gesture.
    if (!lastGesture || gesture === lastGesture) {
      // Stop all current animations.
      mesh.mixer.stopAllAction();
      // Play animation.
      toAction.play();
      return;
    }

    // Animate or crossfade from gesture to gesture.
    clip = this.getClip(lastGesture);
    fromAction = mesh.mixer.clipAction(clip);
    fromAction.weight = 0.15;
    fromAction.play();
    toAction.play();
    fromAction.crossFadeTo(toAction, 0.15, true);
  }
});

/**
 * 获取手势事件名
 * Suffix gestures based on toggle state (e.g., open/close, up/down, start/end).
 *
 * @param {string} gesture
 * @param {boolean} active
 */
function getGestureEventName (gesture, active) {
  var eventName;

  if (!gesture) { return; }

  eventName = EVENTS[gesture];
  if (eventName === 'grip') {
    return eventName + (active ? 'close' : 'open');
  }
  if (eventName === 'point') {
    return eventName + (active ? 'up' : 'down');
  }
  if (eventName === 'pointing' || eventName === 'pistol') {
    return eventName + (active ? 'start' : 'end');
  }
}

function isViveController (trackedControls) {
  var controller = trackedControls && trackedControls.controller;
  var isVive = controller && (controller.id && controller.id.indexOf('OpenVR ') === 0 ||
    (controller.profiles &&
     controller.profiles[0] &&
     controller.profiles[0] === 'htc-vive'));
  return isVive;
}
