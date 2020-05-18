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
  return post('/guard-web/a/face/fetchList', data);
}

/**
 * （通行-授权3）添加/删除授权人员
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAddAuthory(data) {
  return post('/guard-web/a/device/saveAssociation', data);
}

/**
 * （通行-授权3）添加/删除授权人员
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDelAuthory(data) {
  return post('/guard-web/a/device/saveAssociation', data);
}

/**
 * （通行-授权4）懒加载人员及分组树
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxGroupTree(data) {
  return post('/guard-web/a/group/fetchGroupTree', data);
}

/**
 * （人员-认证-分组1）获取用户分组树
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxGroupAllTree(data) {
  return post('/guard-web/a/group/fetchGroupAllTree', data);
}

/**
 * （通行-授权5）根据分组ID获取所有人员/访客信息
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxPeopleByGroupId(data) {
  return post('/guard-web/a/group/fetchFaceTree', data);
}

/**
 * （通行-授权6）查询人员及分组树根节点总数
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxPeopleTotal(data) {
  return post('/guard-web/a/face/countFacesNumByCompanyId', data);
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
