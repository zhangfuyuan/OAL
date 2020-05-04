import { ajaxList, ajaxTest } from './service';

const Model = {
  namespace: 'faceVisitor',
  state: {
    visitorList: [],
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      const response = yield call(ajaxList, payload);

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
    saveList(state, action) {
      return {
        ...state,
        visitorList: action.payload,
      };
    },
  },
};

export default Model;
