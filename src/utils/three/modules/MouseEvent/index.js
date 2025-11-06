/*
 * _______________#########_______________________ 
 * ______________############_____________________ 
 * ______________#############____________________ 
 * _____________##__###########___________________ 
 * ____________###__######_#####__________________ 
 * ____________###_#######___####_________________ 
 * ___________###__##########_####________________ 
 * __________####__###########_####_______________ 
 * ________#####___###########__#####_____________ 
 * _______######___###_########___#####___________ 
 * _______#####___###___########___######_________ 
 * ______######___###__###########___######_______ 
 * _____######___####_##############__######______ 
 * ____#######__#####################_#######_____ 
 * ____#######__##############################____ 
 * ___#######__######_#################_#######___ 
 * ___#######__######_######_#########___######___ 
 * ___#######____##__######___######_____######___ 
 * ___#######________######____#####_____#####____ 
 * ____######________#####_____#####_____####_____ 
 * _____#####________####______#####_____###______ 
 * ______#####______;###________###______#________ 
 * ________##_______####________####______________ 
 */


import * as THREE from "three";

export default class MouseEvent {
  constructor(_viewer, _isSelect, _callback, _type="click") {
    this.viewer = _viewer;
    this.isSelect = _isSelect;
    this.callback = _callback;
    this.type = _type;
    this.composer = new THREE.EffectComposer(this.viewer.renderer);
    return this;
  }

  animate() {
    this.composer.render();
  }

  startSelect() {
    // 开始绑定点击事件
    this.stopSelect();
    this.bingEvent = this._event.bind(this, this); // 会是一个新的函数，第一个this与第二个this不一样
    this.viewer.renderer.domElement.addEventListener(this.type, this.bingEvent);
  }

  /**
   * 关闭鼠标事件
   */
  stopSelect () {
    this.viewer.renderer.domElement.removeEventListener(this.type, this.bingEvent);// 第一个this与第二个this不一样
  }

  _event (that, e) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (e.offsetX / that.viewer.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.offsetY / that.viewer.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, that.viewer.camera);
    const intersects = raycaster.intersectObject(that.viewer.scene, true);
    if (intersects.length > 0 && intersects[0]) {
      intersects[0] && that.callback(intersects[0].object, intersects[0].point);
    }
  }
}