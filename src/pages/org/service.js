import { post, get, capture } from '@/utils/ajax';

/**
 * 新增组织
 * @param data
 * @returns {Promise<*>}
 */
export async function add(data) {
  const _promise = post('/api/org/add', data);
  _promise.then(res => { if (res && res.res > 0) capture('9', { ...data, oalid: res.data._id, }); });
  return _promise;
}

/**
 * 查询组织
 * @param query
 * @returns {Promise<*>}
 */
export async function getOrg(query) {
  return post('/api/org/fetchList', query);
}

/**
 * 修改组织
 */
export async function modifyOrg(data) {
  const _promise = post('/api/org/update', data);
  _promise.then(res => { if (res && res.res > 0) capture('10', data); });
  return _promise;
}

/**
 * 禁用&&启用
 */
export async function handleState(data) {
  const _promise = get(`/api/org/${data.orgId}/setState/${data.state}`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('11', {
        orgId: data.orgId,
        state: data.state,
      });
  });
  return _promise;
}
