import { authByToken, query as queryUsers, modifyPsw, editSaasInfo, modifyUser } from '@/services/user';
import { AUTH_TOKEN, AUTH_AUTO_LOGIN } from '@/utils/constants';
import { getPermissionRoutes } from '@/utils/authority';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    org: {},
    modifyPwdLoading: false,
    menuList: [],
    menuRedirect: '/',
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
      if (response && response.res > 0) {
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

      if (response && response.res > 0) {
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

      if (response && response.res > 0) {
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

      if (response && response.res > 0) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }

      return Promise.resolve(response);
    },
    *modifySaasIconsUrl({ payload }, { call, put }) {
      yield put({
        type: 'setOrg',
        payload,
      });

      return Promise.resolve();
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      const _currentUser = action.payload.data.user || action.payload.data;
      const _path = _currentUser && _currentUser.org && _currentUser.org.path || '';
      const _saasIconsUrl = _currentUser && _currentUser.org && _currentUser.org.saasIconsUrl || '';

      if (_saasIconsUrl) _currentUser.org.saasIconsUrl = `${_saasIconsUrl}?t=${Date.now()}`;

      return {
        ...state,
        currentUser: _currentUser || {},
        // menuList: action.payload.data.menus || [],
        menuList: (user => {
          const { type, org } = user || { org: {} };
          const { menuList: _menuList } = getPermissionRoutes(type, org.type);

          return _menuList;
        })(_currentUser),
        menuRedirect: _path === 'admin' ? '/org' : '/device',
      };
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
      const _org = action.payload.org;
      const { saasIconsUrl } = _org;

      currentUser.org = _org;

      if (saasIconsUrl) currentUser.org.saasIconsUrl = `${saasIconsUrl}?t=${Date.now()}`;

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
