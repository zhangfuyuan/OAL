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
// import DetailModal from './components/DetailModal';
import { getPageQuery } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const initFormValues = {
  date: [moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD')],
};

// TODO 需要对接
const getWorkStatus = bean => {
  const { workRule, record } = bean;
  const {
    workStartTime: ruleWorkStartTime,
    workEndTime: ruleWorkEndTime,
  } = workRule || { workStartTime: '09:00', workEndTime: '18:00' };
  const {
    workStartTime: recordWorkStartTime,
    workEndTime: recordWorkEndTime,
  } = record || { workStartTime: '10:00:00', workEndTime: '10:00:22' };
  let res = [];

  if (!recordWorkStartTime || !recordWorkEndTime) {
    res.push(formatMessage({ id: 'oal.work-statistics.absence' }));
  } else {
    if (recordWorkStartTime > ruleWorkStartTime) {
      res.push(formatMessage({ id: 'oal.work-statistics.late' }));
    }

    if (recordWorkEndTime < ruleWorkEndTime) {
      res.push(formatMessage({ id: 'oal.work-statistics.early' }));
    }
  }

  if (res.length === 0) {
    res.push(formatMessage({ id: 'oal.work-statistics.normal' }));
  }

  return res.join('、');
};

@connect(({ attendanceRecord, loading }) => ({
  attendanceRecord,
  listLoading: loading.effects['attendanceRecord/fetchList'],
}))
class AttendanceRecord extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    tableSelectedRows: [],
    tableSelectedBean: {},
    formValues: (() => {
      let res = null;
      const { ruleId, name, date, status } = getPageQuery() || {};

      if (name) {
        const [sDate, eDate] = date && date.split('~') || initFormValues.date;

        // 从 "考勤统计" 跳转过来
        res = {
          ruleId,
          name,
          date: sDate && eDate ? [sDate, eDate] : initFormValues.date,
          status,
        }
      } else {
        res = { ...initFormValues };
      }

      return res;
    })(),
    tablePage: {
      current: 1,
      pageSize: 10,
    },
    sortedInfo: {
      columnKey: '',
      order: '', // ascend（正序）、descend（倒序）
    },
    // viewVisible: false,
    attendanceRuleList: [],
  };

  ref_download = null;

  componentDidMount() {
    this.table_loadData();

    const { dispatch } = this.props;
    dispatch({
      type: 'attendanceRecord/fetchAttendanceRuleList',
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
      type: 'attendanceRecord/fetchList',
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
      sortedInfo: { columnKey, order }
    } = this.state;

    const cl = [
      {
        title: formatMessage({ id: 'oal.common.date' }),
        key: 'date',
        dataIndex: 'date',
        sorter: (a, b) => a.date - b.date,
        sortOrder: columnKey === 'date' && order,
        width: 150,
        render: (text, record) => <span>{record.updateAt ? moment(record.updateAt).format('YYYY-MM-DD') : '2020-04-21'}</span>,
      },
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
        title: formatMessage({ id: 'oal.work-rule.workRule' }),
        key: 'workRule',
        dataIndex: 'workRule',
        sorter: (a, b) => a.workRule - b.workRule,
        sortOrder: columnKey === 'workRule' && order,
        render: (text, record) => <span>{record.workRule && record.workRule.ruleName || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.work-rule.workTime' }),
        key: 'workTime',
        dataIndex: 'workTime',
        sorter: (a, b) => a.workRule - b.workRule,
        sortOrder: columnKey === 'workTime' && order,
        render: (text, record) => <span>{record.workRule && `${record.workRule.workStartTime} ~ ${record.workRule.workEndTime}` || '9:00-18:00'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.work-rule.workStartTime' }),
        key: 'recordWorkStartTime',
        dataIndex: 'recordWorkStartTime',
        sorter: (a, b) => a.recordWorkStartTime - b.recordWorkStartTime,
        sortOrder: columnKey === 'recordWorkStartTime' && order,
        render: (text, record) => <span>{record.recordWorkStartTime || '11:00:02'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.work-rule.workEndTime' }),
        key: 'recordWorkEndTime',
        dataIndex: 'recordWorkEndTime',
        sorter: (a, b) => a.recordWorkEndTime - b.recordWorkEndTime,
        sortOrder: columnKey === 'recordWorkEndTime' && order,
        render: (text, record) => <span>{record.recordWorkEndTime || '16:00:22'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.status' }),
        key: 'status',
        dataIndex: 'status',
        render: (text, record) => <span>{getWorkStatus(record)}</span>,
      },
      // {
      //   title: formatMessage({ id: 'oal.common.handle' }),
      //   width: 100,
      //   render: (text, record) => (
      //     <Fragment>
      //       <a onClick={() => this.table_showViewModal(record)}><FormattedMessage id="oal.common.view" /></a>
      //     </Fragment>
      //   ),
      // },
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
    const { ruleId, name, date, status } = formValues;
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
                  {getFieldDecorator('attendanceRule', {
                    initialValue: ruleId,
                  })(
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
          <Col xxl={3} xl={3} lg={4} md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('status', {
                initialValue: status,
              })(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.status' })}
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value=""><FormattedMessage id="oal.common.all" /></Option>
                  <Option value="0"><FormattedMessage id="oal.work-statistics.normal" /></Option>
                  <Option value="1"><FormattedMessage id="oal.work-statistics.late" /></Option>
                  <Option value="2"><FormattedMessage id="oal.work-statistics.early" /></Option>
                  <Option value="3"><FormattedMessage id="oal.work-statistics.absence" /></Option>
                </Select>,
              )}
            </FormItem>
          </Col>
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
                allowClear={false}
              />)}
            </FormItem>
          </Col>
          <Col xxl={4} xl={5} lg={6} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.fullName' })}>
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input placeholder={formatMessage({ id: 'oal.face.enterFullName' })} />)}
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

    // TODO 需对接
    dispatch({
      type: 'attendanceRecord/export',
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
  // table_showViewModal = bean => {
  //   this.setState({ viewVisible: true, tableSelectedBean: bean })
  // };

  // table_closeViewModal = () => {
  //   this.setState({ viewVisible: false, tableSelectedBean: {} })
  // };

  /************************************************ Render ************************************************/

  render() {
    const {
      attendanceRecord: { recordList },
      listLoading,
    } = this.props;
    const {
      tableSelectedRows,
      // viewVisible,
      tableSelectedBean,
    } = this.state;

    recordList && recordList.pagination && (recordList.pagination.showTotal = (total, range) => (formatMessage({
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
                data={recordList}
                columns={this.table_columns()}
                onSelectRow={this.table_handleSelectRows}
                onChange={this.table_handleChange}
              />
            </div>
          </div>
        </Card>

        {/* <DetailModal
          visible={viewVisible}
          bean={tableSelectedBean}
          handleCancel={this.table_closeViewModal}
          handleSubmit={this.table_closeViewModal}
        /> */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AttendanceRecord);
