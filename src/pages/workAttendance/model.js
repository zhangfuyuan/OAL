import { getAttendList, getDeviceList, fetchTest, ajaxSetState, ajaxRelation } from './service';

const Model = {
  namespace: 'report',
  state: {
    attendList: {},
    deviceList: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAttendList, payload);
      if (response && response.res > 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(getDeviceList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveDeviceList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 关联设备
    *ruleRelateDevice({ payload }, { call, put, select }) {
      const response = yield call(ajaxRelation, payload);

      return Promise.resolve(response);
    },
    // 删除考勤规则
    *deleteRule({ payload }, { call, put, select }) {
      const response = yield call(fetchTest, payload);

      return Promise.resolve(response);
    },
    // 禁用/启用规则
    *setState({ payload }, { call, put, select }) {
      const response = yield call(ajaxSetState, payload);

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
    saveDeviceList(state, action) {
      return {
        ...state,
        deviceList: action.payload,
      };
    },
  },
};
export default Model;
