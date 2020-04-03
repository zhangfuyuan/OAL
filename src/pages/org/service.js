import { post, get } from '@/utils/ajax';

/**
 * 新增组织
 * @param data
 * @returns {Promise<*>}
 */
export async function add(data) {
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
  return post('/api/org/update', data);
}

/**
 * 禁用&&启用
 */
export async function handleState(data) {
  return get(`/api/org/${data.orgId}/setState/${data.state}`);
}
