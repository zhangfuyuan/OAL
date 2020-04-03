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
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from '../../components/StandardTable';
import AddOrUpdateOrg from './components/AddOrUpdateOrg';
import OrgDetailModal from './components/OrgDetailModal';
import styles from './style.less';
import defaultSettings from '../../../config/defaultSettings';

const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['error', 'success'];
const status = ['禁用', '启用'];
const { publicPath } = defaultSettings;

@connect(({ org, loading }) => ({
  org,
  orgListLoading: loading.effects['org/fetch'],
  addOrUpdateOrgLoading: loading.effects['org/add'],
}))
class OrgList extends Component {
  state = {
    detailVisible: false,
    modalVisible: false,
    formValues: {},
    selectedRows: [],
    selectedOrg: {},
    page: {
      current: 1,
      pageSize: 10,
    },
  };

  // columns = [
  //   {
  //     title: '组织名称',
  //     dataIndex: 'name',
  //   },
  //   {
  //     title: '状态',
  //     dataIndex: 'state',
  //     render(val) {
  //       return <Badge status={statusMap[val]} text={status[val]} />;
  //     },
  //   },
  //   {
  //     title: '路径',
  //     dataIndex: 'path',
  //     render: (text, record) => (
  //       <Fragment>
  //         <a onClick={() => this.openWin(record.path)}>{record.path}</a>
  //       </Fragment>
  //     ),
  //   },
  //   {
  //     title: '操作',
  //     render: (text, record) => (
  //       <Fragment>
  //         <a onClick={() => this.handleUpdateModalVisible(record)}>修改</a>
  //         <Divider type="vertical"/>
  //         <a onClick={() => this.openDetailModal(record)}>查看</a>
  //         {/* <MoreBtn item={item}/>, */}
  //       </Fragment>
  //     ),
  //   },
  // ];

  componentDidMount() {
    this.loadOrgList();
  }

  loadOrgList = () => {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'org/fetch',
      payload: {
        ...page,
      },
    });
  };

  columns = () => {
    const MoreBtn = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.moreAction(key, item)}>
            <Menu.Item key="modify" disabled={item.state === 0}>修改</Menu.Item>
            <Menu.Item key="open" disabled={item.state === 1}>启用</Menu.Item>
            <Menu.Item key="close" disabled={item.state === 0}>禁用</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多<Icon type="down" />
        </a>
      </Dropdown>
    );
    const cl = [
      {
        title: '组织名称',
        dataIndex: 'name',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '路径',
        dataIndex: 'path',
        render: (_text, record) => (
          <Fragment>
            <a onClick={() => this.openWin(record.path)}>{record.path}</a>
          </Fragment>
        ),
      },
      {
        title: '联系人',
        dataIndex: 'contactName',
        render: (text, record) => <span>{(record && record.contact && record.contact.nickName) || '未填写'}</span>,
      },
      {
        title: '操作',
        width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.openDetailModal(record)}>查看</a>
            <Divider type="vertical" />
            <MoreBtn item={record} />
          </Fragment>
        ),
      },
    ];
    return cl;
  };

  moreAction = (key, bean) => {
    if (key === 'modify') {
      this.handleUpdateModalVisible(bean);
    } else if (key === 'open') {
      // eslint-disable-next-line no-underscore-dangle
      this.handleState(1, bean._id);
    } else if (key === 'close') {
      // eslint-disable-next-line no-underscore-dangle
      this.handleState(0, bean._id);
    }
  };

  handleState = (state, orgId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'org/handleState',
      payload: {
        orgId,
        state,
      },
    }).then(res => {
      if (res.res > 0) {
        message.success('设置成功');
        this.loadOrgList();
      }
    })
  };

  openWin = path => {
    const { origin } = window.location;
    const href = `${origin}${publicPath}user/${path}/login`;
    window.open(href);
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
        type: 'org/fetch',
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
      pageNo: 1,
    };
    dispatch({
      type: 'org/fetch',
      payload: params,
    });
  };

  openDetailModal = record => {
    this.setState({ detailVisible: true, selectedOrg: record });
  };

  closeDetailModal = () => {
    this.setState({ detailVisible: false, selectedOrg: {} });
  };

  submitCopy = () => {
    this.closeDetailModal();
  };

  handleUpdateModalVisible = record => {
    this.setState({ modalVisible: true, selectedOrg: record });
  };

  toAdd = () => {
    this.setState({ modalVisible: true });
  };

  closeAddOrUpdateOrgModal = () => {
    this.setState({ modalVisible: false, selectedOrg: {} });
  };

  submitAddOrUpdateOrg = (values, callback) => {
    const { dispatch } = this.props;
    const { selectedOrg } = this.state;
    // eslint-disable-next-line no-underscore-dangle
    if (selectedOrg && selectedOrg._id) {
      dispatch({
        type: 'org/update',
        payload: values,
      }).then(res => {
        if (res.res === 1) {
          message.success('修改成功');
          this.closeAddOrUpdateOrgModal();
          this.loadOrgList();
          callback();
        }
      });
    } else {
      dispatch({
        type: 'org/add',
        payload: values,
      }).then(res => {
        if (res.res === 1) {
          message.success('新增成功');
          this.closeAddOrUpdateOrgModal();
          this.loadOrgList();
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
            <FormItem label="组织名称">
              {getFieldDecorator('name')(<Input placeholder="输入组织名称" />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label="路径">
              {getFieldDecorator('path')(<Input placeholder="输入路径" />)}
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
                  <Option value="0">禁用</Option>
                  <Option value="1">启用</Option>
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
      type: 'org/fetch',
      payload: params,
    });
  };

  render() {
    const {
      org: { orgList },
      loading,
      addOrUpdateOrgLoading,
    } = this.props;
    const { selectedRows, modalVisible, selectedOrg, detailVisible } = this.state;
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
              data={orgList}
              columns={this.columns()}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <AddOrUpdateOrg
          confirmLoading={addOrUpdateOrgLoading}
          visible={modalVisible}
          orgBean={selectedOrg}
          handleCancel={this.closeAddOrUpdateOrgModal}
          handleSubmit={this.submitAddOrUpdateOrg}
        />
        <OrgDetailModal
          visible={detailVisible}
          orgBean={selectedOrg}
          handleCancel={this.closeDetailModal}
          handleSubmit={this.submitCopy}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(OrgList);
