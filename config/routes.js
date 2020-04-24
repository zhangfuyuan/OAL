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
            path: '/org',
            name: 'orgManger',
            icon: 'idcard',
            component: './org',
          },
          {
            path: '/userManagement',
            name: 'userManagement',
            icon: 'user',
            component: './userManagement',
          },
          {
            path: '/settings',
            name: 'settings',
            icon: 'setting',
            component: './settings',
          },
          {
            path: '/dashboard',
            name: 'dashboard2',
            icon: 'dashboard',
            component: './dashboard',
          },
          {
            path: '/device',
            name: 'device',
            icon: 'hdd',
            component: './device',
          },
          {
            path: '/face',
            name: 'faceManger',
            icon: 'smile',
            routes: [
              {
                path: '/face',
                redirect: '/face/group',
              },
              {
                path: '/face/group',
                name: 'faceGroup',
                component: './face',
              },
              {
                path: '/face/blacklist',
                name: 'faceBlacklist',
                component: './face/blacklist',
              },
              {
                path: '/face/visitor',
                name: 'faceVisitor',
                component: './face/visitor',
              },
              {
                component: './404',
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
              },
              {
                path: '/log/authory',
                name: 'logAuthory',
                component: './log',
              },
              {
                path: '/log/query',
                name: 'logQuery',
                component: './log/query',
              },
              {
                component: './404',
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
              },
              {
                path: '/workAttendance/rule',
                name: 'workAttendanceRule',
                component: './workAttendance',
              },
              {
                path: '/workAttendance/statistics',
                name: 'workAttendanceStatistics',
                component: './workAttendance/statistics',
              },
              {
                path: '/workAttendance/record',
                name: 'workAttendanceRecord',
                component: './workAttendance/record',
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
    ],
  },
  {
    component: './404',
  },
]

export default routers;