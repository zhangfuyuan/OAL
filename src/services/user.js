import request from '@/utils/request';
import { get, post } from '@/utils/ajax';
import defaultSettings from '../../config/defaultSettings';

const { isAjaxOAL } = defaultSettings;

export async function query() {
  return request('/api/users');
}
export async function queryNotices() {
  return request('/api/notices');
}

/**
 * （通用5）获取当前用户信息
 */
export async function authByToken() {
  // return get('/api/user/authByToken');
  return isAjaxOAL ? get('/api/user/authByToken') : get('/guard-web/a/sys/user/authByToken');
}

/**
 * （通用6）修改密码
 * （设置2）admin组织的安全设置-修改密码
 */
export async function modifyPsw(data) {
  // return post('/api/user/modifyPsw', data);
  return post('/guard-web/a/sys/user/modifyPsw', data);
}

/**
 * （设置1）admin组织账号设置
 */
export async function modifyUser(data) {
  return post('/guard-web/a/sys/office/update', data);
}

/**
 * （设置3-1）修改系统信息
 * @param data
 * @returns {Promise<*>}
 */
export async function editSaasInfo(data) {
  return post('/guard-web/a/sys/office/systemInformationName', data)
}
