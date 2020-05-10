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
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: { passwordVersion: 8 },
        }

        yield put({
          type: 'setPswVersion',
          payload: _response.data,
        });

        yield put({
          type: 'setModifyLoading',
          payload: false,
        });

        return Promise.resolve(_response);
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
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: {
            org: {
              type: 0,
              state: 1,
              _id: "5e8216ca2d93465736e3bfe9",
              path: "admin",
              createAt: "2020-03-30T15:56:58.650Z",
              updateAt: "2020-05-10T07:57:25.065Z",
              __v: 0,
              saasName: "Lango666",
            },
          }
        };

        yield put({
          type: 'setOrg',
          payload: _response.data,
        });

        yield put({
          type: 'setModifyLoading',
          payload: false,
        });

        return Promise.resolve(_response);
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

        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: {
            profile: { nickName: "jeffrey888" },
            passwordVersion: 7,
            type: 1,
            state: 1,
            authErrorCount: 0,
            _id: "5e9d82cd69f493012fcae176",
            userName: "zfy",
            org: {
              type: 1,
              state: 1,
              _id: "5e9d760b3f9dbc013d416e56",
              path: "zfy",
              name: "zfy",
              createAt: "2020-04-20T10:14:35.571Z",
              updateAt: "2020-05-07T02:37:29.690Z",
              __v: 0,
            },
            createAt: "2020-04-20T11:09:01.104Z",
            __v: 0,
            authErrorAt: "2020-05-09T02:25:09.839Z",
            authAt: "2020-05-10T07:16:45.046Z",
          },
          errorCode: 200,
        }

        yield put({
          type: 'saveCurrentUser',
          payload: _response,
        });

        return Promise.resolve(_response);
      }
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
      return {
        ...state,
        currentUser: action.payload.data.user || action.payload.data || {},
        // menuList: action.payload.data.menus || [],
        menuList: (user => {
          const { type, org } = user || { org: {} };
          const { menuList: _menuList } = getPermissionRoutes(type, org.type);

          return _menuList;
        })(action.payload.data.user || action.payload.data),
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
