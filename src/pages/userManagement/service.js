import { post, get, capture } from '@/utils/ajax';

/**
 * 新增用户
 * @param data
 * @returns {Promise<*>}
 */
export async function addUser(data) {
  const _promise = post('/api/user/add', data);
  _promise.then(res => { if (res && res.res > 0) capture('12', { ...data, oalid: res.data._id, }); });
  return _promise;
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
  const _promise = get(`/api/user/${data.userId}/${data.action}`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('13', {
        userId: data.userId,
        action: data.action,
      });
  });
  return _promise;
}
