import {
  ajaxGetDevInfo,
  ajaxSetDevInfo,
  ajaxDelDevInfo,
  // applyDevAccount,
  // resetSecret,
  ajaxAlarmSendSettings,
  ajaxAlarmReceiveSettings,
  ajaxAlarmEvents,
  ajaxAlarmContent,
  ajaxGetAlarmSet,
  ajaxAuthorizationEnvironment,
  ajaxDeviceCode,
} from './service';
import { getSysConfig, setSysConfig } from '@/services/sys';

const Model = {
  namespace: 'settingInfo',
  state: {
    // devInfo: {}, // 开发者信息
    sysConfigs: [], // 系统设置
  },
  effects: {
    *getDevInfo(_, { call, put }) {
      const response = yield call(ajaxGetDevInfo);

      return Promise.resolve(response);
    },
    *setDevInfo({ payload }, { call, put }) {
      const response = yield call(ajaxSetDevInfo, payload);

      return Promise.resolve(response);
    },
    *deltDevInfo({ payload }, { call, put }) {
      const response = yield call(ajaxDelDevInfo, payload);

      return Promise.resolve(response);
    },
    // *applyDevAccount(_, { call, put }) {
    //   const response = yield call(applyDevAccount);
    //   const { res, data } = response;
    //   if (res > 0) {
    //     yield put({
    //       type: 'saveDevInfo',
    //       payload: data,
    //     });
    //   }
    //   return Promise.resolve(response);
    // },
    // *resetSecret(_, { call, put }) {
    //   const response = yield call(resetSecret);
    //   const { res, data } = response;
    //   if (res > 0) {
    //     yield put({
    //       type: 'saveDevInfo',
    //       payload: data,
    //     });
    //   }
    //   return Promise.resolve(response);
    // },
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
    // 告警设置-发送设置
    *alarmSendSettings({ payload }, { call, put }) {
      const response = yield call(ajaxAlarmSendSettings, payload);

      return Promise.resolve(response);
    },
    // 告警设置-接收设置
    *alarmReceiveSettings({ payload }, { call, put }) {
      const response = yield call(ajaxAlarmReceiveSettings, payload);

      return Promise.resolve(response);
    },
    // 告警设置-告警事件
    *alarmEvents({ payload }, { call, put }) {
      const response = yield call(ajaxAlarmEvents, payload);

      return Promise.resolve(response);
    },
    // 告警设置-告警内容
    *alarmContent({ payload }, { call, put }) {
      const response = yield call(ajaxAlarmContent, payload);

      return Promise.resolve(response);
    },
    // 获取告警设置
    *getAlarmSet({ payload }, { call, put }) {
      const response = yield call(ajaxGetAlarmSet, payload);

      return Promise.resolve(response);
    },
    // 检测授权环境
    *fetchAuthorizationEnvironment({ payload }, { call, put }) {
      const response = yield call(ajaxAuthorizationEnvironment, payload);

      return Promise.resolve(response);
    },
    // 获取设备码
    *fetchDeviceCode({ payload }, { call, put }) {
      const response = yield call(ajaxDeviceCode, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
    saveSysConfig(state, action) {
      return {
        ...state,
        sysConfigs: action.payload,
      };
    },
  },
};
export default Model;
