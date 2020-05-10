import { post, get, remove } from '@/utils/ajax';
import { async } from 'q';

/**
 * （人员-认证-分组1）获取用户分组树
 * @returns {Promise<*>}
 */
export async function fetchGroup() {
  return get('/guard-web/a/sys/face/fetchGroupTree');
}

/**
 * （人员-认证-分组2）新增分组节点
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAddGroupNode(data) {
  return post('/guard-web/a/sys/face/addGroupNode', data);
}

/**
 * （人员-认证-分组3）重命名分组节点
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxModifyGroupNode(data) {
  return post('/guard-web/a/sys/face/modifyGroupNode', data);
}

/**
 * （人员-认证-分组4）删除分组节点
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxDelGroupNode(data) {
  return post('/guard-web/a/sys/face/delGroupNode', data);
}

/**
 * （人员-认证-列表1）获取/搜索认证人员列表
 * @param data
 * @returns {Promise<*>}
 */
export async function fetchList(data) {
  return post('/guard-web/a/sys/face/fetchList', data);
}

/**
 * （人员-认证-列表2）禁/启用认证人员
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxSetFaceState(data) {
  return post('/guard-web/a/sys/face/setState', data);
}

/**
 * （人员-认证-列表3-1）添加/修改人员的非头像信息
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxAddOrEditInfo(data) {
  return post('/guard-web/a/sys/face/addOrEditInfo', data);
}

/**
 * （人员-认证-列表4-1）批量添加人员数据-获取创建任务ID
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxGetBatchAddTaskId(data) {
  return post('/guard-web/a/sys/face/getBatchAddTaskId', data);
}

/**
 * （人员-认证-列表4-4）轮询后台的解析数据进度
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxGetBatchAddTaskProgress(data) {
  return post('/guard-web/a/sys/face/getBatchAddTaskProgress', data);
}

/**
 * （人员-认证-列表4-5）取消任务
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxCancelBatchAddTask(data) {
  return post('/guard-web/a/sys/face/cancelBatchAddTask', data);
}

/**
 * （人员-认证-列表5）移动人员至其它分组
 * @param data
 * @returns {Promise<*>}
 */
export async function ajaxMoveFace(data) {
  return post('/guard-web/a/sys/face/moveFace', data);
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




