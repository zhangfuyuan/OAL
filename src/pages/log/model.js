import {
  ajaxTest,
  ajaxLog,
  ajaxDeviceList,
  ajaxGroupTree,
  ajaxAddAuthory,
  ajaxDelAuthory,
  ajaxPeopleByGroupId,
  ajaxPeopleTotal,
} from './service';

const Model = {
  namespace: 'log',
  state: {
    deviceList: [],
    logList: {},
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
    // 获取设备对应的记录数据
    *fetchLog({ payload }, { call, put, select }) {
      const response = yield call(ajaxLog, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveLogList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 获取分组树的数据
    *fetchGroupTree({ payload }, { call, put, select }) {
      const response = yield call(ajaxGroupTree, payload);

      return Promise.resolve(response);
    },
    // 根据分组ID获取所有人员/访客信息
    *fetchPeopleByGroupId({ payload }, { call, put, select }) {
      const response = yield call(ajaxPeopleByGroupId, payload);

      return Promise.resolve(response);
    },
    // 查询人员及分组树根节点总数
    *fetchPeopleTotal({ payload }, { call, put, select }) {
      const response = yield call(ajaxPeopleTotal, payload);

      return Promise.resolve(response);
    },
    // 添加授权
    *addAuthory({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddAuthory, payload);

      return Promise.resolve(response);
    },
    // 根据分组节点获取对应用户列表
    // *fetchUsersByNode({ payload }, { call, put, select }) {
    //   const response = yield call(ajaxUser, payload);
    //   return Promise.resolve(response);
    // },
    // 移除授权
    *delAuthory({ payload }, { call, put, select }) {
      const response = yield call(ajaxDelAuthory, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
    saveLogList(state, action) {
      return {
        ...state,
        logList: action.payload,
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
