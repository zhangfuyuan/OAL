const routers = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/:org/login',
        component: './user/login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/userManagement',
          },
          {
            path: 'org',
            name: 'orgManger',
            icon: 'idcard',
            component: './org',
          },
          {
            path: 'userManagement',
            name: 'userManagement',
            icon: 'user',
            component: './userManagement',
          },
          {
            path: 'device',
            name: 'device',
            icon: 'hdd',
            routes: [
              {
                path: '/device',
                redirect: '/device/pass'
              },
              {
                path: '/device/:type',
                component: './device'
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: 'face',
            name: 'faceManger',
            icon: 'smile',
            component: './face',
          },
          {
            path: 'workAttendance',
            name: 'workAttendance',
            icon: 'table',
            component: './workAttendance',
          },
          {
            path: 'settings',
            name: 'settings',
            icon: 'setting',
            component: './settings',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]

export default routers;