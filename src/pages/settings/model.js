import { getDevInfo, applyDevAccount, resetSecret } from './service';
import { getSysConfig, setSysConfig } from '@/services/sys';

const Model = {
  namespace: 'settingInfo',
  state: {
    devInfo: {}, // 开发者信息
    sysConfigs: [], // 系统设置
  },
  effects: {
    *getDevInfo(_, { call, put }) {
      const response = yield call(getDevInfo);
      // console.log('getDevInfo response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'saveDevInfo',
          payload: data,
        });
      }
      return Promise.resolve(response);
    },
    *applyDevAccount(_, { call, put }) {
      const response = yield call(applyDevAccount);
      // console.log('applyDevAccount response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'saveDevInfo',
          payload: data,
        });
      }
      return Promise.resolve(response);
    },
    *resetSecret(_, { call, put }) {
      const response = yield call(resetSecret);
      // console.log('resetSecret response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'saveDevInfo',
          payload: data,
        });
      }
      return Promise.resolve(response);
    },
    *toGetSysConfigs(_, { call, put }) {
      const response = yield call(getSysConfig);
      // console.log('toGetSysConfigs response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'saveSysConfig',
          payload: data,
        });
      }
    },
    *toSetSysConfigs({ payload }, { call, put }) {
      const response = yield call(setSysConfig, payload);
      // console.log('toSetSysConfigs response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'saveSysConfig',
          payload: data,
        });
      }
      return Promise.resolve(response);
    },
  },
  reducers: {
    saveDevInfo(state, action) {
      // console.log('save org-:', action.payload);
      return {
        ...state,
        devInfo: action.payload,
      };
    },
    saveSysConfig(state, action) {
      return {
        ...state,
        sysConfigs: action.payload,
      };
    },
  },
};
export default Model;
