import {
  Card,
  Tabs,
  message,
  Alert,
  Button,
  Badge,
  Divider,
  Popconfirm,
  Modal,
  Menu,
  Dropdown,
  Icon,
  Form,
  Row,
  Col,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import io from 'socket.io-client';
import { AUTH_TOKEN } from '@/utils/constants';
// import DeviceList from './components/DeviceList';
import DetailModal from './components/DetailModal';
import RenameModal from './components/RenameModal';
import DeviceDelModal from './components/DeviceDelModal';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './style.less';
import StandardTable from '@/components/StandardTable';

const FormItem = Form.Item;
// const { TabPane } = Tabs;

// const tabArray = [
//     { key: 'pass', name: 'oal.device.approve', value: 1 },
//     { key: 'wait', name: 'oal.device.toAudit', value: 0 },
//     { key: 'fail', name: 'oal.device.notApprove', value: -1 },
// ];

const deviceType = [
  { value: 1, text: 'oal.device.accessControlDevice' },
  { value: 2, text: 'EAIS' },
];
const statusMap = ['error', 'success'];
const status = ['oal.device.offline', 'oal.device.online'];

@connect(({ user: { currentUser }, device, loading, user }) => ({
  currentUser,
  device,
  loginUser: user,
  deviceListLoading: loading.effects['device/fetch'],
  renameLoading: loading.effects['device/rename'],
  deleteLoading: loading.effects['device/delete'],
}))
class Device extends Component {
  state = {
    modalVisible: false,
    detailModalVisible: false,
    delModalVisible: false,
    alertVisible: true,
    deviceBean: {},
    selectedRows: [],
    delBean: [],
    page: {
      current: 1,
      pageSize: 10,
    },
    // sortedInfo: {},
    formValues: {}
  };

  componentDidMount() {
    this.loadData();
    // this.initSocket();
  }

  componentWillUnmount() {
    if (this.scoket) {
      this.scoket.close()
      this.scoket = null;
    }
  }

  initSocket = () => {
    if (!this.scoket) {
      // console.log(AUTH_TOKEN, '--scoket--5345345--->', `/?auth_token=${sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN)}`)
      this.socket = io(`/?auth_token=${sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN)}`, { forceNew: true })
      // console.log(io, '--scoket----->', this.socket)
      this.socket.on('connect', () => {
        console.log('-------connect!-------');
      });
      this.socket.on('MESSAGE', msg => {
        console.log('MESSAGE from server:', msg);
        if (msg.data.code === 1000 || msg.data.code === 1001) {
          // 有设备上线
          this.props.dispatch({
            type: 'device/setDeviceInfo',
            payload: msg.data.entity,
          });
        }
      });
    }
  }

  loadData = key => {
    // 设备不再区分审核状态
    // if (!key) {
    //     key = this.props.match.params.type;
    // }
    // const tabBean = tabArray.find(item => item.key === key);
    // const verity = tabBean ? tabBean.value : 1;
    const { dispatch } = this.props;
    const { page, formValues } = this.state;

    dispatch({
      type: 'device/fetch',
      payload: {
        ...page,
        ...formValues,
      },
    });
  };

  // changeTab = key => {
  //   router.push(`/device/${key}`)
  //   this.loadData(key)
  // };

  openDetailModal = bean => {
    this.setState({ detailModalVisible: true, deviceBean: bean });
  };

  closeDetailModal = () => {
    this.setState({ detailModalVisible: false, deviceBean: {} });
  };

  openRenameModal = bean => {
    this.setState({ modalVisible: true, deviceBean: bean });
  };

  closeRenameModal = () => {
    this.setState({ modalVisible: false, deviceBean: {} });
  };

  renameDevice = (params, callback) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'device/rename',
      payload: params,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.setSuccessfully' }));
        this.closeRenameModal();
        this.loadData();
        callback();
      } else {
        message.success(formatMessage({ id: 'oal.common.setFailed' }));
      }
    }).catch(err => {
      console.log(err);
      message.success(formatMessage({ id: 'oal.common.setFailed' }));
    });
  };

  openDelModal = bean => {
    this.setState({ delModalVisible: true, delBean: bean });
  };

  closeDelModal = () => {
    this.setState({ delModalVisible: false, delBean: [] });
  };

  submitDelete = bean => {
    const { dispatch } = this.props;

    dispatch({
      type: 'device/delete',
      payload: {
        deviceId: bean && bean.map(item => item._id).join(',') || ''
      },
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        this.loadData();
        this.closeDelModal();
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'user/modifyAuthorizedPoints',
          payload: {
            authorizedPoints: res.data.authorizedPoints || {},
          },
        });
      } else {
        message.error(formatMessage({ id: 'oal.ajax.5004' }));
      }
    }).catch(err => {
      console.log(err);
      message.error(formatMessage({ id: 'oal.ajax.5004' }));
    });
  };

  // submitVerity = (type, bean) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'device/verify',
  //     payload: { deviceId: bean._id, result: type === 'pass' ? 1 : -1 },
  //   }).then(res => {
  //     if (res.res === 1) {
  //       message.success(formatMessage({ id: 'oal.device.auditSuccessfully' }));
  //       this.loadData();
  //     }
  //   });
  // };

  handleClose = () => {
    this.setState({ alertVisible: false })
  };

  handleBatchDelete = () => {
    this.openDelModal(this.state.selectedRows);
  };

  table_columns = () => {
    // const MoreBtn = ({ item }) => (
    //   <Dropdown
    //     overlay={
    //       <Menu onClick={({ key }) => this.modifyAndDelete(key, item)}>
    //         <Menu.Item key="modify"><FormattedMessage id="oal.common.modify" /></Menu.Item>
    //         <Menu.Item key="delete"><FormattedMessage id="oal.common.delete" /></Menu.Item>
    //       </Menu>
    //     }
    //   >
    //     <a>
    //       <FormattedMessage id="oal.common.more" /> <Icon type="down" />
    //     </a>
    //   </Dropdown>
    // );
    let cl = [
      {
        title: formatMessage({ id: 'oal.device.deviceName' }),
        dataIndex: 'name',
        render: text => text || '-',
        key: 'name',
        // sorter: (a, b) => a.name - b.name,
        // sortOrder: this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.common.status' }),
        dataIndex: 'networkState',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val] && formatMessage({ id: status[val] }) || '-'} />;
        },
        key: 'networkState',
        // sorter: (a, b) => a.networkState - b.networkState,
        // sortOrder: this.state.sortedInfo.columnKey === 'networkState' && this.state.sortedInfo.order,
      },
      // {
      //   title: formatMessage({ id: 'oal.device.mac' }),
      //   key: 'mac',
      //   dataIndex: 'mac',
      //   render: text => text || '-',
      // },
      {
        title: 'IP',
        key: 'ip',
        dataIndex: 'ip',
        render: text => text || '-',
      },
      // {
      //   title: formatMessage({ id: 'oal.common.type' }),
      //   dataIndex: 'deviceType',
      //   render(val) {
      //     const bean = deviceType.find(item => item.value === val);
      //     return <span>{bean.value === 2 ? bean.text : (bean.text && formatMessage({ id: bean.text }) || '-')}</span>;
      //   },
      // },
      {
        title: 'ID',
        dataIndex: 'deviceUuid',
        render: text => text || '-',
        key: 'deviceUuid',
        // sorter: (a, b) => a.deviceVersion - b.deviceVersion,
        // sortOrder: this.state.sortedInfo.columnKey === 'deviceVersion' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        dataIndex: 'action',
        // width: 200,
        render: (text, record) => (
          <Fragment>
            <a key="view" onClick={() => this.openDetailModal(record)}><FormattedMessage id="oal.common.view" /></a>
            <Divider type="vertical" />
            <a key="set" onClick={() => this.openRenameModal(record)}><FormattedMessage id="oal.common.set" /></a>
            <Divider type="vertical" />
            {/* <Popconfirm title={formatMessage({ id: 'oal.device.confirmDeleteDevice' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.modifyAndDelete('deletePass', record)}> */}
            <a key="delete" onClick={() => this.openDelModal([record])}><FormattedMessage id="oal.common.delete" /></a>
            {/* </Popconfirm> */}
          </Fragment>
        ),
      },
    ];

    return cl;
  };

  table_handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  table_handleChange = (pagination, filters, sorter) => {
    this.setState({
      page: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      selectedRows: [],
    }, () => {
      this.loadData();
    });
  };

  renderSimpleForm = () => {
    const { form, loading } = this.props;
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
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.device.deviceName' })}>
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label="IP">
              {getFieldDecorator('ip')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label="ID">
              {getFieldDecorator('deviceUuid')(<Input />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.status' })}>
              {getFieldDecorator('networkState', {
                initialValue: '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value=""><FormattedMessage id="oal.common.all" /></Option>
                  <Option value="1"><FormattedMessage id="oal.device.online" /></Option>
                  <Option value="0"><FormattedMessage id="oal.device.offline" /></Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={4} lg={4} md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={loading}>
                <FormattedMessage id="oal.common.query" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                <FormattedMessage id="oal.common.reset" />
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  handleSearch = () => {
    const { form, dispatch } = this.props;
    const { page } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        page: {
          ...page,
          current: 1,
        },
        formValues: fieldsValue,
        selectedRows: [],
      }, () => {
        this.loadData();
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    form.setFieldsValue({
      creator: '',
    });
    this.setState({
      page: {
        pageNo: 1,
        pageSize: 10,
        current: 1,
      },
      formValues: {
        creator: '',
      },
      selectedRows: [],
    }, () => {
      this.loadData();
    });
  };

  device_showTotal = (total, range) => (formatMessage({
    id: 'oal.device.currentToTotal',
  }, {
    total,
  }));

  render() {
    const {
      device: { deviceList },
      deviceListLoading,
      loginUser,
      renameLoading,
      deleteLoading,
      currentUser,
    } = this.props;
    const authorizedPoints = currentUser && currentUser.org && currentUser.org.authorizedPoints || {};
    let deviceTableData = null;
    const { modalVisible, deviceBean, alertVisible, page, delBean, detailModalVisible, delModalVisible, selectedRows } = this.state;

    if (deviceList && deviceList.pagination) {
      deviceList.pagination.showTotal = this.device_showTotal;
      deviceTableData = deviceList;
    } else {
      deviceTableData = {
        list: deviceList,
        pagination: {
          ...page,
          showTotal: this.device_showTotal,
        }
      };
    }

    // const { type } = this.props.match.params.type ? this.props.match.params : { type: 'pass' };
    // console.log('loginUser----', loginUser)
    return (
      <PageHeaderWrapper className={styles.myPageHeaderWrapper}>
        {loginUser.currentUser && loginUser.currentUser.org && alertVisible ? (
          <Alert message={<div><FormattedMessage id="oal.device.deviceRegistrationPath" />: <span style={{ color: 'red', marginLeft: 12 }}>{loginUser.currentUser.org.path}</span></div>} type="info" showIcon style={{ marginBottom: 8 }} closable afterClose={this.handleClose} />
        ) : null}
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderSimpleForm()}</div> */}
            <div
              className={styles.tableListOperator}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Button type="danger" onClick={this.handleBatchDelete} disabled={!selectedRows || selectedRows.length === 0}>
                <FormattedMessage id="oal.common.delete" />
              </Button>

              <div>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.totalAuthorizationPoints" /> :
                </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{authorizedPoints.terminalTotal || 0}</span>
                </span>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.available" /> :
                 </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{authorizedPoints.terminalTotal - authorizedPoints.terminalAssigned || 0}</span>
                </span>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.common.used" /> :
                </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{authorizedPoints.terminalAssigned || 0}</span>
                </span>
              </div>
            </div>
            <StandardTable
              // eslint-disable-next-line no-underscore-dangle
              rowKey={record => record._id}
              needRowSelection
              selectedRows={selectedRows}
              loading={deviceListLoading}
              data={deviceTableData}
              columns={this.table_columns()}
              onSelectRow={this.table_handleSelectRows}
              onChange={this.table_handleChange}
            />
          </div>
          {/* <Tabs activeKey={type} onChange={this.changeTab}>
            {
              tabArray.map(item => (
                <TabPane tab={item.name && formatMessage({ id: item.name }) || '-'} key={item.key}>
                  <DeviceList
                    type={item.key}
                    data={deviceList}
                    loading={deviceListLoading}
                    openRenameModal={this.openRenameModal}
                    submitDelete={this.submitDelete}
                    submitVerity={this.submitVerity}
                  />
                </TabPane>
              ))
            }
          </Tabs> */}
        </Card>

        <DetailModal
          visible={detailModalVisible}
          bean={deviceBean}
          handleCancel={this.closeDetailModal}
          handleSubmit={this.closeDetailModal}
        />
        <RenameModal
          visible={modalVisible}
          bean={deviceBean}
          confirmLoading={renameLoading}
          handleCancel={this.closeRenameModal}
          handleSubmit={this.renameDevice}
        />
        <DeviceDelModal
          visible={delModalVisible}
          deviceBeanList={delBean}
          confirmLoading={deleteLoading}
          handleCancel={this.closeDelModal}
          handleSubmit={this.submitDelete}
        />
      </PageHeaderWrapper>
    )
  }
}

export default Form.create()(Device);
