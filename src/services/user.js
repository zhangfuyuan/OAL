import request from '@/utils/request';
import { get, post } from '@/utils/ajax';

export async function query() {
  return request('/api/users');
}
export async function queryNotices() {
  return request('/api/notices');
}

// begin rel api
export async function authByToken() {
  // return get('/api/user/authByToken');
  return get('/guard-web/a/user/authByToken');
}
export async function modifyPsw(data) {
  // return post('/api/user/modifyPsw', data);
  return post('/guard-web/a/user/modifyPsw', data);
}

export async function modifyUser(data) {
  return post('/api/user/update', data);
}

/**
 * 修改Saas
 * @param data
 * @returns {Promise<*>}
 */
export async function editSaasInfo(data) {
  return post('/api/org/editSaasInfo', data)
}
// /api/user/modifyPsw
