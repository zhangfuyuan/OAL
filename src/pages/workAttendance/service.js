import { post, get } from '@/utils/ajax';

/**
 * （考勤-规则1）获取/搜索考勤规则
 * @param data
 * @returns {Promise<*>}
 */
export async function getAttendList(data) {
  return post('/guard-web/a/attendance/fetchList', data);
}

/**
 * （考勤-规则2）获取设备列表
 * @param data
 * @returns {Promise<*>}
 */
export async function getDeviceList(data) {
  return post(`/guard-web/a/device/fetchAll`, data);
}

/**
 * （考勤-规则3）禁用/启用考勤规则
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxSetState(data) {
  return post(`/guard-web/a/attendance/setState`, data);
}

/**
 * （考勤-规则4）关联考勤设备
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxRelation(data) {
  return post(`/guard-web/a/attendance/saveAssociationRules`, data);
}

/**
 * 获取个人考勤列表
 */
export async function getPerAttendList(data) {
  return get(`/api/report/face/${data.faceId}/${data.date}`);
}

/**
 * ...
 * @param data
 * @returns {Promise<*>}
 */
export async function fetchTest(data) {
  return get('/api/user/authByToken');
}
