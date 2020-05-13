/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { AUTH_TOKEN } from './constants';
import { formatMessage } from 'umi-plugin-react/locale';

const codeMessage = {
  200: 'oal.ajax.200',
  201: 'oal.ajax.201',
  202: 'oal.ajax.202',
  204: 'oal.ajax.204',
  400: 'oal.ajax.400',
  401: 'oal.ajax.401',
  403: 'oal.ajax.403',
  404: 'oal.ajax.404',
  406: 'oal.ajax.406',
  410: 'oal.ajax.410',
  422: 'oal.ajax.422',
  500: 'oal.ajax.500',
  502: 'oal.ajax.502',
  503: 'oal.ajax.503',
  504: 'oal.ajax.504',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] && formatMessage({ id: codeMessage[response.status] }) || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `${formatMessage({ id: 'oal.ajax.requestError' })} ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: formatMessage({ id: 'oal.ajax.requestErrorDescription' }),
      message: formatMessage({ id: 'oal.ajax.requestErrorMessage' }),
    });
  }

  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 100000, // 超时设置
});

/**
 * add by Jianbing.Fang
 * 全局拦截器,增加认证token
 */
request.interceptors.request.use((url, options) => {
  options.headers = {
    ...options.headers,
  };
  // const authToken = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);
  // if (authToken) {
  //   options.headers.Authorization = `Bearer ${authToken}`
  // }
  return (
    {
      url,
      options: {
        ...options,
        interceptors: true,
      },
    }
  );
});

export default request;
