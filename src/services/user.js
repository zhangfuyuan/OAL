import request from '@/utils/request';
import { get, post, capture } from '@/utils/ajax';

export async function query() {
  return request('/api/users');
}
export async function queryNotices() {
  return request('/api/notices');
}

// begin rel api
export async function authByToken() {
  return get('/api/user/authByToken');
}
export async function modifyPsw(data) {
  return post('/api/user/modifyPsw', data);
}

export async function modifyUser(data) {
  const _promise = post('/api/user/update', data);
  _promise.then(res => { if (res && res.res > 0) capture('18', data); });
  return _promise;
}

/**
 * 修改Saas
 * @param data
 * @returns {Promise<*>}
 */
export async function editSaasInfo(data) {
  const _promise = post('/api/org/editSaasInfo', data);
  _promise.then(res => { if (res && res.res > 0) capture('19', data); });
  return _promise;
}
// /api/user/modifyPsw
