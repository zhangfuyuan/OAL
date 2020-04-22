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
    capture('5', {
        faceId: data.faceId,
    });
    return get(`/api/face/manage/${data.faceId}/remove`);
}

export async function removeAllFace() {
    capture('6');
    return remove('/api/face/manage/removeAll')
}

/**
 * 重命名
 * @param data
 */
export async function renameFace(data) {
    capture('7', {
        faceId: data.faceId,
        name: data.name,
    });
    return get(`/api/face/manage/${data.faceId}/rename/${data.name}`);
}

/**
 * 修改人脸信息
 */
export async function modifyFaceInfo(data) {
    capture('8', data);
    return post(`/api/face/manage/${data.faceId}/modify`, data);
}
