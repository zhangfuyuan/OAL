import { post, get, capture } from '@/utils/ajax';

/**
 * 新增用户
 * @param data
 * @returns {Promise<*>}
 */
export async function addUser(data) {
  capture('12', data);
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
  capture('13', {
    userId: data.userId,
    action: data.action,
  });
  return get(`/api/user/${data.userId}/${data.action}`);
}
