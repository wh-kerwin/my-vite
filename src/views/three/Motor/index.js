import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //导入轨道控制器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //导入GLTF模型加载器

class Motor3D {
  constructor(el) {
    this.container = document.querySelector(el);
    this.scene;
    this.camera;
    this.renderer;
    this.controls;
    this.light;
    this.init();
    this.animate();
  }

  init() {
    // 初始化场景
    this.initScene();
    // 初始化辅助轴
    this.initAxesHelper();
    // 初始化灯光
    this.initLight();
    // 初始化Mesh
    this.initMesh();
    // 初始化相机
    this.initCamera();
    // 初始化渲染器
    this.initRender();
    // 初始化轨道控制器
    this.initControls();
    // 监听场景大小改变，重新渲染尺寸
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  initScene() {
    this.scene = new Three.Scene();
    this.scene.background = new Three.Color(0xa0a0a0);
  }

  initAxesHelper() {
    const axesHelper = new Three.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  initLight() {
    // this.light = new Three.HemisphereLight(0xffffff, 0x444444);
    // this.light.position.set(0, 20, 0);
    // this.scene.add(this.light);

    const hesLight = new Three.HemisphereLight(0xffffff, 0x444444);
    hesLight.intensity = 0.6;
    this.scene.add(hesLight);

    const dirLight = new Three.DirectionalLight();
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);
  }

  initCamera() {
    this.camera = new Three.PerspectiveCamera(
      75,
      (window.innerWidth - 310) / (window.innerHeight - 90),
      0.1,
      1000
    );
    this.camera.position.set(1.5, 1.5, 1.5);
    // this.camera.lookAt(this.scene.position);
  }

  initRender() {
    this.renderer = new Three.WebGLRenderer({ antialias: true }); //设置抗锯齿
    //设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //渲染的尺寸大小
    this.renderer.setSize(window.innerWidth - 310, window.innerHeight - 90);
    // 添加到容器
    this.container.appendChild(this.renderer.domElement);
    //解决加载gltf格式模型纹理贴图和原图不一样问题
    this.renderer.outputEncoding = Three.sRGBEncoding;
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = (window.innerWidth - 310) / (window.innerHeight - 90);
    this.camera.updateProjectionMatrix(); //更新矩阵，将3d内容投射到2d画面上转换
    this.renderer.setSize(window.innerWidth - 310, window.innerHeight - 90);
  }

  initMesh() {
    this.addGLTFModel("motor3D.gltf");
    this.addGLTFModel("dalou3D.gltf");
  }
  // 加载模型
  addGLTFModel(url) {
    return new Promise((resolve) => {
      const loader = new GLTFLoader().setPath("3dModules/");
      loader.load(url, (gltf) => {
        this.scene.add(gltf.scene);
        resolve("gltf添加模型成功");
      });
    });
  }
}

export default Motor3D;
