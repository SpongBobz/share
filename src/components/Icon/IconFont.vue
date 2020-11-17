<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="'#icon-' + type"></use>
  </svg>
</template>

<script>
/**
 * @description 阿里字体图标，参照iconfont项目文件夹查看type
 * @example <icon-font type="ditu"></icon-font>
 */
import "./iconfont.js";
export default {
  name: "IconFont",
  props: {
    type: {
      type: String,
      required: true,
      default: "user"
    }
  }
};
</script>

<style>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
