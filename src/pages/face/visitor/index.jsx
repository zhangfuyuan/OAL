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

const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['error', 'success'];
const status = ['oal.common.disable', 'oal.common.enable'];

@connect(({ setting, faceVisitor, loading }) => ({
  setting,
  faceVisitor,
  listLoading: loading.effects['faceVisitor/fetchList'],
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
  };

  componentDidMount() {
    this.table_loadData();
  }

  componentWillUnmount() {
  }

  /************************************************* Table *************************************************/

  table_loadData = () => {
    const { dispatch } = this.props;
    const { tablePage, sortedInfo } = this.state;
    dispatch({
      type: 'faceVisitor/fetchList',
      payload: {
        ...tablePage,
        ...sortedInfo,
        featureState: 'all',
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
        title: formatMessage({ id: 'oal.common.phoneNumber' }),
        key: 'mobile',
        dataIndex: 'mobile',
      },
      {
        title: formatMessage({ id: 'oal.face-visitor.validity' }),
        key: 'validity',
        dataIndex: 'validity',
        sorter: (a, b) => a.validity - b.validity,
        sortOrder: this.state.sortedInfo.columnKey === 'validity' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 200,
        render: (text, record) => (
          <Fragment>
            <a key="edit"><FormattedMessage id="oal.common.edit" /></a>
            <Divider type="vertical" />
            <a key="relate"><FormattedMessage id="oal.work-rule.relateDevice" /></a>
            <Divider type="vertical" />
            {/* <Popconfirm placement="topLeft" title={formatMessage({ id: 'oal.face.confirmDeleteFace' })} onConfirm={() => this.deleteFace(record)} okText={formatMessage({ id: 'oal.common.delete' })} cancelText={formatMessage({ id: 'oal.common.cancel' })}> */}
            <a key="remove"><FormattedMessage id="oal.common.delete" /></a>
          </Fragment>
        ),
      },
    ];
    return cl;
  };

  table_handleChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
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
    const { form, dispatch } = this.props;
    const { tablePage, sortedInfo } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        tableSelectedRows: [],
      });
      const params = {
        ...tablePage,
        ...sortedInfo,
        ...fieldsValue,
      };
      console.log('table_handleSearch', params);
    });
  };

  table_handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    form.setFieldsValue({});
    const { tablePage, sortedInfo } = this.state;
    this.setState({
      formValues: {},
    });
    const params = {
      ...tablePage,
      pageNo: 1,
      ...sortedInfo,
    };
    console.log('table_handleFormReset', params);
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

  table_showTableAddOrModifyModal = bean => {
    console.log(812666)
  };

  table_showTableDelModal = bean => {
    console.log(812666)
  };

  table_showTableMoveModal = bean => {
    console.log(812666)
  };

  table_showTableRelateModal = bean => {
    console.log(812666)
  };

  /************************************************* Other *************************************************/



  /************************************************ Render ************************************************/

  render() {
    const {
      faceVisitor: { visitorList },
      listLoading,
    } = this.props;
    const {
      tableSelectedRows,
    } = this.state;

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
                  onClick={this.table_showTableRelateModal}
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Visitor);
