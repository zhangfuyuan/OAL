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

@connect(({ log, loading }) => ({
  log,
  deviceList: log.deviceList,
  deviceListLoading: loading.effects['log/getDeviceList'],
  logList: log.logList,
  logListLoading: loading.effects['log/fetchLog'],
  treeLoading: loading.effects['log/fetchGroupTree'],
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
    treeData: [],
    treeOriginalData: [],
  };

  componentDidMount() {
    this.list_loadData();
    this.props.dispatch({
      type: 'log/fetchGroupTree',
    }).then(res => {
      if (res && res.res > 0) {
        this.setState({
          treeData: toTree(res.data) || [],
          treeOriginalData: res.data,
        });
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  componentWillUnmount() {
  }

  /************************************************* List *************************************************/

  list_loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'log/getDeviceList',
      payload: {
        verity: 1,
      },
    }).then(res => {
      if (res && res.res > 0 && res.data.length > 0) {
        this.list_handleClickItem(null, res.data[0]);
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  list_handleClickItem = (e, bean) => {
    console.log(8126, '点击设备', bean);
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
        featureState: 'all',
        deviceId: listSelectedBean._id,
      },
    });
  };

  table_handleSelectRows = rows => {
    this.setState({
      tableSelectedRows: rows,
    });
  };

  table_columns = () => {
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
        ellipsis: true,
        key: 'name',
        sorter: (a, b) => a.name - b.name,
        sortOrder: this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.face.staffid' }) + '/ID',
        key: 'staffid',
        dataIndex: 'staffid',
        render: (text, record) => <span>{record.staffid || record._id}</span>,
      },
      {
        title: formatMessage({ id: 'oal.log.sourceGroup' }),
        key: 'group',
        dataIndex: 'group',
        render: (text, record) => <span>{record.group && record.group.name || ''}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 150,
        render: (text, record) => (
          <Fragment>
            <a key="remove" onClick={(e) => this.table_showTableDelModal(e, record)}><FormattedMessage id="oal.log.remove" /></a>
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
    const { form, logListLoading, treeLoading } = this.props;
    const { getFieldDecorator } = form;
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
              {getFieldDecorator('type', {
                initialValue: '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value=""><FormattedMessage id="oal.common.all" /></Option>
                  <Option value="0"><FormattedMessage id="menu.faceManger.faceGroup" /></Option>
                  {/* <Option value="1"><FormattedMessage id="menu.faceManger.faceBlacklist" /></Option> */}
                  <Option value="2"><FormattedMessage id="menu.faceManger.faceVisitor" /></Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={6} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.face.search' })}>
              {getFieldDecorator('search')(<Input placeholder={formatMessage({ id: 'oal.log.enterNameOrStaffidOrId' })} />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={6} md={6} sm={12}>
            <span className={styles.submitButtons}>
              <Button onClick={this.table_handleSearch} type="primary" htmlType="submit" loading={logListLoading}>
                <FormattedMessage id="oal.common.query" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.table_handleFormReset}
              >
                <FormattedMessage id="oal.common.reset" />
              </Button>
            </span>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
            <div style={{ textAlign: 'right', }}>
              <Button
                type="primary"
                icon="plus"
                loading={treeLoading}
                onClick={this.table_showTableAddAuthoryModal}
              >
                <FormattedMessage id="oal.face.add" />
              </Button>
            </div>
          </Col>
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

  table_submitTableAddAuthoryModal = (userId, callback) => {
    const { dispatch } = this.props;
    const { listSelectedBean } = this.state;
    dispatch({
      type: 'log/addAuthory',
      payload: {
        deviceId: listSelectedBean._id,
        userId: userId,
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
      type: 'log/delAuthory',
      payload: {
        faceId: tableSelectedBean && tableSelectedBean._id || tableSelectedRows.map(item => item._id).join(','),
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        this.table_closeTableDelModal();
        this.table_loadData();
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
      treeLoading,
    } = this.props;
    const {
      tableSelectedRows,
      listSelectedBean,
      tableDelVisible,
      tableSelectedBean,
      viewVisible,
      tableAddAuthoryVisible,
      treeData,
      treeOriginalData,
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
                  <Spin spinning={deviceListLoading} /> :
                  (<List
                    itemLayout="horizontal"
                    split={false}
                    dataSource={[...deviceList, ...deviceList, ...deviceList]}
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
                  type="danger"
                  disabled={!tableSelectedRows || tableSelectedRows.length === 0}
                  onClick={this.table_showTableDelModal}
                >
                  <FormattedMessage id="oal.log.remove" />
                </Button>
              </div>
              <StandardTable
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                needRowSelection
                selectedRows={tableSelectedRows}
                loading={logListLoading}
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
          <img src={tableSelectedBean.imgPath} alt="" style={{ width: '100%', height: '100%' }} />
        </Modal>
        <TableDelModal
          visible={tableDelVisible}
          bean={tableSelectedBean && tableSelectedBean._id ? [tableSelectedBean] : tableSelectedRows}
          handleCancel={this.table_closeTableDelModal}
          handleSubmit={this.table_submitTableDelModal}
        />
        <TableAddAuthoryModal
          visible={tableAddAuthoryVisible}
          treeData={treeData}
          treeOriginalData={treeOriginalData}
          curDeviceId={listSelectedBean._id}
          handleCancel={this.table_closeTableAddAuthoryModal}
          handleSubmit={this.table_submitTableAddAuthoryModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Log);
