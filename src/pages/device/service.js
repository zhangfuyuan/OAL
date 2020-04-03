import { post, get } from '@/utils/ajax';

/**
 * 查询设备
 * @param query
 * @returns {Promise<*>}
 */
export async function getDeviceList(data) {
    return get(`/api/device/list/${data.verity}`);
}

/**
 * 设备审核
 *
 */
export async function verifyDevice(data) {
    return get(`/api/device/${data.deviceId}/verify/${data.result}`);
}

/**
 * 删除设备
 */
export async function removeDevice(data) {
    return get(`/api/device/${data.deviceId}/remove`);
}

/**
 * 设备重命名
 */
export async function renameDevice(data) {
    return get(`/api/device/${data.deviceId}/rename/${data.name}`);
}
