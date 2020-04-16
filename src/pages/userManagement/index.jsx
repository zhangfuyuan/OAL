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
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['error', 'success'];
const status = ['oal.user-manage.failure', 'oal.user-manage.normal'];

@connect(({ userManagement, loading }) => ({
    userManagement,
    userListLoading: loading.effects['userManagement/fetch'],
    addOrUpdateLoading: loading.effects['userManagement/add'],
}))
class UserManagement extends Component {
    state = {
        modalVisible: false,
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
          title: formatMessage({ id: 'oal.common.username' }),
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: formatMessage({ id: 'oal.common.nickname' }),
          ellipsis: true,
          render: (text, record) => (
            <span>
              {record && record.profile && record.profile.nickName ? record.profile.nickName : ''}
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
          title: formatMessage({ id: 'oal.common.status' }),
          dataIndex: 'state',
          width: 120,
          render(val) {
            return <Badge status={statusMap[val]} text={status[val] && formatMessage({ id: status[val] }) || '--'} />;
          },
        },
        {
          title: formatMessage({ id: 'oal.common.handle' }),
          width: 140,
          render: (text, record) => (
            <Fragment>
              <Popconfirm title={formatMessage({ id: 'oal.user-manage.confirmDeleteUser' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.deleteUser(record)}>
                <a href="#" disabled={!record.type}><FormattedMessage id="oal.common.delete" /></a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={formatMessage({ id: 'oal.user-manage.confirmResetUserPassword' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.resetPsw(record)}>
                <a href="#"><FormattedMessage id="oal.user-manage.resetPassword" /></a>
              </Popconfirm>
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
          if (res.res === 1) {
            this.loadUserList();
            message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
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
        if (res.res === 1) {
          this.loadUserList();
          message.success(formatMessage({ id: 'oal.user-manage.resetPasswordSuccessfully' }));
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

    closeAddOrUpdateModal = () => {
        this.setState({ modalVisible: false, selectedUser: {} });
    };

    submitAddOrUpdate = (values, callback) => {
        const { dispatch } = this.props;
        const { selectedUser } = this.state;
        // eslint-disable-next-line no-underscore-dangle
        if (selectedUser && selectedUser._id) {
          console.log('修改走这边---');
        } else {
          dispatch({
            type: 'userManagement/add',
            payload: values,
          }).then(res => {
            if (res.res === 1) {
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
                <FormItem label={formatMessage({ id: 'oal.common.username' })}>
                  {getFieldDecorator('userName')(<Input placeholder={formatMessage({ id: 'oal.user-manage.enterUsername2' })} />)}
                </FormItem>
              </Col>
              <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
                <FormItem label={formatMessage({ id: 'oal.common.status' })}>
                  {getFieldDecorator('state')(
                    <Select
                      placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value=""><FormattedMessage id="oal.common.all" /></Option>
                      <Option value="0"><FormattedMessage id="oal.user-manage.failure" /></Option>
                      <Option value="1"><FormattedMessage id="oal.user-manage.normal" /></Option>
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

    handleSelectRows = rows => {
        // eslint-disable-next-line no-console
        console.log('rows-------', rows);
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
        const { selectedRows, modalVisible, selectedUser } = this.state;
        return (
          <PageHeaderWrapper>
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
          </PageHeaderWrapper>
        );
    }
}

export default Form.create()(UserManagement);
