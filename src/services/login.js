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
 * 获取组织详情
 * @param path
 * @returns {Promise<*>}
 */
export async function getOrg(path) {
  return get(`/api/org/getByPath/${path}`)
}

/**
 * 用户登录
 * @param data
 * @returns {Promise<*>}
 */
export async function signin(data) {
  return post('/api/user/signin', data)
}
