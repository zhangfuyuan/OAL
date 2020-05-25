import { add, getOrg, modifyOrg, handleState, resetPsw, ajaxAssign } from './service';

const Model = {
  namespace: 'org',
  state: {
    orgList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getOrg, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    *add({ payload }, { call }) {
      const response = yield call(add, payload);

      return Promise.resolve(response);
    },
    *update({ payload }, { call }) {
      const response = yield call(modifyOrg, payload);

      return Promise.resolve(response);
    },
    *handleState({ payload }, { call }) {
      const response = yield call(handleState, payload);

      return Promise.resolve(response);
    },
    *resetPsw({ payload }, { call }) {
      const response = yield call(resetPsw, payload);

      return Promise.resolve(response);
    },
    *assign({ payload }, { call, put }) {
      const response = yield call(ajaxAssign, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
    save(state, action) {
      // console.log('save org-:', action.payload);
      return {
        ...state,
        orgList: action.payload,
      };
    },
  },
};
export default Model;
