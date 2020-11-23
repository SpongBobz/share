import { login, getUser } from "@/api/user";
import { getAccessToken, setAccessToken, removeAccessToken } from "@/util/auth";

const state = {
  userInfo: null, // 用户信息
  menuList: [],
  accessToken: getAccessToken(), // token
  updateSize: null,
  changeNum: 0,
  dtMap: []
};

const mutations = {
  _setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  },
  _setUser(state, user) {
    state.userInfo = user.User;
    state.menuList = user.Module;
  },
  _setUpdateSize(state, value) {
    state.updateSize = value;
  },
  _setChangeNum(state, value) {
    state.changeNum = value;
  },
  setMap(state, value) {
    state.dtMap = value;
  },
  _changeNum(state) {
    state.changeNum++;
  }
};

const actions = {
  /**
   * @description 登录
   * @param {Object} userInfo 登录用户信息
   * @returns {boolean} true 登录成功  |  false 登录失败
   */
  login({ commit }, userInfo) {
    return login(userInfo)
      .then(async result => {
        if (result.Success) {
          commit("_setAccessToken", result.Data);
          setAccessToken(result.Data);
          return result;
        }
      })
      .catch(error => {
        return error;
      });
  },
  /**
   * @description 获取用户信息
   */
  async getUserInfo({ commit }) {
    return await getUser().then(res => {
      if (res.Success) {
        let data = res.Data;
        if (data.Module[0] && data.Module[0].Child.length) {
          data.Module = data.Module[0].Child.map(item => {
            return { ...item, url: item.Name.substring(4).toLowerCase() };
          });
          commit("_setUser", data);
          return { flag: true, path: "/onMap" };
        } else {
          this.dispatch("user/logout");
          return false;
        }
      }
      return res;
    });
  },

  /**
   * @description 退出登录，清空登录状态
   */
  logout({ commit }) {
    removeAccessToken();
    commit("_setAccessToken", null);
    commit("_setUser", {});
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
