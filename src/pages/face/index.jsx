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

@connect(({ user, face, faceKey, loading }) => ({
  face,
  user: user.currentUser,
  tableLoading: loading.effects['face/fetch'],
  modifyLoading: loading.effects['face/modify'],
  sysConfigs: face.sysConfigs,
  treeLoading: loading.effects['face/fetchGroupTree'],
  addGroupNodeLoading: loading.effects['face/addGroupNode'],
  modifyGroupNodeLoading: loading.effects['face/modifyGroupNode'],
  delGroupNodeLoading: loading.effects['face/delGroupNode'],
  moveFaceLoading: loading.effects['face/moveFace'],
  setFaceStateLoading: loading.effects['face/setFaceState'],
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
    selectedKeys: [],
    tablePage: {
      current: 1,
      pageSize: 10,
    },
  };

  ref_leftDom = null;
  tree_originalData = [];

  componentDidMount() {
    this.tree_loadData();
    // this.errorList = [];
    // this.excludeNum = 0;
  }

  componentWillUnmount() {
    this.tree_clearMenu();
  }

  /************************************************* Tree Start *************************************************/

  tree_loadData = () => {
    const { dispatch } = this.props;
    const { selectedKeys } = this.state;

    this.tree_clearMenu();
    this.setState({ treeData: [] });
    dispatch({
      type: 'face/fetchGroupTree',
      payload: {},
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        this.tree_originalData = res.data;
        const treeData = toTree(res.data) || [];

        this.setState({
          treeData,
          selectedKeys: [(selectedKeys[0] || (treeData[0] && treeData[0]._id) || '0')],
        }, () => {
          this.table_loadFaceList();
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
          <TreeNode key={item._id} title={`${item.name} (${item.num || 0})`} dataRef={item}>
            {this.tree_renderNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item._id} title={`${item.name} (${item.num || 0})`} {...item} dataRef={item} />;
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
      const { pageX, pageY, level, nodeData } = this.state.nodeTreeItem;
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
            level > 1 && nodeData && nodeData.isLeaf ?
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

  tree_onSelect = (selectedKeys, info) => {
    this.setState({
      selectedKeys: [info.node.props.dataRef._id],
      tableSelectedRows: [],
    }, () => {
      this.table_loadFaceList();
    });
  };

  // tree_onDrop = info => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'face/moveGroupNode',
  //     payload: {
  //       id: info.dragNode.props.eventKey,
  //       parentId: info.node.props.eventKey,
  //     },
  //   }).then(res => {
  //     if (res && res.res > 0) {
  //       message.success(formatMessage({ id: 'oal.common.moveSuccessfully' }));
  //       this.tree_loadData();
  //     } else {
  //       console.log(res);
  //     }
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // };

  tree_refreshGroupNum = groupId => {
    this.props.dispatch({
      type: 'face/refreshGroupNum',
      payload: {
        groupId,
      },
    }).then(res => {
      if (res && res.res > 0) {
        this.tree_loadData();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

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
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.newSuccessfully' }));
        this.setState({
          selectedKeys: [res.data.id],
        }, () => {
          this.tree_loadData();
        });
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
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        this.setState({
          selectedKeys: [res.data.id],
        }, () => {
          this.tree_loadData();
        });
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
    const { groupPid } = params;

    dispatch({
      type: 'face/delGroupNode',
      payload: params,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        this.setState({
          selectedKeys: [groupPid],
        }, () => {
          this.tree_refreshGroupNum(groupPid);
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

  /************************************************* Tree End *************************************************/

  /************************************************ Table Start ************************************************/

  table_loadFaceList = () => {
    const { dispatch } = this.props;
    const { tableSearchName, selectedKeys, tablePage, sortedInfo } = this.state;
    const { columnKey, order } = sortedInfo;

    dispatch({
      type: 'face/fetch',
      payload: {
        ...tablePage,
        groupId: selectedKeys[0],
        // columnKey,
        // order,
        name: tableSearchName.trim(),
        peopleType: '0',
      },
    });
  };

  table_columns = () => {
    const { user } = this.props;
    const _t = Date.now();

    const cl = [
      {
        title: formatMessage({ id: 'oal.common.photo' }),
        key: 'avatar',
        width: 100,
        render: (text, record) => <Avatar src={`${record.imgPath}?t=${_t}`} shape="square" size="large" onClick={() => this.table_openViewModal(record)} style={{ cursor: 'pointer' }} />,
      },
      {
        title: formatMessage({ id: 'oal.common.fullName' }),
        key: 'name',
        dataIndex: 'name',
        render: (text, record) => <span>{record.name || '-'}</span>,
        // sorter: (a, b) => a.name - b.name,
        // sortOrder: this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.face.staffid' }),
        key: 'staffid',
        dataIndex: 'staffid',
        render: (text, record) => <span>{record.staffid || '-'}</span>,
      },
    ];

    cl.push(
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        key: 'handle',
        width: 200,
        render: (text, record) => (
          <Fragment>
            <a key="edit" onClick={() => this.table_showTableAddOrModifyModal(record)}><FormattedMessage id="oal.common.modify" /></a>
            <Divider type="vertical" />
            <a key="move" onClick={(e) => this.table_showTableMoveModal(e, record)}><FormattedMessage id="oal.common.move" /></a>
            <Divider type="vertical" />
            {
              record.state === 1 ?
                <a key="disable" onClick={(e) => this.table_showTableDelModal(e, record)}><FormattedMessage id="oal.common.disable" /></a> :
                <a key="enable" onClick={() => this.table_submitTableDelModal(1, record)}><FormattedMessage id="oal.common.enable" /></a>
            }
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
    this.tree_refreshGroupNum(this.state.selectedKeys[0] || '');
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

  table_submitTableBatchAddModal = successNum => {
    message.success(formatMessage({ id: 'oal.face.addedNumPeopleSuccessfully' }, { num: successNum }));
    this.table_closeTableBatchAddModal();
    this.tree_refreshGroupNum(this.tree_originalData.map(item => item._id).join(','));
  };

  // 单个/批量移动（人脸分组）
  table_showTableMoveModal = (e, bean) => {
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
    const { tableSelectedBean, tableSelectedRows, selectedKeys } = this.state;
    const oldGroupId = selectedKeys[0];
    const groupId = param;

    dispatch({
      type: 'face/moveFace',
      payload: {
        oldGroupId,
        groupId,
        faceId: tableSelectedBean && tableSelectedBean._id || tableSelectedRows.map(item => item._id).join(','),
        peopleType: '0',
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.moveSuccessfully' }));
        this.table_closeTableMoveModal();
        this.setState({
          tableSelectedRows: [],
        });
        this.tree_refreshGroupNum([oldGroupId, groupId].join(','));
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

  table_submitTableDelModal = (state, bean, callback) => {
    const { dispatch } = this.props;
    const _state = state;
    dispatch({
      type: 'face/setFaceState',
      payload: {
        faceId: bean && bean._id || '',
        state: _state,
        peopleType: '0',
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: _state === 1 ? 'oal.user-manage.beenEnabled' : 'oal.user-manage.beenDisabled' }));
        this.table_loadFaceList();

        if (_state === 0) {
          this.table_closeTableDelModal();
          callback && callback();
        }
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

  /************************************************* Table End *************************************************/

  render() {
    const {
      treeLoading,
      face,
      tableLoading,
      user,
      modifyLoading,
      dispatch,
      addGroupNodeLoading,
      modifyGroupNodeLoading,
      delGroupNodeLoading,
      moveFaceLoading,
      setFaceStateLoading,
    } = this.props;
    const {
      treeData,
      selectedKeys,
      nodeTreeItem,
      treeAddVisible,
      treeModifyVisible,
      treeDelVisible,
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
                      // draggable
                      defaultExpandedKeys={selectedKeys}
                      defaultSelectedKeys={selectedKeys}
                      onMouseEnter={this.tree_onMouseEnter}
                      onSelect={this.tree_onSelect}
                      selectedKeys={selectedKeys}
                      // onDrop={this.tree_onDrop}
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
                    <FormattedMessage id="oal.common.fullName" />&nbsp;&nbsp;:&nbsp;&nbsp;
                    <Input
                      placeholder={formatMessage({ id: 'oal.face.enterFullName' })}
                      style={{ marginRight: 20, width: 180, }}
                      value={tableSearchName}
                      onChange={this.table_handelSearchChange}
                      onPressEnter={this.table_handelSearchPressEnter}
                    />
                    <Button
                      type="primary"
                      loading={tableLoading || treeLoading}
                      style={{ marginRight: 10 }}
                      onClick={this.table_handelSearchPressEnter}
                    >
                      <FormattedMessage id="oal.face.search" />
                    </Button>
                    <Button
                      loading={tableLoading || treeLoading}
                      onClick={this.table_handelSearchReset} >
                      <FormattedMessage id="oal.common.reset" />
                    </Button>
                  </div>

                  <div>
                    <Button
                      type="primary"
                      style={{ marginRight: 10 }}
                      icon="plus"
                      loading={tableLoading || treeLoading}
                      onClick={this.table_showTableAddOrModifyModal}
                    >
                      <FormattedMessage id="oal.face.add" />
                    </Button>
                    <Button
                      loading={tableLoading || treeLoading}
                      onClick={this.table_showTableBatchAddModal}
                    >
                      <FormattedMessage id="oal.face.batchAdd" />
                    </Button>
                  </div>
                </div>

                <div className={styles.rightBatch}>
                  {/* <Button
                    type="danger"
                    disabled={!tableSelectedRows || tableSelectedRows.length === 0}
                    style={{ marginRight: 10 }}
                    onClick={this.table_showTableDelModal}
                  >
                    <FormattedMessage id="oal.common.delete" />
                  </Button> */}
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
                  loading={tableLoading || treeLoading}
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
            confirmLoading={addGroupNodeLoading}
            bean={nodeTreeItem && nodeTreeItem.nodeData || {}}
            handleCancel={this.tree_closeTreeAddModal}
            handleSubmit={this.tree_submitTreeAddModal}
          />
          <TreeModifyModal
            visible={treeModifyVisible}
            confirmLoading={modifyGroupNodeLoading}
            bean={nodeTreeItem && nodeTreeItem.nodeData || {}}
            handleCancel={this.tree_closeTreeModifyModal}
            handleSubmit={this.tree_submitTreeModifyModal}
          />
          <TreeDelModal
            visible={treeDelVisible}
            confirmLoading={delGroupNodeLoading}
            bean={nodeTreeItem && nodeTreeItem.nodeData || {}}
            handleCancel={this.tree_closeTreeDelModal}
            handleSubmit={this.tree_submitTreeDelModal}
          />
          <TableAddOrModifyModal
            visible={tableAddOrModifyVisible}
            bean={tableSelectedBean}
            dispatch={dispatch}
            groupId={selectedKeys[0]}
            handleCancel={this.table_closeTableAddOrModifyModal}
            handleSubmit={this.table_submitTableAddOrModifyModal}
          />
          <TableBatchAddModal
            visible={tableBatchAddVisible}
            dispatch={dispatch}
            groupId={selectedKeys[0]}
            handleCancel={this.table_closeTableBatchAddModal}
            handleSubmit={this.table_submitTableBatchAddModal}
          />
          <TableMoveModal
            visible={tableMoveVisible}
            treeData={treeData}
            confirmLoading={moveFaceLoading}
            handleCancel={this.table_closeTableMoveModal}
            handleSubmit={this.table_submitTableMoveModal}
          />
          <TableDelModal
            visible={tableDelVisible}
            confirmLoading={setFaceStateLoading}
            bean={tableSelectedBean}
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
