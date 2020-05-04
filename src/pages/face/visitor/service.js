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
 * 查询访客
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxList(data) {
  return post('/api/face/manage/fetchList', data);
}

/**
 * 查询设备
 * @param query
 * @returns {Promise<*>}
 */
export async function getDeviceList(data) {
  return get(`/api/device/list/${data.verity}`);
}
