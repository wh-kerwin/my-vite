const dragDialog = {
  mounted(el) {
    const dialogHeaderEl = el; // 当前 el 就是对话框内容部分
    const dragDom = el.closest(".el-dialog"); // 向上找到 .el-dialog 元素
    if (!dialogHeaderEl || !dragDom) {
      return;
    }
    dialogHeaderEl.style.cursor = "move";

    dialogHeaderEl.onmousedown = (e) => {
      const disX = e.clientX - dialogHeaderEl.getBoundingClientRect().left;
      const disY = e.clientY - dialogHeaderEl.getBoundingClientRect().top;

      const screenWidth = document.documentElement.clientWidth;
      const screenHeight = document.documentElement.clientHeight;

      const minLeft = 0;
      const maxLeft = screenWidth - dragDom.offsetWidth;
      const minTop = 0;
      const maxTop = screenHeight - dragDom.offsetHeight;

      document.onmousemove = function (e) {
        dragDom.style.cursor = "move";
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 处理横向边界
        if (left < minLeft) {
          left = minLeft;
        }
        if (left > maxLeft) {
          left = maxLeft;
        }

        // 处理纵向边界
        if (top < minTop) {
          top = minTop;
        }
        if (top > maxTop) {
          top = maxTop;
        }

        dragDom.style.left = `${left}px`;
        dragDom.style.top = `${top}px`;
        dragDom.style.margin = "0px";
      };

      document.onmouseup = function () {
        dragDom.style.cursor = "default";
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
  beforeUnmount(el) {
    el.onmousedown = null;
  },
};

export default dragDialog;
