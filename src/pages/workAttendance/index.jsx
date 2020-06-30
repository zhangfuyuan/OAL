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
// import DetailDrawer from './components/DetailDrawer';
import styles from './style.less';
// import { exportCSV } from '@/utils/utils';
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
  deviceList: report.deviceList,
  getDeviceListLoading: loading.effects['report/getDeviceList'],
  ruleRelateDeviceLoading: loading.effects['report/ruleRelateDevice'],
}))
class AttendanceList extends Component {
  state = {
    formValues: {},
    selectedRows: [],
    page: {
      current: 1,
      pageSize: 10,
    },
    selectedBean: {},
    delVisible: false,
    relateVisible: false,
  };

  componentDidMount() {
    this.loadAttendList();
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
        // begin,
        // end,
      },
    });
  };

  loadDeviceList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/getDeviceList',
      payload: {
        ruleFlag: true,
      },
    });
  }

  columns = () => {
    // const { faceKeyList } = this.props;
    const cl = [
      {
        title: formatMessage({ id: 'oal.work-rule.workRule' }),
        key: 'ruleName',
        dataIndex: 'ruleName',
        render: (_text, record) => (
          <span>
            {record && record.ruleName || '-'}
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
              record.workAttendanceTimes.map(item => `${item.workAttendanceStartTime} ~ ${item.workAttendanceEndTime}`).join('、') ||
              '-'
            }
          </span>
        ),
      },
      // {
      //   title: formatMessage({ id: 'oal.work.attendanceDevice' }),
      //   key: 'deviceName',
      //   dataIndex: 'deviceName',
      //   render: (_text, record) => (
      //     <span>
      //       {
      //         (record.device && record.device.length > 0 && record.device.map(item => item.name).join('、')) ||
      //         '-'
      //       }
      //     </span>
      //   ),
      // },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 250,
        render: (text, record) => (
          <Fragment>
            {/* <Link to={`/workAttendance/record?ruleId=${record && typeof (record._id) === 'string' && record._id || ''}`}><FormattedMessage id="oal.work-rule.record" /></Link>
            <Divider type="vertical" /> */}
            <Link to={`/workAttendance/rule/edit?ruleId=${record && typeof (record._id) === 'string' && record._id || ''}`}><FormattedMessage id="oal.common.edit" /></Link>
            <Divider type="vertical" />
            <a key="relate" onClick={() => this.openRelateModal(record)}><FormattedMessage id="oal.work-rule.relateDevice" /></a>
            <Divider type="vertical" />
            {/* <a key="delete" onClick={() => this.openDelModal(record)}><FormattedMessage id="oal.common.delete" /></a> */}
            {
              record.state === 1 ?
                <a key="disable" onClick={() => this.handleSetState(0, record)}><FormattedMessage id="oal.common.disable" /></a> :
                <a key="enable" onClick={() => this.handleSetState(1, record)}><FormattedMessage id="oal.common.enable" /></a>
            }
          </Fragment>
        ),
      },
    ];

    return cl;
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
      }
    }, () => {
      this.loadAttendList();
    });
  };

  attend_showTotal = (total, range) => (formatMessage({
    id: 'oal.work-rule.currentToTotal',
  }, {
    total,
  }));

  handleSetState = (state, bean) => {
    const { dispatch } = this.props;
    const _state = state;

    dispatch({
      type: 'report/setState',
      payload: {
        ruleId: bean._id,
        state: _state,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: _state === 1 ? 'oal.user-manage.beenEnabled' : 'oal.user-manage.beenDisabled' }));
        this.loadAttendList();
      }
    });
  };

  // openDelModal = record => {
  //   this.setState({ delVisible: true, selectedBean: record });
  // };

  // closeDelModal = () => {
  //   this.setState({ delVisible: false, selectedBean: {} });
  // };

  // deleteRule = (bean, isDeleteRecord) => {
  //   const { dispatch } = this.props;
  //   // TODO 需对接
  //   dispatch({
  //     type: 'report/deleteRule',
  //     payload: {
  //       // eslint-disable-next-line no-underscore-dangle
  //       ruleId: bean._id,
  //       isDeleteRecord,
  //     },
  //   }).then(res => {
  //     if (res && res.res > 0) {
  //       message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
  //       this.closeDelModal();
  //       this.loadAttendList();
  //     }
  //   });
  // };

  openRelateModal = record => {
    this.setState({ relateVisible: true, selectedBean: record });
  };

  closeRelateModal = () => {
    this.setState({ relateVisible: false, selectedBean: {} });
  };

  ruleRelateDevice = (bean, deviceId) => {
    const { dispatch } = this.props;

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
        this.loadDeviceList();
        this.loadAttendList();
      }
    });
  };

  render() {
    const {
      attendList,
      attendListLoading,
      getDeviceListLoading,
      deviceList,
      ruleRelateDeviceLoading,
    } = this.props;
    const {
      selectedRows,
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
            <div style={{ marginBottom: '20px', }}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => router.push('/workAttendance/rule/add')}
              >
                <FormattedMessage id="oal.face.add" />
              </Button>
            </div>
            <StandardTable
              // eslint-disable-next-line no-underscore-dangle
              rowKey={record => record._id}
              needRowSelection={false}
              selectedRows={selectedRows}
              loading={attendListLoading || getDeviceListLoading}
              data={attendList}
              columns={this.columns()}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {/* <RuleDelModal
          visible={delVisible}
          bean={selectedBean}
          handleCancel={this.closeDelModal}
          handleSubmit={this.deleteRule}
        /> */}
        <RuleRelateDeviceModal
          visible={relateVisible}
          bean={{ selectedBean, deviceList }}
          confirmLoading={ruleRelateDeviceLoading}
          handleCancel={this.closeRelateModal}
          handleSubmit={this.ruleRelateDevice}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AttendanceList);
