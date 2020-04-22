import { authByToken, query as queryUsers, modifyPsw, editSaasInfo, modifyUser } from '@/services/user';
import { AUTH_TOKEN, AUTH_AUTO_LOGIN } from '@/utils/constants'

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    org: {},
    modifyPwdLoading: false,
    menuList: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(authByToken);
      if (response.res > 0) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
        const isAuto = localStorage.getItem(AUTH_AUTO_LOGIN)
        if (isAuto) {
          localStorage.setItem(AUTH_TOKEN, response.data.token);
        } else {
          sessionStorage.setItem(AUTH_TOKEN, response.data.token);
        }
      }
      return Promise.resolve(response);
    },
    *modifyPassword({ payload }, { call, put }) {
      yield put({
        type: 'setModifyLoading',
        payload: true,
      });
      const response = yield call(modifyPsw, payload);
      if (response.res > 0) {
        yield put({
          type: 'setPswVersion',
          payload: response.data,
        });
      }
      yield put({
        type: 'setModifyLoading',
        payload: false,
      });
      return Promise.resolve(response);
    },
    *modifySaasInfo({ payload }, { call, put }) {
      yield put({
        type: 'setModifyLoading',
        payload: true,
      });
      const response = yield call(editSaasInfo, payload);
      if (response.res > 0) {
        yield put({
          type: 'setOrg',
          payload: response.data,
        });
      }
      yield put({
        type: 'setModifyLoading',
        payload: false,
      });
      return Promise.resolve(response);
    },
    *modifyUser({ payload }, { call, put }) {
      const response = yield call(modifyUser, payload);
      if (response.res > 0) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
      return Promise.resolve(response);
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      const _data = action.payload.data || {};
      const { user: _user, menus: _menuList } = _data;
      const _res = {
        ...state,
        currentUser: _user || _data,
      };

      if (_menuList) _res.menuList = _menuList;

      return _res;
    },
    setPswVersion(state, action) {
      const { currentUser } = state;
      currentUser.passwordVersion = action.payload.passwordVersion;
      return { ...state, currentUser }
    },
    setModifyLoading(state, action) {
      return { ...state, modifyPwdLoading: action.payload }
    },
    setOrg(state, action) {
      const { currentUser } = state;
      currentUser.org = action.payload.org;
      return { ...state, currentUser }
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
