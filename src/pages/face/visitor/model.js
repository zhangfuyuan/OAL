import { ajaxList, ajaxTest, getDeviceList, ajaxAddOrEditInfo, ajaxDeleteFace } from './service';

const Model = {
  namespace: 'faceVisitor',
  state: {
    visitorList: [],
    deviceList: [],
  },
  effects: {
    // 获取访客列表
    *fetchList({ payload }, { call, put, select }) {
      const response = yield call(ajaxList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });

        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: {
            list: [{
              staffid: '工号1',
              _id: '5ea93b2c3f0070130b0f50a',
              name: '王勇1',
              org: '5e8216ca2d93465736e3bfe9',
              from: {
                type: 'device'
              },
              fileName: '6,3efbd842b4b3',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
              imgPath: '/faceImg/8081/6,3efbd842b4b3',
              mobile: '1311***1235',
              startDate: "2020-05-04",
              endDate: "2020-05-10",
            }, {
              staffid: '工号2',
              _id: '5ea93b2c3f6da70130b0f50a',
              name: '王勇2',
              org: '5e8216ca2d93465736e3bfe9',
              from: {
                type: 'device'
              },
              fileName: '6,3efbd842b4b3',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
              imgPath: '/faceImg/8081/6,3efbd842b4b3',
              mobile: '1311***1235',
              startDate: "2020-05-04",
              endDate: "2020-05-10",
            }],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 2,
            }
          },
        };

        yield put({
          type: 'saveList',
          payload: _response.data,
        });

        return Promise.resolve(_response);
      }
    },
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
    // 删除访客
    *delVisitor({ payload }, { call, put, select }) {
      const response = yield call(ajaxDeleteFace, payload);

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
    // 获取设备列表
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(getDeviceList, payload);
      if (response.res > 0) {
        yield put({
          type: 'saveDeviceList',
          payload: response.data,
        });
      }
      return Promise.resolve(response);
    },
    // 关联设备
    *relateDevice({ payload }, { call, put, select }) {
      console.log(8126, '关联设备', payload);
      const response = yield call(ajaxTest, payload);
      return Promise.resolve(response);
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        visitorList: action.payload,
      };
    },
    saveDeviceList(state, action) {
      return {
        ...state,
        deviceList: action.payload,
      };
    },
  },
};

export default Model;
