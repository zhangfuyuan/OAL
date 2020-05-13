import { post, get } from '@/utils/ajax';

/**
 * （账号1）获取/搜索账号列表数据
 * @param data
 * @returns {Promise<*>}
 */
export async function getUserList(data) {
  return post('/guard-web/a/sys/user/fetchList', data);
}

/**
 * （账号2）新建账号
 * @param data
 * @returns {Promise<*>}
 */
export async function addUser(data) {
  return post('/guard-web/a/sys/user/saveUser', data);
}

/**
 * （账号3）修改账号
 */
export async function modifyUser(data) {
  return post('/guard-web/a/sys/user/saveUser', data);
}

/**
 * （账号4）重置密码
 */
export async function ajaxResetPsw(data) {
  return post(`/guard-web/a/sys/user/resetPassword`, data);
}

/**
 * （账号5）禁/启用账号
 */
export async function ajaxSetState(data) {
  return post(`/guard-web/a/sys/user/setState`, data);
}

/**
 * 操作用户
 * action：delete，resetPsw
 */
export async function operateUser(data) {
  return get(`/api/user/${data.userId}/${data.action}`);
}
