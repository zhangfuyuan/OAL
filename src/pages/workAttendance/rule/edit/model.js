import { ajaxRuleById, ajaxEditRule } from './service';

const Model = {
  namespace: 'workAttendanceRuleEdit',
  state: {
  },
  effects: {
    // 获取规则详情
    *getDetails({ payload }, { call, put, select }) {
      const response = yield call(ajaxRuleById, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {
            _id: '5e8456cd2d93465736e3bff0',
            name: '规则名称2222',
            workAttendanceTimes: [
              {
                workStartTime: '09:00',
                workEndTime: '12:00',
                workAttendanceStartTime: '08:00',
                workAttendanceEndTime: '12:30',
              },
              {
                workStartTime: '14:00',
                workEndTime: '18:00',
                workAttendanceStartTime: '13:00',
                workAttendanceEndTime: '21:00',
              },
            ],
          }
        });
      }
    },
    // 编辑规则
    *edit({ payload }, { call, put, select }) {
      const response = yield call(ajaxEditRule, payload);

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
