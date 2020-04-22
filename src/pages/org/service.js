import { post, get, capture } from '@/utils/ajax';

/**
 * 新增组织
 * @param data
 * @returns {Promise<*>}
 */
export async function add(data) {
  capture('9', data);
  return post('/api/org/add', data);
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
  capture('10', data);
  return post('/api/org/update', data);
}

/**
 * 禁用&&启用
 */
export async function handleState(data) {
  capture('11', {
    orgId: data.orgId,
    state: data.state,
  });
  return get(`/api/org/${data.orgId}/setState/${data.state}`);
}
