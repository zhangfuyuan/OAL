import { ajaxTest, ajaxLogQuery, ajaxDeviceList } from './service';

const Model = {
  namespace: 'logQuery',
  state: {
    deviceList: [],
    logQueryList: [],
  },
  effects: {
    // 获取设备列表
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(ajaxDeviceList, payload);
      if (response.res > 0) {
        yield put({
          type: 'saveDeviceList',
          payload: response.data,
        });
      }
      return Promise.resolve(response);
    },
    // 获取设备对应的记录查询
    *fetchLogQuery({ payload }, { call, put, select }) {
      console.log(8126, '获取设备对应的记录查询', payload);
      const response = yield call(ajaxLogQuery, payload);

      if (response.res > 0) {
        yield put({
          type: 'saveLogQueryList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 导出
    *export({ payload }, { call, put, select }) {
      console.log(8126, '导出', payload);
      const response = yield call(ajaxTest, payload);
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
