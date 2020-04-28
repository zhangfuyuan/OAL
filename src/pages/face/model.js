import { fetchList, deleteFace, renameFace, modifyFaceInfo, removeAllFace, fetchGroup } from './service';
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
      // console.log('fetch response-->', response);
      if (response.res > 0) {
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
    *toGetSysConfigs(_, { call, put }) {
      const response = yield call(getSysConfig);
      // console.log('toGetSysConfigs response-->', response);
      const { res, data } = response;
      if (res > 0) {
        yield put({
          type: 'saveSysConfig',
          payload: data,
        });
      }
    },
    /** 8126TODO 对接新增接口 **/
    // 获取分组树的数据
    *fetchGroupTree({ payload }, { call, put, select }) {
      console.log(8126, '获取分组树的数据', payload);
      const response = yield call(fetchGroup, payload);
      return Promise.resolve({
        ...response,
        data: [
          { id: '0', pid: '-1', name: '朗国电子科技', num: '149' },
          { id: '1', pid: '0', name: '长沙研发', num: '25' },
          { id: '2', pid: '1', name: '长沙研发子部门', num: '10' },
          { id: '3', pid: '0', name: '上海研发', num: '15' },
          { id: '4', pid: '3', name: '上海研发子部门', num: '10' },
          { id: '5', pid: '0', name: '广州总部', num: '109' },
          { id: '6', pid: '5', name: '营销中心', num: '10' },
          { id: '7', pid: '6', name: '营销中心子部门', num: '5' },
          { id: '8', pid: '5', name: '运营中心', num: '21' },
          { id: '9', pid: '8', name: '运营中心子部门', num: '5' },
          { id: '10', pid: '5', name: '研发中心', num: '78' },
          { id: '11', pid: '10', name: '软件一部', num: '40' },
          { id: '12', pid: '10', name: '软件二部', num: '38' },
          { id: '13', pid: '12', name: '软件二二部', num: '40' },
          { id: '14', pid: '13', name: '软件二二二部', num: '38' },
        ]
      });
    },
    // 新增分组节点
    *addGroupNode({ payload }, { call, put, select }) {
      console.log(8126, '新增分组节点', payload);
      const response = yield call(fetchGroup, payload);
      return Promise.resolve(response);
    },
    // 重命名分组节点
    *modifyGroupNode({ payload }, { call, put, select }) {
      console.log(8126, '重命名分组节点', payload);
      const response = yield call(fetchGroup, payload);
      return Promise.resolve(response);
    },
    // 删除分组节点
    *delGroupNode({ payload }, { call, put, select }) {
      console.log(8126, '删除分组节点', payload);
      const response = yield call(fetchGroup, payload);
      return Promise.resolve(response);
    },
    // 移动分组节点
    *moveGroupNode({ payload }, { call, put, select }) {
      console.log(8126, '移动分组节点', payload);
      const response = yield call(fetchGroup, payload);
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
