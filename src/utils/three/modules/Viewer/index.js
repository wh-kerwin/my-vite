/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑     永不宕机     永无BUG
 */
/**
 * @description: threejs scene viewer
 * @return {*} viewer
 */
import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import MouseEvent from "../MouseEvent";
import SkyBoxs from "../SkyBoxs";
import Lights from "../Lights";

export default class Viewer {
  /**
     * @param {*} id 窗口
     */    
  constructor(id) {
    Cache.enabled = true; // 开启缓存
    this.container = document.getElementById(id);
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.controls = null;
    this.animateEventList = [];
    this.init();
  }

  /**
     * @description: 初始化
     */
  init() {
    // 创建渲染器
    this._initRenderer();
    // 创建相机
    this._initCamera();
    // 创建场景
    this._initScene();
    // 创建控制器
    this._initControls();

    this.animate();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true, // true/false表示是否开启反锯齿
      alpha: true, // true/false 表示是否可以设置背景色透明
      precision: "highp", // highp/mediump/lowp 表示着色精度选择
      premultipliedAlpha: true, // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
      // preserveDrawingBuffer: false, // true/false 表示是否保存绘图缓冲
      // physicallyCorrectLights: true, // true/false 表示是否开启物理光照
    });
    this.renderer.clearDepth();
    // this.renderer.domElement.style.zIndex = 1
    // 默认情况下，js的光强数值不真实。为了使得光强更趋于真实值，应该把渲染器的physicallyCorrectLights属性设为true
    // this.renderer.physicallyCorrectLights = true
    // this.renderer.toneMapping = ACESFilmicToneMapping // 尽管我们的贴图不是HDR，但使用tone mapping可以塑造更真实的效果。
    // this.renderer.toneMappingExposure = 4 // tone mapping的曝光度
    this.renderer.shadowMap.enabled = true; // 场景中的阴影自动更新
    // this.renderer.shadowMap.type = PCFSoftShadowMap // 设置渲染器开启阴影贴图，并将类型设为PCFSoftShadowMap
    this.renderer.outputEncoding = sRGBEncoding; // 这下我们可以看到更亮的材质，同时这也影响到环境贴图。
    this.container.appendChild(this.renderer.domElement);

    // 网页标签
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.zIndex = 2;
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.left = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";// 避免HTML标签遮挡三维场景的鼠标事件
    this.container.appendChild(this.labelRenderer.domElement);
    // 三维标签
    this.css3DRenderer = new CSS3DRenderer();
    this.css3DRenderer.domElement.style.zIndex = 0;
    this.css3DRenderer.domElement.style.position = "absolute";
    this.css3DRenderer.domElement.style.top = "0px";
    this.css3DRenderer.domElement.style.left = "0px";
    this.css3DRenderer.domElement.style.pointerEvents = "none";// 避免HTML标签遮挡三维场景的鼠标事件
    this.container.appendChild(this.css3DRenderer.domElement);
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.set(50, 0, 50);
    this.camera.lookAt(0, 0, 0);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("rgb(5,24,38)");
  }

  _initControls() {
    // 鼠标控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.screenSpacePanning = false; // 定义平移时如何平移相机的位置 控制不上下移动
    // this.controls.dampingFactor = 0.05;
    // this.controls.screenSpacePanning = true;
    // this.controls.minDistance = 10;
    // this.controls.maxDistance = 1000;
  }
  
  // 添加skybox
  _initSkybox() {
    if (!this.skyboxs) {this.skyboxs = new SkyBoxs(this);}
    this.skyboxs.addSkyBox();
  }

  // 灯光处理
  _initLight() {
    if (!this.lights) {this.lights = new Lights(this);}
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this._updateDom();
    this._renderDom();
    // 全局的公共动画函数，添加函数可同步执行
    this.animateEventList.forEach(event => {
      event.fun && event.content && event.fun(event.content);
    });
  }

  _renderDom() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    this.css3DRenderer.render(this.scene, this.camera);
  }

  _updateDom() {
    this.controls.update();
    // 更新参数
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight; // 摄像机视锥体的长宽比，通常是使用画布的宽/画布的高
    this.camera.updateProjectionMatrix(); // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用,来使得这些改变生效
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比
    this.labelRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.css3DRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  // 添加全局的公共动画函数
  addAnimateEvent(fun, content) {
    this.animateEventList.push({
      fun: fun,
      content: content
    });
  }
  
  // 移除全局的公共动画函数
  removeAnimateEvent(fun, content) {
    for (let i = 0; i < this.animateEventList.length; i++) {
      if (this.animateEventList[i].fun === fun && this.animateEventList[i].content === content) {
        this.animateEventList.splice(i, 1);
        break;
      }
    }
  }

  /**
     * 添加坐标轴
     */
  addAxis() {
    const axis = new THREE.AxesHelper(1000);
    this.scene.add(axis);
  }

  /**
     * 开启鼠标事件
     * @param mouseType
     * @param isSelect
     * @param callback
     */
  startSelectEvent(mouseType, isSelect, callback) {
    if (!this.mouseEvent) {this.mouseEvent = new MouseEvent(this, isSelect, callback, mouseType);}
    this.mouseEvent.startSelect();
  }

  /**
 * 关闭鼠标事件
 */
  stopSelectEvent() {
    if (this.mouseEvent) {
      this.mouseEvent.stopSelect();
    }
  }

  /**
 * 设置背景颜色
 * @param color rgb(4,4,4)
 */
  setBackground(color = "rgb(4,4,4)") {
    this.scene.background = new Color(color);
  }

  beforeDestroy() {
    this.scene.traverse((child) => {
      if (child.material) {
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
      child = null;
    });
    this.renderer.forceContextLoss();
    this.renderer.dispose();
    this.scene.clear();
  }
}