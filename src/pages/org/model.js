import { add, getOrg, modifyOrg, handleState, resetPsw } from './service';

const Model = {
  namespace: 'org',
  state: {
    orgList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getOrg, payload);
      // console.log('fetch response-->', response);
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
              type: 1,
              state: 0,
              _id: '5e8456cd2d93465736e3bff0',
              path: 'langogz',
              name: 'langogz',
              createAt: '2020-04-01T08:54:37.178Z',
              updateAt: '2020-04-20T08:22:47.149Z',
              __v: 0,
              contact: {
                nickName: '管理员',
                mobile: '13112201235',
                email: '',
              },
              creator: '代理人',
              saasName: '系统名称1',
            }, {
              type: 0,
              state: 1,
              _id: '5e8456cd2d9005736e3bff0',
              path: 'admin',
              name: 'admin',
              createAt: '2020-04-01T08:54:37.178Z',
              updateAt: '2020-04-20T08:22:47.149Z',
              __v: 0,
              contact: {
                nickName: '管理员',
                mobile: '13112201238',
                email: '',
              },
              creator: '代理人2',
              saasName: '系统名称2',
            }],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 23,
            },
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
      const response = yield call(add, payload);

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
    *update({ payload }, { call }) {
      const response = yield call(modifyOrg, payload);

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
      const response = yield call(handleState, payload);

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
    *resetPsw({ payload }, { call }) {
      const response = yield call(resetPsw, payload);

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
      // console.log('save org-:', action.payload);
      return {
        ...state,
        orgList: action.payload,
      };
    },
  },
};
export default Model;
