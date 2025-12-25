/*
 * 
 *    ┏┓　　　┏┓
 *  ┏┛┻━━━┛┻┓
 *  ┃　　　　　　　┃
 *  ┃　　　━　　　┃
 *  ┃　＞　　　＜　┃
 *  ┃　　　　　　　┃
 *  ┃...　⌒　...　┃
 *  ┃　　　　　　　┃
 *  ┗━┓　　　┏━┛
 *      ┃　　　┃　
 *      ┃　　　┃
 *      ┃　　　┃
 *      ┃　　　┃  神兽保佑
 *      ┃　　　┃  代码无bug　　
 *      ┃　　　┃
 *      ┃　　　┗━━━┓
 *      ┃　　　　　　　┣┓
 *      ┃　　　　　　　┏┛
 *      ┗┓┓┏━┳┓┏┛
 *        ┃┫┫　┃┫┫
 *        ┗┻┛　┗┻┛
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import TWEEN from "tween.js/src/Tween.js";
import City from "./city";
import SkyBoxs from "@/utils/three/modules/SkyBoxs";

// 常量配置
const CONFIG = {
  INITIAL_CAMERA: { x: 3000, y: 2000, z: 1221 },
  INITIAL_TARGET: { x: 0, y: 0, z: 0 },
  INITIAL_FLYTO: { distance: 1000, height: 800, angle: 45 },
  CAMERA_FOV: 45,
  CAMERA_NEAR: 1,
  CAMERA_FAR: 10000,
  PIXEL_RATIO_LIMIT: 2,
  MIN_DISTANCE: 100,
  MAX_DISTANCE: 5000,
  DEFAULT_DURATION: 2000,
};

class Screen {
  constructor(el) {
    this.container = document.querySelector(el);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.css2renderer = null;
    this.controls = null;
    this.city = new City({});
    this.tweenCamera = null;
    this.tweenTarget = null;
    this.loader = null;
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.canvasHtmlGroup = new THREE.Group();
    this.clock = new THREE.Clock();
    this.isAnimating = false;
    this.labelData = [
      { text: "东方明珠", position: {x: -520.8185899721013, y: 254.31348041959666, z: 1334.4456044740848} },
      { text: "陆家嘴", position: {x: -374.9514172359461, y: 97.65854415606516, z: 539.1217592715113} },
      { text: "新天地", position: {x: -217.44272941156635, y: 41.237777709960966, z: 203.11301542389742} },
      { text: "松江大学城", position: {x: -282.8620062878682, y: 204.1691591314717, z: -634.8093208130131} },
      { text: "人民广场", position: {x: -6.7844973566450335, y: 103.49198288924137, z: -31.741284807192073} },
      { text: "宝山区", position: {x: 618.3054998026594, y: 34.94658279418956, z: -145.98597071841232} },
    ];
    this._onWindowResize = null;
    this._handleClick = null;
    this.init();
  }

  init() {
    this.initScene();
    this.initLight();
    this.initCamera();
    this.initRenderer();
    this.initCss2renderer();
    this.initControls();
    this.initCanvasHtml();
    this.loaderSky("sky/night/");
    this.animate();
    this.flyto(CONFIG.INITIAL_TARGET, CONFIG.INITIAL_FLYTO);
    this.initClickEvent();
    this._onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this._onWindowResize, false);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.add(this.city.group);
  }

  initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 1000);
    this.scene.add(directionalLight);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.CAMERA_FOV,
      this.size.width / this.size.height,
      CONFIG.CAMERA_NEAR,
      CONFIG.CAMERA_FAR
    );
    this.camera.position.set(CONFIG.INITIAL_CAMERA.x, CONFIG.INITIAL_CAMERA.y, CONFIG.INITIAL_CAMERA.z);
    this.camera.lookAt(this.scene.position);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.PIXEL_RATIO_LIMIT));
    this.renderer.setClearColor(new THREE.Color("#32373E"), 1);
    this.container.appendChild(this.renderer.domElement);
  }

  initCss2renderer() {
    this.css2renderer = new CSS2DRenderer();
    this.css2renderer.setSize(this.size.width, this.size.height);
    this.css2renderer.domElement.style.position = "absolute";
    this.css2renderer.domElement.style.top = "0px";
    this.css2renderer.domElement.style.pointerEvents = "none";
    this.container.appendChild(this.css2renderer.domElement);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.panSpeed = 0.5;
    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.minDistance = CONFIG.MIN_DISTANCE;
    this.controls.maxDistance = CONFIG.MAX_DISTANCE;
    this.controls.target.set(CONFIG.INITIAL_TARGET.x, CONFIG.INITIAL_TARGET.y, CONFIG.INITIAL_TARGET.z);
  }

  // 加载天空盒
  loaderSky(path) {
    const skyObj = new SkyBoxs(this);
    skyObj.setSkyBox(path);
    this.renderer.setClearAlpha(1);
  }

  animate() {
    const dt = this.clock.getDelta();
    this.city.animate(dt);
    requestAnimationFrame(this.animate.bind(this));

    if (this.controls) {
      this.controls.update();
    }

    TWEEN.update();

    this.renderer.render(this.scene, this.camera);

    if (this.css2renderer) {
      this.css2renderer.render(this.scene, this.camera);
    }
  }

  flyto(targetPosition, options = {}) {
    const {
      distance = 800,
      height = 600,
      angle = 45,
      duration = 2000
    } = options;

    if (this.tweenCamera) {
      this.tweenCamera.stop();
      this.tweenCamera = null;
    }
    if (this.tweenTarget) {
      this.tweenTarget.stop();
      this.tweenTarget = null;
    }

    this.isAnimating = true;

    if (this.controls) {
      this.controls.enabled = false;
    }

    const angleRad = (angle * Math.PI) / 180;
    const cameraPosition = {
      x: targetPosition.x + Math.cos(angleRad) * distance,
      y: targetPosition.y + height,
      z: targetPosition.z + Math.sin(angleRad) * distance
    };

    const lookAtTarget = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y,
      targetPosition.z
    );

    const startTarget = this.controls.target.clone();

    this.tweenCamera = new TWEEN.Tween(this.camera.position)
      .to(new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z), duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        this.camera.updateProjectionMatrix();
      })
      .onComplete(() => {
        this.isAnimating = false;
        if (this.controls) {
          this.controls.enabled = true;
          this.controls.target.copy(lookAtTarget);
        }
      })
      .start();

    this.tweenTarget = new TWEEN.Tween(startTarget)
      .to(lookAtTarget, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(() => {
        if (this.controls) {
          this.controls.target.copy(startTarget);
          this.camera.lookAt(this.controls.target);
        }
      })
      .start();
  }

  onWindowResize() {
    this.size.width = window.innerWidth;
    this.size.height = window.innerHeight;

    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.PIXEL_RATIO_LIMIT));

    if (this.css2renderer) {
      this.css2renderer.setSize(this.size.width, this.size.height);
    }
  }

  initCanvasHtml() {
    this.labelData.forEach((item) => {
      if (item.position) {
        const domEle = this.createLabelElement(item.text);
        const domEleObj = new CSS2DObject(domEle);
        domEleObj.position.set(item.position.x, item.position.y, item.position.z);
        domEleObj.scale.set(50, 50, 50);
        this.scene.add(domEleObj);
      }
    });
  }

  createLabelElement(text) {
    const domEle = document.createElement("div");
    domEle.className = "tag";
    domEle.innerHTML = `
      <div>${text}</div>
      <div>今日电耗：1892.01kwh</div>
    `;
    return domEle;
  }

  initClickEvent() {
    this._handleClick = this.handleClick.bind(this);
    this.container.addEventListener("click", this._handleClick);
  }

  handleClick(e) {
    e.preventDefault();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const object = intersects[0].object;

      console.log("Clicked at world coordinates:", point);
      console.log("Clicked object:", object.name || object.type);
    }
  }

  dispose() {
    if (this.tweenCamera) {
      this.tweenCamera.stop();
    }
    if (this.tweenTarget) {
      this.tweenTarget.stop();
    }

    if (this._onWindowResize) {
      window.removeEventListener("resize", this._onWindowResize);
    }
    if (this._handleClick) {
      this.container.removeEventListener("click", this._handleClick);
    }

    if (this.controls) {
      this.controls.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.container) {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
  }
}

export default Screen;