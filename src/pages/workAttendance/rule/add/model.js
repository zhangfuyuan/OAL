import { ajaxAddRule } from './service';

const Model = {
  namespace: 'workAttendanceRuleAdd',
  state: {
  },
  effects: {
    // 添加规则
    *add({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddRule, payload);


      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {}
        });
      }
    },
  },
  reducers: {
  },
};

export default Model;
