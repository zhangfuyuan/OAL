/**
 *  add by Jianbing Fang
 */
import request from './request';
import router from 'umi/router';
import { notification } from 'antd';
import { stringify } from 'qs';
import { SYSTEM_PATH } from '@/utils/constants';

const errorCode = {
  1000: '系统错误或未知错误',
  3001: '用户未找到',
  3002: '密码错误',
  3003: '密码错误次数过多',
  3004: '用户被冻结或者状态无效',
  3005: '无效的认证凭证',
  3006: '认证过期',
  3007: '所属组织已经失效',
  3008: '所属组织未找到',
  3009: '没有此权限',
  3010: '用户名已经存在',
  3011: '新密码和旧密码一致，请重新设置',
  4001: '查询条件为空',
  4002: '缺少查询条件',
  4003: '数据未找到',
  5001: '保存数据错误',
  5002: '数据更新失败，已经不是最新版本',
  5003: '数据更新失败，数据已经不存在',
  5004: '删除失败',
  5005: '缺少必要参数',
  5006: '未知操作',
  5007: '数据已经存在',
  6001: '邮箱已经存在',
  6002: '组织路径已经存在',
  6003: '设备已经存在于该组织下',
  6004: '设备还未通过审核',
  6005: '开发者信息已经存在',
  6006: '属性已经存在',
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
        message: '请重新登录',
        description: '授权失败或者已过期',
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
      message: '请求失败',
      description: data.errorCode ? (errorCode[data.errorCode] || '') : '',
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
export { post, get, remove };
