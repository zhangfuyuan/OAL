import { ajaxRuleById, ajaxEditRule } from './service';

const Model = {
  namespace: 'workAttendanceRuleEdit',
  state: {
  },
  effects: {
    // 获取规则详情
    *getDetails({ payload }, { call, put, select }) {
      const response = yield call(ajaxRuleById, payload);

      return Promise.resolve(response);
    },
    // 编辑规则
    *edit({ payload }, { call, put, select }) {
      const response = yield call(ajaxEditRule, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
  },
};

export default Model;
