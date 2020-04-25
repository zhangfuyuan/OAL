import { post, get, remove, capture } from '@/utils/ajax';
import { async } from 'q';

/**
 * 查询人脸
 * @param query
 * @returns {Promise<*>}
 */
export async function fetchList(query) {
  return post('/api/face/manage/fetchList', query);
}

/**
 * 删除人脸
 * @param data
 */
export async function deleteFace(data) {
  const _promise = get(`/api/face/manage/${data.faceId}/remove`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('5', {
        faceId: data.faceId,
      });
  });
  return _promise;
}

export async function removeAllFace() {
  const _promise = remove('/api/face/manage/removeAll');
  _promise.then(res => { if (res && res.res > 0) capture('6'); });
  return _promise;
}

/**
 * 重命名
 * @param data
 */
export async function renameFace(data) {
  const _promise = get(`/api/face/manage/${data.faceId}/rename/${data.name}`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('7', {
        faceId: data.faceId,
        name: data.name,
      });
  });
  return _promise;
}

/**
 * 修改人脸信息
 */
export async function modifyFaceInfo(data) {
  const _promise = post(`/api/face/manage/${data.faceId}/modify`, data);
  _promise.then(res => { if (res && res.res > 0) capture('8', data); });
  return _promise;
}
