import { addRule } from './service';

const Model = {
  namespace: 'workAttendanceRuleAdd',
  state: {
  },
  effects: {
    // 添加规则
    *add({ payload }, { call, put, select }) {
      console.log(8126, '添加规则', payload);
      const response = yield call(addRule, payload);
      return Promise.resolve(response);
    },
  },
  reducers: {
  },
};

export default Model;
