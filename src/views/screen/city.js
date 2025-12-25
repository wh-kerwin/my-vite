import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Shader from "./utils/shader";
import Utils from "./utils/index";
import { Radar, Wall, Fly } from "./effect/index";

const CONFIG = {
  CITY_NAMES: ["CITY_UNTRIANGULATED"],
  FLOOR_NAMES: ["LANDMASS"],
  MODEL_PATH: "3dModules/shanghai.FBX",
  START_DELAY: 2000,
};

const radarData = [
  { position: { x: 666, y: 22, z: 0 }, radius: 150, color: "#ff0000", opacity: 0.5, speed: 2 },
  { position: { x: -666, y: 25, z: 202 }, radius: 320, color: "#efad35", opacity: 0.6, speed: 1 }
];

const wallData = [
  { position: { x: -150, y: 15, z: 100 }, speed: 0.5, color: "#efad35", opacity: 0.6, radius: 420, height: 120, renderOrder: 5 }
];

const flyData = [
  { source: { x: -150, y: 15, z: 100 }, target: { x: -666, y: 25, z: 202 }, range: 120, height: 100, color: "green", speed: 1, size: 30 },
  { source: { x: -150, y: 15, z: 100 }, target: { x: 666, y: 22, z: 0 }, height: 300, range: 150, color: "blue", speed: 1, size: 40 }
];
class City {
  constructor() {
    this.cityLoader = new FBXLoader();
    this.group = new THREE.Group();
    this.effectGroup = new THREE.Group();
    this.group.add(this.effectGroup);
    this.surroundLineMaterial = null;
    this.time = { value: 0 };
    this.StartTime = { value: 0 };
    this.isStart = false;

    this.init();
  }

  init() {
    this.loaderModel(CONFIG.MODEL_PATH).then(scene => {
      this.group.add(scene);
      scene.traverse((child) => {
        if (CONFIG.CITY_NAMES.includes(child.name)) {
          this.setCityMaterial(child);
          this.surroundLine(child);
        }
        if (CONFIG.FLOOR_NAMES.includes(child.name)) {
          this.setFloor(child);
        }

        setTimeout(() => {
          this.isStart = true;
          this.addEffects();
        }, CONFIG.START_DELAY);
      });
    });
  }

  addEffects() {
    radarData.forEach((data) => {
      const mesh = Radar(data);
      mesh.material.uniforms.time = this.time;
      this.effectGroup.add(mesh);
    });

    wallData.forEach((data) => {
      const mesh = Wall(data);
      mesh.material.uniforms.time = this.time;
      this.effectGroup.add(mesh);
    });

    flyData.forEach((data) => {
      const mesh = Fly(data);
      mesh.material.uniforms.time = this.time;
      mesh.renderOrder = 10;
      this.effectGroup.add(mesh);
    });
  }

  loaderModel(url) {
    return new Promise((resolve, reject) => {
      try {
        this.cityLoader.load(url, (model) => {
          resolve(model);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  setCityMaterial(object) {
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();

    const { geometry } = object;
    const { center, radius } = geometry.boundingSphere;
    const { max, min } = geometry.boundingBox;

    const size = new THREE.Vector3(
      max.x - min.x,
      max.y - min.y,
      max.z - min.z
    );

    Utils.forMaterial(object.material, (material) => {
      material.transparent = true;
      material.color.setStyle("#040912");

      material.onBeforeCompile = (shader) => {
        shader.uniforms.time = this.time;
        shader.uniforms.uStartTime = this.StartTime;
        shader.uniforms.uCenter = { value: center };
        shader.uniforms.uSize = { value: size };
        shader.uniforms.uMax = { value: max };
        shader.uniforms.uMin = { value: min };
        shader.uniforms.uTopColor = { value: new THREE.Color("#FFFFDC") };
        shader.uniforms.uSwitch = { value: new THREE.Vector3(0, 0, 0) };
        shader.uniforms.uDiffusion = { value: new THREE.Vector3(1, 120, 600) };
        shader.uniforms.uDiffusionCenter = { value: new THREE.Vector3(0, 0, 0) };
        shader.uniforms.uFlow = { value: new THREE.Vector3(1, 10, 20) };
        shader.uniforms.uColor = { value: new THREE.Color("#5588aa") };
        shader.uniforms.uFlowColor = { value: new THREE.Color("#5588AA") };
        shader.uniforms.uOpacity = { value: 1 };
        shader.uniforms.uRadius = { value: radius };
        shader.uniforms.uModRange = { value: 10 };
        shader.uniforms.uModWidth = { value: 1.5 };

        const fragment = `
          float distanceTo(vec2 src, vec2 dst) {
              float dx = src.x - dst.x;
              float dy = src.y - dst.y;
              float dv = dx * dx + dy * dy;
              return sqrt(dv);
          }

          float lerp(float x, float y, float t) {
              return (1.0 - t) * x + t * y;
          }

          vec3 getGradientColor(vec3 color1, vec3 color2, float index) {
              float r = lerp(color1.r, color2.r, index);
              float g = lerp(color1.g, color2.g, index);
              float b = lerp(color1.b, color2.b, index);
              return vec3(r, g, b);
          }

          varying vec4 vPositionMatrix;
          varying vec3 vPosition;

          uniform float time;
          uniform float uRadius;
          uniform float uOpacity;
          uniform float uModRange;
          uniform float uModWidth;
          uniform float uStartTime;

          uniform vec3 uMin;
          uniform vec3 uMax;
          uniform vec3 uSize;
          uniform vec3 uFlow;
          uniform vec3 uColor;
          uniform vec3 uCenter;
          uniform vec3 uSwitch;
          uniform vec3 uTopColor;
          uniform vec3 uFlowColor;
          uniform vec3 uDiffusion;
          uniform vec3 uDiffusionCenter;

          void main() {
        `;

        const fragmentColor = `
          vec3 distColor = outgoingLight;
          float dstOpacity = diffuseColor.a;

          float indexMix = vPosition.z / (uSize.z * 0.6);
          distColor = mix(distColor, uTopColor, indexMix);

          vec2 position2D = vec2(vPosition.x, vPosition.y);
          float mx = mod(vPosition.x, uModRange);
          float my = mod(vPosition.y, uModRange);
          float mz = mod(vPosition.z, uModRange);

          if (uDiffusion.x > 0.5) {
              float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
              float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));

              if (uLen < dTime && uLen > dTime - uDiffusion.y) {
                  float dIndex = sin((dTime - uLen) / uDiffusion.y * PI);
                  distColor = mix(uColor, distColor, 1.0 - dIndex);
              }

              if (uLen < dTime) {
                  if (mx < uModWidth || my < uModWidth || mz < uModWidth ) {
                      distColor = vec3(0.7);
                  }
              }
          }

          if (uFlow.x > 0.5) {
              float dTime = mod(time * uFlow.z, uSize.z);
              float topY = vPosition.z + uFlow.y;
              if (dTime > vPosition.z && dTime < topY) {
                  float dIndex = sin((topY - dTime) / uFlow.y * PI);
                  distColor = mix(distColor, uFlowColor,  dIndex);
              }
          }

          gl_FragColor = vec4(distColor, dstOpacity * uStartTime);
        `;

        shader.fragmentShader = shader.fragmentShader.replace("void main() {", fragment);
        shader.fragmentShader = shader.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );", fragmentColor);

        const vertex = `
          varying vec4 vPositionMatrix;
          varying vec3 vPosition;
          uniform float uStartTime;
          void main() {
          vPositionMatrix = projectionMatrix * vec4(position, 1.0);
          vPosition = position;
        `;

        const vertexPosition = `
          vec3 transformed = vec3(position.x, position.y, position.z * uStartTime);
        `;

        shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);
        shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", vertexPosition);
      };
    });
  }

  surroundLine(object) {
    const geometry = new THREE.EdgesGeometry(object.geometry);
    const worldPosition = new THREE.Vector3();
    object.getWorldPosition(worldPosition);

    const { max, min } = object.geometry.boundingBox;
    const size = new THREE.Vector3(
      max.x - min.x,
      max.y - min.y,
      max.z - min.z
    );

    const material = this.createSurroundLineMaterial({ max, min, size });
    const line = new THREE.LineSegments(geometry, material);
    line.name = "surroundLine";
    line.scale.copy(object.scale);
    line.rotation.copy(object.rotation);
    line.position.copy(worldPosition);

    this.effectGroup.add(line);
  }

  createSurroundLineMaterial({ max, min, size }) {
    if (this.surroundLineMaterial) { return this.surroundLineMaterial; }

    this.surroundLineMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: { value: new THREE.Color("#01adff") },
        uActive: { value: new THREE.Color("#FFFFFF") },
        time: this.time,
        uOpacity: { value: 1 },
        uMax: { value: max },
        uMin: { value: min },
        uRange: { value: 200 },
        uSpeed: { value: 0.2 },
        uStartTime: this.StartTime
      },
      vertexShader: Shader.surroundLine.vertexShader,
      fragmentShader: Shader.surroundLine.fragmentShader
    });

    return this.surroundLineMaterial;
  }

  setFloor(object) {
    Utils.forMaterial(object.material, (material) => {
      material.color.setStyle("#27597b");
    });
  }

  animate(dt) {
    if (dt > 1) { return false; }
    this.time.value += dt;

    if (this.isStart) {
      this.StartTime.value += dt * 0.5;
      if (this.StartTime.value >= 1) {
        this.StartTime.value = 1;
        this.isStart = false;
      }
    }
  }
}

export default City;