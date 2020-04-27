import { post, get } from '@/utils/ajax';

/**
 * 新增用户
 * @param data
 * @returns {Promise<*>}
 */
export async function addUser(data) {
  return post('/api/user/add', data);
}

/**
 * 查询组织
 * @param query
 * @returns {Promise<*>}
 */
export async function getUserList(query) {
  return post('/api/user/fetchList', query);
}

/**
 * 操作用户
 * action：delete，resetPsw
 */
export async function operateUser(data) {
  // 8126TODO 不在uri中传参
  return get(`/api/user/${data.userId}/${data.action}`);
}

/**
 * 修改用户信息
 * action：delete，resetPsw
 */
export async function modifyUser(data) {
  return post('/api/user/update', data);
}
