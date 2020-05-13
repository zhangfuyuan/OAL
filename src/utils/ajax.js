/**
 *  add by Jianbing Fang
 */
import request from './request';
import router from 'umi/router';
import { notification } from 'antd';
import { stringify } from 'qs';
import { SYSTEM_PATH, AUTH_TOKEN } from '@/utils/constants';
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
  6007: 'oal.face.staffidRepeatTips',
  6008: 'oal.face.userNumLimit',
};

const errorMsg = {
  3002: 'oal.user-login.loginFailed',
  3004: 'oal.user-login.loginFailed',
  3007: 'oal.user-login.loginFailed',
  6007: 'oal.face.staffidRepeat',
  6008: 'oal.face.addFailed',
};

/**
 * 全局的处理
 */
request.interceptors.response.use(async (response, options) => {
  // console.log('response-->', response);
  const { status } = response || {};

  if (status !== 200) {
    if (status === 401) {
      // 鉴权失败，跳转到登录
      notification.error({
        message: formatMessage({ id: 'oal.ajax.401-message' }),
        description: formatMessage({ id: 'oal.ajax.401-description' }),
      });
      localStorage.removeItem(AUTH_TOKEN);
      sessionStorage.removeItem(AUTH_TOKEN);
      router.replace({
        pathname: `/user/${localStorage.getItem(SYSTEM_PATH)}/login`,
      });
    } else {
      notification.error({
        message: `${formatMessage({ id: 'oal.ajax.requestError' })} ${status}`,
        description: formatMessage({ id: `oal.ajax.${status}` }),
      });
    }

    return { res: -1, status: status }
  }
  const data = await response.clone().json();
  // console.info('http response:', data);
  if (data.res < 0) {
    notification.error({
      message: errorMsg[data.errcode] ? formatMessage({ id: errorMsg[data.errcode] }) : formatMessage({ id: 'oal.ajax.requestFailed' }),
      description: data.errcode ? (errorCode[data.errcode] && formatMessage({ id: errorCode[data.errcode] }) || '') : '',
    });
  }
  return response;
});

const post = (path, params, extend = {}) => request(path, {
  method: 'post',
  data: { ...params },
  ...extend,
});
const get = path => request(path, {
  method: 'get',
});
const remove = path => request(path, {
  method: 'delete',
});
export { post, get, remove };
