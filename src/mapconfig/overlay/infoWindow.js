import Overlay from "ol/Overlay";
function infoWindow(content, options) {
  if (!content) {
    this.content = "";
  }
  this.options = options;
  this.contents = content;
  // 设置信息框是否随着地图移动
  if (!this.options.autoPan) {
    this.options.autoPan = false;
  }

  // 偏移
  if (!this.options.offset) {
    this.options.offset = [0, 0];
  }
  if (!this.options.id) {
    this.options.id = "popup";
  }
  this.init();
}

infoWindow.prototype.init = function() {
  // 创建信息框的主体
  this.popup = document.createElement("div");
  this.popup.id = this.options.id;
  this.popup.className = "ol-popup";
  this.options.width
    ? (this.popup.style.width = this.options.width + "px")
    : "";
  this.options.height
    ? (this.popup.style.height = this.options.height + "px")
    : "";

  // 创建关闭按钮
  this.closer = document.createElement("a");
  this.closer.id = "popup-closer";
  this.closer.className = "ol-popup-closer";
  this.closer.href = "#";
  this.closer.onclick = () => {
    this.overlay.setPosition(undefined);
    this.popup.style.display = "none";
    this.closer.blur();
    if (this.closeCallback) {
      this.closeCallback();
    }
  };

  // 创建标题
  this.title = document.createElement("div");
  this.title.id = "popup-title";
  this.title.className = "ol-popup-title";
  this.name = "false";

  // 创建存放信息的窗体内容
  this.content = document.createElement("div");
  this.content.id = "popup-content";
  this.content.innerHTML = this.contents;

  this.popup.appendChild(this.title);
  this.popup.appendChild(this.closer);
  this.popup.appendChild(this.content);
  document.body.appendChild(this.popup);

  this.overlay = new Overlay({
    element: this.popup,
    autoPan: this.options.autoPan,
    autoPanAnimation: {
      duration: 250
    },
    positioning: "bottom-center",
    offset: this.options.offset
  });

  this.options.map.addOverlay(this.overlay);
};

// 设置窗体宽高
infoWindow.prototype.setWidthAndHeight = function(width, height) {
  this.popup.style.width = width + "px";
  this.popup.style.height = height + "px";
};

// 设置窗体标题
infoWindow.prototype.setTitle = function(title) {
  this.title.innerHTML = title;
};

// 设置窗体的内容
infoWindow.prototype.setContent = function(content) {
  this.content.innerHTML = content;
};

// 返回窗体的内容
infoWindow.prototype.getContent = function() {
  return this.content.innerText;
};

// 设置信息窗体的地理坐标
infoWindow.prototype.setPosition = function(point) {
  this.overlay.setPosition([point.x, point.y]);
};

// 返回窗体位置
infoWindow.prototype.getPosition = function() {
  let events = this.overlay.getPosition();
  if (events) {
    return [{ x: events[0], y: events[1] }];
  } else {
    return [];
  }
};

export default infoWindow;
