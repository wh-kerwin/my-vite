import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Valve3D {
  constructor(containerId) {
    this.container = document.querySelector(containerId);
    this.scene;
    this.camera;
    this.loader;
    this.renderer;
    this.controls;
    this.model = null;
    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initLight();
    this.initModel();
    this.initRenderer();
    this.initControl();
    this.playAnimate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x888888);
    this.scene.environment = new THREE.Color(0xcccccc);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth - 310) / (window.innerHeight - 90),
      0.1,
      100
    );
    this.camera.position.set(0.8, 0.8, 1.5);
  }

  initLight() {
    // 设置环境光
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // 添加球光源
    const hesLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hesLight.intensity = 0.6;
    this.scene.add(hesLight);
    // 自然光
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(0, 0, 15);
    this.scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight();
    dirLight2.position.set(0, 0, -15);
    this.scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight();
    dirLight3.position.set(15, 0, 0);
    this.scene.add(dirLight3);

    const dirLight4 = new THREE.DirectionalLight();
    dirLight4.position.set(-15, 0, 0);
    this.scene.add(dirLight4);

    const dirLight5 = new THREE.DirectionalLight();
    dirLight5.position.set(0, 15, 0);
    this.scene.add(dirLight5);

    const dirLight6 = new THREE.DirectionalLight();
    dirLight6.position.set(0, -15, 0);
    this.scene.add(dirLight6);

    const dirLight7 = new THREE.DirectionalLight();
    dirLight7.position.set(5, 15, 5);
    this.scene.add(dirLight7);

    const dirLight8 = new THREE.DirectionalLight();
    dirLight8.position.set(-5, -15, -5);
    this.scene.add(dirLight8);
    // 聚光灯
    const sportLight = new THREE.SpotLight(0xffffff, 0.8);
    sportLight.angle = Math.PI / 8; //散射角度，跟水平线的夹角
    sportLight.penumbra = 0.1; // 聚光锥的半影衰减百分比
    sportLight.decay = 2; // 纵向：沿着光照距离的衰减量。
    sportLight.distance = 10;
    sportLight.shadow.radius = 10;
    // 阴影映射宽度，阴影映射高度
    sportLight.shadow.mapSize.set(512, 512);
    sportLight.position.set(0, 15, 0);
    // 光照射的方向
    sportLight.target.position.set(0, 0, 0);
    sportLight.castShadow = true;
    this.scene.add(sportLight);
  }

  // 加载模型
  initModel() {
    const loader = new GLTFLoader();
    loader.load("3dModules/motor3D.gltf", (gltf) => {
      this.model = gltf.scene;
      this.model.position.set(0, -0.8, 0);
      this.scene.add(this.model);
    });
  }

  // 初始化渲染器
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
      // alpha: true // 背景透明
    });
    this.renderer.setSize(window.innerWidth - 310, window.innerHeight - 90);
    this.container.appendChild(this.renderer.domElement);
  }

  // 添加控制器
  initControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
  }

  playAnimate() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
