import { post, get } from '@/utils/ajax';

/**
 * （设备1）获取/搜索设备列表
 * @param data
 * @returns {Promise<*>}
 */
export async function getDeviceList(data) {
  return post(`/guard-web/a/device/fetchList`, data);
}

/**
 * （设备2）设置设备信息
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxSetDeviceInfo(data) {
  return post(`/guard-web/a/device/setDeviceInfo`, data);
}

/**
 * （设备3）删除设备
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDeviceDelete(data) {
  return post(`/guard-web/a/device/deviceDelete`, data);
}

/**
 * （设备4）软件升级
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDeviceUpdate(data) {
  return post(`/guard-web/a/device/deviceUpdate`, data);
}

/**
 * 设备审核
 *
 */
export async function verifyDevice(data) {
  return get(`/api/device/${data.deviceId}/verify/${data.result}`);
}

/**
 * 删除设备
 */
export async function removeDevice(data) {
  return get(`/api/device/${data.deviceId}/remove`);
}

/**
 * 设备重命名
 */
export async function renameDevice(data) {
  return get(`/api/device/${data.deviceId}/rename/${data.name}`);
}
