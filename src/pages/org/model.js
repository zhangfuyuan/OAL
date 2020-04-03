import { add, getOrg, modifyOrg, handleState } from './service';

const Model = {
  namespace: 'org',
  state: {
    orgList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getOrg, payload);
      console.log('fetch response-->', response);
      if (response.res > 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      return Promise.resolve(response);
    },
    *add({ payload }, { call }) {
      const response = yield call(add, payload);
      console.log('add response-->', response);
      return Promise.resolve(response);
    },
    *update({ payload }, { call }) {
      const response = yield call(modifyOrg, payload);
      console.log('update response-->', response);
      return Promise.resolve(response);
    },
    *handleState({ payload }, { call }) {
      const response = yield call(handleState, payload);
      console.log('handleState response-->', response);
      return Promise.resolve(response);
    },
  },
  reducers: {
    save(state, action) {
      console.log('save org-:', action.payload);
      return {
        ...state,
        orgList: action.payload,
      };
    },
  },
};
export default Model;
