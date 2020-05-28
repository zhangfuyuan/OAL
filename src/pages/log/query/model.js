import { ajaxTest, ajaxLogQuery, ajaxDeviceList, ajaxDelLogQuery } from './service';

const Model = {
  namespace: 'logQuery',
  state: {
    deviceList: [],
    logQueryList: {},
  },
  effects: {
    // 获取设备列表
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(ajaxDeviceList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveDeviceList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 获取设备对应的记录查询
    *fetchLogQuery({ payload }, { call, put, select }) {
      const response = yield call(ajaxLogQuery, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveLogQueryList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 导出
    *export({ payload }, { call, put, select }) {
      const response = yield call(ajaxTest, payload);

      return Promise.resolve(response);
    },
    *delLogQuery({ payload }, { call, put, select }) {
      const response = yield call(ajaxDelLogQuery, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
    saveLogQueryList(state, action) {
      return {
        ...state,
        logQueryList: action.payload,
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
