import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'E:/web/guarderClient/guarderClient/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
          LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/user/initOrigin',
        name: 'initOrigin',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__initOrigin" */ '../user/initOrigin'),
              LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                .default,
            })
          : require('../user/initOrigin').default,
        exact: true,
      },
      {
        path: '/user/:org/login',
        name: 'login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__user__login" */ '../user/login'),
              LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                .default,
            })
          : require('../user/login').default,
        exact: true,
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__SecurityLayout" */ '../../layouts/SecurityLayout'),
          LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/SecurityLayout').default,
    routes: [
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
              LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                .default,
            })
          : require('../../layouts/BasicLayout').default,
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/org',
            name: 'orgManger',
            icon: 'idcard',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__org__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/org/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__org" */ '../org'),
                  LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                    .default,
                })
              : require('../org').default,
            exact: true,
          },
          {
            path: '/userManagement',
            name: 'userManagement',
            icon: 'user',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__userManagement__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/userManagement/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__userManagement" */ '../userManagement'),
                  LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                    .default,
                })
              : require('../userManagement').default,
            exact: true,
          },
          {
            path: '/settings',
            name: 'settings',
            icon: 'setting',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__settings__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/settings/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__settings" */ '../settings'),
                  LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                    .default,
                })
              : require('../settings').default,
            exact: true,
          },
          {
            path: '/dashboard',
            name: 'dashboard2',
            icon: 'dashboard',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__dashboard__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/dashboard/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__dashboard" */ '../dashboard'),
                  LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                    .default,
                })
              : require('../dashboard').default,
            exact: true,
          },
          {
            path: '/device',
            name: 'device',
            icon: 'hdd',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__device__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/device/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__device" */ '../device'),
                  LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                    .default,
                })
              : require('../device').default,
            exact: true,
          },
          {
            path: '/face',
            name: 'faceManger',
            icon: 'smile',
            routes: [
              {
                path: '/face',
                redirect: '/face/group',
                exact: true,
              },
              {
                path: '/face/group',
                name: 'faceGroup',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__face__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/face/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../face'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../face').default,
                exact: true,
              },
              {
                path: '/face/blacklist',
                name: 'faceBlacklist',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__face__blacklist__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/face/blacklist/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                        import(/* webpackChunkName: 'p__face__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/face/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../face/blacklist'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../face/blacklist').default,
                exact: true,
              },
              {
                path: '/face/visitor',
                name: 'faceVisitor',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__face__visitor__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/face/visitor/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                        import(/* webpackChunkName: 'p__face__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/face/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../face/visitor'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../face/visitor').default,
                exact: true,
              },
              {
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../404'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../404').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/log',
            name: 'log',
            icon: 'global',
            routes: [
              {
                path: '/log',
                redirect: '/log/authory',
                exact: true,
              },
              {
                path: '/log/authory',
                name: 'logAuthory',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__log__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/log/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../log'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../log').default,
                exact: true,
              },
              {
                path: '/log/query',
                name: 'logQuery',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      app: require('@tmp/dva').getApp(),
                      models: () => [
                        import(/* webpackChunkName: 'p__log__query__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/log/query/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                        import(/* webpackChunkName: 'p__log__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/log/model.js').then(
                          m => {
                            return { namespace: 'model', ...m.default };
                          },
                        ),
                      ],
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../log/query'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../log/query').default,
                exact: true,
              },
              {
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../404'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../404').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/workAttendance',
            name: 'workAttendance',
            icon: 'table',
            routes: [
              {
                path: '/workAttendance',
                redirect: '/workAttendance/rule',
                exact: true,
              },
              {
                path: '/workAttendance/rule',
                name: 'workAttendanceRule',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/workAttendance/rule',
                    redirect: '/workAttendance/rule/index',
                    exact: true,
                  },
                  {
                    path: '/workAttendance/rule/index',
                    name: 'workAttendanceRuleIndex',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import(/* webpackChunkName: 'p__workAttendance__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/workAttendance/model.js').then(
                              m => {
                                return { namespace: 'model', ...m.default };
                              },
                            ),
                          ],
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../workAttendance'),
                          LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../workAttendance').default,
                    exact: true,
                  },
                  {
                    path: '/workAttendance/rule/add',
                    name: 'workAttendanceRuleAdd',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import(/* webpackChunkName: 'p__workAttendance__rule__add__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/workAttendance/rule/add/model.js').then(
                              m => {
                                return { namespace: 'model', ...m.default };
                              },
                            ),
                            import(/* webpackChunkName: 'p__workAttendance__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/workAttendance/model.js').then(
                              m => {
                                return { namespace: 'model', ...m.default };
                              },
                            ),
                          ],
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../workAttendance/rule/add'),
                          LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../workAttendance/rule/add').default,
                    exact: true,
                  },
                  {
                    path: '/workAttendance/rule/edit',
                    name: 'workAttendanceRuleEdit',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import(/* webpackChunkName: 'p__workAttendance__rule__edit__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/workAttendance/rule/edit/model.js').then(
                              m => {
                                return { namespace: 'model', ...m.default };
                              },
                            ),
                            import(/* webpackChunkName: 'p__workAttendance__model.js' */ 'E:/web/guarderClient/guarderClient/src/pages/workAttendance/model.js').then(
                              m => {
                                return { namespace: 'model', ...m.default };
                              },
                            ),
                          ],
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../workAttendance/rule/edit'),
                          LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../workAttendance/rule/edit').default,
                    exact: true,
                  },
                  {
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../404'),
                          LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                            .default,
                        })
                      : require('../404').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../404'),
                      LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                        .default,
                    })
                  : require('../404').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                  LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                    .default,
                })
              : require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__404" */ '../404'),
              LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
          LoadingComponent: require('E:/web/guarderClient/guarderClient/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('E:/web/guarderClient/guarderClient/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
