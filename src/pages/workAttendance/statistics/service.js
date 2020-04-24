import { post, get } from '@/utils/ajax';

/**
 * demo1
 * @param data
 * @returns {Promise<*>}
 */
export async function demoAjax1(data) {
  return get('/api/user/authByToken');
}

/**
 * demo2
 * @param data
 * @returns {Promise<*>}
 */
export async function demoAjax2(data) {
  return post('/api/org/fetchList', data);
}
