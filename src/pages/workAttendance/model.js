import { getAttendList, getPerAttendList, getDeviceList } from './service';

const Model = {
  namespace: 'report',
  state: {
    attendList: {},
    perAttendList: [],
    deviceList: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAttendList, payload);
      if (response.res > 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      return Promise.resolve(response);
    },
    *fetchNoPage({ payload }, { call, put }) {
      const response = yield call(getAttendList, payload);
      return Promise.resolve(response);
    },
    *getPerAttendList({ payload }, { call, put }) {
      const response = yield call(getPerAttendList, payload);
      if (response.res > 0) {
        yield put({
          type: 'savePerAttendList',
          payload: response.data,
        });
      }
      return Promise.resolve(response);
    },
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
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        attendList: action.payload,
      };
    },
    savePerAttendList(state, action) {
      return {
        ...state,
        perAttendList: action.payload,
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
