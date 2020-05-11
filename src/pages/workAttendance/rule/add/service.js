import { post, get } from '@/utils/ajax';

/**
 * （考勤-规则5）添加考勤规则
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAddRule(data) {
  return post(`/guard-web/a/attendance/addRule`, data);
}

/**
 * ...
 * @param data
 * @returns {Promise<*>}
 */
export async function addRule(data) {
  return get('/api/user/authByToken');
}
