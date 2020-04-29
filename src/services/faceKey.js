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
  const _promise = post('/api/face/attribute/add', params);
  _promise.then(res => { if (res && res.res > 0) capture('14', { ...params, oalid: res.data._id, }); });
  return _promise;
}

/**
 * 修改人脸属性
 */
export async function updateFaceKey(params) {
  const _promise = post('/api/face/attribute/update', params);
  _promise.then(res => { if (res && res.res > 0) capture('15', params); });
  return _promise;
}

/**
 * 删除人脸属性
 */
export async function deleteFaceKey(params) {
  const _promise = remove(`/api/face/attribute/${params.attributeId}/remove`);
  _promise.then(res => {
    if (res && res.res > 0)
      capture('16', {
        attributeId: params.attributeId,
      });
  });
  return _promise;
}
