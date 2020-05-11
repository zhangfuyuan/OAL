import { post, get } from '@/utils/ajax';

/**
 * （通行-记录1）获取设备列表
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDeviceList(data) {
  return post(`/guard-web/a/device/fetchAll`, data);
}

/**
 * （通行-记录2）获取/搜索通行记录列表
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxLogQuery(data) {
  return post('/guard-web/a/sys/logQuery/fetchList', data);
}

/**
 * demo1
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxTest(data) {
  return get('/api/user/authByToken');
}
