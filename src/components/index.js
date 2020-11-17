import ComTable from "./ComTable";
import Vue from "vue";
const commonComponents = {
  ComTable
};
const components = { ...commonComponents };
Object.keys(components).forEach(key =>
  Vue.component(components[key].name, components[key])
);
