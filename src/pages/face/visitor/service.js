import { post, get } from '@/utils/ajax';

/**
 * （人员-访客1）获取/搜索访客列表
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxList(data) {
  return post('/guard-web/a/face/fetchList', data);
}

/**
 * （人员-访客2-1）添加访客非头像信息
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAddInfo(data) {
  return post('/guard-web/a/face/addFaceInfo', data);
}

/**
 * （人员-访客2-1）修改访客非头像信息
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxEditInfo(data) {
  return post('/guard-web/a/face/saveFaceInfo', data);
}

/**
 * （人员-访客3）删除访客
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDeleteFace(data) {
  return post('/guard-web/a/face/deleteFace', data);
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
 * 查询设备
 * @param query
 * @returns {Promise<*>}
 */
export async function getDeviceList(data) {
  return get(`/api/device/list/${data.verity}`);
}
