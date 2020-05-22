import { post, get } from '@/utils/ajax';

/**
 * （设置-4-1）告警设置-发送设置
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAlarmSendSettings(data) {
  return post(`/guard-web/a/alarmSet/saveAlarmSet`, data);
}

/**
 * （设置-4-1）告警设置-接收设置
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAlarmReceiveSettings(data) {
  return post(`/guard-web/a/alarmSet/saveAlarmSet`, data);
}

/**
 * （设置-4-1）告警设置-告警事件
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAlarmEvents(data) {
  return post(`/guard-web/a/alarmSet/saveAlarmSet`, data);
}

/**
 * （设置-4-1）告警设置-告警内容
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAlarmContent(data) {
  return post(`/guard-web/a/alarmSet/saveAlarmSet`, data);
}

/**
 * （设置-4-2）获取告警设置
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxGetAlarmSet(data) {
  return post(`/guard-web/a/alarmSet/getAlarmSet`, data);
}

/**
 * （设置-）检测授权环境
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAuthorizationEnvironment(data) {
  return post(`/guard-web/a/alarmSet/**`, data);
}

/**
 * （设置-）获取设备码
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDeviceCode(data) {
  return post(`/guard-web/a/alarmSet/**`, data);
}


/**
 * 获取自己的开发者账号
 */
export async function getDevInfo() {
  return get('/api/developer/get');
}

/**
 * 获取生成一个开发者账号
 */
export async function applyDevAccount() {
  return get('/api/developer/apply');
}

/**
 * 重置开发者密钥
 */
export async function resetSecret() {
  return get('/api/developer/secret/reset');
}
