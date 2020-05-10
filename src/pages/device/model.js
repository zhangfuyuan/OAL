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
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: {
            list: [{
              _id: '5ea956a43f6da70130b0f50c',
              name: 'dd',
              networkState: 1,
              mac: '00-00-00-00-00-00',
              ip: '210.21.98.89',
              deviceUuid: '402c7662cd7e00000000000000000000',
              createAt: '2020-04-29T10:27:48.149Z',
              heartbeatAt: '2020-04-29T10:27:48.149Z',
              firmwareVersion: '固件版本',
              deviceVersion: '软件版本',
              recognitionMode: '1',
              infraredThermometer: '1',
              alarm: false,
              relayOperationMode: '1',
              pwd: 'VFZSSmVrNUVWVEk9',
              temperatureUnit: '1',
              waitShutdownTime: '10',
              deviceType: 1,
              state: 1,
              org: '5e8216ca2d93465736e3bfe9',
              updateAt: '2020-04-29T10:27:48.149Z',
              __v: 0,
            }, {
              _id: '5ea956a43f6da7013080f50c',
              name: '888',
              networkState: 0,
              mac: '00-00-00-00-00-00',
              ip: '210.21.98.89',
              deviceUuid: '402c7662cd7e00000000000000000000',
              createAt: '2020-04-29T10:27:48.149Z',
              heartbeatAt: '2020-04-29T10:27:48.149Z',
              firmwareVersion: '固件版本',
              deviceVersion: '软件版本',
              recognitionMode: '0',
              infraredThermometer: '0',
              alarm: true,
              relayOperationMode: '0',
              pwd: 'VFZSSmVrNUVWVEk9',
              temperatureUnit: '0',
              waitShutdownTime: '10',
              deviceType: 1,
              state: 1,
              org: '5e8216ca2d93465736e3bfe9',
              updateAt: '2020-04-29T10:27:48.149Z',
              __v: 0,
            },],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 23,
            }
          },
        };
        yield put({
          type: 'save',
          payload: _response.data,
        });
        return Promise.resolve(_response);
      }
    },
    // 此乃 "设置" 接口
    *rename({ payload }, { call, put }) {
      const response = yield call(ajaxSetDeviceInfo, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(ajaxDeviceDelete, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
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
