import { post, get } from '@/utils/ajax';

/**
 * （通行-授权1）获取设备列表
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDeviceList(data) {
  return post(`/guard-web/a/device/fetchAll`, data);
}

/**
 * （通行-授权2）获取/搜索通行授权列表
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxLog(data) {
  return post('/guard-web/a/sys/logAuthory/fetchLogList', data);
}

/**
 * （通行-授权3）获取用户分组树（含访客）
 * @returns {Promise<*>}
 */
export async function ajaxGroupTree() {
  return get('/guard-web/a/sys/logAuthory/fetchGroupTree');
}

/**
 * （通行-授权4）添加/删除授权人员
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAddAuthory(data) {
  return post('/guard-web/a/device/saveAssociation', data);
}

/**
 * （通行-授权4）添加/删除授权人员
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDelAuthory(data) {
  return post('/guard-web/a/device/saveAssociation', data);
}

/**
 * demo1
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxTest(data) {
  return get('/api/user/authByToken');
}


/**
 * 查询用户
 * @param query
 * @returns {Promise<*>}
 */
export async function ajaxUser(query) {
  return post('/api/face/manage/fetchList', query);
}
