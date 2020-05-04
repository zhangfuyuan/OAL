import { editRule } from './service';

const Model = {
  namespace: 'workAttendanceRuleEdit',
  state: {
  },
  effects: {
    // 获取规则详情
    *getDetails({ payload }, { call, put, select }) {
      console.log(8126, '获取规则详情', payload);
      const response = yield call(editRule, payload);
      return Promise.resolve(response);
    },
    // 编辑规则
    *edit({ payload }, { call, put, select }) {
      console.log(8126, '编辑规则', payload);
      const response = yield call(editRule, payload);
      return Promise.resolve(response);
    },
  },
  reducers: {
  },
};

export default Model;
