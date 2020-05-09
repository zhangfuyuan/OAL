import request from '@/utils/request';
import { post, get } from '@/utils/ajax';
import defaultSettings from '../../config/defaultSettings';

const { isAjaxOAL } = defaultSettings;

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// begin rel api
/**
 * （通用3）非登录状态下，获取访问组织的相关信息
 * @param path
 * @returns {Promise<*>}
 */
export async function getOrg(path) {
  return isAjaxOAL ? get(`/api/org/getByPath/${path}`) : post(`/guard-web/f/com/getByPath`, { path });
}

/**
 * （通用4）登录
 * @param data
 * @returns {Promise<*>}
 */
export async function signin(data) {
  return isAjaxOAL ? post('/api/user/signin', data) : post('/guard-web/a/login', data);
}

/**
 * （通用7）退出登录
 */
export async function ajaxLogout() {
  return get('/guard-web/a/sys/user/logout');
}
