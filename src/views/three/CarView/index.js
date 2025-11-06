import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

class Car3D {
  constructor(el) {
    this.container = document.querySelector(el);
    this.scene;
    this.floorMesh; //添加地面
    this.camera;
    this.renderer;
    this.controls;
    this.carModel;
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      // 金属材质
      color: "#c0c0c0",
      metalness: 1,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });
    // 玻璃材质
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.25,
      roughness: 0,
      transparent: true,
      transmission: 1.0,
    });
    // 轮毂材质
    this.rimMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 1,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });
    this.detailsMaterial = new THREE.MeshStandardMaterial( {
      color: 0xffffff, 
      metalness: 1.0, 
      roughness: 0.5
    } );

    this.init();
  }

  get position() {
    return this.carModel.position;
  }

  init() {
    this.initScene();
    this.initFloor();
    this.initCamera();
    this.initLight();
    this.loadCarModel();
    this.initRenderer();
    this.initControls();
    this.playAnimation();
  }

  initScene() {
    // 初始化场景
    this.scene = new THREE.Scene();
    // 设置场景背景色为白色
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.environment = new THREE.Color(0xffffff);
  }

  initFloor() {
    // 初始化地面
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
      metalness: 0,
      roughness: 0.1,
    });
    floorMaterial.transparent = false;
    this.floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floorMesh.rotation.x = Math.PI / 2;
    this.floorMesh.position.setY(-0.385);
    this.scene.add(this.floorMesh);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      20,
      (window.innerWidth - 310) / (window.innerHeight - 90),
      0.1,
      100
    );
    this.camera.position.set(9.5, 0.5, 0.5);
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

  loadCarModel() {
    // 设置物体的位置为坐标原点(0,0,0)
    function toSceneCenter(object) {
      object.position.set(0, -0.28, 0);
      // 调整模型的方向
      // object.rotation.set(0, -Math.PI / 2, 0);
    }
    const loader = new GLTFLoader();
    const DracoLoader = new DRACOLoader();
    DracoLoader.setDecoderPath("/gltf/");
    loader.setDRACOLoader(DracoLoader);
    loader.load(
      "3dModules/ferrari.glb",
      (gltf) => {
        // this.carModel = gltf.scene;
        this.carModel = gltf.scene.children[0];
        this.carModel.getObjectByName( "body" ).material =  this.bodyMaterial;
        
        this.carModel.getObjectByName( "rim_fl" ).material = this.detailsMaterial;
        this.carModel.getObjectByName( "rim_fr" ).material = this.detailsMaterial;
        this.carModel.getObjectByName( "rim_rr" ).material = this.detailsMaterial;
        this.carModel.getObjectByName( "rim_rl" ).material = this.detailsMaterial;
        this.carModel.getObjectByName( "trim" ).material = this.detailsMaterial;

        this.carModel.getObjectByName( "glass" ).material = this.glassMaterial;

        // this.wheels.push(
        //   this.carModel.getObjectByName( "wheel_fl" ),
        //   this.carModel.getObjectByName( "wheel_fr" ),
        //   this.carModel.getObjectByName( "wheel_rl" ),
        //   this.carModel.getObjectByName( "wheel_rr" )
        // );

        // shadow
        const shadow = new THREE.TextureLoader().load( "3dModules/ferrari_ao.png" );
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
          new THREE.MeshBasicMaterial( {
            map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
          } )
        );
        mesh.rotation.x = - Math.PI / 2;
        mesh.renderOrder = 2;
        this.carModel.add( mesh );
        // this.carModel.traverse((obj) => {
        //   if (obj.isMesh) {
        //     // console.log(obj);
        //   }
        //   if (obj.isMesh && obj.name.includes("glass")) {
        //     obj.material = this.glassMaterial;
        //   } else if (obj.isMesh && obj.name.includes("Obj3d66-870414-5-220")) {
        //     // 更换车漆
        //     obj.material = this.bodyMaterial;
        //   } else if (
        //     obj.isMesh &&
        //     obj.name.includes("Obj3d66-870414-5-220_11")
        //   ) {
        //     // 更换轮毂
        //     obj.material = this.rimMaterial;
        //   } else if (obj.isMesh && obj.name.includes("chrome")) {
        //   } else if (obj.isMesh && obj.name.includes("tire")) {
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("Material")) {
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("brakedisk")) {
        //     // 刹车盘
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("black")) {
        //     // 车架
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("mattemetal")) {
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("mirror")) {
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("interior")) {
        //     // 车辆内部
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("white")) {
        //     // BMW车标白色
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("blue")) {
        //     // BMW车标蓝色
        //     // console.log(obj)
        //   } else if (obj.isMesh && obj.name.includes("RootNode")) {
        //     // BMW车标蓝色
        //     // console.log(obj)
        //   } else {
        //     // console.log(obj)
        //   }
        // });
        toSceneCenter(this.carModel);
        this.scene.add(this.carModel);
      },
      undefined,
      (error) => console.error(error)
    );

    // 添加物体阴影
    this.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  initRenderer() {
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); //设置抗锯齿
    //设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //解决加载gltf格式模型纹理贴图和原图不一样问题
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setSize(window.innerWidth - 310, window.innerHeight - 90);
    this.container.appendChild(this.renderer.domElement);
  }

  initControls() {
    // 添加控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // 阻尼效果
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = false;
    this.controls.enablePan = false; //// 禁用平移功能
    this.controls.maxDistance = 9; // 相机到目标点的最小和最大距离
    this.controls.minDistance = 6; // 极角的最小和最大角度
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = (60 / 360) * 2 * Math.PI;
  }

  playAnimation() {
    // 渲染循环
    const animate = () => {
      this.controls.update();
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  // 改变颜色
  setCarColor(color) {
    this.bodyMaterial.color.set(color);
  }
}

export default Car3D;
