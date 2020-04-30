import { post, get } from '@/utils/ajax';

/**
 * 获取考勤列表
 */
export async function getAttendList(data) {
    return post('/api/report/fetch', data);
}

/**
 * 获取个人考勤列表
 */
export async function getPerAttendList(data) {
    return get(`/api/report/face/${data.faceId}/${data.date}`);
}

/**
 * 查询设备
 * @param query
 * @returns {Promise<*>}
 */
export async function getDeviceList(data) {
    return get(`/api/device/list/${data.verity}`);
}

/**
 * ...
 * @param data
 * @returns {Promise<*>}
 */
export async function fetchTest(data) {
  return get('/api/user/authByToken');
}
