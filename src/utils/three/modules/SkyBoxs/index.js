/*
 *                   ___====-_  _-====___
 *             _--^^^#####//      \\#####^^^--_
 *          _-^##########// (    ) \\##########^-_
 *         -############//  |\^^/|  \\############-
 *       _/############//   (@::@)   \############\_
 *      /#############((     \\//     ))#############\
 *     -###############\\    (oo)    //###############-
 *    -#################\\  / VV \  //#################-
 *   -###################\\/      \//###################-
 *  _#/|##########/\######(   /\   )######/\##########|\#_
 *  |/ |#/\#/\#/\/  \#/\##\  |  |  /##/\#/  \/\#/\#/\#| \|
 *  `  |/  V  V  `   V  \#\| |  | |/#/  V   '  V  V  \|  '
 *     `   `  `      `   / | |  | | \   '      '  '   '
 *                      (  | |  | |  )
 *                     __\ | |  | | /__
 *                    (vvv(VVV)(VVV)vvv)
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *                神兽保佑            永无BUG
 */

/**
 * @description: 创建天空
 * @return {*}
 */
import * as THREE from "three";

export default class SkyBoxs {

  constructor(_viewer) {
    this.skyList = [ "night", "daytime" ];
    this.viewer = _viewer;
  }

  /**
 * @description: 添加雾效果
 * @return {*}
 */    
  addFog(color = "rgb(9,9,9)", near = 0.01, far = 50) {
    const scene = this.viewer.scene;
    scene.fog = new THREE.Fog(
      new THREE.Color(color),
      near,
      far
    );
  }

  removeFog() {
    const scene = this.viewer.scene;
    scene.fog = null;
  }

  /**
 * @description: 添加默认天空
 * @return {*}
 */  

  addSkyBox(index = 0) {
    const path = `sky/${this.skyList[index]}/`;
    const format = ".jpg";
    this.setSkyBox(path, format);
  }

  setSkyBox(path, format = ".jpg") {
    const skyLoader = new THREE.CubeTextureLoader();
    const paths = path || "sky/night/";
    const skyTexture = skyLoader.load([
      paths + "posx" + format, // 右
      paths + "negx" + format, // 左
      paths + "posy" + format, // 上
      paths + "negy" + format, // 下
      paths + "posz" + format, // 前
      paths + "negz" + format, // 后
    ]);
    skyTexture.encoding = THREE.sRGBEncoding;
    this.viewer.scene.background = skyTexture;
  }
}