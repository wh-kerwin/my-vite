import * as THREE from "three";
// import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

class Tokyo3D {
  constructor(el) {
    this.container = document.querySelector(el);
    this.mixer;
    this.clock = new THREE.Clock();
    // this.stats = new Stats();
    this.pmremGenerator;
    this.scene;
    this.camera;
    this.dracoLoader;
    this.renderer;
    this.controls;
    this.loader;
    this.init();
  }
  init() {
    // this.container.appendChild(this.stats.dom);
    // 初始化渲染器
    this.initRender();
    // 初始化场景
    this.initScene();
    // 初始化相机
    this.initCamera();
    // 初始化轨道控制器
    this.initControls();
    this.initLoader();
    // 监听场景大小改变，重新渲染尺寸
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }
  
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbfe3dd );
    this.scene.environment = this.pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera( 40, (window.innerWidth - 310) / (window.innerHeight - 90), 1, 100 );
    this.camera.position.set( 5, 2, 8 );
  }

  initDracoLoader() {
    this.dracoLoader = new DRACOLoader();
    //解压缩路径
    this.dracoLoader.setDecoderPath( "/gltf/" );
    this.dracoLoader.setDecoderConfig( { type: "js" } ); // 使用 JavaScript 解码器
    this.dracoLoader.preload(); // 预加载解压缩器
  }

  initRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth - 310, window.innerHeight - 90);
    this.container.appendChild(this.renderer.domElement);
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
  }

  initControls() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.target.set( 0, 0.5, 0 );
    this.controls.update();
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
  }

  initLoader() {
    this.loader = new GLTFLoader();
    this.initDracoLoader();
    this.loader.setDRACOLoader( this.dracoLoader );
    
    this.loader.load("3dModules/LittlestTokyo.glb", (gltf) => {
      const model = gltf.scene;
      model.position.set(1, 1, 0);
      model.scale.set(0.01, 0.01, 0.01);
      this.scene.add(model);
      console.log(gltf);
      this.mixer = new THREE.AnimationMixer( model );
      this.mixer.clipAction( gltf.animations[ 0 ] ).play();

      // 添加灯光
      //   const light = new THREE.HemisphereLight( 0xbbbbff, 0x444444 );
      //   light.position.set( 0.5, 1, 0.75 );
      //   this.scene.add( light );

      this.animate();
    }, undefined, function ( e ) {
      console.error( e );
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();
    this.mixer.update(delta);
    // this.stats.update();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    console.log();
    this.camera.aspect = (window.innerWidth - 310) / (window.innerHeight - 90);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth - 310, window.innerHeight - 90);
  }
}

export default Tokyo3D;