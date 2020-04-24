import { demoAjax1, demoAjax2 } from './service';

const Model = {
  namespace: 'faceVisitor',
  state: {
    demoState: {},
    demoList: {},
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const response = yield call(demoAjax1);

      if (response.res > 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    *fetchList({ payload }, { call, put, select }) {
      const response = yield call(demoAjax2, payload);

      if (response.res > 0) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        demoState: action.payload,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        demoList: action.payload,
      };
    },
  },
};

export default Model;
