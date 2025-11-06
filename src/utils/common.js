/**
 * @description: 预加载图片
 * @param {*} url
 * @return {*}
 */
class PreloadImage {
  #load(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image at ${this.url}`));
      img.src = url;
    });
  }

  constructor(source) {
    this.imageUrls = source;
  }

  preload() {
    let list = [];
    this.imageUrls.forEach(element => {
      let p = this.#load(element);
      list.push(p);
    });

    Promise.all(list).then((images) => {
      // 所有图片加载完成后的处理逻辑
      console.log("所有图片加载完成");
      console.log(images);
    });
  }
}

export default PreloadImage;

// const imageUrls = [
//   "https://example.com/image1.jpg",
//   "https://example.com/image2.jpg",
//   "https://example.com/image3.jpg"
// ];

// const preloader = new PreloadImage(imageUrls);
// preloader.preload();