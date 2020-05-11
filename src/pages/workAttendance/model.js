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

        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: {
            list: [{
              _id: '5ea956a43f6da70130b0f50c',
              name: 'dd',
              workAttendanceTimes: [{
                workStartTime: '09:00',
                workEndTime: '12:00',
                workAttendanceStartTime: '08:00',
                workAttendanceEndTime: '12:30',
              }],
              state: 1,
              creator: '5e8216ca2d93465736e3bfea',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
            }, {
              _id: '5ea95111111111111111f50c',
              name: 'd1111111111111111d',
              workAttendanceTimes: [{
                workStartTime: '08:30',
                workEndTime: '18:00',
                workAttendanceStartTime: '08:00',
                workAttendanceEndTime: '19:30',
              }],
              state: 0,
              creator: '5e8216ca2d93465736e3bfea',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
            }, {
              _id: '5ea2222222222222222250c',
              name: 'dd',
              workAttendanceTimes: [{
                workStartTime: '09:00',
                workEndTime: '17:00',
                workAttendanceStartTime: '08:00',
                workAttendanceEndTime: '18:30',
              }],
              state: 1,
              creator: '5e8216ca2d93465736e3bfea',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
            }],
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
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(getDeviceList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveDeviceList',
          payload: response.data,
        });
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: [
            {
              _id: '5ea956a43f6da70130b0f50c',
              name: 'dd',
              relateRuleId: "5ea2222222222222222250c",
            },
            {
              _id: '5ea956a000000000080f50c',
              name: '888',
              relateRuleId: "5ea95111111111111111f50c",
            },
            {
              _id: '5ea956a00111111111111111f50c',
              name: '454545',
              relateRuleId: "5ea956a43f6da70130b0f50c",
            },
            {
              _id: '5ea952222222222222220f50c',
              name: 'fsdfds',
              relateRuleId: "5ea2222222222222222250c",
            },
            {
              _id: '5ea95333333333333330f50c',
              name: '是大是大非',
              relateRuleId: "5ea95111111111111111f50c",
            },
            {
              _id: '5ea94444444444444f50c',
              name: '啊实打实&*&（',
              relateRuleId: "5ea956a43f6da70130b0f50c",
            }, {
              _id: '5ea9111a43f6da70130b0f50c',
              name: 'dd',
              relateRuleId: "5ea2222222222222222250c",
            },
            {
              _id: '5ea95222000080f50c',
              name: '888',
              relateRuleId: "5ea95111111111111111f50c",
            },
          ],
        };

        yield put({
          type: 'saveDeviceList',
          payload: _response.data,
        });
        return Promise.resolve(_response);
      }
    },
    // 关联设备
    *ruleRelateDevice({ payload }, { call, put, select }) {
      const response = yield call(ajaxRelation, payload);

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
    // 删除考勤规则
    *deleteRule({ payload }, { call, put, select }) {
      console.log(8126, '删除考勤规则', payload);
      const response = yield call(fetchTest, payload);
      return Promise.resolve(response);
    },
    // 禁用/启用规则
    *setState({ payload }, { call, put, select }) {
      const response = yield call(ajaxSetState, payload);

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
