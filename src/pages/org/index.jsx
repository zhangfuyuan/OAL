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
  Tooltip,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from '../../components/StandardTable';
import AddOrUpdateOrg from './components/AddOrUpdateOrg';
import OrgDetailModal from './components/OrgDetailModal';
import OrgResetModal from './components/OrgResetModal';
import AssignModal from './components/AssignModal';
import styles from './style.less';
import defaultSettings from '../../../config/defaultSettings';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { getPageQuery } from '@/utils/utils';
import { SYSTEM_PATH } from '@/utils/constants';

const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['error', 'success'];
const status = ['oal.common.disable', 'oal.common.enable'];
const { publicPath } = defaultSettings;

@connect(({ user: { currentUser }, org, loading }) => ({
  currentUser,
  org,
  orgListLoading: loading.effects['org/fetch'],
  addOrgLoading: loading.effects['org/add'],
  updateOrgLoading: loading.effects['org/update'],
  resetPswLoading: loading.effects['org/resetPsw'],
  assignLoading: loading.effects['org/assign'],
}))
class OrgList extends Component {
  state = {
    detailVisible: false,
    resetVisible: false,
    modalVisible: false,
    assignVisible: false,
    formValues: {
      creator: getPageQuery().creator,
    },
    selectedRows: [],
    selectedOrg: {},
    page: {
      current: 1,
      pageSize: 10,
    },
  };

  componentDidMount() {
    this.loadOrgList();
  }

  loadOrgList = () => {
    const { dispatch } = this.props;
    const { page, formValues } = this.state;

    dispatch({
      type: 'org/fetch',
      payload: {
        ...page,
        ...formValues,
      },
    });
  };

  columns = () => {
    // const MoreBtn = ({ item }) => (
    //   <Dropdown
    //     overlay={
    //       <Menu onClick={({ key }) => this.moreAction(key, item)}>
    //         <Menu.Item key="modify" disabled={item.state === 0}><FormattedMessage id="oal.common.modify" /></Menu.Item>
    //         <Menu.Item key="open" disabled={item.state === 1}><FormattedMessage id="oal.common.enable" /></Menu.Item>
    //         <Menu.Item key="close" disabled={item.state === 0}><FormattedMessage id="oal.common.disable" /></Menu.Item>
    //       </Menu>
    //     }
    //   >
    //     <a>
    //       <FormattedMessage id="oal.common.more" /><Icon type="down" />
    //     </a>
    //   </Dropdown>
    // );
    const cl = [
      {
        title: formatMessage({ id: 'oal.org.orgName' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: formatMessage({ id: 'oal.common.status' }),
        dataIndex: 'state',
        key: 'state',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val] && formatMessage({ id: status[val] }) || '-'} />;
        },
      },
      {
        title: formatMessage({ id: 'oal.org.path' }),
        dataIndex: 'path',
        key: 'path',
        render: (_text, record) => (
          <Fragment>
            <a onClick={() => this.openWin(record.path)}>{record.path}</a>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'oal.org.contacts' }),
        dataIndex: 'contactName',
        key: 'contactName',
        render: (text, record) => <span>{(record && record.contact && record.contact.nickName) || '-'}</span>,
      },
      // {
      //   title: formatMessage({ id: 'oal.org.creator' }),
      //   dataIndex: 'creator',
      //   key: 'creator',
      //   render: (text, record) => <span>{text || '-'}</span>,
      // },
      {
        title: formatMessage({ id: 'oal.common.authorizedPoints' }),
        key: 'authorizedPoints',
        dataIndex: 'authorizedPoints',
        render: (text, record) => (
          <Tooltip title={formatMessage({ id: 'oal.common.terminalAssigned/terminalTotal' })}>
            <span>
              {record && record.terminalAssigned || '0'}/{record && record.terminalTotal || '0'}
            </span>
          </Tooltip>
        ),
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        // width: 250,
        key: 'handle',
        render: (text, record) => (
          <Fragment>
            <a key="view" onClick={() => this.openDetailModal(record)}><FormattedMessage id="oal.common.view" /></a>
            <Divider type="vertical" />
            <a key="modify" onClick={() => this.moreAction('modify', record)}><FormattedMessage id="oal.common.modify" /></a>
            <Divider type="vertical" />
            <a onClick={() => this.openAssignModal(record)}><FormattedMessage id="oal.common.assign" /></a>
            <Divider type="vertical" />
            <a key="resetPassword" onClick={() => this.openResetModal(record)}><FormattedMessage id="oal.org.resetPassword" /></a>
            <Divider type="vertical" />
            {
              record.state === 1 ?
                <a key="disable" onClick={() => this.moreAction('close', record)}><FormattedMessage id="oal.common.disable" /></a> :
                <a key="enable" onClick={() => this.moreAction('open', record)}><FormattedMessage id="oal.common.enable" /></a>
            }
            {/* <MoreBtn item={record} /> */}
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
        message.success(formatMessage({ id: 'oal.common.setSuccessfully' }));
        this.loadOrgList();
      }
    })
  };

  openWin = path => {
    // 由于后台框架限制，同时只能一个账号处于登录状态，所以需先登出
    localStorage.setItem(SYSTEM_PATH, path);
    this.props.dispatch({
      type: 'login/logout',
      payload: {},
    });
    // const { origin } = window.location;
    // const href = `${origin}${publicPath}user/${path}/login`;
    // window.open(href);
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
        this.loadOrgList();
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
      this.loadOrgList();
    });
  };

  openDetailModal = record => {
    this.setState({ detailVisible: true, selectedOrg: record });
  };

  openResetModal = record => {
    this.setState({ resetVisible: true, selectedOrg: record });
  };

  closeDetailModal = () => {
    this.setState({ detailVisible: false, selectedOrg: {} });
  };

  closeResetModal = () => {
    this.setState({ resetVisible: false, selectedOrg: {} });
  };

  submitCopy = () => {
    // this.closeDetailModal();
  };

  submitReset = () => {
    const { dispatch } = this.props;
    const { selectedOrg } = this.state;

    dispatch({
      type: 'org/resetPsw',
      payload: {
        orgId: selectedOrg._id,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.org.resetSuccessfully' }));
        this.closeResetModal();
      }
    });
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
        if (res && res.res > 0) {
          message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
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
        if (res && res.res > 0) {
          message.success(formatMessage({ id: 'oal.face.addSuccessfully' }));
          this.closeAddOrUpdateOrgModal();
          this.loadOrgList();
          callback();
        }
      });
    }
  };

  // 分配授权点
  openAssignModal = bean => {
    this.setState({ assignVisible: true, selectedOrg: bean });
  };

  closeAssignModal = () => {
    this.setState({ assignVisible: false, selectedOrg: {} });
  };

  submitAssignModal = (values, callback) => {
    const { dispatch, currentUser } = this.props;
    const { terminalTotal: oldTerminalTotal, terminalAssigned: oldTerminalAssigned } = currentUser.authorizedPoints || {};
    const { points, diff } = values;

    dispatch({
      type: 'org/assign',
      payload: values,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.assignSuccessfully' }));
        this.closeAssignModal();
        this.loadOrgList();
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
    const { form, orgListLoading } = this.props;
    const { formValues } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row
          gutter={{
            md: 4,
            lg: 12,
            xl: 24,
          }}
        >
          <Col xxl={5} xl={7} lg={10} md={10} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.org.orgName' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'oal.org.enterOrgName' })} />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.org.path' })}>
              {getFieldDecorator('path')(<Input placeholder={formatMessage({ id: 'oal.org.enterPath' })} />)}
            </FormItem>
          </Col>
          {/* <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.org.creator' })}>
              {getFieldDecorator('creator', {
                initialValue: formValues && formValues.creator || '',
              })(<Input placeholder={formatMessage({ id: 'oal.org.enterCreator' })} />)}
            </FormItem>
          </Col> */}
          <Col xxl={4} xl={5} lg={5} md={5} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.status' })}>
              {getFieldDecorator('state', {
                initialValue: '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value=""><FormattedMessage id="oal.common.all" /></Option>
                  <Option value="1"><FormattedMessage id="oal.common.enable" /></Option>
                  <Option value="0"><FormattedMessage id="oal.common.disable" /></Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={5} lg={6} md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={orgListLoading}>
                <FormattedMessage id="oal.face.search" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                loading={orgListLoading}
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
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = pagination => {
    this.setState({
      page: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      selectedRows: [],
    }, () => {
      this.loadOrgList();
    });
  };

  org_showTotal = (total, range) => (formatMessage({
    id: 'oal.org.currentToTotal',
  }, {
    total,
  }));

  render() {
    const {
      org: { orgList },
      orgListLoading,
      addOrgLoading,
      updateOrgLoading,
      resetPswLoading,
      assignLoading,
      currentUser,
    } = this.props;
    const authorizedPoints = currentUser && currentUser.authorizedPoints || {};
    orgList && orgList.pagination && (orgList.pagination.showTotal = this.org_showTotal);
    const { selectedRows, modalVisible, selectedOrg, detailVisible, resetVisible, assignVisible } = this.state;
    return (
      <PageHeaderWrapper className={styles.myPageHeaderWrapper}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div
              className={styles.tableListOperator}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Button type="primary" onClick={() => this.toAdd()}>
                <FormattedMessage id="oal.org.addOrg" />
              </Button>

              <div>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.totalAuthorizationPoints" /> :
                </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{authorizedPoints.terminalTotal || '0'}</span>
                </span>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.available" /> :
                 </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{authorizedPoints.terminalTotal - authorizedPoints.terminalAssigned || '0'}</span>
                </span>
                <span>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                    <FormattedMessage id="oal.settings.assigned" /> :
                </span>
                  <span style={{ margin: '0 50px 0 10px' }}>{authorizedPoints.terminalAssigned || '0'}</span>
                </span>
              </div>
            </div>
            <StandardTable
              // eslint-disable-next-line no-underscore-dangle
              rowKey={record => record._id}
              needRowSelection={false}
              selectedRows={selectedRows}
              loading={orgListLoading}
              data={orgList}
              columns={this.columns()}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <AddOrUpdateOrg
          confirmLoading={addOrgLoading || updateOrgLoading}
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
        <OrgResetModal
          visible={resetVisible}
          orgBean={selectedOrg}
          confirmLoading={resetPswLoading}
          handleCancel={this.closeResetModal}
          handleSubmit={this.submitReset}
        />
        <AssignModal
          visible={assignVisible}
          bean={selectedOrg}
          currentUser={currentUser}
          confirmLoading={assignLoading}
          handleCancel={this.closeAssignModal}
          handleSubmit={this.submitAssignModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(OrgList);
