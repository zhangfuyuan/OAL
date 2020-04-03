import { getFaceKeyList, addFaceKey, updateFaceKey, deleteFaceKey } from '@/services/faceKey';

const Model = {
  namespace: 'faceKey',
  state: {
    faceKeyList: [], // 人脸属性列表
  },
  effects: {
    *getFaceKeyList({ payload }, { call, put }) {
      const response = yield call(getFaceKeyList, payload);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'saveFaceKey',
          payload: data,
        });
      }
      return Promise.resolve(response);
    },
    *addFaceKey({ payload }, { call, put }) {
      const response = yield call(addFaceKey, payload);
      return Promise.resolve(response);
    },
    *updateFaceKey({ payload }, { call, put }) {
      const response = yield call(updateFaceKey, payload);
      return Promise.resolve(response);
    },
    *deleteFaceKey({ payload }, { call, put }) {
      const response = yield call(deleteFaceKey, payload);
      return Promise.resolve(response);
    },
  },
  reducers: {
    saveFaceKey(state, action) {
      return {
        ...state,
        faceKeyList: action.payload,
      };
    },
  },
};
export default Model;
