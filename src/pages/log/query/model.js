import { ajaxTest, ajaxLogQuery, ajaxDeviceList } from './service';

const Model = {
  namespace: 'logQuery',
  state: {
    deviceList: [],
    logQueryList: {},
  },
  effects: {
    // 获取设备列表
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(ajaxDeviceList, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveDeviceList',
          payload: response.data,
        });
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: [
            {
              _id: '5ea956a43f6da70130b0f50c',
              name: 'dd',
              temperatureUnit: '1',
            },
            {
              _id: '5ea956a000000000080f50c',
              name: '888',
              temperatureUnit: '1',
            },
            {
              _id: '5ea956a00111111111111111f50c',
              name: '454545',
              temperatureUnit: '0',
            },
            {
              _id: '5ea952222222222222220f50c',
              name: 'fsdfds',
              temperatureUnit: '0',
            },
            {
              _id: '5ea95333333333333330f50c',
              name: '是大是大非',
              temperatureUnit: '0',
            },
            {
              _id: '5ea94444444444444f50c',
              name: '啊实打实&*&（',
              temperatureUnit: '1',
            },
          ],
        };

        yield put({
          type: 'saveDeviceList',
          payload: _response.data,
        });
        return Promise.resolve(_response);
      }
    },
    // 获取设备对应的记录查询
    *fetchLogQuery({ payload }, { call, put, select }) {
      const response = yield call(ajaxLogQuery, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveLogQueryList',
          payload: response.data,
        });

        return Promise.resolve(response);
      } else {
        const _response = {
          res: 1,
          data: {
            list: [{
              animalHeat: '36.5',
              _id: '5ea956a43f6da70130b0f50c',
              imgPath: '/faceImg/8081/6,3efbd842b4b3',
              name: '王勇',
              staffid: '工号',
              group: [{
                _id: '分组ID',
                name: '分组名称',
              }],
              peopleType: '0',
              state: 1,
              creator: '5e8216ca2d93465736e3bfea',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
            }, {
              animalHeat: '40.2',
              _id: '5ea9522222222220b0f50c',
              imgPath: '/faceImg/8081/6,3efbd842b4b3',
              name: '王勇22',
              staffid: '工号2',
              group: [{
                _id: '分组ID',
                name: '分组名称',
              }],
              peopleType: '2',
              state: 1,
              creator: '5e8216ca2d93465736e3bfea',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
            }, {
              animalHeat: '100',
              _id: '5ea9533333333333b0f50c',
              imgPath: '/faceImg/8081/6,3efbd842b4b3',
              name: '王勇3333',
              staffid: '工号33333',
              peopleType: '2',
              state: 1,
              creator: '5e8216ca2d93465736e3bfea',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
            }],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 23,
            }
          },
        };

        yield put({
          type: 'saveLogQueryList',
          payload: _response.data,
        });

        return Promise.resolve(_response);
      }
    },
    // 导出
    *export({ payload }, { call, put, select }) {
      console.log(8126, '导出', payload);
      const response = yield call(ajaxTest, payload);
      return Promise.resolve(response);
    },
  },
  reducers: {
    saveLogQueryList(state, action) {
      return {
        ...state,
        logQueryList: action.payload,
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
