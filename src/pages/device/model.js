import { getDeviceList, verifyDevice, removeDevice, renameDevice } from './service';
import { findIndex } from 'lodash'

const Model = {
  namespace: 'device',
  state: {
    deviceList: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getDeviceList, payload) || {};
      // console.log('fetch response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'save',
          payload: data,
        });
      }
      return Promise.resolve(response);
    },
    *rename({ payload }, { call, put }) {
      const response = yield call(renameDevice, payload);
      // console.log('rename response-->', response);
      return Promise.resolve(response);
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(removeDevice, payload);
      // console.log('remove response-->', response);
      return Promise.resolve(response);
    },
    *verify({ payload }, { call, put }) {
      const response = yield call(verifyDevice, payload);
      // console.log('verify response-->', response);
      return Promise.resolve(response);
    },
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
