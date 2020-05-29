import { queryNotices } from '@/services/user';
import { querySystemVersion, ajaxSystemOrigin } from '@/services/global';
import { routerRedux } from 'dva/router';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    systemVersion: '',
    systemOrigin: '',
  },
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },

    *getSystemVersion(_, { call, put }) {
      const response = yield call(querySystemVersion);

      const { res, data } = response || {};
      let version = 'v2.0.0';
      if (res && data && data.version) {
        // eslint-disable-next-line prefer-destructuring
        version = data.version;
      }
      yield put({
        type: 'saveVersion',
        payload: {
          version,
        },
      });

      if (process.env.NODE_ENV === 'production' && res && data) {
        const { ip } = data || {};

        if (ip) {
          yield put({
            type: 'saveOrigin',
            payload: {
              origin: ip,
            },
          });

          // try {
          //   const { origin: curOrigin, href: curHref } = new URL(window.location.href);
          //   if (!~curHref.indexOf(ip)) window.location.href = curHref.replace(curOrigin, /\/\/./.test(ip) ? ip : `//${ip}`);
          // } catch (err) {
          //   console.log(err);
          // }
        } else {
          yield put(routerRedux.replace('/user/initOrigin'));
        }
      }
    },

    // 初始化部署时，提交访问IP/域名
    *updateSystemOrigin({ payload }, { call, put }) {
      const response = yield call(ajaxSystemOrigin, payload);
      return Promise.resolve(response);
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    saveVersion(state, { payload: { version } }) {
      return { ...state, systemVersion: version };
    },
    saveOrigin(state, { payload: { origin } }) {
      return { ...state, systemOrigin: origin };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
