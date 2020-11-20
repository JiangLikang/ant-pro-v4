import {  getGlobalMenu } from '@/services/user';
const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    menu: [],
  },
  effects: {
    *fetchMenu(_, { call, put, select }) {
      const data = yield call(getGlobalMenu);
      yield put({
        type: 'save',
        payload: {
          menu: data?.data
        }
      })
    },
  },
  reducers: {
    save(state, { payload = {} }) {
      return { ...state, ...payload };
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
  },
};
export default GlobalModel;
