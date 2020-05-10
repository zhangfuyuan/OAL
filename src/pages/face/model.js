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
      } else {
        // 8126TODO 测试数据
        const _data =
          yield put({
            type: 'save',
            payload: {
              list: [{
                staffid: '工号1',
                group: [{
                  _id: '分组ID',
                  name: '分组名称',
                }],
                featureState: 0,
                state: 1,
                _id: '5ea93b2c3f6da70130b0f50a',
                name: '王勇',
                creator: '5e8216ca2d93465736e3bfea',
                org: '5e8216ca2d93465736e3bfe9',
                from: {
                  type: 'device',
                },
                profile: {
                  jobNumber: '001',
                  department: '测试',
                },
                fileInfo: {
                  fid: '6,3efbd842b4b3',
                  url: '127.0.0.1:8081',
                  publicUrl: '127.0.0.1:8081',
                  count: 1,
                },
                fileName: '6,3efbd842b4b3',
                createAt: '2020-04-29 08:30:36',
                updateAt: '2020-04-29 08:30:36',
                __v: 0,
                imgPath: '/faceImg/8081/6,3efbd842b4b3',
              }, {
                staffid: '工号2',
                group: [{
                  _id: '分组ID',
                  name: '分组名称',
                }],
                featureState: 0,
                state: 0,
                _id: '5ea93b2c3f6da70130b0f60a',
                name: '阿萨',
                creator: '5e8216ca2d93465736e3bfea',
                org: '5e8216ca2d93465736e3bfe9',
                from: {
                  type: 'device',
                },
                profile: {
                  jobNumber: '001',
                  department: '测试',
                },
                fileInfo: {
                  fid: '6,3efbd842b4b3',
                  url: '127.0.0.1:8081',
                  publicUrl: '127.0.0.1:8081',
                  count: 1,
                },
                fileName: '6,3efbd842b4b3',
                createAt: '2020-04-29 08:30:36',
                updateAt: '2020-04-29 08:30:36',
                __v: 0,
                imgPath: '/faceImg/8081/6,3efbd842b4b3',
              }],
              pagination: {
                current: 1,
                pageSize: 10,
                total: 2,
              }
            },
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


      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: [
            { _id: '0', pid: '-1', name: '朗国电子科技', num: '149', isLeaf: false },
            { _id: '1', pid: '0', name: '长沙研发', num: '25', isLeaf: false },
            { _id: '2', pid: '1', name: '长沙研发子部门', num: '10', isLeaf: true },
            { _id: '3', pid: '0', name: '上海研发', num: '15', isLeaf: false },
            { _id: '4', pid: '3', name: '上海研发子部门', num: '10', isLeaf: true },
            { _id: '5', pid: '0', name: '广州总部', num: '109', isLeaf: false },
            { _id: '6', pid: '5', name: '营销中心', num: '10', isLeaf: false },
            { _id: '7', pid: '6', name: '营销中心子部门', num: '5', isLeaf: true },
            { _id: '8', pid: '5', name: '运营中心', num: '21', isLeaf: false },
            { _id: '9', pid: '8', name: '运营中心子部门', num: '5', isLeaf: true },
            { _id: '10', pid: '5', name: '研发中心', num: '78', isLeaf: false },
            { _id: '11', pid: '10', name: '软件一部', num: '40', isLeaf: true },
            { _id: '12', pid: '10', name: '软件二部', num: '38', isLeaf: true },
            { _id: '13', pid: '12', name: '软件二二部', num: '40', isLeaf: true },
            { _id: '14', pid: '13', name: '软件二二二部', num: '38', isLeaf: true },
          ]
        });
      }
    },
    // 新增分组节点
    *addGroupNode({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddGroupNode, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
    },
    // 重命名分组节点
    *modifyGroupNode({ payload }, { call, put, select }) {
      const response = yield call(ajaxModifyGroupNode, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
    },
    // 删除分组节点
    *delGroupNode({ payload }, { call, put, select }) {
      const response = yield call(ajaxDelGroupNode, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
    },
    // 移动分组节点
    // *moveGroupNode({ payload }, { call, put, select }) {
    //   console.log(8126, '移动分组节点', payload);
    //   const response = yield call(fetchGroup, payload);
    //   return Promise.resolve(response);
    // },
    // （单个）添加/编辑人脸信息（不包括图片）
    *addOrEditInfo({ payload }, { call, put, select }) {
      const response = yield call(ajaxAddOrEditInfo, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
    },
    // 移动人脸
    *moveFace({ payload }, { call, put, select }) {
      const response = yield call(ajaxMoveFace, payload);
      
      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
    },
    // 禁/启用认证人员
    *setFaceState({ payload }, { call, put, select }) {
      const response = yield call(ajaxSetFaceState, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
    },
    // 批量添加人员数据-获取创建任务ID
    *getBatchAddTaskId({ payload }, { call, put, select }) {
      const response = yield call(ajaxGetBatchAddTaskId, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {
            taskId: '任务ID',
          },
        });
      }
    },
    // 批量添加人员数据-轮询后台的解析数据进度
    *getBatchAddTaskProgress({ payload }, { call, put, select }) {
      const response = yield call(ajaxGetBatchAddTaskProgress, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {
            taskProgress: 66,
            successNum: 6,
          },
        });
      }
    },
    // 批量添加人员数据-取消任务
    *cancelBatchAddTask({ payload }, { call, put, select }) {
      const response = yield call(ajaxCancelBatchAddTask, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: {},
        });
      }
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
