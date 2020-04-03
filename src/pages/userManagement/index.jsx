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

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['error', 'success'];
const status = ['失效', '正常'];

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
          title: '用户名',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '昵称',
          ellipsis: true,
          render: (text, record) => (
            <span>
              {record && record.profile && record.profile.nickName ? record.profile.nickName : ''}
            </span>
          ),
        },
        {
          title: '手机号',
          ellipsis: true,
          render: (text, record) => (
            <span>
              {record && record.profile && record.profile.mobile ? record.profile.mobile : ''}
            </span>
          ),
        },
        {
          title: '邮箱',
          ellipsis: true,
          render: (text, record) => (
            <span>
              {record && record.profile && record.profile.email ? record.profile.email : ''}
            </span>
          ),
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 120,
          render(val) {
            return <Badge status={statusMap[val]} text={status[val]} />;
          },
        },
        {
          title: '操作',
          width: 140,
          render: (text, record) => (
            <Fragment>
              <Popconfirm title="确定删除该用户？" okText="确定" cancelText="取消" onConfirm={() => this.deleteUser(record)}>
                <a href="#" disabled={!record.type}>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="确定重置该用户密码？" okText="确定" cancelText="取消" onConfirm={() => this.resetPsw(record)}>
                <a href="#">重置密码</a>
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
            message.success('删除成功');
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
          message.success('重置密码成功');
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
                message.success('新增成功');
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
                <FormItem label="用户名">
                  {getFieldDecorator('userName')(<Input placeholder="输入用户名" />)}
                </FormItem>
              </Col>
              <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
                <FormItem label="状态">
                  {getFieldDecorator('state')(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="0">失效</Option>
                      <Option value="1">正常</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col xxl={4} lg={4} md={4} sm={24}>
                <span className={styles.submitButtons}>
                  <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={loading}>
                    查询
                  </Button>
                  <Button
                    style={{
                      marginLeft: 8,
                    }}
                    onClick={this.handleFormReset}
                  >
                    重置
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
                    新增
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
