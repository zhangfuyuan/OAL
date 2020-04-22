import { post, get, capture } from '@/utils/ajax';

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
    capture('1', {
        deviceId: data.deviceId,
        result: data.result,
    });
    return get(`/api/device/${data.deviceId}/verify/${data.result}`);
}

/**
 * 删除设备
 */
export async function removeDevice(data) {
    capture('2', {
        deviceId: data.deviceId,
    });
    return get(`/api/device/${data.deviceId}/remove`);
}

/**
 * 设备重命名
 */
export async function renameDevice(data) {
    capture('3', {
        deviceId: data.deviceId,
        name: data.name,
    });
    return get(`/api/device/${data.deviceId}/rename/${data.name}`);
}
