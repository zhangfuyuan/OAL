import { get, post } from '@/utils/ajax';
import defaultSettings from '../../config/defaultSettings';

const { isAjaxOAL } = defaultSettings;

/**
 * （通用1）非登录状态下，获取系统版本号等信息
 */
export async function querySystemVersion() {
  return isAjaxOAL ? get('/api/release') : get('/guard-web/f/com/release');
}

/**
 * （通用2）非登录状态下，首次部署确认访问IP/域名
 */
export async function ajaxSystemOrigin(data) {
  return post('/guard-web/f/com/setSysIp', data);
}
