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
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ userManagement, loading }) => ({
    userManagement,
    userListLoading: loading.effects['userManagement/fetch'],
    addOrUpdateLoading: loading.effects['userManagement/add'],
}))
class UserManagement extends Component {
    state = {
        modalVisible: false,
        resetVisible: false,
        delVisible: false,
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
          title: formatMessage({ id: 'oal.common.account' }),
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: formatMessage({ id: 'oal.common.nickname' }),
          ellipsis: true,
          render: (text, record) => (
            <span>
              {record && record.profile && record.profile.nickName ? record.profile.nickName : '--'}
            </span>
          ),
        },
        {
          title: formatMessage({ id: 'oal.common.phoneNumber' }),
          ellipsis: true,
          render: (text, record) => (
            <span>
              {record && record.profile && record.profile.mobile ? record.profile.mobile : ''}
            </span>
          ),
        },
        {
          title: formatMessage({ id: 'oal.common.email' }),
          ellipsis: true,
          render: (text, record) => (
            <span>
              {record && record.profile && record.profile.email ? record.profile.email : ''}
            </span>
          ),
        },
        {
          title: formatMessage({ id: 'oal.user-manage.orgNum' }),
          dataIndex: 'orgNum',
          width: 120,
          render: (text, record) => (
            <Fragment>
              {/* <a onClick={() => this.openWin(record.orgNum)}>{record.orgNum}</a> */}
              <Link to={`/org?creator=${record && record.profile && record.profile.nickName || ''}`}>{record.orgNum || 0}</Link>
            </Fragment>
          ),
        },
        {
          title: formatMessage({ id: 'oal.common.handle' }),
          width: 200,
          render: (text, record) => (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(record)}><FormattedMessage id="oal.common.modify" /></a>
              <Divider type="vertical" />
              <a onClick={() => this.openResetModal(record)}><FormattedMessage id="oal.user-manage.resetPassword" /></a>
              <Divider type="vertical" />
              <a onClick={() => this.openDelModal(record)} disabled={!record.type}><FormattedMessage id="oal.common.delete" /></a>
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

    componentDidMount() {
        this.loadUserList();
    }

    loadUserList = () => {
        const { dispatch } = this.props;
        const { page } = this.state;
        dispatch({
            type: 'userManagement/fetch',
            payload: {
                ...page,
            },
        });
    };

    deleteUser = userBean => {
        const { dispatch } = this.props;
        dispatch({
          type: 'userManagement/operate',
          payload: {
              // eslint-disable-next-line no-underscore-dangle
              userId: userBean._id,
              action: 'delete',
          },
        }).then(res => {
          if (res && res.res > 0) {
            message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
            this.closeDelModal();
            this.loadUserList();
          }
        });
    };

    resetPsw = userBean => {
      const { dispatch } = this.props;
      dispatch({
        type: 'userManagement/operate',
        payload: {
            // eslint-disable-next-line no-underscore-dangle
            userId: userBean._id,
            action: 'resetPsw',
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
        const { form, dispatch } = this.props;
        const { page } = this.state;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({
                formValues: fieldsValue,
                selectedRows: [],
            });
            dispatch({
                type: 'userManagement/fetch',
                payload: {
                    ...page,
                    ...fieldsValue,
                },
            });
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        form.setFieldsValue({});
        const { page } = this.state;
        this.setState({
            formValues: {},
        });
        const params = {
            ...page,
            current: 1,
        };
        dispatch({
            type: 'userManagement/fetch',
            payload: params,
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
          console.log(8126, '修改用户信息', values);
          // 8126TODO 对接修改账号信息接口
          // dispatch({
          //   type: 'userManagement/modify',
          //   payload: values,
          // }).then(res => {
          //   if (res && res.res > 0) {
          //     message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
          //     this.closeAddOrUpdateModal();
          //     this.loadUserList();
          //     callback();
          //   }
          // });
          message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
          this.closeAddOrUpdateModal();
          this.loadUserList();
          callback();
        } else {
          dispatch({
            type: 'userManagement/add',
            payload: values,
          }).then(res => {
            if (res && res.res > 0) {
              message.success(formatMessage({ id: 'oal.common.newSuccessfully' }));
              this.closeAddOrUpdateModal();
              this.loadUserList();
              callback();
            }
          });
        }
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
                <FormItem label={formatMessage({ id: 'oal.common.nickname' })}>
                  {getFieldDecorator('nickname')(<Input placeholder={formatMessage({ id: 'oal.user-manage.enterNickname' })} />)}
                </FormItem>
              </Col>
              <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
                <FormItem label={formatMessage({ id: 'oal.org.orgPath' })}>
                  {getFieldDecorator('orgPath')(<Input placeholder={formatMessage({ id: 'oal.org.enterPath' })} />)}
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

    handleSelectRows = rows => {
        // eslint-disable-next-line no-console
        // console.log('rows-------', rows);
        this.setState({
          selectedRows: rows,
        });
    };

    handleStandardTableChange = pagination => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
          current: pagination.current,
          pageSize: pagination.pageSize,
          ...formValues,
        };
        dispatch({
          type: 'userManagement/fetch',
          payload: params,
        });
        this.setState({ page: { current: pagination.current, pageSize: pagination.pageSize } })
    };

    render() {
        const {
          userManagement: { userList },
          loading,
          addOrUpdateLoading,
        } = this.props;
        const { selectedRows, modalVisible, selectedUser, resetVisible, delVisible } = this.state;
        return (
          <PageHeaderWrapper className={styles.myPageHeaderWrapper}>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.toAdd()}>
                    <FormattedMessage id="oal.common.new" />
                  </Button>
                </div>
                <StandardTable
                  // eslint-disable-next-line no-underscore-dangle
                  rowKey={record => record._id}
                  needRowSelection={false}
                  selectedRows={selectedRows}
                  loading={loading}
                  data={userList}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
            <AddOrUpdateUser
              confirmLoading={addOrUpdateLoading}
              visible={modalVisible}
              userBean={selectedUser}
              handleCancel={this.closeAddOrUpdateModal}
              handleSubmit={this.submitAddOrUpdate}
            />
            <UserResetModal
              visible={resetVisible}
              userBean={selectedUser}
              handleCancel={this.closeResetModal}
              handleSubmit={this.resetPsw}
            />
            <UserDelModal
              visible={delVisible}
              userBean={selectedUser}
              handleCancel={this.closeDelModal}
              handleSubmit={this.deleteUser}
            />
          </PageHeaderWrapper>
        );
    }
}

export default Form.create()(UserManagement);
