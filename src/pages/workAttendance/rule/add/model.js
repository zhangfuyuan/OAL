import { ajaxAddRule } from './service';

const Model = {
  namespace: 'workAttendanceRuleAdd',
  state: {
  },
  effects: {
    // 添加规则
    *add({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddRule, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
  },
};

export default Model;
