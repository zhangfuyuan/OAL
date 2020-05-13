import { demoAjax1, demoAjax2 } from './service';

const Model = {
  namespace: 'attendanceRecord',
  state: {
    recordList: [],
  },
  effects: {
    // 获取统计列表
    *fetchList({ payload }, { call, put, select }) {
      const response = yield call(demoAjax2, payload);

      if (response.res > 0) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // 获取考勤规则选项
    *fetchAttendanceRuleList({ payload }, { call, put, select }) {
      const response = yield call(demoAjax1, payload);

      return Promise.resolve({
        ...response,
        data: [
          {
            ruleName: '考勤规则1',
            _id: '1',
          },
          {
            ruleName: '考勤规则2',
            _id: '2',
          },
          {
            ruleName: '考勤规则3',
            _id: '3',
          },
        ]
      });
    },
    // 导出
    *export({ payload }, { call, put, select }) {
      const response = yield call(demoAjax1, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        recordList: action.payload,
      };
    },
  },
};

export default Model;
