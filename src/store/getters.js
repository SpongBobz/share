const getters = {
  token: state => state.user.token,
  user: state => state.user.name,
  collapsed: state => state.layout.collapsed
};
export default getters;
