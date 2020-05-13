import { getDeviceList, verifyDevice, removeDevice, renameDevice, ajaxSetDeviceInfo, ajaxDeviceDelete } from './service';
import { findIndex } from 'lodash'

const Model = {
  namespace: 'device',
  state: {
    deviceList: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getDeviceList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 此乃 "设置" 接口
    *rename({ payload }, { call, put }) {
      const response = yield call(ajaxSetDeviceInfo, payload);

      return Promise.resolve(response);
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(ajaxDeviceDelete, payload);

      return Promise.resolve(response);
    },
    *verify({ payload }, { call, put }) {
      const response = yield call(verifyDevice, payload);
      // console.log('verify response-->', response);
      return Promise.resolve(response);
    },
    // 暂不用，等有实时刷新在线状态的需求再实现
    *setDeviceInfo({ payload }, { call, put }) {
      // console.log('setNetState payload:', payload)
      yield put({
        type: 'setDevice',
        payload,
      });
    },
  },
  reducers: {
    save(state, action) {
      // console.log('save deviceList-:', action.payload);
      return {
        ...state,
        deviceList: action.payload,
      };
    },
    setDevice(state, action) {
      const { deviceList } = state;
      const deviceIndex = findIndex(deviceList, item => item._id === action.payload._id)
      // console.log('setDevice deviceIndex:', deviceIndex);
      if (deviceIndex !== -1) {
        deviceList[deviceIndex] = action.payload
      }
      return {
        ...state,
        deviceList,
      };
    },
  },
};
export default Model;
