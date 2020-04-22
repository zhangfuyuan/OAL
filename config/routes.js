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
            path: 'dashboard',
            name: 'dashboard',
            icon: 'dashboard',
            component: './dashboard',
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
                name: 'deviceType',
                component: './device'
              },
            ],
          },
          {
            path: 'face',
            name: 'faceManger',
            icon: 'smile',
            routes: [
              {
                path: '/face',
                redirect: '/face/manger'
              },
              {
                path: '/face/manger',
                name: 'faceMangerIndex',
                component: './face',
              },
              {
                path: '/face/blacklist',
                name: 'faceBlacklist',
                component: './face/blacklist'
              },
              {
                path: '/face/visitor',
                name: 'faceVisitor',
                component: './face/visitor'
              },
            ],
          },
          {
            path: 'workAttendance',
            name: 'workAttendance',
            icon: 'table',
            routes: [
              {
                path: '/workAttendance',
                redirect: '/workAttendance/rule'
              },
              {
                path: '/workAttendance/rule',
                name: 'workAttendanceRule',
                component: './workAttendance/rule',
              },
              {
                path: '/workAttendance/manger',
                name: 'workAttendanceManger',
                component: './workAttendance',
              },
            ],
          },
          {
            path: 'log',
            name: 'log',
            icon: 'global',
            component: './log',
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