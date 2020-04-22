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
 * 
 * 全部菜单如下：
    [{
      path: '/dashboard',
      name: 'dashboard',
      locale: 'menu.dashboard2',
      icon: 'dashboard',
    }, {
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
      name: 'device',
      locale: 'menu.device',
      icon: 'hdd',
      routes: [
        {
          path: '/device/pass',
          name: 'deviceType',
          locale: 'menu.device',
        },
      ],
    }, {
      name: 'faceManger',
      locale: 'menu.faceManger',
      icon: 'smile',
      routes: [
        {
          path: '/face/manger',
          name: 'faceMangerIndex',
          locale: 'menu.faceManger',
        },
        {
          path: '/face/blacklist',
          name: 'faceBlacklist',
          locale: 'menu.faceBlacklist',
        },
        {
          path: '/face/visitor',
          name: 'faceVisitor',
          locale: 'menu.faceVisitor',
        },
      ],
    }, {
      name: 'workAttendance',
      locale: 'menu.workAttendance',
      icon: 'table',
      routes: [
        {
          path: '/workAttendance/rule',
          name: 'workAttendanceRule',
          locale: 'menu.workAttendanceRule',
        },
        {
          path: '/workAttendance/manger',
          name: 'workAttendanceManger',
          locale: 'menu.workAttendance',
        },
      ],
    }, {
      path: '/log',
      name: 'log',
      locale: 'menu.log',
      icon: 'global',
    }, {
      path: '/settings',
      name: 'settings',
      locale: 'menu.settings',
      icon: 'setting',
    }]
 * 
 */
export function authorityRouter(userType, orgType) {
  let redirect = '/';
  let menuList = [];
  
  if (userType === 0) {
    if (orgType === 0) {
      // admin机构下的admin账号
      redirect = '/org';
      menuList = [{
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
      }];
    } else {
      // 普通机构下的admin账号
      redirect = '/userManagement';
      menuList = [{
        path: '/userManagement',
        name: 'userManagement',
        locale: 'menu.userManagement',
        icon: 'user',
      }, {
        path: '/settings',
        name: 'settings',
        locale: 'menu.settings',
        icon: 'setting',
      }];
    }
  } else {
    // 普通账号
    redirect = '/dashboard';
    menuList = [{
      path: '/dashboard',
      name: 'dashboard',
      locale: 'menu.dashboard2',
      icon: 'dashboard',
    }, {
      name: 'device',
      locale: 'menu.device',
      icon: 'hdd',
      routes: [
        {
          path: '/device/pass',
          name: 'deviceType',
          locale: 'menu.device.deviceType',
        },
      ],
    }, {
      name: 'faceManger',
      locale: 'menu.faceManger',
      icon: 'smile',
      routes: [
        {
          path: '/face/manger',
          name: 'faceMangerIndex',
          locale: 'menu.faceManger.faceMangerIndex',
        },
        {
          path: '/face/blacklist',
          name: 'faceBlacklist',
          locale: 'menu.faceManger.faceBlacklist',
        },
        {
          path: '/face/visitor',
          name: 'faceVisitor',
          locale: 'menu.faceManger.faceVisitor',
        },
      ],
    }, {
      name: 'workAttendance',
      locale: 'menu.workAttendance',
      icon: 'table',
      routes: [
        {
          path: '/workAttendance/rule',
          name: 'workAttendanceRule',
          locale: 'menu.workAttendance.workAttendanceRule',
        },
        {
          path: '/workAttendance/manger',
          name: 'workAttendanceManger',
          locale: 'menu.workAttendance.workAttendanceManger',
        },
      ],
    }, {
      path: '/log',
      name: 'log',
      locale: 'menu.log',
      icon: 'global',
    }, {
      path: '/settings',
      name: 'settings',
      locale: 'menu.settings',
      icon: 'setting',
    }];
  }

  return { redirect, menuList };
}
