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
import TableAddOrModifyModal from './components/TableAddOrModifyModal';
import TableDelModal from './components/TableDelModal';
import TableRelateDeviceModal from './components/TableRelateDeviceModal';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ setting, faceVisitor, loading }) => ({
  setting,
  faceVisitor,
  listLoading: loading.effects['faceVisitor/fetchList'],
  deviceList: faceVisitor.deviceList,
}))
class Visitor extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
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
    tableAddOrModifyVisible: false,
    tableDelVisible: false,
    relateVisible: false,
  };

  componentDidMount() {
    this.table_loadData();
    this.loadDeviceList();
  }

  componentWillUnmount() {
  }

  /************************************************* Table *************************************************/

  table_loadData = () => {
    const { dispatch } = this.props;
    const { tablePage, sortedInfo, formValues } = this.state;
    dispatch({
      type: 'faceVisitor/fetchList',
      payload: {
        ...tablePage,
        ...sortedInfo,
        ...formValues,
        featureState: 'all',
      },
    });
  };

  loadDeviceList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'faceVisitor/getDeviceList',
      payload: {
        verity: 1,
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
        // sorter: (a, b) => a.name - b.name,
        // sortOrder: this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.face.staffid' }),
        key: 'staffid',
        dataIndex: 'staffid',
        render: (text, record) => <span>{record.staffid || '--'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.phoneNumber' }),
        key: 'mobile',
        dataIndex: 'mobile',
      },
      {
        title: formatMessage({ id: 'oal.face-visitor.validity' }),
        key: 'validity',
        dataIndex: 'validity',
        // sorter: (a, b) => a.validity - b.validity,
        // sortOrder: this.state.sortedInfo.columnKey === 'validity' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 200,
        render: (text, record) => (
          <Fragment>
            <a key="edit" onClick={() => this.table_showTableAddOrModifyModal(record)}><FormattedMessage id="oal.common.edit" /></a>
            <Divider type="vertical" />
            <a key="relate" onClick={(e) => this.table_showRelateModal(e, record)}><FormattedMessage id="oal.work-rule.relateDevice" /></a>
            <Divider type="vertical" />
            {/* <Popconfirm placement="topLeft" title={formatMessage({ id: 'oal.face.confirmDeleteFace' })} onConfirm={() => this.deleteFace(record)} okText={formatMessage({ id: 'oal.common.delete' })} cancelText={formatMessage({ id: 'oal.common.cancel' })}> */}
            <a key="remove" onClick={(e) => this.table_showTableDelModal(e, record)}><FormattedMessage id="oal.common.delete" /></a>
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
            <FormItem label={formatMessage({ id: 'oal.face.search' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'oal.face.enterFullName' })} />)}
            </FormItem>
          </Col>
          <Col xxl={4} lg={4} md={4} sm={12}>
            <span className={styles.submitButtons}>
              <Button onClick={this.table_handleSearch} type="primary" htmlType="submit" loading={loading}>
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
          <Col xxl={15} xl={14} lg={12} md={12} sm={12}>
            <div style={{ textAlign: 'right', }}>
              <Button
                type="primary"
                icon="plus"
                onClick={this.table_showTableAddOrModifyModal}
              >
                <FormattedMessage id="oal.face.add" />
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
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
    this.table_loadData();
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
      type: 'faceVisitor/delVisitor',
      payload: {
        visitorId: tableSelectedBean && tableSelectedBean._id || tableSelectedRows.map(item => item._id).join(','),
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

  // 单个/批量关联设备
  table_showRelateModal = (e, bean) => {
    this.setState({ relateVisible: true, tableSelectedBean: bean || {} });
  };

  table_closeRelateModal = () => {
    this.setState({ relateVisible: false, tableSelectedBean: {} });
  };

  table_submitRelateModal = (visitorId, deviceId) => {
    const { dispatch } = this.props;
    // 8126TODO 需对接
    dispatch({
      type: 'faceVisitor/relateDevice',
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        visitorId,
        deviceId,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.work-rule.relateSuccessfully' }));
        this.table_closeRelateModal();
        this.table_loadData();
      }
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
      faceVisitor: { visitorList },
      listLoading,
      dispatch,
      deviceList,
    } = this.props;
    const {
      tableSelectedRows,
      tableSelectedBean,
      viewVisible,
      tableAddOrModifyVisible,
      tableDelVisible,
      relateVisible,
    } = this.state;

    visitorList && visitorList.pagination && (visitorList.pagination.showTotal = (total, range) => (formatMessage({
      id: 'oal.face-visitor.currentToTotal',
    }, {
      total,
    })));

    return (
      <PageHeaderWrapper title=" " className={styles.myPageHeaderWrapper} >
        <Card bordered={false}>
          <div className={styles.main} >
            <div className={styles.right}>
              <div className={styles.tableListForm}>{this.table_renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  type="danger"
                  disabled={!tableSelectedRows || tableSelectedRows.length === 0}
                  style={{ marginRight: 10 }}
                  onClick={this.table_showTableDelModal}
                >
                  <FormattedMessage id="oal.common.delete" />
                </Button>
                <Button
                  type="primary"
                  disabled={!tableSelectedRows || tableSelectedRows.length === 0}
                  onClick={this.table_showRelateModal}
                >
                  <FormattedMessage id="oal.work-rule.relateDevice" />
                </Button>
              </div>
              <StandardTable
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                needRowSelection
                selectedRows={tableSelectedRows}
                loading={listLoading}
                data={visitorList}
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
        <TableAddOrModifyModal
          visible={tableAddOrModifyVisible}
          bean={tableSelectedBean}
          dispatch={dispatch}
          handleCancel={this.table_closeTableAddOrModifyModal}
          handleSubmit={this.table_submitTableAddOrModifyModal}
        />
        <TableDelModal
          visible={tableDelVisible}
          bean={tableSelectedBean && tableSelectedBean._id ? [tableSelectedBean] : tableSelectedRows}
          handleCancel={this.table_closeTableDelModal}
          handleSubmit={this.table_submitTableDelModal}
        />
        <TableRelateDeviceModal
          visible={relateVisible}
          bean={{ selectedBean: (tableSelectedBean && tableSelectedBean._id ? [tableSelectedBean] : tableSelectedRows), deviceList }}
          handleCancel={this.table_closeRelateModal}
          handleSubmit={this.table_submitRelateModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Visitor);
