import { ajaxTest, ajaxLog, ajaxDeviceList, ajaxGroupTree, ajaxAddAuthory, ajaxDelAuthory } from './service';

const Model = {
  namespace: 'log',
  state: {
    deviceList: [],
    logList: {},
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
            },
            {
              _id: '5ea956a000000000080f50c',
              name: '888',
            },
            {
              _id: '5ea956a00111111111111111f50c',
              name: '454545',
            },
            {
              _id: '5ea952222222222222220f50c',
              name: 'fsdfds',
            },
            {
              _id: '5ea95333333333333330f50c',
              name: '是大是大非',
            },
            {
              _id: '5ea94444444444444f50c',
              name: '啊实打实&*&（',
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
    // 获取设备对应的记录数据
    *fetchLog({ payload }, { call, put, select }) {
      const response = yield call(ajaxLog, payload);

      if (response && response.res > 0) {
        yield put({
          type: 'saveLogList',
          payload: response.data,
        });

        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        const _response = {
          res: 1,
          data: {
            list: [{
              _id: '5ea956a43f6da70130b0f50c',
              imgPath: '/faceImg/8081/6,3efbd842b4b3',
              name: '王勇',
              staffid: '工号1',
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
              _id: '5ea956a43f677777130b0f50c',
              imgPath: '/faceImg/8081/6,3efbd842b4b3',
              name: '大叔大婶',
              staffid: '工号2',
              group: [{
                _id: '分组ID2222',
                name: '分组名称222',
              }],
              peopleType: '2',
              state: 0,
              creator: '5e8216ca2d93465736e3bfea',
              org: '5e8216ca2d93465736e3bfe9',
              createAt: '2020-04-29T08:30:36.178Z',
              updateAt: '2020-04-29T08:30:36.178Z',
              __v: 0,
            },],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 23,
            }
          },
        };

        yield put({
          type: 'saveLogList',
          payload: _response.data,
        });
        return Promise.resolve(_response);
      }
    },
    // 获取分组树的数据
    *fetchGroupTree({ payload }, { call, put, select }) {
      const response = yield call(ajaxGroupTree, payload);

      if (response && response.res > 0) {
        return Promise.resolve(response);
      } else {
        // 8126TODO 测试数据
        return Promise.resolve({
          res: 1,
          data: [
            { _id: '0', pid: '-1', name: '朗国电子科技', num: '149', isLeaf: false, isPeople: false }, // 必有
            { _id: '1', pid: '0', name: '长沙研发', num: '25', isLeaf: false, isPeople: false },
            { _id: '2', pid: '1', name: '长沙研发子部门', num: '10', isLeaf: true, isPeople: false },
            { _id: '3', pid: '0', name: '上海研发', num: '15', isLeaf: false, isPeople: false },
            { _id: '4', pid: '3', name: '上海研发子部门', num: '10', isLeaf: true, isPeople: false },
            { _id: '5', pid: '0', name: '广州总部', num: '109', isLeaf: false, isPeople: false },
            { _id: '6', pid: '5', name: '营销中心', num: '10', isLeaf: false, isPeople: false },
            { _id: '7', pid: '6', name: '营销中心子部门', num: '5', isLeaf: true, isPeople: false },
            { _id: '7-0', pid: '7', name: '销售工程师', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea95333333333333330f50c' },
            { _id: '7-1', pid: '7', name: '销售工程师', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea95333333333333330f50c' },
            { _id: '7-2', pid: '7', name: '销售工程师', isPeople: true, relateDevice: '5ea956a43f6da70130b0f50c,5ea95333333333333330f50c' },
            { _id: '7-3', pid: '7', name: '销售工程师', isPeople: true, relateDevice: '5ea956a43f6da70130b0f50c,5ea95333333333333330f50c' },
            { _id: '7-4', pid: '7', name: '销售工程师', isPeople: true, relateDevice: '5ea956a43f6da70130b0f50c,5ea95333333333333330f50c' },
            { _id: '8', pid: '5', name: '运营中心', num: '21', isLeaf: false, isPeople: false },
            { _id: '9', pid: '8', name: '运营中心子部门', num: '5', isLeaf: true, isPeople: false },
            { _id: '10', pid: '5', name: '研发中心', num: '78', isLeaf: false, isPeople: false },
            { _id: '11', pid: '10', name: '软件一部', num: '40', isLeaf: true, isPeople: false },
            { _id: '11-0', pid: '11', name: '软件工程师', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea956a43f6da70130b0f50c' },
            { _id: '11-1', pid: '11', name: '软件工程师1', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea956a43f6da70130b0f50c' },
            { _id: '11-2', pid: '11', name: '软件工程师2', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea956a43f6da70130b0f50c' },
            { _id: '11-3', pid: '11', name: '软件工程师3', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-4', pid: '11', name: '软件工程师4', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-5', pid: '11', name: '软件工程师5', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-6', pid: '11', name: '软件工程师6', isPeople: true, relateDevice: '5ea94444444444444f50c,5ea952222222222222220f50c' },
            { _id: '11-7', pid: '11', name: '软件工程师7', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-8', pid: '11', name: '软件工程师8', isPeople: true, relateDevice: '5ea94444444444444f50c,5ea952222222222222220f50c' },
            { _id: '11-9', pid: '11', name: '软件工程师9', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea956a43f6da70130b0f50c' },
            { _id: '11-10', pid: '11', name: '软件工程师10', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea956a43f6da70130b0f50c' },
            { _id: '11-11', pid: '11', name: '软件工程师11', isPeople: true, relateDevice: '5ea956a00111111111111111f50c,5ea956a43f6da70130b0f50c' },
            { _id: '11-12', pid: '11', name: '软件工程师12', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-13', pid: '11', name: '软件工程师13', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-14', pid: '11', name: '软件工程师14', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-15', pid: '11', name: '软件工程师15', isPeople: true, relateDevice: '5ea94444444444444f50c,5ea952222222222222220f50c' },
            { _id: '11-16', pid: '11', name: '软件工程师16', isPeople: true, relateDevice: '5ea94444444444444f50c' },
            { _id: '11-17', pid: '11', name: '软件工程师17', isPeople: true, relateDevice: '5ea94444444444444f50c,5ea952222222222222220f50c' },
            { _id: '12', pid: '10', name: '软件二部', num: '38', isLeaf: true, isPeople: false },
            { _id: '13', pid: '12', name: '软件二二部', num: '40', isLeaf: true, isPeople: false },
            { _id: '14', pid: '13', name: '软件二二二部', num: '38', isLeaf: true, isPeople: false },
            { _id: '15', pid: '0', name: '黑名单', num: '25', isPeople: false },
            { _id: '16', pid: '0', name: '访客', num: '25', isPeople: false },  // 必有
            { _id: '16-0', pid: '16', name: '访客1', isPeople: true, relateDevice: '5ea94444444444444f50c,5ea956a000000000080f50c' },
            { _id: '16-1', pid: '16', name: '访客2', isPeople: true, relateDevice: '5ea94444444444444f50c,5ea956a000000000080f50c' },
            { _id: '16-2', pid: '16', name: '访客3', isPeople: true, relateDevice: '5ea94444444444444f50c' },
          ]
        });
      }
    },
    // 添加授权
    *addAuthory({ payload }, { call, put, select }) {
      const response = yield call(ajaxDelAuthory, payload);

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
    // 根据分组节点获取对应用户列表
    // *fetchUsersByNode({ payload }, { call, put, select }) {
    //   console.log(8126, '根据分组节点获取对应用户列表', payload);
    //   const response = yield call(ajaxUser, payload);
    //   return Promise.resolve(response);
    // },
    // 移除授权
    *delAuthory({ payload }, { call, put, select }) {
      const response = yield call(ajaxDelAuthory, payload);

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
    saveLogList(state, action) {
      return {
        ...state,
        logList: action.payload,
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
