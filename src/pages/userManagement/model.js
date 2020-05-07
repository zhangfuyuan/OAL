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
      const response = yield call(getUserList, payload);
      // console.log('fetch response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'save',
          payload: data,
        });
      }
      return Promise.resolve(response);
    },
    *add({ payload }, { call }) {
      const response = yield call(addUser, payload);
      // console.log('add response-->', response);
      return Promise.resolve(response);
    },
    *operate({ payload }, { call, put }) {
      // console.log('operate payload--->', payload);
      const response = yield call(operateUser, payload);
      return Promise.resolve(response);
    },
    *modify({ payload }, { call }) {
      const response = yield call(modifyUser, payload);
      // console.log('add response-->', response);
      return Promise.resolve(response);
    },
    *handleState({ payload }, { call }) {
      const response = yield call(ajaxSetState, payload);
      // console.log('handleState response-->', response);
      return Promise.resolve(response);
    },
    *resetPsw({ payload }, { call, put }) {
      // console.log('operate payload--->', payload);
      const response = yield call(ajaxResetPsw, payload);
      return Promise.resolve(response);
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
