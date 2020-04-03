import { post, get } from '@/utils/ajax';

/**
 * 获取自己的开发者账号
 */
export async function getDevInfo() {
  return get('/api/developer/get');
}

/**
 * 获取生成一个开发者账号
 */
export async function applyDevAccount() {
  return get('/api/developer/apply');
}

/**
 * 重置开发者密钥
 */
export async function resetSecret() {
  return get('/api/developer/secret/reset');
}
