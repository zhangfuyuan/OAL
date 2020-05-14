import { post, get } from '@/utils/ajax';

/**
 * （考勤-规则6）根据规则ID查询详情
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxRuleById(data) {
  return post(`/guard-web/a/attendance/getAttendanceRules`, data);
}

/**
 * （考勤-规则7）编辑考勤规则
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxEditRule(data) {
  return post(`/guard-web/a/attendance/saveAttendanceRules`, data);
}

/**
 * ...
 * @param data
 * @returns {Promise<*>}
 */
export async function editRule(data) {
  return get('/api/user/authByToken');
}