import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { stringify } from 'querystring';
import { fakeAccountLogin, getFakeCaptcha, getOrg, signin, ajaxLogout } from '@/services/login';
import { setAuthority, getPermissionRoutes } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import CONSTANTS from '@/utils/constants';
import defaultSettings from '../../config/defaultSettings';

const { publicPath } = defaultSettings;

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    org: {},
    agent: {},
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(signin, payload);
      if (response && response.res > 0) {
        // 登录成功
        let loginState = {
          status: 'ok',
        };
        if (response.data.user) {
          if (response.data.user.type === 0) {
            loginState.currentAuthority = 'admin';
          } else {
            loginState.currentAuthority = 'user';
          }
          loginState.user = response.data.user;
          if (payload.autoLogin) {
            // 自动登录
            localStorage.setItem(CONSTANTS.AUTH_TOKEN, response.data.token);
            localStorage.setItem(CONSTANTS.AUTH_AUTO_LOGIN, CONSTANTS.AUTH_AUTO_LOGIN);
          } else {
            // 不自动登录
            sessionStorage.setItem(CONSTANTS.AUTH_TOKEN, response.data.token);
            localStorage.removeItem(CONSTANTS.AUTH_TOKEN);
          }
        }
        yield put({
          type: 'changeLoginStatus',
          payload: loginState,
        }); // Login successfully
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // console.log('redirect-----------', redirect)
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }

        const { type, org } = response.data.user || { org: {} };
        const { redirect } = getPermissionRoutes(type, org.type);

        yield put(routerRedux.replace(redirect || '/'));
      } else if (!response || response.res !== 0) {
        console.error('login error:', response);
        let loginState = {
          status: 'error',
        };
        yield put({
          type: 'changeLoginStatus',
          payload: loginState,
        });
      }

      return Promise.resolve(response);
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    // eslint-disable-next-line require-yield
    *logout(_, { call, put }) {
      yield call(ajaxLogout);

      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== `${publicPath}user/${localStorage.getItem(CONSTANTS.SYSTEM_PATH)}/login` && !redirect) {
        localStorage.removeItem(CONSTANTS.AUTH_TOKEN);
        sessionStorage.removeItem(CONSTANTS.AUTH_TOKEN);
        router.replace({
          pathname: `/user/${localStorage.getItem(CONSTANTS.SYSTEM_PATH)}/login`,
        });
      }
    },
    // rel api
    *getOrgInfo({ payload }, { call, put }) {
      const orgInfo = yield call(getOrg, payload);
      if (orgInfo && orgInfo.res > 0) {
        yield put({
          type: 'setOrg',
          payload: orgInfo.data.org,
        });
        yield put({
          type: 'setAgent',
          payload: orgInfo.data.agent,
        });
      } else {
        yield put({
          type: 'setOrg',
          payload: 'error',
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status };
    },
    setOrg(state, { payload }) {
      return { ...state, org: payload };
    },
    setAgent(state, { payload }) {
      return { ...state, agent: payload };
    },
  },
};
export default Model;
