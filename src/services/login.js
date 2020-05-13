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
 * （通用3）非登录状态下，获取访问组织的相关信息
 * @param path
 * @returns {Promise<*>}
 */
export async function getOrg(path) {
  return post(`/guard-web/f/com/getByPath`, { path });
}

/**
 * （通用4）登录
 * @param data
 * @returns {Promise<*>}
 */
export async function signin(data) {
  const _data = { ...data };
  const { errorHandler } = _data || {};

  if (errorHandler) delete _data.errorHandler;

  return post('/guard-web/a/login', _data, { errorHandler });
}

/**
 * （通用7）退出登录
 */
export async function ajaxLogout() {
  return get('/guard-web/a/sys/user/logout');
}

/**
 * （通用8）询问当前用户是否处于登录状态
 */
export async function ajaxLoginStateInServer() {
  return get('/guard-web/f/com/isLogin');
}
