import { get, post } from '@/utils/ajax';

/**
 * 非登录状态下，获取系统版本号等信息
 */
export async function querySystemVersion() {
  // return get('/api/release');
  return get('/guard-web/f/com/release');
}

/**
 * 非登录状态下，首次部署确认访问IP/域名
 */
export async function ajaxSystemOrigin(data) {
  return post('/guard-web/f/com/setSysIp', data);
}
