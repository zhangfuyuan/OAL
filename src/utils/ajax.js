/**
 *  add by Jianbing Fang
 */
import request from './request';
import router from 'umi/router';
import { notification } from 'antd';
import { stringify } from 'qs';
import { SYSTEM_PATH } from '@/utils/constants';
import { formatMessage } from 'umi-plugin-react/locale';

const errorCode = {
  1000: 'oal.ajax.1000',
  3001: 'oal.ajax.3001',
  3002: 'oal.ajax.3002',
  3003: 'oal.ajax.3003',
  3004: 'oal.ajax.3004',
  3005: 'oal.ajax.3005',
  3006: 'oal.ajax.3006',
  3007: 'oal.ajax.3007',
  3008: 'oal.ajax.3008',
  3009: 'oal.ajax.3009',
  3010: 'oal.ajax.3010',
  3011: 'oal.ajax.3011',
  4001: 'oal.ajax.4001',
  4002: 'oal.ajax.4002',
  4003: 'oal.ajax.4003',
  5001: 'oal.ajax.5001',
  5002: 'oal.ajax.5002',
  5003: 'oal.ajax.5003',
  5004: 'oal.ajax.5004',
  5005: 'oal.ajax.5005',
  5006: 'oal.ajax.5006',
  5007: 'oal.ajax.5007',
  6001: 'oal.ajax.6001',
  6002: 'oal.ajax.6002',
  6003: 'oal.ajax.6003',
  6004: 'oal.ajax.6004',
  6005: 'oal.ajax.6005',
  6006: 'oal.ajax.6006',
};
/**
 * 全局的处理
 */
request.interceptors.response.use(async (response, options) => {
  console.log('response-->', response);
  if (response.status !== 200) {
    if (response.status === 401) {
      // 鉴权失败，跳转到登录
      notification.error({
        message: formatMessage({ id: 'oal.ajax.401-message' }),
        description: formatMessage({ id: 'oal.ajax.401-description' }),
      });
      router.replace({
        pathname: `/user/${localStorage.getItem(SYSTEM_PATH)}/login`,
      });
    }
    return { res: -1, status: response.status }
  }
  const data = await response.clone().json();
  console.info('http response:', data);
  if (data.res < 0) {
    notification.error({
      message: formatMessage({ id: 'oal.ajax.requestFailed' }),
      description: data.errorCode ? (errorCode[data.errorCode] && formatMessage({ id: errorCode[data.errorCode] }) || '') : '',
    });
  }
  return response;
});

const post = (path, params) => request(path, {
  method: 'post',
  data: { ...params },
});
const get = path => request(path, {
  method: 'get',
});
const remove = path => request(path, {
  method: 'delete',
});
const capture = (ctype, params = {}) => {
  const { user } = window.g_app && window.g_app._store.getState() || {};
  const { userName: cuserName, org: { path: corg } } = user && user.currentUser || { org: {} };

  return request('/guard-web/f/com/capture', {
    method: 'post',
    data: { cuserName, corg, cpath: corg, ctype, ...params },
  });
};
export { post, get, remove, capture };
