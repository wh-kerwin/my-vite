/*
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐│
 *  ││Esc│!1 │@2 │#3 │$4 │%5 │^6 │&7 │*8 │(9 │)0 │_- │+= │|\ │`~ ││
 *  │├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴───┤│
 *  ││ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{[ │}] │ BS  ││
 *  │├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤│
 *  ││ Ctrl │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  ││
 *  │├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────┬───┤│
 *  ││ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│Shift │Fn ││
 *  │└─────┬──┴┬──┴──┬┴───┴───┴───┴───┴───┴──┬┴───┴┬──┴┬─────┴───┘│
 *  │      │Fn │ Alt │         Space         │ Alt │Win│   HHKB   │
 *  │      └───┴─────┴───────────────────────┴─────┴───┘          │
 *  └─────────────────────────────────────────────────────────────┘
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const buildingSweepingLightShader = {
  uniforms: {
    "boxH": {
      type: "f", // float
      value: -10.0 // box height
    }
  },
  vertexShader: ` // 顶点着色器
    varying vec3 vColor;
    varying float v_pz;
    void main() {
        vColor = color;
        v_pz = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // 将顶点坐标从局部坐标系变换到裁剪坐标系
    }
    `,
  fragmentShader: ` // 片元着色器
        uniform float boxH;
        varying vec3 vColor;
        varying float v_pz;
        float plot(float pct) {
            return smoothstep(pct-8.0, pct, v_pz) - smoothstep(pct, pct + 0.02, v_pz); // 0.02 表示透明度 
        }
        void main() {
            float f1 = plot(boxH);
            vec4 b1 = mix(vec4(0.9, 0.2, 1.0, 0.1), vec4(f1, f1, f1, 1.0), 0.1);

            gl_FragColor = mix(vec4(vColor, 1.0), b1, f1); // 将颜色与透明度混合
            gl_FragColor = vec4(vec3(gl_FragColor), 0.9); // 设置透明度
        }
    `
};
    

class Shade {
  constructor(el) {
    this.container = document.getElementById(el);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
    this.clock = null;
    this.size = {
      width: window.innerWidth - 310,
      height: window.innerHeight - 110
    };
    this.init();
  }

  init() {
    this._initScene();
    this._initCamera();
    this._initLight();
    this._initRenderer();
    this._initControls();
    this._initModel();
    this.animate();
  }

  _initScene() {
    this.scene = new THREE.Scene();
  }

  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(45,  this.size.width /  this.size.height, 0.1, 1000);
    this.camera.position.set(30, 40, 80);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  _initLight() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    let spotLight = new THREE.PointLight(0xffffff, 1);
    spotLight.position.set(5, 10, 20);
    spotLight.castShadow = true; // 开启阴影
    this.scene.add(spotLight);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setClearColor(0x0f2d48, 1.0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // 设置色调映射
    this.container.appendChild(this.renderer.domElement);
  }

  _initControls() {
    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  _initModel() {
    // 创建60个立方体模拟大楼
    for (let i = 0; i < 60; i++) {
      const height = Math.random() * 10 + 2;
      const width = 3;
      const cubeGeom = new THREE.BoxGeometry(width, height, width); // 创建立方体几何体
      const count = cubeGeom.attributes.position.count;
      cubeGeom.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3)); // 设置颜色属性
      const colors = cubeGeom.attributes.color;
      let r = Math.random() * 0.2,
        g = Math.random() * 0.1,
        b = Math.random() * 0.8;
          
      for (let j = 0; j < count; j++) {
        colors.setXYZ(j, r, g, b);
      }
      // 重置立方体顶部四边形顶点颜色
      const k = 2;
      colors.setXYZ(k * 4 + 0, .0, g, 1.0);
      colors.setXYZ(k * 4 + 1, .0, g, 1.0);
      colors.setXYZ(k * 4 + 2, .0, g, 1.0);
      colors.setXYZ(k * 4 + 3, .0, g, 1.0);

      const material = new THREE.ShaderMaterial({
        uniforms: buildingSweepingLightShader.uniforms,
        vertexShader: buildingSweepingLightShader.vertexShader,
        fragmentShader: buildingSweepingLightShader.fragmentShader,
        vertexColors: buildingSweepingLightShader
      });
      material.needsUpdate = true;
      const cube = new THREE.Mesh(cubeGeom, material); // 创建立方体网格
      cube.position.set(Math.random() * 100 - 50, height / 2, Math.random() * 100 - 50);
      this.scene.add(cube);

      // 绘制边框线
      const lineGeom = new THREE.EdgesGeometry(cubeGeom); // 创建立方体边框线几何体
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x018BF5,
        linewidth: 1,
        linecap: "round",
        linejoin: "round"
      });
      const line = new THREE.LineSegments(lineGeom, lineMaterial);
      line.scale.copy(cube.scale); // 复制立方体缩放比例
      line.position.copy(cube.rotation); // 复制立方体旋转角度
      line.position.copy(cube.position); // 复制立方体位置
      this.scene.add(line);
    }
  }

  animate() {
    this._update();
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  _update() {
    const delta = this.clock.getDelta(); // 获取自上次调用的时间差
    this.controls.update(delta); // 更新控制器
      
    buildingSweepingLightShader.uniforms.boxH.value += 0.1; // 更新时间
    if (buildingSweepingLightShader.uniforms.boxH.value > 10) {
      buildingSweepingLightShader.uniforms.boxH.value = -10; // 循环时间
    }
  }
}

export default Shade;