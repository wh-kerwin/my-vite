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

class Screen {
  constructor(el) {
    this.container = document.querySelector(el);
    this.scene;
    this.camera;
    this.renderer;
    this.css2renderer;
    this.controls;
    this.city = new City({});
    this.tweenCamera;
    this.loader;
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.canvasHtmlGroup = new THREE.Group();
    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    this.initScene();
    this.initLight();
    // this.initAxesHelper();
    this.initCamera();
    this.initRenderer();
    this.initCss2renderer();
    this.initControls();
    this.initCanvasHtml();
    this.loaderSky("sky/night/");
    this.animate();
    this.flyto({ x: 14, y: 32, z: 430 });
    this.initClickEvent();
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    // this.scene.position.set(200, 0, 0);
    this.scene.add(this.city.group);
  }

  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(50);
    this.scene.add(axesHelper);
  }

  initLight() {
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    this.scene.add(light);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 1000);
    this.scene.add(directionalLight);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.size.width / this.size.height, 1, 10000);
    this.camera.position.set(3000, 2000, 1221);  // 相机位置 可以将对象挂载到window上 用 window.camera.position查看合适的角度
    //this.camera.lookAt(this.scene.position);
    this.camera.lookAt(this.scene.position);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      // preserveDrawingBuffer: true, // 是否保留绘制缓冲区
    });
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(new THREE.Color("#32373E"), 1);
    this.container.appendChild(this.renderer.domElement);
  }

  initCss2renderer() {
    this.css2renderer = new CSS2DRenderer();
    this.css2renderer.setSize(this.size.width, this.size.height);
    this.css2renderer.domElement.style.position = "absolute";
    this.css2renderer.domElement.style.top = "0px";
    // this.css2renderer.domElement.style.zIndex = 999999;
    this.css2renderer.domElement.style.pointerEvents = "none";
    this.container.appendChild(this.css2renderer.domElement);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    // this.controls.autoRotate = true;
    // this.controls.autoRotateSpeed = 0.5;
    this.controls.enablePan = true; // 启用平移
    this.controls.panSpeed = 0.5; // 平移速度
    this.controls.enableRotate = true; // 启用旋转
    this.controls.rotateSpeed = 0.5; // 旋转速度
    this.controls.minDistance = 1000;
    this.controls.maxDistance = 5000;
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
    this.controls.update();
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
    if (!this.css2renderer) {
      return;
    }
    this.css2renderer.render(this.scene, this.camera);
  }

  flyto(position) {
    if (this.tweenCamera) {this.tweenCamera.stop();}
    // 创建一个 tween 动画，将相机从当前位置移动到新位置
    this.tweenCamera = new TWEEN.Tween(this.camera.position)
      .to(new THREE.Vector3(position.x, position.y, position.z), 2000) // 移动到 (5, 0, 5)，持续时间 2000 毫秒
      .easing(TWEEN.Easing.Quadratic.InOut) // 使用线性插值
      .onUpdate(() => { // 更新相机的投影矩阵
        this.camera.lookAt(this.scene.position); // 使相机始终朝向场景中心
      })
      .start();
  }

  onWindowResize() {
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // 加载建筑上的贴图文字
  initCanvasHtml() {
    const data = [
      { text: "东方明珠", position: {x: -520.8185899721013, y: 254.31348041959666, z: 1334.4456044740848} },
      { text: "陆家嘴", position: {x: -374.9514172359461, y: 97.65854415606516, z: 539.1217592715113} },
      { text: "新天地", position: {x: -217.44272941156635, y: 41.237777709960966, z: 203.11301542389742} },
      { text: "松江大学城", position: {x: -282.8620062878682, y: 204.1691591314717, z: -634.8093208130131} },
      { text: "人民广场", position: {x: -6.7844973566450335, y: 103.49198288924137, z: -31.741284807192073} },
      { text: "宝山区", position: {x: 618.3054998026594, y: 34.94658279418956, z: -145.98597071841232} },
    ];
    data.forEach((item) => {
      if (item.position) {
        let domEle = document.createElement("div");
        domEle.className = "tag";
        domEle.innerHTML = `<div>${item.text}</div>
        <div>今日电耗：1892.01kwh</div>
        `;
        let domEleObj = new CSS2DObject(domEle);
        domEleObj.position.set( item.position.x, item.position.y, item.position.z );
        domEleObj.scale.set(50, 50, 50);
        this.scene.add(domEleObj);
      }
    });
  }

  // 鼠标点击事件
  initClickEvent() {
    this.container.addEventListener("click", (e) => {
      // 阻止默认行为
      e.preventDefault();
      // 创建Raycaster对象
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      // 计算与场景中对象的交点
      const intersects = raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
      // 获取第一个交点的位置
        const point = intersects[0].point;

        // 打印或处理点击位置的世界坐标
        console.log("Clicked at world coordinates:", point);
      }
    });
  }
}

export default Screen;