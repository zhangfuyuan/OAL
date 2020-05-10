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
  Icon,
  Spin,
  DatePicker,
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
import DetailModal from './components/DetailModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const initFormValues = {
  date: [moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD')],
};

@connect(({ attendanceStatistics, loading }) => ({
  attendanceStatistics,
  listLoading: loading.effects['attendanceStatistics/fetchList'],
}))
class AttendanceStatistics extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    tableSelectedRows: [],
    tableSelectedBean: {},
    formValues: {
      ...initFormValues,
    },
    tablePage: {
      current: 1,
      pageSize: 10,
    },
    sortedInfo: {
      columnKey: '',
      order: '', // ascend（正序）、descend（倒序）
    },
    viewVisible: false,
    attendanceRuleList: [],
  };

  ref_download = null;

  componentDidMount() {
    this.table_loadData();

    const { dispatch } = this.props;
    dispatch({
      type: 'attendanceStatistics/fetchAttendanceRuleList',
      payload: {},
    }).then(res => {
      if (res && res.res > 0 && res.data.length > 0) {
        this.setState({
          attendanceRuleList: res.data,
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

  /************************************************* Table *************************************************/

  table_loadData = () => {
    const { dispatch } = this.props;
    const { tablePage, sortedInfo, formValues } = this.state;
    dispatch({
      type: 'attendanceStatistics/fetchList',
      payload: {
        ...tablePage,
        ...sortedInfo,
        ...formValues,
      },
    });
  };

  table_handleSelectRows = rows => {
    this.setState({
      tableSelectedRows: rows,
    });
  };

  table_columns = () => {
    const {
      sortedInfo: { columnKey, order },
    } = this.state;

    const cl = [
      {
        title: formatMessage({ id: 'oal.common.fullName' }),
        key: 'name',
        dataIndex: 'name',
        sorter: (a, b) => a.name - b.name,
        sortOrder: columnKey === 'name' && order,
      },
      {
        title: formatMessage({ id: 'oal.face.staffid' }),
        key: 'staffid',
        dataIndex: 'staffid',
        render: (text, record) => <span>{record.staffid || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.work-statistics.department' }),
        key: 'department',
        dataIndex: 'department',
        render: (text, record) => <span>{record.department || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.work-rule.workRule' }),
        key: 'workRule',
        dataIndex: 'workRule',
        render: (text, record) => <span>{record.workRule && record.workRule.ruleName || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.work-statistics.normal' }),
        key: 'normalNum',
        dataIndex: 'normalNum',
        sorter: (a, b) => a.normalNum - b.normalNum,
        sortOrder: columnKey === 'normalNum' && order,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleLink(record, '0')}>{record.normalNum || 0}</a>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'oal.work-statistics.late' }),
        key: 'lateNum',
        dataIndex: 'lateNum',
        sorter: (a, b) => a.lateNum - b.lateNum,
        sortOrder: columnKey === 'lateNum' && order,
        render: (text, record) => (
          <Fragment>
            <a style={{ color: '#FF4D4F' }} onClick={() => this.handleLink(record, '1')}>{record.lateNum || 0}</a>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'oal.work-statistics.early' }),
        key: 'earlyNum',
        dataIndex: 'earlyNum',
        sorter: (a, b) => a.earlyNum - b.earlyNum,
        sortOrder: columnKey === 'earlyNum' && order,
        render: (text, record) => (
          <Fragment>
            <a style={{ color: '#FF4D4F' }} onClick={() => this.handleLink(record, '2')}>{record.earlyNum || 0}</a>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'oal.work-statistics.absence' }),
        key: 'absenceNum',
        dataIndex: 'absenceNum',
        sorter: (a, b) => a.absenceNum - b.absenceNum,
        sortOrder: columnKey === 'absenceNum' && order,
        render: (text, record) => (
          <Fragment>
            <a style={{ color: '#FF4D4F' }} onClick={() => this.handleLink(record, '3')}>{record.absenceNum || 0}</a>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 100,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.table_showViewModal(record)}><FormattedMessage id="oal.common.view" /></a>
          </Fragment>
        ),
      },
    ];
    return cl;
  };

  handleLink = (bean, status) => {
    if (bean) {
      const {
        formValues: { date },
      } = this.state;

      router.push({
        pathname: '/workAttendance/record',
        query: {
          ruleId: bean.workRule && bean.workRule._id || '',
          name: bean.name,
          date: date && date.join('~') || '',
          status,
        },
      });
    }
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
      const { date } = fieldsValue;
      this.setState({
        formValues: {
          ...fieldsValue,
          date: date[0] && [date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD')] || [],
        },
        tableSelectedRows: [],
      }, () => {
        this.table_loadData();
      });
    });
  };

  table_handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        ...initFormValues,
      },
      tableSelectedRows: [],
    }, () => {
      this.table_loadData();
    });
  };

  table_renderSimpleForm = () => {
    const { form, listLoading } = this.props;
    const { getFieldDecorator } = form;
    const { formValues, attendanceRuleList } = this.state;
    const { date } = formValues;
    return (
      <Form layout="inline">
        <Row
          gutter={{
            md: 4,
            lg: 12,
            xl: 24,
          }}
        >
          {
            attendanceRuleList && attendanceRuleList.length > 0 ?
              (<Col xxl={4} xl={5} lg={6} md={8} sm={24}>
                <FormItem label="">
                  {getFieldDecorator('attendanceRule')(
                    <Select
                      placeholder={formatMessage({ id: 'oal.work-statistics.pleaseSelectAttendanceRule' })}
                      style={{
                        width: '100%',
                      }}
                    >
                      {
                        attendanceRuleList.map(item => <Option key={item._id} value={item._id}>{item.ruleName}</Option>)
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>) : ''
          }
          <Col xxl={4} xl={5} lg={6} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.fullName' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'oal.face.enterFullName' })} />)}
            </FormItem>
          </Col>
          {/* <Col xxl={6} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.status' })}>
              {getFieldDecorator('status')(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value=""><FormattedMessage id="oal.common.all" /></Option>
                  <Option value="0"><FormattedMessage id="oal.common.disable" /></Option>
                  <Option value="1"><FormattedMessage id="oal.common.enable" /></Option>
                </Select>,
              )}
            </FormItem>
          </Col> */}
          <Col xxl={6} xl={8} lg={12} md={12} sm={24}>
            <FormItem label="">
              {getFieldDecorator('date', {
                initialValue: [moment(date[0], 'YYYY-MM-DD'), moment(date[1], 'YYYY-MM-DD')],
              })(<RangePicker
                ranges={{
                  [formatMessage({ id: 'oal.log-query.today' })]: [moment(), moment()],
                  [formatMessage({ id: 'oal.log-query.latestWeek' })]: [moment().subtract(1, 'weeks'), moment()],
                  [formatMessage({ id: 'oal.log-query.latestMonth' })]: [moment().subtract(1, 'months'), moment()],
                }}
              />)}
            </FormItem>
          </Col>
          <Col xxl={4} lg={6} md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={this.table_handleSearch} type="primary" htmlType="submit" loading={listLoading}>
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
        </Row>
      </Form>
    );
  };

  handleExport = () => {
    const { dispatch } = this.props;
    const { sortedInfo, formValues, listSelectedBean } = this.state;

    // 8126TODO 需对接
    dispatch({
      type: 'attendanceStatistics/export',
      payload: {
        ...sortedInfo,
        ...formValues,
      },
    }).then(res => {
      if (res && res.res > 0) {
        if (this.ref_download) {
          this.ref_download.href = res.data.length > 0 ? res.data : `http://lango-tech.com/XBH/lango19/data/users.zip`;
          this.ref_download.click();
        }
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  // 查看
  table_showViewModal = bean => {
    this.setState({ viewVisible: true, tableSelectedBean: bean })
  };

  table_closeViewModal = () => {
    this.setState({ viewVisible: false, tableSelectedBean: {} })
  };

  /************************************************ Render ************************************************/

  render() {
    const {
      attendanceStatistics: { statisticsList },
      listLoading,
    } = this.props;
    const {
      tableSelectedRows,
      viewVisible,
      tableSelectedBean,
    } = this.state;

    statisticsList && statisticsList.pagination && (statisticsList.pagination.showTotal = (total, range) => (formatMessage({
      id: 'oal.work-statistics.currentToTotal',
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
                  type="primary"
                  onClick={this.handleExport}
                >
                  <FormattedMessage id="oal.common.export" />
                </Button>
                <a ref={el => { this.ref_download = el }} href="" />
              </div>
              <StandardTable
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                needRowSelection={false}
                selectedRows={tableSelectedRows}
                loading={listLoading}
                data={statisticsList}
                columns={this.table_columns()}
                onSelectRow={this.table_handleSelectRows}
                onChange={this.table_handleChange}
              />
            </div>
          </div>
        </Card>

        <DetailModal
          visible={viewVisible}
          bean={tableSelectedBean}
          handleCancel={this.table_closeViewModal}
          handleSubmit={this.table_closeViewModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AttendanceStatistics);
