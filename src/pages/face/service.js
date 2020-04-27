import { post, get, remove } from '@/utils/ajax';
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
    return get(`/api/face/manage/${data.faceId}/remove`);
}

export async function removeAllFace() {
    return remove('/api/face/manage/removeAll')
}

/**
 * 重命名
 * @param data
 */
export async function renameFace(data) {
    return get(`/api/face/manage/${data.faceId}/rename/${data.name}`);
}

/**
 * 修改人脸信息
 */
export async function modifyFaceInfo(data) {
    return post(`/api/face/manage/${data.faceId}/modify`, data);
}

/**
 * 获取用户分组树
 * @param data
 * @returns {Promise<*>}
 */
export async function fetchGroup(data) {
  return get('/api/user/authByToken');
}
