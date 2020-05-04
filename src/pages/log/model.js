import { ajaxTest, ajaxLog, getDeviceList, ajaxUser } from './service';

const Model = {
  namespace: 'log',
  state: {
    deviceList: [],
    logList: [],
  },
  effects: {
    // 获取设备列表
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
    // 获取设备对应的记录数据
    *fetchLog({ payload }, { call, put, select }) {
      console.log(8126, '获取设备对应的记录数据', payload);
      const response = yield call(ajaxLog, payload);

      if (response.res > 0) {
        yield put({
          type: 'saveLogList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 获取分组树的数据
    *fetchGroupTree({ payload }, { call, put, select }) {
      console.log(8126, '获取分组树的数据', payload);
      const response = yield call(ajaxTest, payload);
      return Promise.resolve({
        ...response,
        data: [
          { id: '0', pid: '-1', name: '朗国电子科技', num: '149' },
          { id: '1', pid: '0', name: '长沙研发', num: '25' },
          { id: '1-0', pid: '1', name: '长沙研发用户1' },
          { id: '1-1', pid: '1', name: '长沙研发用户2' },
          { id: '2', pid: '1', name: '长沙研发子部门', num: '10' },
          { id: '2-0', pid: '2', name: '长沙研发子部门用户1' },
          { id: '3', pid: '0', name: '上海研发', num: '15' },
          { id: '3-0', pid: '3', name: '上海研发用户1' },
          { id: '4', pid: '3', name: '上海研发子部门', num: '10' },
          { id: '5', pid: '0', name: '广州总部', num: '109' },
          { id: '6', pid: '5', name: '营销中心', num: '10' },
          { id: '7', pid: '6', name: '营销中心子部门', num: '5' },
          { id: '8', pid: '5', name: '运营中心', num: '21' },
          { id: '9', pid: '8', name: '运营中心子部门', num: '5' },
          { id: '10', pid: '5', name: '研发中心', num: '78' },
          { id: '11', pid: '10', name: '软件一部', num: '40' },
          { id: '12', pid: '10', name: '软件二部', num: '38' },
          { id: '12-0', pid: '12', name: '软件二部用户1' },
          { id: '12-1', pid: '12', name: '软件二部用户2' },
          { id: '12-2', pid: '12', name: '软件二部用户3' },
          { id: '12-3', pid: '12', name: '软件二部用户4' },
          { id: '12-4', pid: '12', name: '软件二部用户5' },
          { id: '12-5', pid: '12', name: '软件二部用户6' },
          { id: '12-6', pid: '12', name: '软件二部用户7' },
          { id: '12-7', pid: '12', name: '软件二部用户8' },
          { id: '13', pid: '12', name: '软件二二部', num: '40' },
          { id: '14', pid: '13', name: '软件二二二部', num: '38' },
          { id: '15', pid: '0', name: '黑名单', num: '25' },
          { id: '16', pid: '0', name: '访客', num: '25' },
          { id: '16-0', pid: '16', name: '访客1' },
          { id: '16-1', pid: '16', name: '访客2' },
          { id: '16-2', pid: '16', name: '访客3' },
        ]
      });
    },
    // 添加授权
    *addAuthory({ payload }, { call, put, select }) {
      console.log(8126, '添加授权', payload);
      const response = yield call(ajaxTest, payload);
      return Promise.resolve(response);
    },
    // 根据分组节点获取对应用户列表
    *fetchUsersByNode({ payload }, { call, put, select }) {
      console.log(8126, '根据分组节点获取对应用户列表', payload);
      const response = yield call(ajaxUser, payload);
      return Promise.resolve(response);
    },
    // 移除授权
    *delAuthory({ payload }, { call, put, select }) {
      console.log(8126, '移除授权', payload);
      const response = yield call(ajaxTest, payload);
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
