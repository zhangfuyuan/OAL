import { post, get } from '@/utils/ajax';

/**
 * demo1
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxTest(data) {
  return get('/api/user/authByToken');
}

/**
 * demo2
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxList(data) {
  return post('/api/face/manage/fetchList', data);
}
