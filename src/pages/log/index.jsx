import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Divider,
  Input,
  Row,
  Select,
  message,
  Badge,
  Dropdown,
  Menu,
  Icon,
  Spin,
  Tooltip,
  List,
  Avatar,
  Modal,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import Link from 'umi/link';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { findIndex } from 'lodash';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import { SYSTEM_PATH } from '@/utils/constants';
import styles from './style.less';
import TableDelModal from './components/TableDelModal';
import TableAddAuthoryModal from './components/TableAddAuthoryModal';
import { toTree } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const peopleTypeMap = {
  '': 'oal.common.all',
  '0': 'oal.common.certifiedPeople',
  '2': 'oal.common.blacklist',
  '3': 'oal.common.visitor',
  '99': 'oal.common.unregistered',
}

@connect(({ log, loading }) => ({
  log,
  deviceList: log.deviceList,
  deviceListLoading: loading.effects['log/getDeviceList'],
  logList: log.logList,
  logListLoading: loading.effects['log/fetchLog'],
  delAuthoryLoading: loading.effects['log/delAuthory'],
  addAuthoryLoading: loading.effects['log/addAuthory'],
  fetchGroupAllTreeLoading: loading.effects['log/fetchGroupAllTree'],
  fetchGroupTreeLoading: loading.effects['log/fetchGroupTree'],
}))
class Log extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    listSelectedBean: {},
    tableSelectedRows: [],
    formValues: {},
    tablePage: {
      current: 1,
      pageSize: 10,
    },
    sortedInfo: {
      columnKey: '',
      order: '', // ascend（正序）、descend（倒序）
    },
    tableSelectedBean: {},
    viewVisible: false,
    tableDelVisible: false,
    tableAddAuthoryVisible: false,
    peopleTotal: 0,
    groupTreeData: [],
  };

  componentDidMount() {
    this.list_loadData();

    // this.props.dispatch({
    //   type: 'log/fetchPeopleTotal',
    //   payload: {},
    // }).then(res => {
    //   if (res && res.res > 0 && res.data) {
    //     this.setState({
    //       peopleTotal: res.data.num || 0,
    //     });
    //   } else {
    //     console.log(res);
    //   }
    // }).catch(err => {
    //   console.log(err);
    // });
  }

  componentWillUnmount() {
  }

  /************************************************* List *************************************************/

  list_loadData = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'log/getDeviceList',
      payload: {},
    }).then(res => {
      if (res && res.res > 0 && res.data.length > 0) {
        const _firstSelectedBean = res.data[0];

        this.list_handleClickItem(null, _firstSelectedBean);
        dispatch({
          type: 'log/fetchGroupAllTree',
          payload: {
            faceType: '0,3',
          },
        }).then(res => {
          if (res && res.res > 0 && res.data) {
            const tree_originalData = res.data;
            let _rootNum = 0;
            let _rootIndex = -1;

            tree_originalData.forEach((item, index) => {
              if (item.type === '0') {
                if (item.pid === '1') {
                  // 认证人员分组的根节点
                  _rootIndex = index;
                }

                _rootNum += item.num;
              }
            });

            if (_rootIndex > -1) {
              tree_originalData[_rootIndex].num = _rootNum;
            }

            this.setState({
              groupTreeData: (toTree(tree_originalData) || []).reverse(),
            });
          }
        });
        // dispatch({
        //   type: 'log/fetchGroupTree',
        //   payload: {
        //     groupId: '',
        //     deviceId: _firstSelectedBean._id,
        //   },
        // }).then(res => {
        //   if (res && res.res > 0 && res.data) {
        //     const _visitorGroup = res.data.filter(item => !item.isPeople && item.type === '3');

        //     dispatch({
        //       type: 'log/fetchGroupAllTree',
        //       payload: {},
        //     }).then(res => {
        //       if (res && res.res > 0 && res.data) {
        //         const _treeData = toTree(res.data) || [];

        //         this.setState({
        //           groupTreeData: [..._visitorGroup, ..._treeData],
        //         });
        //       }
        //     });
        //   }
        // });
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  list_handleClickItem = (e, bean) => {
    this.setState({
      listSelectedBean: bean,
    }, () => {
      this.table_loadData();
    });
  };

  /************************************************* Table *************************************************/

  table_loadData = () => {
    const { dispatch } = this.props;
    const { tablePage, sortedInfo, formValues, listSelectedBean } = this.state;

    dispatch({
      type: 'log/fetchLog',
      payload: {
        ...tablePage,
        ...sortedInfo,
        ...formValues,
        deviceId: listSelectedBean._id,
        peopleType: formValues && formValues.peopleType || '',
      },
    });
  };

  table_handleSelectRows = rows => {
    this.setState({
      tableSelectedRows: rows,
    });
  };

  table_columns = () => {
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
        // sorter: (a, b) => a.name - b.name,
        // sortOrder: this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.face.staffid' }),
        key: 'staffid',
        dataIndex: 'staffid',
        render: (text, record) => <span>{record.staffid || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.log-query.group' }),
        key: 'group',
        dataIndex: 'group',
        render: (text, record) => <span>{(record.peopleType === '0' && record.group && record.group.length > 0 && record.group[0].name) || (peopleTypeMap[record.peopleType] && formatMessage({ id: peopleTypeMap[record.peopleType] })) || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.type' }),
        key: 'peopleType',
        dataIndex: 'peopleType',
        render: (text, record) => <span>{peopleTypeMap[record.peopleType] && formatMessage({ id: peopleTypeMap[record.peopleType] }) || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 150,
        key: 'handle',
        render: (text, record) => (
          <Fragment>
            <a key="delete" onClick={(e) => this.table_showTableDelModal(e, record)}><FormattedMessage id="oal.common.delete" /></a>
          </Fragment>
        ),
      },
    ];
    return cl;
  };

  table_handleChange = (pagination, filters, sorter) => {
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
      this.table_loadData();
    });
  };

  table_handleSearch = () => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        tableSelectedRows: [],
      }, () => {
        this.table_loadData();
      });
    });
  };

  table_handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({});
    this.setState({
      formValues: {},
      tableSelectedRows: [],
    }, () => {
      this.table_loadData();
    });
  };

  table_renderSimpleForm = () => {
    const { form, deviceListLoading, logListLoading } = this.props;
    const { getFieldDecorator } = form;
    const { listSelectedBean } = this.state;

    return (
      <Form layout="inline">
        <Row
          gutter={{
            md: 4,
            lg: 24,
            xl: 48,
          }}
        >
          <Col xxl={6} xl={6} lg={6} md={6} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.type' })}>
              {getFieldDecorator('peopleType', {
                initialValue: '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value=""><FormattedMessage id={peopleTypeMap['']} /></Option>
                  <Option value="0"><FormattedMessage id={peopleTypeMap['0']} /></Option>
                  {/* <Option value="2"><FormattedMessage id={peopleTypeMap['2']} /></Option> */}
                  <Option value="3"><FormattedMessage id={peopleTypeMap['3']} /></Option>
                  {/* <Option value="99"><FormattedMessage id={peopleTypeMap['99']} /></Option> */}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={8} xl={8} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.fullName' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'oal.face.enterFullName' })} />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={6} md={6} sm={12}>
            <span className={styles.submitButtons}>
              <Button
                type="primary"
                htmlType="submit"
                loading={logListLoading || deviceListLoading}
                disabled={!listSelectedBean || !listSelectedBean._id}
                onClick={this.table_handleSearch}
              >
                <FormattedMessage id="oal.face.search" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                loading={logListLoading || deviceListLoading}
                disabled={!listSelectedBean || !listSelectedBean._id}
                onClick={this.table_handleFormReset}
              >
                <FormattedMessage id="oal.common.reset" />
              </Button>
            </span>
          </Col>
          {/* <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
            <div style={{ textAlign: 'right', }}>
              <Button
                type="primary"
                icon="plus"
                onClick={this.table_showTableAddAuthoryModal}
              >
                <FormattedMessage id="oal.face.add" />
              </Button>
            </div>
          </Col> */}
        </Row>
      </Form>
    );
  };

  // 添加授权
  table_showTableAddAuthoryModal = () => {
    this.setState({
      tableAddAuthoryVisible: true,
    });
  };

  table_closeTableAddAuthoryModal = () => {
    this.setState({
      tableAddAuthoryVisible: false,
    });
  };

  table_submitTableAddAuthoryModal = (faceId, callback) => {
    const { dispatch } = this.props;
    const { listSelectedBean } = this.state;

    dispatch({
      type: 'log/addAuthory',
      payload: {
        deviceId: listSelectedBean._id,
        faceId,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.face.addSuccessfully' }));
        this.table_closeTableAddAuthoryModal();
        this.table_loadData();
        callback && callback();
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  // 移除授权
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

  table_submitTableDelModal = (params, callback) => {
    const { dispatch } = this.props;
    const { listSelectedBean, tableSelectedBean, tableSelectedRows } = this.state;

    dispatch({
      type: 'log/delAuthory',
      payload: {
        deviceId: listSelectedBean._id,
        removeFaceId: tableSelectedBean && tableSelectedBean._id || tableSelectedRows.map(item => item._id).join(','),
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        this.table_closeTableDelModal();
        this.table_loadData();
        this.setState({
          tableSelectedRows: [],
        });
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

  /************************************************ Render ************************************************/

  render() {
    const {
      deviceList,
      deviceListLoading,
      logList,
      logListLoading,
      delAuthoryLoading,
      dispatch,
      addAuthoryLoading,
      fetchGroupAllTreeLoading,
      fetchGroupTreeLoading,
    } = this.props;
    const {
      tableSelectedRows,
      listSelectedBean,
      tableDelVisible,
      tableSelectedBean,
      viewVisible,
      tableAddAuthoryVisible,
      peopleTotal,
      groupTreeData,
    } = this.state;

    logList && logList.pagination && (logList.pagination.showTotal = (total, range) => (formatMessage({
      id: 'oal.log.currentToTotal',
    }, {
      total,
    })));

    return (
      <PageHeaderWrapper title=" " className={styles.myPageHeaderWrapper} >
        <Card bordered={false}>
          <div className={styles.main} >
            <div className={styles.left}>
              {
                deviceListLoading ?
                  <Spin /> :
                  (<List
                    itemLayout="horizontal"
                    split={false}
                    dataSource={deviceList}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Icon type="tablet" theme={listSelectedBean._id === item._id ? "twoTone" : "outlined"} style={{ fontSize: '16px', }} />}
                          title={<a className={`oal-list-content ${listSelectedBean._id === item._id ? "active" : ""}`}>{item.name}</a>}
                          onClick={(e) => this.list_handleClickItem(e, item)}
                        />
                      </List.Item>
                    )}
                  />)
              }
            </div>

            <div className={styles.right}>
              <div className={styles.tableListForm}>{this.table_renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  icon="plus"
                  style={{ marginRight: '8px', }}
                  loading={logListLoading || fetchGroupAllTreeLoading || fetchGroupTreeLoading}
                  disabled={!listSelectedBean || !listSelectedBean._id}
                  onClick={this.table_showTableAddAuthoryModal}
                >
                  <FormattedMessage id="oal.face.add" />
                </Button>
                <Button
                  type="danger"
                  disabled={!tableSelectedRows || tableSelectedRows.length === 0}
                  onClick={this.table_showTableDelModal}
                >
                  <FormattedMessage id="oal.common.delete" />
                </Button>
              </div>
              <StandardTable
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                needRowSelection
                selectedRows={tableSelectedRows}
                loading={logListLoading || deviceListLoading}
                data={logList}
                columns={this.table_columns()}
                onSelectRow={this.table_handleSelectRows}
                onChange={this.table_handleChange}
              />
            </div>
          </div>
        </Card>

        <Modal
          title={tableSelectedBean.name}
          visible={viewVisible}
          footer={null}
          onCancel={this.table_closeViewModal}
        >
          <img src={`${tableSelectedBean.imgPath}?t=${Date.now()}`} alt="" style={{ width: '100%', height: '100%' }} />
        </Modal>
        <TableDelModal
          visible={tableDelVisible}
          confirmLoading={delAuthoryLoading}
          bean={tableSelectedBean && tableSelectedBean._id ? [tableSelectedBean] : tableSelectedRows}
          handleCancel={this.table_closeTableDelModal}
          handleSubmit={this.table_submitTableDelModal}
        />
        <TableAddAuthoryModal
          visible={tableAddAuthoryVisible}
          groupTreeData={groupTreeData}
          curDeviceId={listSelectedBean._id}
          peopleTotal={peopleTotal}
          dispatch={dispatch}
          confirmLoading={addAuthoryLoading}
          handleCancel={this.table_closeTableAddAuthoryModal}
          handleSubmit={this.table_submitTableAddAuthoryModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Log);
