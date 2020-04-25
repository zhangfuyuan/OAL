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
  const _promise = get(`/api/device/${data.deviceId}/verify/${data.result}`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('1', {
        deviceId: data.deviceId,
        result: data.result,
        ...res.data,
      });
  });
  return _promise;
}

/**
 * 删除设备
 */
export async function removeDevice(data) {
  const _promise = get(`/api/device/${data.deviceId}/remove`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('2', {
        deviceId: data.deviceId,
      });
  });
  return _promise;
}

/**
 * 设备重命名
 */
export async function renameDevice(data) {
  const _promise = get(`/api/device/${data.deviceId}/rename/${data.name}`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('3', {
        deviceId: data.deviceId,
        name: data.name,
      });
  });
  return _promise;
}
