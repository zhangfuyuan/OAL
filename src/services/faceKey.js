import { post, get, remove, capture } from '@/utils/ajax';

/**
 * 获取人脸属性列表
 */
export async function getFaceKeyList() {
    return get('/api/face/attribute/fetch');
}

/**
* 新增人脸属性
*/
export async function addFaceKey(params) {
    capture('14', params);
    return post('/api/face/attribute/add', params);
}

/**
 * 修改人脸属性
 */
export async function updateFaceKey(params) {
    capture('15', params);
    return post('/api/face/attribute/update', params);
}

/**
 * 删除人脸属性
 */
export async function deleteFaceKey(params) {
    capture('16', {
        attributeId: params.attributeId,
    });
    return remove(`/api/face/attribute/${params.attributeId}/remove`);
}
