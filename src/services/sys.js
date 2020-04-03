import { post, get } from '@/utils/ajax';

/**
 * 获取系统参数
 */
export async function getSysConfig() {
    return get('/api/sys/getConfig');
}
/**
 * 设置系统参数
 */
export async function setSysConfig(data) {
    return post('/api/sys/setConfig', data)
}
