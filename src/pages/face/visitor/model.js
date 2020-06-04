import { ajaxList, ajaxTest, getDeviceList, ajaxAddInfo, ajaxEditInfo, ajaxDeleteFace } from './service';

const Model = {
  namespace: 'faceVisitor',
  state: {
    visitorList: [],
    deviceList: [],
  },
  effects: {
    // 获取访客列表
    *fetchList({ payload }, { call, put, select }) {
      const response = yield call(ajaxList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // （单个）添加人脸信息（不包括图片）
    *addInfo({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddInfo, payload);

      return Promise.resolve(response);
    },
    // （单个）编辑人脸信息（不包括图片）
    *editInfo({ payload }, { call, put, select }) {
      const response = yield call(ajaxEditInfo, payload);

      return Promise.resolve(response);
    },
    // 删除访客
    *delVisitor({ payload }, { call, put, select }) {
      const response = yield call(ajaxDeleteFace, payload);

      return Promise.resolve(response);
    },
    // 获取设备列表
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(getDeviceList, payload);
      if (response.res > 0) {
        yield put({
          type: 'saveDeviceList',
          payload: response.data,
        });
      }
      return Promise.resolve(response);
    },
    // 关联设备
    *relateDevice({ payload }, { call, put, select }) {
      const response = yield call(ajaxTest, payload);

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
    saveDeviceList(state, action) {
      return {
        ...state,
        deviceList: action.payload,
      };
    },
  },
};

export default Model;
