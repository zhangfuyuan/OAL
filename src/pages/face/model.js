import {
  fetchList,
  deleteFace,
  renameFace,
  modifyFaceInfo,
  removeAllFace,
  fetchGroup,
  ajaxSetFaceState,
  ajaxAddGroupNode,
  ajaxModifyGroupNode,
  ajaxDelGroupNode,
  ajaxAddOrEditInfo,
  ajaxGetBatchAddTaskId,
  ajaxGetBatchAddTaskProgress,
  ajaxCancelBatchAddTask,
  ajaxMoveFace,
  ajaxRefreshGroupNum,
} from './service';
import { getSysConfig } from '@/services/sys';

const Model = {
  namespace: 'face',
  state: {
    faceList: {},
    sysConfigs: [], // 系统设置
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }

      return Promise.resolve(response);
    },
    // *add({ payload }, { call }) {
    //   const response = yield call(add, payload);
    //   console.log('add response-->', response);
    //   return Promise.resolve(response);
    // },
    *delete({ payload }, { call }) {
      const response = yield call(deleteFace, payload);
      // console.log('deleteFace response-->', response);
      return Promise.resolve(response);
    },
    *removeAll(_, { call }) {
      const response = yield call(removeAllFace);
      // console.log('removeAll response-->', response);
      return Promise.resolve(response);
    },
    *modify({ payload }, { call }) {
      const response = yield call(modifyFaceInfo, payload);
      // console.log('modifyFaceInfo response-->', response);
      return Promise.resolve(response);
    },
    // 获取分组树的数据
    *fetchGroupTree({ payload }, { call, put, select }) {
      const response = yield call(fetchGroup, payload);

      return Promise.resolve(response);
    },
    // 新增分组节点
    *addGroupNode({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddGroupNode, payload);

      return Promise.resolve(response);
    },
    // 重命名分组节点
    *modifyGroupNode({ payload }, { call, put, select }) {
      const response = yield call(ajaxModifyGroupNode, payload);

      return Promise.resolve(response);
    },
    // 删除分组节点
    *delGroupNode({ payload }, { call, put, select }) {
      const response = yield call(ajaxDelGroupNode, payload);

      return Promise.resolve(response);
    },
    // 刷新分组数量
    *refreshGroupNum({ payload }, { call, put, select }) {
      const response = yield call(ajaxRefreshGroupNum, payload);

      return Promise.resolve(response);
    },
    // 移动分组节点
    // *moveGroupNode({ payload }, { call, put, select }) {
    //   const response = yield call(fetchGroup, payload);
    //   return Promise.resolve(response);
    // },
    // （单个）添加/编辑人脸信息（不包括图片）
    *addOrEditInfo({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddOrEditInfo, payload);

      return Promise.resolve(response);
    },
    // 移动人脸
    *moveFace({ payload }, { call, put, select }) {
      const response = yield call(ajaxMoveFace, payload);

      return Promise.resolve(response);
    },
    // 禁/启用认证人员
    *setFaceState({ payload }, { call, put, select }) {
      const response = yield call(ajaxSetFaceState, payload);

      return Promise.resolve(response);
    },
    // 批量添加人员数据-获取创建任务ID
    *getBatchAddTaskId({ payload }, { call, put, select }) {
      const response = yield call(ajaxGetBatchAddTaskId, payload);

      return Promise.resolve(response);
    },
    // 批量添加人员数据-轮询后台的解析数据进度
    *getBatchAddTaskProgress({ payload }, { call, put, select }) {
      const response = yield call(ajaxGetBatchAddTaskProgress, payload);

      return Promise.resolve(response);
    },
    // 批量添加人员数据-取消任务
    *cancelBatchAddTask({ payload }, { call, put, select }) {
      const response = yield call(ajaxCancelBatchAddTask, payload);

      return Promise.resolve(response);
    },
  },
  reducers: {
    save(state, action) {
      // console.log('save org-:', action.payload);
      return {
        ...state,
        faceList: action.payload,
      };
    },
    saveSysConfig(state, action) {
      return {
        ...state,
        sysConfigs: action.payload,
      };
    },
  },
};
export default Model;
