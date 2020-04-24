// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  } // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

/**
 * 根据机构、用户的类型获取重定向、菜单等
 * @param {*} userType 
 * @param {*} orgType 
 */
export function getPermissionRoutes(userType, orgType) {
  let redirect = '/';
  let menuList = [];

  if (userType === 0) {
    if (orgType === 0) {
      // admin机构下的admin账号
      redirect = '/org';
      menuList = [
        {
          path: '/org',
          name: 'orgManger',
          locale: 'menu.orgManger',
          icon: 'idcard',
        }, {
          path: '/userManagement',
          name: 'userManagement',
          locale: 'menu.userManagement',
          icon: 'user',
        }, {
          path: '/settings',
          name: 'settings',
          locale: 'menu.settings',
          icon: 'setting',
        }
      ];
    } else {
      // 普通机构下的admin账号
      redirect = '/userManagement';
      menuList = [
        {
          path: '/userManagement',
          name: 'userManagement',
          locale: 'menu.userManagement',
          icon: 'user',
        }, {
          path: '/settings',
          name: 'settings',
          locale: 'menu.settings',
          icon: 'setting',
        }
      ];
    }
  } else {
    // 普通账号
    redirect = '/dashboard';
    menuList = [
      {
        path: '/dashboard',
        name: 'dashboard2',
        locale: 'menu.dashboard2',
        icon: 'dashboard',
      }, {
        path: '/device',
        name: 'device',
        locale: 'menu.device',
        icon: 'hdd',
      }, {
        path: '/face',
        name: 'faceManger',
        locale: 'menu.faceManger',
        icon: 'smile',
        routes: [
          {
            path: '/face/group',
            name: 'faceGroup',
            locale: 'menu.faceManger.faceGroup',
          }, {
            path: '/face/blacklist',
            name: 'faceBlacklist',
            locale: 'menu.faceManger.faceBlacklist',
          }, {
            path: '/face/visitor',
            name: 'faceVisitor',
            locale: 'menu.faceManger.faceVisitor',
          },
        ],
      }, {
        path: '/log',
        name: 'log',
        locale: 'menu.log',
        icon: 'global',
        routes: [
          {
            path: '/log/authory',
            name: 'logAuthory',
            locale: 'menu.log.logAuthory',
          }, {
            path: '/log/query',
            name: 'logQuery',
            locale: 'menu.log.logQuery',
          },
        ],
      }, {
        path: '/workAttendance',
        name: 'workAttendance',
        locale: 'menu.workAttendance',
        icon: 'table',
        routes: [
          {
            path: '/workAttendance/rule',
            name: 'workAttendanceRule',
            locale: 'menu.workAttendance.workAttendanceRule',
          }, {
            path: '/workAttendance/statistics',
            name: 'workAttendanceStatistics',
            locale: 'menu.workAttendance.workAttendanceStatistics',
          }, {
            path: '/workAttendance/record',
            name: 'workAttendanceRecord',
            locale: 'menu.workAttendance.workAttendanceRecord',
          },
        ],
      }, {
        path: '/settings',
        name: 'settings',
        locale: 'menu.settings',
        icon: 'setting',
      }
    ];
  }

  return { redirect, menuList };
}
