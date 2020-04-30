import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  DatePicker,
  Icon,
  Input,
  Divider,
  message
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '../../components/StandardTable';
import DetailDrawer from './components/DetailDrawer';
import styles from './style.less';
import { exportCSV } from '@/utils/utils';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../../config/defaultSettings';
import router from 'umi/router';
import Link from 'umi/link';
import RuleDelModal from './components/RuleDelModal';
import RuleRelateDeviceModal from './components/RuleRelateDeviceModal';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { publicPath } = defaultSettings;

const day = moment().date();
const begin = moment().subtract(day - 1, 'days').format('YYYY-MM-DD');
const end = moment().format('YYYY-MM-DD');

@connect(({ report, faceKey, loading }) => ({
  report,
  attendList: report.attendList,
  attendListLoading: loading.effects['report/fetch'],
  perAttendList: report.perAttendList,
  perAttendListLoading: loading.effects['report/getPerAttendList'],
  faceKeyList: faceKey.faceKeyList,
  deviceList: report.deviceList,
}))
class AttendanceList extends Component {
  state = {
    formValues: {},
    selectedRows: [],
    page: {
      current: 1,
      pageSize: 10,
    },
    // startDate: null,
    // detailVisible: false,
    selectedBean: {},
    // expandForm: false,
    delVisible: false,
    relateVisible: false,
  };

  componentDidMount() {
    this.loadAttendList();
    this.loadFaceKeyList();
    this.loadDeviceList();
  }

  // profileQuery
  loadAttendList = () => {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'report/fetch',
      payload: {
        ...page,
        begin,
        end,
      },
    });
  };

  loadFaceKeyList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'faceKey/getFaceKeyList',
    });
  };

  loadPreAttendList = (faceId, date) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/getPerAttendList',
      payload: {
        faceId,
        date,
      },
    });
  };

  loadDeviceList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/getDeviceList',
      payload: {
        verity: 1,
      },
    });
  }

  columns = () => {
    const { faceKeyList } = this.props;
    const cl = [
      {
        title: formatMessage({ id: 'oal.work-rule.workRule' }),
        key: 'ruleName',
        dataIndex: 'ruleName',
        ellipsis: true,
        render: (_text, record) => (
          <span>
            {record && record.ruleName || '--'}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'oal.work-rule.timeFrame' }),
        key: 'timeFrame',
        dataIndex: 'timeFrame',
        render: (_text, record) => (
          <span>
            {
              record &&
              record.workAttendanceTimes &&
              record.workAttendanceTimes.map(item => `${item.workAttendanceStartTime}~${item.workAttendanceEndTime}`).join('、') ||
              '--'
            }
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'oal.work.attendanceDevice' }),
        key: 'deviceName',
        dataIndex: 'deviceName',
        ellipsis: true,
        render: (_text, record) => (
          <span>
            {
              (record && record.attendanceDevices && record.attendanceDevices.map(item => item.name).join('、')) ||
              (record && record.deviceInfo && record.deviceInfo.name) ||
              '--'
            }
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 250,
        render: (text, record) => (
          <Fragment>
            <Link to={`/workAttendance/record?ruleId=${record && typeof (record._id) === 'string' && record._id || ''}`}><FormattedMessage id="oal.work-rule.record" /></Link>
            <Divider type="vertical" />
            <Link to={`/workAttendance/rule/edit?ruleId=${record && typeof (record._id) === 'string' && record._id || ''}`}><FormattedMessage id="oal.common.edit" /></Link>
            <Divider type="vertical" />
            <a key="relate" onClick={() => this.openRelateModal(record)}><FormattedMessage id="oal.work-rule.relateDevice" /></a>
            <Divider type="vertical" />
            <a key="delete" onClick={() => this.openDelModal(record)}><FormattedMessage id="oal.common.delete" /></a>
          </Fragment>
        ),
      },
    ];
    // eslint-disable-next-line no-unused-expressions
    // faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
    //   if (item.reportQuery) {
    //     const type = item.componentInfo && item.componentInfo.type; // 文本框1，下拉框2
    //     const options = item.componentInfo && item.componentInfo.data; // 下拉选项value，text的对象数组
    //     cl.push({
    //       title: item.name,
    //       key: `${item.key}`,
    //       dataIndex: `faceInfo_profile_${item.key}`,
    //       ellipsis: true,
    //       options: type === 2 ? options : null,
    //       render: (_text, record) => {
    //         let spanText = '';
    //         if (record && record.faceInfo && record.faceInfo.profile && record.faceInfo.profile[item.key]) {
    //           if (type === 2 && options && options.length > 0) {
    //             const option = options.find(bean => bean.value == record.faceInfo.profile[item.key]);
    //             spanText = (option && option.text) || '';
    //           } else {
    //             spanText = record.faceInfo.profile[item.key];
    //           }
    //         }
    //         return <span>{spanText}</span>
    //       },
    //     });
    //   }
    // });
    // cl.push({
    //   title: formatMessage({ id: 'oal.work.turnoverCount' }),
    //   key: 'count',
    //   dataIndex: 'count',
    //   width: 100,
    //   render: (_text, record) => (
    //     <span>{(record && record.accessTypes && record.accessTypes.length) || 0}</span>
    //   ),
    // },
    //   {
    //     title: formatMessage({ id: 'oal.common.time' }),
    //     key: 'time',
    //     width: 200,
    //     render: (_text, record) => (
    //       <span>{moment(record.min).format('YYYY-MM-DD HH:mm:ss')} ~ {moment(record.max).format('YYYY-MM-DD HH:mm:ss')}</span>
    //     ),
    //   });
    return cl;
  };

  // openWin = path => {
  //   const { origin } = window.location;
  //   const href = `${origin}${publicPath}user/${path}/login`;
  //   window.open(href);
  // };

  // handleSearch = () => {
  //   const { form, dispatch, faceKeyList } = this.props;
  //   const { page } = this.state;

  //   form.validateFields((err, fieldsValue) => {
  //     // console.log('fieldValues------>', fieldsValue);
  //     if (err) return;
  //     this.setState({
  //       formValues: fieldsValue,
  //       selectedRows: [],
  //     });
  //     const params = {};
  //     params.faceName = fieldsValue.faceName;
  //     params.deviceRegion = fieldsValue.deviceRegion;
  //     params.begin = moment(fieldsValue.date[0]).format('YYYY-MM-DD');
  //     params.end = moment(fieldsValue.date[1]).format('YYYY-MM-DD');
  //     params.profileQuery = {};
  //     // eslint-disable-next-line no-unused-expressions
  //     faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
  //       if (item.reportQuery) {
  //         params.profileQuery[item.key] = fieldsValue[item.key];
  //       }
  //     });
  //     dispatch({
  //       type: 'report/fetch',
  //       payload: {
  //         ...page,
  //         ...params,
  //       },
  //     });
  //   });
  // };

  // handleFormReset = () => {
  //   const { form, dispatch } = this.props;
  //   form.resetFields();
  //   form.setFieldsValue({});
  //   const { page } = this.state;
  //   this.setState({
  //     formValues: {},
  //   });
  //   const params = {
  //     ...page,
  //     current: 1,
  //     begin,
  //     end,
  //   };
  //   dispatch({
  //     type: 'report/fetch',
  //     payload: params,
  //   });
  // };

  // openDetailModal = record => {
  //   this.setState({ detailVisible: true, selectedBean: record });
  //   // eslint-disable-next-line no-underscore-dangle
  //   const faceId = record && record._id && record._id.faceId;
  //   // eslint-disable-next-line no-underscore-dangle
  //   const deviceDate = record && record._id && record._id.deviceDate;
  //   if (faceId && deviceDate) {
  //     this.loadPreAttendList(faceId, moment(deviceDate).format('YYYY-MM-DD'));
  //   }
  // };

  // closeDetailModal = () => {
  //   this.setState({ detailVisible: false, selectedBean: {} });
  // };

  // handleExport = data => {
  //   const { formValues } = this.state;
  //   const faceName = formValues.faceName || '';
  //   let beginDate = begin;
  //   let endDate = end;
  //   if (formValues.date) {
  //     beginDate = moment(formValues.date[0]).format('YYYY-MM-DD');
  //     endDate = moment(formValues.date[1]).format('YYYY-MM-DD');
  //   }
  //   let fileName = `${formatMessage({ id: 'oal.work.exportFileName' }, { beginDate, endDate })}.csv`;
  //   if (faceName) {
  //     fileName = `${faceName}_${formatMessage({ id: 'oal.work.exportFileName' }, { beginDate, endDate })}.csv`;
  //   }
  //   const headers = this.columns();
  //   const index = headers.findIndex(h => h.dataIndex === 'count');
  //   if (index > -1) {
  //     headers.splice(index, 2)
  //   }
  //   headers.push({
  //     title: formatMessage({ id: 'oal.common.date' }),
  //     dataIndex: 'date',
  //   }, {
  //     title: formatMessage({ id: 'oal.work.attendanceTime' }),
  //     dataIndex: 'beginTime',
  //   }, {
  //     title: formatMessage({ id: 'oal.work.closingTime' }),
  //     dataIndex: 'endTime',
  //   }, {
  //     title: formatMessage({ id: 'oal.work.enterCount' }),
  //     dataIndex: 'inCount',
  //   }, {
  //     title: formatMessage({ id: 'oal.work.leaveCount' }),
  //     dataIndex: 'outCount',
  //   });
  //   exportCSV(headers, data, fileName);
  // };

  // toExport = () => {
  //   const { dispatch, faceKeyList } = this.props;
  //   const { formValues } = this.state;
  //   const params = {
  //     // current: pagination.current,
  //     // pageSize: pagination.pageSize,
  //     forExport: true,
  //     faceName: formValues.faceName,
  //     deviceRegion: formValues.deviceRegion,
  //   };
  //   if (formValues.date) {
  //     params.begin = moment(formValues.date[0]).format('YYYY-MM-DD');
  //     params.end = moment(formValues.date[1]).format('YYYY-MM-DD');
  //   } else {
  //     params.begin = begin;
  //     params.end = end;
  //   }
  //   params.profileQuery = {};
  //   // eslint-disable-next-line no-unused-expressions
  //   faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
  //     if (item.reportQuery) {
  //       params.profileQuery[item.key] = formValues[item.key];
  //     }
  //   });
  //   dispatch({
  //     type: 'report/fetchNoPage',
  //     payload: {
  //       ...params,
  //     },
  //   }).then(res => {
  //     if (res && res.res > 0 && res.data) {
  //       this.handleExport(res.data);
  //     }
  //   });
  // };

  // renderDeviceOption = () => {
  //   const { deviceList } = this.props;
  //   if (deviceList.length > 0) {
  //     // eslint-disable-next-line no-underscore-dangle
  //     return deviceList.map(item => <Option value={item._id} key={`option_${item._id}`}>{item.name}</Option>);
  //   }
  //   return null;
  // };

  // toggleForm = () => {
  //   const { expandForm } = this.state;
  //   this.setState({
  //     expandForm: !expandForm,
  //   });
  // };

  // onChangeDate = date => {
  //   this.setState({ startDate: date && date[0] })
  // };

  // disabledDate = current => {
  //   const { startDate } = this.state;
  //   if (startDate) {
  //     const endDate = moment(startDate).add(1, 'months');
  //     return current && current > endDate;
  //   }
  //   return null;
  // };

  // initialDate = () => [moment().subtract(day - 1, 'days'), moment()];

  // renderSimpleForm = hasExpand => {
  //   const { form, attendListLoading } = this.props;
  //   const { getFieldDecorator } = form;
  //   return (
  //     <Form layout="inline">
  //       <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
  //         <Col md={6} sm={24}>
  //           <FormItem label={formatMessage({ id: 'oal.common.fullName' })}>
  //             {getFieldDecorator('faceName')(
  //               <Input placeholder={formatMessage({ id: 'oal.common.pleaseEnter' })} />,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={10} sm={24}>
  //           <FormItem label={formatMessage({ id: 'oal.work.attendanceDevice' })}>
  //             {getFieldDecorator('deviceRegion')(
  //               <Select
  //                 mode="multiple"
  //                 placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
  //                 style={{
  //                   width: '100%',
  //                 }}
  //                 allowClear
  //               >
  //                 {this.renderDeviceOption()}
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label={formatMessage({ id: 'oal.common.time' })}>
  //             {getFieldDecorator('date', {
  //               initialValue: this.initialDate(),
  //             })(
  //               <RangePicker
  //                 onCalendarChange={this.onChangeDate}
  //                 disabledDate={this.disabledDate}
  //               />,
  //             )}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <div style={{ overflow: 'hidden' }}>
  //         <div style={{ float: 'left', marginBottom: 24 }}>
  //           <Button type="primary" onClick={() => this.toExport()}>
  //             <FormattedMessage id="oal.common.export" />
  //           </Button>
  //         </div>
  //         <div style={{ float: 'right', marginBottom: 24 }}>
  //           <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={attendListLoading}>
  //             <FormattedMessage id="oal.common.query" />
  //           </Button>
  //           <Button
  //             style={{ marginLeft: 8 }}
  //             onClick={this.handleFormReset}
  //           >
  //             <FormattedMessage id="oal.common.reset" />
  //           </Button>
  //           {
  //             hasExpand ?
  //               <a
  //                 style={{ marginLeft: 8 }}
  //                 onClick={this.toggleForm}
  //               >
  //                 <FormattedMessage id="oal.common.expand" /> <Icon type="down" />
  //               </a>
  //               :
  //               null
  //           }
  //         </div>
  //       </div>
  //     </Form>
  //   );
  // };

  // renderAdvancedForm = () => {
  //   const { form, attendListLoading, faceKeyList } = this.props;
  //   const { getFieldDecorator } = form;
  //   return (
  //     <Form layout="inline">
  //       <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
  //         <Col md={6} sm={24}>
  //           <FormItem label={formatMessage({ id: 'oal.common.fullName' })}>
  //             {getFieldDecorator('faceName')(
  //               <Input placeholder={formatMessage({ id: 'oal.common.pleaseEnter' })} />,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={10} sm={24}>
  //           <FormItem label={formatMessage({ id: 'oal.work.attendanceDevice' })}>
  //             {getFieldDecorator('deviceRegion')(
  //               <Select
  //                 mode="multiple"
  //                 placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
  //                 style={{
  //                   width: '100%',
  //                 }}
  //                 allowClear
  //               >
  //                 {this.renderDeviceOption()}
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label={formatMessage({ id: 'oal.common.time' })}>
  //             {getFieldDecorator('date', {
  //               initialValue: this.initialDate(),
  //             })(
  //               <RangePicker
  //                 onCalendarChange={this.onChangeDate}
  //                 disabledDate={this.disabledDate}
  //               />,
  //             )}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
  //         {faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
  //           const type = item.componentInfo && item.componentInfo.type; // 文本框1，下拉框2
  //           const options = item.componentInfo && item.componentInfo.data; // 下拉选项value，text的对象数组
  //           if (item.reportQuery) {
  //             return (
  //               <Col md={8} sm={24} key={`col_${item.key}`}>
  //                 <FormItem label={item.name}>
  //                   {getFieldDecorator(item.key)(
  //                     type === 1 ?
  //                       <Input placeholder={formatMessage({ id: 'oal.common.pleaseEnter' })} />
  //                       :
  //                       <Select
  //                         placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
  //                         style={{
  //                           width: '100%',
  //                         }}
  //                       >
  //                         {options.length > 0 && options.map(option => (
  //                           <Option value={option.value} key={`option_${option.value}`}>{option.text}</Option>
  //                         ))}
  //                       </Select>,
  //                   )}
  //                 </FormItem>
  //               </Col>
  //             );
  //           }
  //           return null
  //         })}
  //       </Row>
  //       <div style={{ overflow: 'hidden' }}>
  //         <div style={{ float: 'left', marginBottom: 24 }}>
  //           <Button type="primary" onClick={() => this.toExport()}>
  //             <FormattedMessage id="oal.common.export" />
  //           </Button>
  //         </div>
  //         <div style={{ float: 'right', marginBottom: 24 }}>
  //           <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={attendListLoading}>
  //             <FormattedMessage id="oal.common.query" />
  //           </Button>
  //           <Button
  //             style={{ marginLeft: 8 }}
  //             onClick={this.handleFormReset}
  //           >
  //             <FormattedMessage id="oal.common.reset" />
  //           </Button>
  //           <a
  //             style={{ marginLeft: 8 }}
  //             onClick={this.toggleForm}
  //           >
  //             <FormattedMessage id="oal.common.collapse" /> <Icon type="up" />
  //           </a>
  //         </div>
  //       </div>
  //     </Form>
  //   );
  // };

  // renderForm = () => {
  //   const { expandForm } = this.state;
  //   const { faceKeyList } = this.props;
  //   let hasExpand = false; // 人脸属性列表里面是否有reportQuery为true的属性
  //   const index = faceKeyList.findIndex(item => item && item.reportQuery);
  //   // console.log('index=====>', index);
  //   if (index > -1) {
  //     hasExpand = true;
  //   }
  //   return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm(hasExpand);
  // };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch, faceKeyList } = this.props;
    const { formValues } = this.state;
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      faceName: formValues.faceName,
      deviceRegion: formValues.deviceRegion,
    };
    if (formValues.date) {
      params.begin = moment(formValues.date[0]).format('YYYY-MM-DD');
      params.end = moment(formValues.date[1]).format('YYYY-MM-DD');
    } else {
      params.begin = begin;
      params.end = end;
    }
    params.profileQuery = {};
    // eslint-disable-next-line no-unused-expressions
    faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
      if (item.reportQuery) {
        params.profileQuery[item.key] = formValues[item.key];
      }
    });
    dispatch({
      type: 'report/fetch',
      payload: {
        ...params,
      },
    });
  };

  attend_showTotal = (total, range) => (formatMessage({
    id: 'oal.work-rule.currentToTotal',
  }, {
    total,
  }));

  openDelModal = record => {
    this.setState({ delVisible: true, selectedBean: record });
  };

  closeDelModal = () => {
    this.setState({ delVisible: false, selectedBean: {} });
  };

  deleteRule = (bean, isDeleteRecord) => {
    const { dispatch } = this.props;
    // 8126TODO 需对接
    dispatch({
      type: 'report/deleteRule',
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        ruleId: bean._id,
        isDeleteRecord,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        this.closeDelModal();
        this.loadAttendList();
      }
    });
  };

  openRelateModal = record => {
    this.setState({ relateVisible: true, selectedBean: record });
  };

  closeRelateModal = () => {
    this.setState({ relateVisible: false, selectedBean: {} });
  };

  ruleRelateDevice = (bean, deviceId) => {
    const { dispatch } = this.props;
    // 8126TODO 需对接
    dispatch({
      type: 'report/ruleRelateDevice',
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        ruleId: bean._id,
        deviceId,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.work-rule.relateSuccessfully' }));
        this.closeRelateModal();
        this.loadAttendList();
      }
    });
  };

  render() {
    const {
      attendList,
      attendListLoading,
      faceKeyList,
      perAttendList,
      perAttendListLoading,
      deviceList,
    } = this.props;
    const {
      selectedRows,
      // detailVisible, 
      selectedBean,
      delVisible,
      relateVisible,
    } = this.state;
    attendList && attendList.pagination && (attendList.pagination.showTotal = this.attend_showTotal);
    return (
      <PageHeaderWrapper title=" " className={styles.myPageHeaderWrapper}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div style={{ textAlign: 'right', marginBottom: '20px', }}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => router.push('/workAttendance/rule/add')}
              >
                <FormattedMessage id="oal.work-rule.addRule" />
              </Button>
            </div>
            <StandardTable
              // eslint-disable-next-line no-underscore-dangle
              rowKey={record => `${record._id && record._id.faceId}_${Math.random()}`}
              needRowSelection={false}
              selectedRows={selectedRows}
              loading={attendListLoading}
              data={attendList}
              columns={this.columns()}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <RuleDelModal
          visible={delVisible}
          bean={selectedBean}
          handleCancel={this.closeDelModal}
          handleSubmit={this.deleteRule}
        />
        <RuleRelateDeviceModal
          visible={relateVisible}
          bean={{ selectedBean, deviceList }}
          handleCancel={this.closeRelateModal}
          handleSubmit={this.ruleRelateDevice}
        />
        {/* <DetailDrawer
          visible={detailVisible}
          selectedBean={selectedBean}
          faceKeyList={faceKeyList}
          data={perAttendList}
          loading={perAttendListLoading}
          onClose={this.closeDetailModal}
        /> */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AttendanceList);
