import { post, get } from '@/utils/ajax';

/**
 * （组织1）获取/搜索组织列表数据
 * @param data
 * @returns {Promise<*>}
 */
export async function getOrg(data) {
  return post('/guard-web/a/sys/office/fetchList', data);
}

/**
 * （组织2）新建组织
 * @param data
 * @returns {Promise<*>}
 */
export async function add(data) {
  return post('/guard-web/a/sys/office/saveOffice', data);
}

/**
 * （组织3）修改组织信息
 */
export async function modifyOrg(data) {
  return post('/guard-web/a/sys/office/saveOffice', data);
}

/**
 * （组织4）重置密码
 */
export async function resetPsw(data) {
  // 8126TODO 修改成 /api/org/resetPsw
  return post(`/guard-web/a/sys/office/resetPassword`, data);
}

/**
 * （组织5）禁/启用组织
 */
export async function handleState(data) {
  // 8126TODO 参数放在body里
  return post(`/guard-web/a/sys/office/disableEnableOffice`, data);
}
