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
      *fetchGroupTree({ payload }, { call, put, select }) {
        const response = yield call(fetchGroup);
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
