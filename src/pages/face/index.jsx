import React, { Component, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import { Avatar, Upload, Button, Icon, Card, Radio, Input, Drawer, Badge, Alert, Dropdown, Menu, Popconfirm, message, Modal, Divider, notification, Col, Form, Row, Select, Spin, Tree, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva';
import { findIndex, groupBy } from 'lodash';
import { AUTH_TOKEN, SYSTEM_PATH } from '../../utils/constants';
import styles from './style.less';
import TreeAddModal from './components/TreeAddModal';
import TreeModifyModal from './components/TreeModifyModal';
import TreeDelModal from './components/TreeDelModal';
import TableAddOrModifyModal from './components/TableAddOrModifyModal';
import TableBatchAddModal from './components/TableBatchAddModal';
import TableMoveModal from './components/TableMoveModal';
import TableDelModal from './components/TableDelModal';
// import UploadProgress from './components/UploadProgress';
// import UploadDetail from './components/UploadDetail';
import StandardTable from '@/components/StandardTable'
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import Link from 'umi/link';
import { toTree } from '@/utils/utils';

const { Search } = Input;
const { confirm } = Modal;
const { TreeNode } = Tree;

const renderStatusText = data => {
  let statusText = <Badge status="processing" text={formatMessage({ id: 'oal.face.authorization' })} />
  if (data.featureState === 1) {
    statusText = <Badge status="success" text={formatMessage({ id: 'oal.face.beAuthorized' })} />
  } else if (data.featureState === -1) {
    statusText = <Badge status="error" text={formatMessage({ id: 'oal.face.authorizationFailure' })} />
  }
  return (
    <span>{statusText}</span>
  )
}

const listSubName = data => {
  let subNameText = <span><Icon type="loading" style={{ marginRight: 8 }} /> <FormattedMessage id="oal.face.featureExtraction" /> </span>;
  if (data.featureState === 1) {
    subNameText = <span><Icon type="check-circle" style={{ marginRight: 8, color: '#52C418' }} /><FormattedMessage id="oal.face.extractedFeature" /></span>
  } else if (data.featureState === -1) {
    subNameText = <span><Icon type="close-circle" style={{ marginRight: 8, color: '#f5222d' }} /><FormattedMessage id="oal.face.featureExtractionFailure" /></span>
    if (data.featureErrorCode && data.featureErrorCode.errorMsg) {
      subNameText += `:${data.featureErrorCode.errorMsg}`
    }
  }
  return subNameText;
}

@connect(({ user, face, faceKey, loading }) => ({
  face,
  user: user.currentUser,
  tableLoading: loading.effects['face/fetch'],
  modifyLoading: loading.effects['face/modify'],
  faceKeyList: faceKey.faceKeyList,
  sysConfigs: face.sysConfigs,
  treeLoading: loading.effects['face/fetchGroupTree'],
}))
class Face extends Component {
  state = {
    treeAddVisible: false,
    treeModifyVisible: false,
    treeDelVisible: false,
    // uploadVisible: false,
    tableBatchAddVisible: false,
    tableMoveVisible: false,
    tableDelVisible: false,
    featureState: 'all',
    tableAddOrModifyVisible: false,
    tableSelectedBean: {},
    viewVisible: false,
    tableSelectedRows: [],
    // infoVisible: true,
    // fileList: [],
    // errorList: [],
    // successList: [],
    // childrenDrawer: false, // 上传的明细右侧栏
    // childrenTabIndex: 'success', // 明细中展示的tab类型
    treeData: [],
    nodeTreeItem: null,
    tableSearchName: '',
    sortedInfo: {
      columnKey: '',
      order: '', // ascend（正序）、descend（倒序）
    },
    treeFocusKey: '',
    tablePage: {
      current: 1,
      pageSize: 10,
    },
  };

  ref_leftDom = null;

  componentDidMount() {
    this.tree_loadData(true);
    // this.errorList = [];
    // this.excludeNum = 0;
  }

  componentWillUnmount() {
    this.tree_clearMenu();
  }

  /************************************************* Tree Start *************************************************/

  tree_loadData = (isRefreshTable) => {
    const { dispatch } = this.props;
    const { treeFocusKey } = this.state;

    this.tree_clearMenu();
    this.setState({ treeData: [] });
    dispatch({
      type: 'face/fetchGroupTree',
    }).then(res => {
      if (res && res.res > 0) {
        const treeData = toTree(res.data) || [];
        this.setState({
          treeData,
          treeFocusKey: treeFocusKey || (treeData[0] && treeData[0].id) || '0',
        }, () => {
          if (isRefreshTable) {
            // 8126TODO 一个请求搞定
            this.table_loadFaceList();
            this.loadFaceKeyList();
            this.loadSysConfig();
          }
        });
      }
    }).catch(err => {
      console.log(err);
    });
  };

  tree_renderNodes = data =>
    data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.id} title={`${item.name} (${item.num})`} dataRef={item}>
            {this.tree_renderNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={`${item.name} (${item.num})`} {...item} dataRef={item} />;
    });

  tree_onMouseEnter = (e) => {
    if (this.ref_leftDom) {
      const { left: pLeft, top: pTop } = this.ref_leftDom.getBoundingClientRect();
      const { left, width, top } = e.event.currentTarget.getBoundingClientRect();
      const x = left - pLeft + width + this.ref_leftDom.scrollLeft;
      const y = top - pTop;
      const { eventKey, dataRef, pos } = e.node.props;

      this.setState({
        nodeTreeItem: {
          pageX: x,
          pageY: y,
          id: eventKey,
          nodeData: dataRef,
          level: pos && (pos.split('-').length - 1) || 1,
        }
      });
    }
  };

  tree_getNodeTreeMenu() {
    if (this.state.nodeTreeItem) {
      const { pageX, pageY, level } = this.state.nodeTreeItem;
      const tmpStyle = {
        position: 'absolute',
        maxHeight: 40,
        textAlign: 'center',
        left: `${pageX + 10}px`,
        top: `${pageY}px`,
        display: 'flex',
        flexDirection: 'row',
      };
      const menu = (
        <div
          style={tmpStyle}
          onClick={e => e.stopPropagation()}
        >
          {
            level > 1 ?
              (<div style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer', }} onClick={this.tree_showTreeModifyModal}>
                <Tooltip placement="bottom" title={formatMessage({ id: 'oal.common.modify' })}>
                  <Icon type='edit' />
                </Tooltip>
              </div>) : ''
          }
          {
            level > 1 ?
              (<div style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer', }} onClick={this.tree_showTreeDelModal}>
                <Tooltip placement="bottom" title={formatMessage({ id: 'oal.common.delete' })}>
                  <Icon type='minus-circle-o' />
                </Tooltip>
              </div>) : ''
          }
          {
            level < 5 ?
              (<div style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer', }} onClick={this.tree_showTreeAddModal}>
                <Tooltip placement="bottom" title={formatMessage({ id: 'oal.common.addItems' })}>
                  <Icon type='plus-circle-o' />
                </Tooltip>
              </div>) : ''
          }
        </div>
      );

      return menu;
    }

    return '';
  }

  tree_clearMenu = () => {
    this.setState({
      nodeTreeItem: null,
    });
  };

  tree_onSelect = (selectedKeys, e) => {
    console.log(8126, '点击分组刷新列表', selectedKeys[0]);
    this.setState({
      treeFocusKey: selectedKeys[0],
    }, () => {
      // 8126TODO 一个请求搞定
      this.table_loadFaceList();
    });
  };

  tree_onDrop = info => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/moveGroupNode',
      payload: {
        id: info.dragNode.props.eventKey,
        parentId: info.node.props.eventKey,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.moveSuccessfully' }));
        this.tree_loadData();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  /************************************************* Tree End *************************************************/

  /************************************************ Table Start ************************************************/

  table_loadFaceList = () => {
    const { dispatch } = this.props;
    const { featureState, tableSearchName, treeFocusKey, tablePage, sortedInfo } = this.state;
    const { columnKey, order } = sortedInfo;
    // 8126TODO 请求参数需对接
    dispatch({
      type: 'face/fetch',
      payload: {
        ...tablePage,
        featureState,
        groupId: treeFocusKey,
        columnKey,
        order,
        name: tableSearchName.trim(),
      },
    });
  };

  table_columns = () => {
    const { user, faceKeyList } = this.props;
    // const MoreBtn = ({ item }) => (
    //   <Dropdown
    //     overlay={
    //       <Menu onClick={({ key }) => this.editAndDelete(key, item)}>
    //         <Menu.Item key="modify"><FormattedMessage id="oal.common.modify" /></Menu.Item>
    //         <Menu.Item key="editPhoto"><FormattedMessage id="oal.face.modifyPhoto" /></Menu.Item>
    //       </Menu>
    //     }
    //   >
    //     <a>
    //       <FormattedMessage id="oal.common.edit" /> <Icon type="down" />
    //     </a>
    //   </Dropdown>
    // );
    const cl = [
      {
        title: formatMessage({ id: 'oal.common.photo' }),
        key: 'avatar',
        width: 100,
        render: (text, record) => <Avatar src={`${record.imgPath}.jpg?height=64&width=64&mode=fit`} shape="square" size="large" onClick={() => this.table_openViewModal(record)} style={{ cursor: 'pointer' }} />,
      },
      {
        title: formatMessage({ id: 'oal.common.fullName' }),
        key: 'name',
        dataIndex: 'name',
        // ellipsis: true,
        // sorter: (a, b) => a.name - b.name,
        // sortOrder: this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.face.staffid' }),
        key: 'staffid',
        dataIndex: 'staffid',
        render: (text, record) => <span>{record.staffid || '--'}</span>,
      },
      // {
      //   title: '状态',
      //   key: 'status',
      //   width: 150,
      //   render: (text, record) => renderStatusText(record),
      // },
    ];
    // 遍历人脸属性列表，根据人脸列表字段profile里面的进行对应渲染，其中如果是下拉控件（type=2），还要拿到value对应的text
    // eslint-disable-next-line no-unused-expressions
    // faceKeyList && faceKeyList.length > 0 && faceKeyList.map((item, index) => {
    //   (index === 0) && cl.push({
    //     title: item.name,
    //     key: item.key,
    //     ellipsis: true,
    //     render: (text, record) => {
    //       const type = item.componentInfo && item.componentInfo.type; // 文本框1，下拉框2
    //       const data = item.componentInfo && item.componentInfo.data; // 下拉选项value，text的对象数组
    //       let spanText = '';
    //       if (record && record.profile && record.profile[item.key]) {
    //         if (type === 2 && data && data.length > 0) {
    //           const option = data.find(bean => bean.value == record.profile[item.key]);
    //           spanText = (option && option.text) || '';
    //         } else {
    //           spanText = record.profile[item.key];
    //         }
    //       }
    //       return <span>{spanText}</span>
    //     },
    //   });
    // });

    cl.push(
      // {
      //   title: formatMessage({ id: 'oal.common.updateTime' }),
      //   key: 'updateAt',
      //   width: 150,
      //   render: (text, record) => <span>{record.updateAt ? moment(record.updateAt).format('YYYY-MM-DD HH:mm') : ''}</span>,
      // },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 200,
        render: (text, record) => (
          <Fragment>
            <a key="edit" onClick={() => this.table_showTableAddOrModifyModal(record)}><FormattedMessage id="oal.common.edit" /></a>
            <Divider type="vertical" />
            <a key="move" onClick={(e) => this.table_showTableMoveModal(e, record)}><FormattedMessage id="oal.common.move" /></a>
            <Divider type="vertical" />
            {/* <Popconfirm placement="topLeft" title={formatMessage({ id: 'oal.face.confirmDeleteFace' })} onConfirm={() => this.deleteFace(record)} okText={formatMessage({ id: 'oal.common.delete' })} cancelText={formatMessage({ id: 'oal.common.cancel' })}> */}
            <a key="remove" onClick={(e) => this.table_showTableDelModal(e, record)}><FormattedMessage id="oal.common.delete" /></a>
            {/* </Popconfirm> */}
            {/* <Divider type="vertical" /> */}
            {/* <MoreBtn item={record} /> */}
          </Fragment>
        ),
      });
    return cl;
  };

  table_onPageChange = (page, pageSize) => {
    this.setState({
      tablePage: {
        current: page,
        pageSize,
      },
    }, () => {
      this.table_loadFaceList();
    });
  };

  table_handleSelectRows = rows => {
    this.setState({
      tableSelectedRows: rows,
    });
  };

  table_handleStandardTableChange = (pagination, filters, sorter) => {
    console.log(8126, pagination, sorter);
    this.setState({
      tablePage: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      sortedInfo: {
        columnKey: sorter.columnKey,
        order: sorter.order,
      }
    }, () => {
      this.table_loadFaceList();
    });
  };

  table_handelSearchChange = e => {
    this.setState({
      tableSearchName: e.target.value,
    });
  };

  table_handelSearchPressEnter = () => {
    this.table_onPageChange(1, 10);
  };

  table_handelSearchReset = () => {
    this.setState({
      tableSearchName: '',
    }, () => {
      this.table_onPageChange(1, 10);
    });
  };

  /************************************************* Table End *************************************************/

  /************************************************ Modal Start ************************************************/

  // 树节点增 TreeAddModal
  tree_showTreeAddModal = (e) => {
    if (this.state.nodeTreeItem && this.state.nodeTreeItem.level < 5) {
      this.setState({
        treeAddVisible: true,
      });
    } else {
      message.error(formatMessage({ id: 'oal.face.groupLevelLimit' }));
    }
  };

  tree_closeTreeAddModal = () => {
    this.setState({
      treeAddVisible: false,
    });
  };

  tree_submitTreeAddModal = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/addGroupNode',
      payload: params,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.newSuccessfully' }));
        this.tree_loadData();
        this.tree_closeTreeAddModal();
        callback && callback();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  // 树节点改 TreeModifyModal
  tree_showTreeModifyModal = (e) => {
    if (this.state.nodeTreeItem) {
      this.setState({
        treeModifyVisible: true,
      });
    }
  };

  tree_closeTreeModifyModal = () => {
    this.setState({
      treeModifyVisible: false,
    });
  };

  tree_submitTreeModifyModal = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/modifyGroupNode',
      payload: params,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        this.tree_loadData();
        this.tree_closeTreeModifyModal();
        callback && callback();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  // 树节点删
  tree_showTreeDelModal = (e) => {
    if (this.state.nodeTreeItem) {
      this.setState({
        treeDelVisible: true,
      });
    }
  };

  tree_closeTreeDelModal = () => {
    this.setState({
      treeDelVisible: false,
    });
  };

  tree_submitTreeDelModal = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/delGroupNode',
      payload: params,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        this.setState({
          treeFocusKey: '',
        }, () => {
          this.tree_loadData(true);
        });
        this.tree_closeTreeDelModal();
        callback && callback();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  // 添加/编辑（单个人脸信息）TableAddOrModifyModal
  table_showTableAddOrModifyModal = bean => {
    const _state = {
      tableAddOrModifyVisible: true,
    };

    bean && bean._id && (_state.tableSelectedBean = bean);

    this.setState(_state);
  };

  table_closeTableAddOrModifyModal = () => {
    this.setState({
      tableAddOrModifyVisible: false,
      tableSelectedBean: {},
    });
  };

  table_submitTableAddOrModifyModal = isEdit => {
    message.success(formatMessage({ id: (isEdit ? 'oal.common.saveSuccessfully' : 'oal.face.addSuccessfully') }));
    this.table_closeTableAddOrModifyModal();
    this.table_loadFaceList();
  };

  // 批量添加（上传人脸信息）TableBatchAddModal
  table_showTableBatchAddModal = () => {
    this.setState({
      tableBatchAddVisible: true,
    });
  };

  table_closeTableBatchAddModal = () => {
    this.setState({
      tableBatchAddVisible: false,
    });
  };

  table_submitTableBatchAddModal = () => {
    this.table_closeTableBatchAddModal();
    this.table_loadFaceList();
  };

  // 单个/批量移动（人脸分组）
  table_showTableMoveModal = (e, bean) => {
    console.log(8126, '单个/批量移动', bean || this.state.tableSelectedRows);
    this.setState({
      tableMoveVisible: true,
      tableSelectedBean: bean || {},
    });
  };

  table_closeTableMoveModal = () => {
    this.setState({
      tableMoveVisible: false,
      tableSelectedBean: {},
    });
  };

  table_submitTableMoveModal = (param, callback) => {
    const { dispatch } = this.props;
    const { tableSelectedBean, tableSelectedRows } = this.state;
    dispatch({
      type: 'face/moveFace',
      payload: {
        groupId: param,
        faceId: tableSelectedBean && tableSelectedBean._id || tableSelectedRows.map(item => item._id).join(','),
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.moveSuccessfully' }));
        this.table_closeTableMoveModal();
        this.table_loadFaceList();
        callback && callback();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  // 单个/批量删除（人脸信息）
  table_showTableDelModal = (e, bean) => {
    console.log(8126, '单个/批量删除', bean || this.state.tableSelectedRows);
    this.setState({
      tableDelVisible: true,
      tableSelectedBean: bean || {},
    });
  };

  table_closeTableDelModal = () => {
    this.setState({
      tableDelVisible: false,
      tableSelectedBean: {},
    });
  };

  table_submitTableDelModal = (params, callback) => {
    const { dispatch } = this.props;
    const { tableSelectedBean, tableSelectedRows } = this.state;
    dispatch({
      type: 'face/delFace',
      payload: {
        faceId: tableSelectedBean && tableSelectedBean._id || tableSelectedRows.map(item => item._id).join(','),
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        this.table_closeTableDelModal();
        this.table_loadFaceList();
        callback && callback();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  // 放大查看（人脸图片）
  table_openViewModal = bean => {
    this.setState({ viewVisible: true, tableSelectedBean: bean })
  };

  table_closeViewModal = () => {
    this.setState({ viewVisible: false, tableSelectedBean: {} })
  };

  /************************************************* Modal End *************************************************/

  // 8126TODO 待废弃
  loadFaceKeyList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'faceKey/getFaceKeyList',
    });
  };

  // 8126TODO 待废弃
  loadSysConfig = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/toGetSysConfigs',
    })
  };

  // table_closeModifyModal = () => {
  //   this.setState({ tableAddOrModifyVisible: false, tableSelectedBean: {} })
  // };

  // table_submitModify = (params, callback) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'face/modify',
  //     payload: params,
  //   }).then(res => {
  //     if (res.res > 0) {
  //       this.table_closeModifyModal();
  //       this.table_loadFaceList();
  //       message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
  //       callback();
  //     }
  //   });
  // };

  // table_deleteFace = bean => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'face/delete',
  //     // eslint-disable-next-line no-underscore-dangle
  //     payload: { faceId: bean._id },
  //   }).then(res => {
  //     if (res.res > 0) {
  //       this.table_loadFaceList();
  //       message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
  //     }
  //   });
  // };

  // getImgName = str => {
  //   const temp = str.split('.');
  //   temp.pop();
  //   return temp.join('.')
  // };

  // getErrorName = (str, errorIndex) => {
  //   const temp = str.split('.');
  //   const pix = temp[temp.length - 1];
  //   temp.pop();
  //   const nameStr = temp.join('.')
  //   const nameArray = nameStr.split('_')
  //   const tp = nameArray.map((item, index) => {
  //     if (errorIndex === index) {
  //       return <span style={{ color: 'red', fontWeight: 700 }}>{item}</span>
  //     }
  //     return item
  //   })
  //   const resultArray = [];
  //   for (let i = 0; i < tp.length; i++) {
  //     resultArray.push(tp[i])
  //     if (i !== nameArray.length - 1) {
  //       resultArray.push('_');
  //     }
  //   }
  //   return (
  //     <div>
  //       {
  //         resultArray
  //       }
  //       .{pix}
  //     </div>
  //   )
  // };

  // addToList = (orgList, bean) => {
  //   const tpIndex = findIndex(orgList, item => item.uid === bean.uid)
  //   if (tpIndex === -1) {
  //     orgList.push(bean)
  //   }
  //   return orgList;
  // };

  // onBeforeUpload = (file, fList, isDirectory, uniqueIndex) => {
  //   let { fileList, errorList } = this.state;
  //   if (fileList.length === 0) {
  //     this.setState({ fileList: fList })
  //   }
  //   if (!isDirectory) {
  //     return true;
  //   }

  //   let flag = true
  //   const nameArray = this.getImgName(file.name).split('_');
  //   for (let i = 0; i < fList.length; i++) {
  //     if (fList[i].uid !== file.uid) {
  //       // 只有不相同的做对比
  //       const temp = this.getImgName(fList[i].name).split('_')
  //       // 遍历取每条数据比较
  //       for (let p = 0; p < uniqueIndex.length; p++) {
  //         // 遍历唯一约束列
  //         if (nameArray[uniqueIndex[p].index + 2] && (temp[uniqueIndex[p].index + 2] === nameArray[uniqueIndex[p].index + 2])) {
  //           // 对比唯一约束列
  //           // 唯一约束列结果一致，加入到错误列表
  //           this.excludeNum++;
  //           errorList = this.addToList(errorList,
  //             {
  //               name: file.name,
  //               size: file.size,
  //               uid: file.uid,
  //               uploadRes: { res: -1, errorCode: 5007 },
  //             });
  //           this.setState({ errorList })
  //           flag = false
  //           break
  //         }
  //       }
  //       if (!flag) {
  //         // 只需要找到一个违反唯一约束的，就退出
  //         break;
  //       }
  //     }
  //   }
  //   return flag
  // };

  // onBeforeUploadbak = (file, fList, isDirectory, uniqueIndex) => {
  //   // console.log('beforeUploadFile-------', fList);
  //   // 这里只校验会影响数据的那种唯一性约束的字段，其他均无校验的必要，如果唯一性校验失败，终止上传
  //   const { fileList, errorList } = this.state;
  //   if (fileList.length === 0) {
  //     this.setState({ fileList: fList })
  //   }

  //   if (!isDirectory) {
  //     return true;
  //   }
  //   // const { errorList } = this;
  //   const isIn = findIndex(errorList,
  //     item => (item.uid === file.uid || item.equalToUid === file.uid))
  //   if (isIn !== -1) {
  //     return false
  //   }
  //   let flag = true
  //   // const { sysConfigs, faceKeyList } = this.props;
  //   // console.log('fList---', fList)
  //   const nameArray = this.getImgName(file.name).split('_')
  //   for (let i = 0; i < fList.length; i++) {
  //     if (fList[i].uid !== file.uid) {
  //       // 只有不相同的做对比
  //       const temp = this.getImgName(fList[i].name).split('_')
  //       // 遍历取每条数据比较
  //       for (let p = 0; p < uniqueIndex.length; p++) {
  //         // 遍历唯一约束列
  //         if (nameArray[uniqueIndex[p].index + 2] && (temp[uniqueIndex[p].index + 2] === nameArray[uniqueIndex[p].index + 2])) {
  //           // 对比唯一约束列
  //           // 唯一约束列结果一致，加入到错误列表
  //           errorList.push({
  //             uid: file.uid,
  //             equalInfo: [file.name, fList[i].name],
  //             equalToUid: fList[i].uid,
  //             equalAt: p,
  //           })

  //           notification.error({
  //             message: <div><span style={{ fontWeight: 700 }}>{uniqueIndex[p].name}</span><FormattedMessage id="oal.face.fieldRepeat" /></div>,
  //             description: (<div>
  //               <div style={{ marginTop: '1em' }}>{this.getErrorName(file.name, uniqueIndex[p].index + 2)}</div>
  //               <div style={{ marginTop: '1em' }}>{this.getErrorName(fList[i].name, uniqueIndex[p].index + 2)}</div>
  //             </div>),
  //             duration: null,
  //           });
  //           flag = false
  //         }
  //       }
  //     }
  //   }
  //   this.errorList = errorList
  //   return flag;
  // };

  // renderUpload = (isDirectory, Btn, bean) => {
  //   // eslint-disable-next-line no-underscore-dangle
  //   const { fileList, errorList, successList } = this.state;
  //   const { faceKeyList } = this.props;

  //   // 寻找出不可重复的字段
  //   const uniqueIndex = []
  //   if (faceKeyList && faceKeyList.length > 0) {
  //     for (let i = 0; i < faceKeyList.length; i++) {
  //       if (faceKeyList[i].isUnique) {
  //         // 该字段不能重复
  //         uniqueIndex.push({ index: i, name: faceKeyList[i].name })
  //       }
  //     }
  //   }

  //   const isEdit = !!(bean && bean._id);
  //   const authToken = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);
  //   const props = {
  //     // eslint-disable-next-line no-underscore-dangle
  //     accept: '.png, .jpg, .jpeg',
  //     action: isEdit ? `/api/face/manage/${bean._id}/upload` : '/api/face/manage/upload',
  //     headers: {
  //       Authorization: `Bearer ${authToken}`,
  //     },
  //     multiple: !isEdit,
  //     directory: isDirectory,
  //     // showUploadList: {
  //     //   showPreviewIcon: true,
  //     //   showRemoveIcon: false,
  //     //   showDownloadIcon: false,
  //     // },
  //     fileList,
  //     showUploadList: false,
  //     beforeUpload: (file, fList) => this.onBeforeUpload(file, fList, isDirectory, uniqueIndex),
  //     onError: (err, res, file) => {
  //       // console.log('onError file:', typeof err)
  //       // console.log('fList status:', res) // <h2>400 Bad Request</h2>
  //       // console.log('event:', oc.event)
  //       errorList.push({ name: file.name, size: file.size, uploadRes: 400, uid: file.uid })
  //       this.setState({ errorList });
  //     },
  //     onSuccess: (result, file) => {
  //       // console.log('onSuccess oc:', result, file)
  //       const temp = { name: file.name, size: file.size, uploadRes: result, uid: file.uid }
  //       if (result.res < 1) {
  //         errorList.push(temp)
  //         this.setState({ errorList });
  //       } else {
  //         successList.push(temp)
  //         this.setState({ successList });
  //       }
  //     },
  //   }
  //   return (
  //     <Upload {...props}>
  //       {Btn}
  //     </Upload>
  //   )
  // };

  // faceStateChange = e => {
  //   this.table_loadFaceList({
  //     current: 1,
  //     pageSize: 10,
  //   }, e.target.value)
  //   this.setState({
  //     featureState: e.target.value,
  //   })
  // };

  // renderUploadPanel = () => {
  //   const { uploadVisible, selectedBean, fileList } = this.state;
  //   const { sysConfigs, faceKeyList } = this.props;
  //   const isUploading = fileList.length > 0
  //   // eslint-disable-next-line no-underscore-dangle
  //   const isEdit = !!(selectedBean && selectedBean._id);
  //   let title = formatMessage({ id: 'oal.face.uploadFacePhoto' });
  //   if (isEdit) {
  //     title = formatMessage({ id: 'oal.face.uploadFacePhoto' }, { name: selectedBean.name });
  //   }
  //   const faceSizeBean = sysConfigs.find(item => item.key === 'faceSize');
  //   const maxFaceCountBean = sysConfigs.find(item => item.key === 'maxFaceCount');
  //   let exampleStr = '';
  //   // eslint-disable-next-line no-unused-expressions
  //   faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
  //     exampleStr += `_${item.name}`;
  //   })
  //   return (
  //     <Drawer
  //       title={title}
  //       placement="right"
  //       onClose={this.onCloseDrawer}
  //       visible={uploadVisible}
  //       width={580}
  //     >
  //       {
  //         isUploading ? null : <Alert
  //           message={
  //             <div>
  //               <div>
  //                 <FormattedMessage id="oal.face.uploadPanelTips1-1" /><span style={{ color: 'green', margin: '0 8px' }}><FormattedMessage id="oal.face.uploadPanelTips1-2" /></span><FormattedMessage id="oal.face.uploadPanelTips1-3" />
  //               </div>
  //               <div>
  //                 <FormattedMessage id="oal.face.uploadPanelTips2-1" />
  //                 <span style={{ color: 'green', margin: '0 8px' }}><FormattedMessage id="oal.face.uploadPanelTips2-2" /></span><FormattedMessage id="oal.face.uploadPanelTips2-3" />
  //               </div>
  //               <div>
  //                 <FormattedMessage id="oal.face.uploadPanelTips2-4" /><span style={{ color: 'red' }}><FormattedMessage id="oal.face.uploadPanelTips2-5" /><span>{exampleStr}</span>.jpeg</span>
  //               </div>
  //               <div>
  //                 <FormattedMessage id="oal.face.uploadPanelTips3" />(kb)
  //               <div style={{ marginLeft: '22px' }}>
  //                   <FormattedMessage id="oal.common.minVal" />：
  //                 <span style={{ color: 'green' }}>
  //                     {faceSizeBean && faceSizeBean.value && faceSizeBean.value.min ?
  //                       `${faceSizeBean && faceSizeBean.value && faceSizeBean.value.min}kb`
  //                       :
  //                       formatMessage({ id: 'oal.common.unset' })
  //                     }
  //                   </span>
  //                 </div>
  //                 <div style={{ marginLeft: '22px' }}>
  //                   <FormattedMessage id="oal.common.maxVal" />：
  //                 <span style={{ color: 'green' }}>
  //                     {faceSizeBean && faceSizeBean.value && faceSizeBean.value.max ?
  //                       `${faceSizeBean && faceSizeBean.value && faceSizeBean.value.max}kb`
  //                       :
  //                       formatMessage({ id: 'oal.common.unset' })
  //                     }
  //                   </span>
  //                 </div>
  //               </div>
  //               <div>
  //                 <FormattedMessage id="oal.face.uploadPanelTips4-1" />
  //                 <span style={{ color: 'green' }}>
  //                   {maxFaceCountBean && maxFaceCountBean.value ?
  //                     `${maxFaceCountBean && maxFaceCountBean.value}${formatMessage({ id: 'oal.face.uploadPanelTips4-2' })}`
  //                     :
  //                     formatMessage({ id: 'oal.common.unset' })
  //                   }
  //                 </span>
  //               </div>
  //               <div>
  //                 <FormattedMessage id="oal.face.uploadPanelTips5-1" />
  //                 <span style={{ color: 'green', margin: '0 8px' }}><FormattedMessage id="oal.face.uploadPanelTips5-2" /></span><FormattedMessage id="oal.face.uploadPanelTips5-3" />
  //               </div>
  //             </div>
  //           }
  //           type="warning"
  //         />
  //       }

  //       <div style={{ display: isUploading ? 'none' : 'flex', marginTop: '16px' }}>
  //         {isEdit ? null : this.renderUpload(true, (
  //           <Button>
  //             <Icon type="upload" /> <FormattedMessage id="oal.face.uploadFolder" />
  //           </Button>
  //         ))}
  //         {this.renderUpload(false, (
  //           <Button style={{ marginLeft: 16 }}>
  //             <Icon type="upload" /> <FormattedMessage id="oal.face.uploadPhoto" />
  //           </Button>
  //         ), selectedBean)}
  //       </div>

  //       <UploadProgress fileList={this.state.fileList}
  //         resetUpload={() => {
  //           this.setState({
  //             fileList: [],
  //             errorList: [],
  //             successList: [],
  //           })
  //           this.excludeNum = 0;
  //         }}
  //         openDetail={tab => {
  //           this.setState({ childrenDrawer: true, childrenTabIndex: tab })
  //         }}
  //         excludeNum={this.excludeNum}
  //         errorList={this.state.errorList}
  //         successList={this.state.successList} />
  //       <UploadDetail childrenDrawer={this.state.childrenDrawer}
  //         childrenTabIndex={this.state.childrenTabIndex}
  //         changeTab={tabType => this.setState({ childrenTabIndex: tabType })}
  //         errorList={this.state.errorList}
  //         successList={this.state.successList}
  //         onChildrenDrawerClose={() => this.setState({ childrenDrawer: false })} />
  //     </Drawer>
  //   )
  // }

  // editAndDelete = (key, bean) => {
  //   if (key === 'modify') {
  //     this.setState({ modifyVisible: true, selectedBean: bean })
  //   } else {
  //     this.setState({ uploadVisible: true, selectedBean: bean })
  //   }
  // };

  // handleInfoClose = () => {
  //   this.setState({ infoVisible: false })
  // };

  // showConfirmRemoveAll = () => {
  //   const self = this;
  //   confirm({
  //     title: formatMessage({ id: 'oal.face.confirmDeleteAllFace' }),
  //     icon: <ExclamationCircleOutlined />,
  //     content: formatMessage({ id: 'oal.face.clearFaceLibraryTips' }),
  //     onOk() {
  //       const { dispatch } = self.props;
  //       return dispatch({
  //         type: 'face/removeAll',
  //       }).then(res => {
  //         if (res.res > 0) {
  //           self.table_loadFaceList();
  //           message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
  //         }
  //       });
  //     },
  //     onCancel() { },
  //   });
  // };

  render() {
    // const extraContent = (
    //   <div className={styles.extraContent}>
    //     {/* <Popover content="授权成功的人脸才能被系统识别" title="什么是授权?">
    //       <Button shape="circle" icon="question" size="small" style={{ marginRight: 16 }} />
    //     </Popover>
    //     <RadioGroup defaultValue="all" onChange={this.faceStateChange}>
    //       <RadioButton value="all">全部</RadioButton>
    //       <RadioButton value="1">已授权</RadioButton>
    //       <RadioButton value="0">授权中</RadioButton>
    //       <RadioButton value="-1">失败</RadioButton>
    //     </RadioGroup> */}
    //     <Search className={styles.extraContentSearch} placeholder={formatMessage({ id: 'oal.face.searchFullName' })} ref={ref => {
    //       this.nameRef = ref
    //     }} onSearch={() => {
    //       this.onPageChange(1, 10)
    //     }} />
    //   </div>
    // );
    // const MoreBtn = ({ item }) => (
    //   <Dropdown
    //     overlay={
    //       <Menu onClick={({ key }) => this.editAndDelete(key, item)}>
    //         <Menu.Item key="modify"><FormattedMessage id="oal.common.modify" /></Menu.Item>
    //         <Menu.Item key="editPhoto"><FormattedMessage id="oal.face.modifyPhoto" /></Menu.Item>
    //       </Menu>
    //     }
    //   >
    //     <a>
    //       <FormattedMessage id="oal.common.edit" /> <Icon type="down" />
    //     </a>
    //   </Dropdown>
    // );
    const {
      treeLoading,
      face,
      tableLoading,
      user,
      modifyLoading,
      faceKeyList,
      dispatch
    } = this.props;
    const {
      treeData,
      treeFocusKey,
      nodeTreeItem,
      treeAddVisible,
      treeModifyVisible,
      treeDelVisible,
      // infoVisible,
      tableSearchName,
      tableAddOrModifyVisible,
      tableBatchAddVisible,
      tableSelectedBean,
      viewVisible,
      tableSelectedRows,
      tableMoveVisible,
      tableDelVisible,
    } = this.state;

    face.faceList && face.faceList.pagination && (face.faceList.pagination.showTotal = (total, range) => (formatMessage({
      id: 'oal.face.currentToTotal',
    }, {
      total,
    })));

    return (
      <PageHeaderWrapper title=" " className={styles.myPageHeaderWrapper} >
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
          >
            <div className={styles.main} >
              <div
                className={styles.left}
                ref={ref => { this.ref_leftDom = ref; }}
                onClick={this.tree_clearMenu}
              >
                {
                  !treeLoading && treeData && treeData.length > 0 ?
                    (<Tree
                      // showLine={true}
                      // blockNode={true}
                      draggable
                      defaultExpandedKeys={[treeFocusKey]}
                      defaultSelectedKeys={[treeFocusKey]}
                      onMouseEnter={this.tree_onMouseEnter}
                      onSelect={this.tree_onSelect}
                      onDrop={this.tree_onDrop}
                      onExpand={this.tree_clearMenu}
                    >
                      {this.tree_renderNodes(treeData)}
                    </Tree>) :
                    (<Spin spinning={treeLoading} />)

                }
                {nodeTreeItem ? this.tree_getNodeTreeMenu() : ''}
              </div>

              <div className={styles.right}>
                <div className={styles.rightHeader}>
                  <div style={{ flex: 1 }}>
                    <FormattedMessage id="oal.face.search" />&nbsp;&nbsp;:&nbsp;&nbsp;
                    <Input
                      placeholder={formatMessage({ id: 'oal.face.enterFullName' })}
                      style={{ marginRight: 20, width: 180, }}
                      value={tableSearchName}
                      onChange={this.table_handelSearchChange}
                      onPressEnter={this.table_handelSearchPressEnter}
                    />
                    <Button
                      type="primary"
                      loading={tableLoading}
                      style={{ marginRight: 10 }}
                      onClick={this.table_handelSearchPressEnter}
                    >
                      <FormattedMessage id="oal.common.query" />
                    </Button>
                    <Button
                      loading={tableLoading}
                      onClick={this.table_handelSearchReset} >
                      <FormattedMessage id="oal.common.reset" />
                    </Button>
                  </div>

                  <div>
                    <Button
                      type="primary"
                      style={{ marginRight: 10 }}
                      icon="plus"
                      onClick={this.table_showTableAddOrModifyModal}
                    >
                      <FormattedMessage id="oal.face.add" />
                    </Button>
                    <Button
                      onClick={this.table_showTableBatchAddModal}
                    >
                      <FormattedMessage id="oal.face.batchAdd" />
                    </Button>
                  </div>
                </div>

                <div className={styles.rightBatch}>
                  <Button
                    type="danger"
                    disabled={!tableSelectedRows || tableSelectedRows.length === 0}
                    style={{ marginRight: 10 }}
                    onClick={this.table_showTableDelModal}
                  >
                    <FormattedMessage id="oal.common.delete" />
                  </Button>
                  <Button
                    type="primary"
                    disabled={!tableSelectedRows || tableSelectedRows.length === 0}
                    onClick={this.table_showTableMoveModal}
                  >
                    <FormattedMessage id="oal.common.move" />
                  </Button>
                </div>

                {/* {infoVisible ? (
                  <Alert showIcon message={<div><FormattedMessage id="oal.face.moreConfigTips-1" /> <span style={{ color: 'red', marginLeft: 8 }}> <FormattedMessage id="oal.face.moreConfigTips-2" /></span></div>} type="info" closable afterClose={this.handleInfoClose} style={{ marginBottom: 8 }} />
                ) : null} */}
                <StandardTable
                  rowKey={record => record._id}
                  needRowSelection
                  selectedRows={tableSelectedRows}
                  loading={tableLoading}
                  data={face.faceList}
                  columns={this.table_columns()}
                  onSelectRow={this.table_handleSelectRows}
                  onChange={this.table_handleStandardTableChange}
                />
              </div>
            </div>
          </Card>
          {/* {this.renderUploadPanel()} */}
          <TreeAddModal
            visible={treeAddVisible}
            bean={nodeTreeItem && nodeTreeItem.nodeData || {}}
            handleCancel={this.tree_closeTreeAddModal}
            handleSubmit={this.tree_submitTreeAddModal}
          />
          <TreeModifyModal
            visible={treeModifyVisible}
            bean={nodeTreeItem && nodeTreeItem.nodeData || {}}
            handleCancel={this.tree_closeTreeModifyModal}
            handleSubmit={this.tree_submitTreeModifyModal}
          />
          <TreeDelModal
            visible={treeDelVisible}
            bean={nodeTreeItem && nodeTreeItem.nodeData || {}}
            handleCancel={this.tree_closeTreeDelModal}
            handleSubmit={this.tree_submitTreeDelModal}
          />
          <TableAddOrModifyModal
            visible={tableAddOrModifyVisible}
            bean={tableSelectedBean}
            dispatch={dispatch}
            groupId={treeFocusKey}
            handleCancel={this.table_closeTableAddOrModifyModal}
            handleSubmit={this.table_submitTableAddOrModifyModal}
          />
          <TableBatchAddModal
            visible={tableBatchAddVisible}
            groupId={treeFocusKey}
            handleCancel={this.table_closeTableBatchAddModal}
            handleSubmit={this.table_submitTableBatchAddModal}
          />
          <TableMoveModal
            visible={tableMoveVisible}
            treeData={treeData}
            handleCancel={this.table_closeTableMoveModal}
            handleSubmit={this.table_submitTableMoveModal}
          />
          <TableDelModal
            visible={tableDelVisible}
            bean={tableSelectedBean && tableSelectedBean._id ? [tableSelectedBean] : tableSelectedRows}
            handleCancel={this.table_closeTableDelModal}
            handleSubmit={this.table_submitTableDelModal}
          />
          <Modal
            title={tableSelectedBean.name}
            visible={viewVisible}
            footer={null}
            onCancel={this.table_closeViewModal}
          >
            <img src={tableSelectedBean.imgPath} alt="" style={{ width: '100%', height: '100%' }} />
          </Modal>
        </div>
      </PageHeaderWrapper >
    )
  }
}
export default Face
