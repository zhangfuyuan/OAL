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
  Popconfirm,
  Tooltip,
  Badge,
  Modal,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { find, findIndex } from 'lodash';
import StandardTable from '../../components/StandardTable';
import AddOrUpdateUser from './components/AddOrUpdateUser';
import UserResetModal from './components/UserResetModal';
import UserDelModal from './components/UserDelModal';
import AssignModal from './components/AssignModal';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ user: { currentUser }, userManagement, loading }) => ({
  currentUser,
  userManagement,
  userListLoading: loading.effects['userManagement/fetch'],
  addLoading: loading.effects['userManagement/add'],
  modifyLoading: loading.effects['userManagement/modify'],
  handleStateLoading: loading.effects['userManagement/handleState'],
  resetPswLoading: loading.effects['userManagement/resetPsw'],
  assignLoading: loading.effects['userManagement/assign'],
}))
class UserManagement extends Component {
  state = {
    modalVisible: false,
    resetVisible: false,
    delVisible: false,
    assignVisible: false,
    formValues: {},
    selectedRows: [],
    selectedUser: {},
    page: {
      current: 1,
      pageSize: 10,
    },
  };

  columns = [
    {
      title: formatMessage({ id: 'oal.user-manage.accountName' }),
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <span>
          {record && record.userName || '-'}
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'oal.common.nickname' }),
      key: 'nickname',
      dataIndex: 'nickname',
      render: (text, record) => (
        <span>
          {record && record.profile && record.profile.nickName || '-'}
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'oal.common.authorizedPoints' }),
      key: 'authorizedPoints',
      dataIndex: 'authorizedPoints',
      render: (text, record) => (
        <Tooltip title={formatMessage({ id: 'oal.common.terminalAssigned/terminalTotal' })}>
          <span>
            {record.authorizedPoints && record.authorizedPoints.terminalAssigned || 0}/{record.authorizedPoints && record.authorizedPoints.terminalTotal || 0}
          </span>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: 'oal.common.phoneNumber' }),
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      render: (text, record) => (
        <span>
          {record && record.profile && record.profile.mobile || '-'}
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'oal.common.email' }),
      key: 'email',
      dataIndex: 'email',
      render: (text, record) => (
        <span>
          {record && record.profile && record.profile.email || '-'}
        </span>
      ),
    },
    // {
    //   title: formatMessage({ id: 'oal.user-manage.orgNum' }),
    //   key: 'orgNum',
    //   dataIndex: 'orgNum',
    //   width: 120,
    //   render: (text, record) => (
    //     <Fragment>
    //       {/* <a onClick={() => this.openWin(record.orgNum)}>{record.orgNum}</a> */}
    //       <Link to={`/org?creator=${record && record.profile && record.profile.nickName || ''}`}>{record.orgNum || 0}</Link>
    //     </Fragment>
    //   ),
    // },
    {
      title: formatMessage({ id: 'oal.common.handle' }),
      // width: 250,
      key: 'handle',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(record)}><FormattedMessage id="oal.common.modify" /></a>
          <Divider type="vertical" />
          <a onClick={() => this.openAssignModal(record)} disabled={this.props.currentUser._id === record._id}><FormattedMessage id="oal.common.assign" /></a>
          <Divider type="vertical" />
          <a onClick={() => this.openResetModal(record)}><FormattedMessage id="oal.user-manage.resetPassword" /></a>
          <Divider type="vertical" />
          {
            record.state === 1 ?
              <a onClick={() => this.openDelModal(record)} disabled={this.props.currentUser._id === record._id}><FormattedMessage id="oal.common.disable" /></a> :
              <a onClick={() => this.handleState(1, record._id)}><FormattedMessage id="oal.common.enable" /></a>
          }
          {/* <Popconfirm title={formatMessage({ id: 'oal.user-manage.confirmDeleteUser' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.deleteUser(record)}>
                <a href="#" disabled={!record.type}><FormattedMessage id="oal.common.delete" /></a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={formatMessage({ id: 'oal.user-manage.confirmResetUserPassword' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.resetPsw(record)}>
                <a href="#"><FormattedMessage id="oal.user-manage.resetPassword" /></a>
              </Popconfirm> */}
        </Fragment>
      ),
    },
  ];

  handleState = (state, userId) => {
    const { dispatch } = this.props;
    const _state = state;
    dispatch({
      type: 'userManagement/handleState',
      payload: {
        userId,
        state,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: _state ? 'oal.user-manage.beenEnabled' : 'oal.user-manage.beenDisabled' }));
        this.closeDelModal();
        this.loadUserList();
      }
    })
  };

  componentDidMount() {
    this.loadUserList();
  }

  loadUserList = () => {
    const { dispatch } = this.props;
    const { page, formValues } = this.state;
    dispatch({
      type: 'userManagement/fetch',
      payload: {
        ...page,
        ...formValues,
      },
    });
  };

  deleteUser = userBean => {
    this.handleState(0, userBean._id);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'userManagement/operate',
    //   payload: {
    //     // eslint-disable-next-line no-underscore-dangle
    //     userId: userBean._id,
    //     action: 'delete',
    //   },
    // }).then(res => {
    //   if (res && res.res > 0) {
    //     message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
    //     this.closeDelModal();
    //     this.loadUserList();
    //   }
    // });
  };

  resetPsw = userBean => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagement/resetPsw',
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        userId: userBean._id,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.org.resetSuccessfully' }));
        this.closeResetModal();
        this.loadUserList();
      }
    });
  };

  handleSearch = () => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { page } = this.state;
      this.setState({
        page: {
          ...page,
          current: 1,
        },
        formValues: fieldsValue,
        selectedRows: [],
      }, () => {
        this.loadUserList();
      });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({});
    this.setState({
      page: {
        current: 1,
        pageSize: 10,
      },
      formValues: {},
      selectedRows: [],
    }, () => {
      this.loadUserList();
    });
  };

  handleUpdateModalVisible = record => {
    this.setState({ modalVisible: true, selectedUser: record });
  };

  toAdd = () => {
    this.setState({ modalVisible: true });
  };

  openResetModal = record => {
    this.setState({ resetVisible: true, selectedUser: record });
  };

  openDelModal = record => {
    this.setState({ delVisible: true, selectedUser: record });
  };

  closeAddOrUpdateModal = () => {
    this.setState({ modalVisible: false, selectedUser: {} });
  };

  closeResetModal = () => {
    this.setState({ resetVisible: false, selectedUser: {} });
  };

  closeDelModal = () => {
    this.setState({ delVisible: false, selectedUser: {} });
  };

  submitAddOrUpdate = (values, callback) => {
    const { dispatch } = this.props;
    const { selectedUser } = this.state;
    // eslint-disable-next-line no-underscore-dangle
    if (selectedUser && selectedUser._id) {
      dispatch({
        type: 'userManagement/modify',
        payload: values,
      }).then(res => {
        if (res && res.res > 0) {
          message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
          this.closeAddOrUpdateModal();
          this.loadUserList();
          callback();
        }
      });
    } else {
      dispatch({
        type: 'userManagement/add',
        payload: values,
      }).then(res => {
        if (res && res.res > 0) {
          message.success(formatMessage({ id: 'oal.face.addSuccessfully' }));
          this.closeAddOrUpdateModal();
          this.loadUserList();
          callback();
        }
      });
    }
  };

  // 分配授权点
  openAssignModal = bean => {
    this.setState({ assignVisible: true, selectedUser: bean });
  };

  closeAssignModal = () => {
    this.setState({ assignVisible: false, selectedUser: {} });
  };

  submitAssignModal = (values, callback) => {
    const { dispatch, currentUser } = this.props;
    const { terminalTotal: oldTerminalTotal, terminalAssigned: oldTerminalAssigned } = currentUser.authorizedPoints || {};
    const { points, diff } = values;

    dispatch({
      type: 'userManagement/assign',
      payload: values,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.assignSuccessfully' }));
        this.closeAssignModal();
        this.loadUserList();
        callback && callback();
        dispatch({
          type: 'user/modifyAuthorizedPoints',
          payload: {
            authorizedPoints: {
              terminalTotal: oldTerminalTotal,
              terminalAssigned: oldTerminalAssigned + diff || 0,
            }
          },
        });
      }
    });
  };

  renderSimpleForm = () => {
    const { form, userListLoading } = this.props;
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
          <Col xxl={6} xl={10} lg={10} md={10} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.user-manage.accountName' })}>
              {getFieldDecorator('userName')(<Input placeholder={formatMessage({ id: 'oal.user-manage.enterAccountNameTips' })} />)}
            </FormItem>
          </Col>
          {/* <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.nickname' })}>
              {getFieldDecorator('nickname')(<Input placeholder={formatMessage({ id: 'oal.user-manage.enterNickname' })} />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.org.orgPath' })}>
              {getFieldDecorator('orgPath')(<Input placeholder={formatMessage({ id: 'oal.org.enterPath' })} />)}
            </FormItem>
          </Col> */}
          <Col xxl={4} lg={4} md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={userListLoading}>
                <FormattedMessage id="oal.face.search" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                loading={userListLoading}
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

  handleSelectRows = rows => {
    // eslint-disable-next-line no-console
    // console.log('rows-------', rows);
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = pagination => {
    this.setState({
      page: {
        current: pagination.current,
        pageSize: pagination.pageSize
      },
      selectedRows: [],
    }, () => {
      this.loadUserList();
    });
  };

  user_showTotal = (total, range) => (formatMessage({
    id: 'oal.user-manage.currentToTotal',
  }, {
    total,
  }));

  render() {
    const {
      userManagement: { userList },
      userListLoading,
      addLoading,
      modifyLoading,
      handleStateLoading,
      currentUser,
      resetPswLoading,
      assignLoading,
    } = this.props;
    const currentUserAuthorizedPoints = currentUser && currentUser.authorizedPoints || {};
    userList && userList.pagination && (userList.pagination.showTotal = this.user_showTotal);
    const { selectedRows, modalVisible, selectedUser, resetVisible, delVisible, assignVisible } = this.state;
    return (
      <PageHeaderWrapper className={styles.myPageHeaderWrapper}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div
              className={styles.tableListOperator}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Button icon="plus" type="primary" onClick={() => this.toAdd()}>
                <FormattedMessage id="oal.face.add" />
              </Button>

              <div>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.totalAuthorizationPoints" /> :
                </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{currentUserAuthorizedPoints.terminalTotal || 0}</span>
                </span>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.available" /> :
                 </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{currentUserAuthorizedPoints.terminalTotal - currentUserAuthorizedPoints.terminalAssigned || 0}</span>
                </span>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.assigned" /> :
                </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{currentUserAuthorizedPoints.terminalAssigned || 0}</span>
                </span>
              </div>
            </div>
            <StandardTable
              // eslint-disable-next-line no-underscore-dangle
              rowKey={record => record._id}
              needRowSelection={false}
              selectedRows={selectedRows}
              loading={userListLoading}
              data={userList}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <AddOrUpdateUser
          confirmLoading={addLoading || modifyLoading}
          currentUser={currentUser}
          visible={modalVisible}
          userBean={selectedUser}
          handleCancel={this.closeAddOrUpdateModal}
          handleSubmit={this.submitAddOrUpdate}
        />
        <UserResetModal
          visible={resetVisible}
          userBean={selectedUser}
          confirmLoading={resetPswLoading}
          handleCancel={this.closeResetModal}
          handleSubmit={this.resetPsw}
        />
        <UserDelModal
          visible={delVisible}
          userBean={selectedUser}
          confirmLoading={handleStateLoading}
          handleCancel={this.closeDelModal}
          handleSubmit={this.deleteUser}
        />
        <AssignModal
          visible={assignVisible}
          bean={selectedUser}
          currentUserAuthorizedPoints={currentUserAuthorizedPoints}
          confirmLoading={assignLoading}
          handleCancel={this.closeAssignModal}
          handleSubmit={this.submitAssignModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(UserManagement);
