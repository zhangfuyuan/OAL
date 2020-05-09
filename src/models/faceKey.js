import { getFaceKeyList, addFaceKey, updateFaceKey, deleteFaceKey } from '@/services/faceKey';
import { formatMessage } from 'umi-plugin-react/locale';

// 8126TODO 该模块待删
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
        faceKeyList: action.payload && action.payload.map(item => {
          const _item = item;
          _item && _item.name && (_item.name = formatMessage({ id: _item.name }));
          return _item;
        }) || action.payload,
      };
    },
  },
};
export default Model;
