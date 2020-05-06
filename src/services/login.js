import request from '@/utils/request';
import { post, get } from '@/utils/ajax';

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
 * 非登录状态下，获取访问组织的相关信息
 * @param path
 * @returns {Promise<*>}
 */
export async function getOrg(path) {
  // return get(`/api/org/getByPath/${path}`)
  return post(`/guard-web/f/com/getByPath`, { path });
}

/**
 * 用户登录
 * @param data
 * @returns {Promise<*>}
 */
export async function signin(data) {
  // return post('/api/user/signin', data)
  return post('/guard-web/f/com/signin', data);
}

/**
 * 退出登录
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxLogout() {
  // return post('/api/user/signin', data)
  return get('/guard-web/a/sys/office/logout');
}
