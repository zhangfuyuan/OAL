import { addUser, getUserList, operateUser, modifyUser, ajaxSetState, ajaxResetPsw } from './service';

const Model = {
  namespace: 'userManagement',
  state: {
    userList: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getUserList, payload) || {};

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
              profile: {
                nickName: '管理员',
                email: '',
                mobile: '131****1239',
              },
              passwordVersion: 1,
              type: 0,
              state: 1,
              authErrorCount: 0,
              _id: '5e8216ca2d90065736e3bfea',
              userName: 'admin',
              password: 'b9ebb30994e859ad16812e349ccf089c',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-03-30T15:56:58.706Z',
              __v: 0,
              authAt: '2020-05-01T10:01:35.614Z',
              authErrorAt: '2020-04-30T06:25:26.445Z',
            }, {
              profile: {
                nickName: 'aasassasa',
                email: '',
                mobile: '13112201235',
              },
              passwordVersion: 1,
              type: 1,
              state: 0,
              authErrorCount: 0,
              _id: '5e8216ca2d90000036e3bfea',
              userName: 'qqqqq',
              password: 'b9ebb30994e859ad16812e349ccf089c',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-03-30T15:56:58.706Z',
              __v: 0,
              authAt: '2020-05-01T10:01:35.614Z',
              authErrorAt: '2020-04-30T06:25:26.445Z',
            }, {
              profile: {
                nickName: 'iii',
                email: 'asasdasdasdasdasdasdads@fsafds',
                mobile: '13112201235',
              },
              passwordVersion: 1,
              type: 1,
              state: 1,
              authErrorCount: 0,
              _id: '5e8216ca2000000036e3bfea',
              userName: 'dddddd',
              password: 'b9ebb30994e859ad16812e349ccf089c',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-03-30T15:56:58.706Z',
              __v: 0,
              authAt: '2020-05-01T10:01:35.614Z',
              authErrorAt: '2020-04-30T06:25:26.445Z',
            }],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 13,
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
    *add({ payload }, { call }) {
      const response = yield call(addUser, payload);

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
    *operate({ payload }, { call, put }) {
      // console.log('operate payload--->', payload);
      const response = yield call(operateUser, payload);
      return Promise.resolve(response);
    },
    *modify({ payload }, { call }) {
      const response = yield call(modifyUser, payload);

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
    *handleState({ payload }, { call }) {
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
    *resetPsw({ payload }, { call, put }) {
      const response = yield call(ajaxResetPsw, payload);

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
      // console.log('save userList-:', action.payload);
      return {
        ...state,
        userList: action.payload,
      };
    },
  },
};
export default Model;
