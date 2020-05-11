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
  List,
  Avatar,
  Modal,
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
import { temperatureC2F } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const initFormValues = {
  date: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
};
const peopleTypeMap = {
  '': 'oal.common.all',
  '0': 'oal.common.certifiedPeople',
  '1': 'oal.common.blacklist',
  '2': 'oal.common.visitor',
}

@connect(({ logQuery, loading }) => ({
  logQuery,
  deviceList: logQuery.deviceList,
  deviceListLoading: loading.effects['logQuery/getDeviceList'],
  logQueryList: logQuery.logQueryList,
  logQueryListLoading: loading.effects['logQuery/fetchLogQuery'],
}))
class logQuery extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    listSelectedBean: {},
    tableSelectedRows: [],
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
    tableSelectedBean: {},
    viewVisible: false,
  };

  ref_download = null;

  componentDidMount() {
    this.list_loadData();
  }

  componentWillUnmount() {
  }

  /************************************************* List *************************************************/

  list_loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'logQuery/getDeviceList',
      payload: {
        temperatureFlag: true,
      },
    }).then(res => {
      if (res && res.res > 0 && res.data.length > 0) {
        this.list_handleClickItem(null, res.data[0]);
      } else {
        console.log(res);
      }
    }).catch(err => {
      console.log(err);
    });
  };

  list_handleClickItem = (e, bean) => {
    this.setState({
      listSelectedBean: bean,
    }, () => {
      this.table_loadData();
    });
  };

  /************************************************* Table *************************************************/

  table_loadData = () => {
    const { dispatch } = this.props;
    const { tablePage, sortedInfo, formValues, listSelectedBean } = this.state;
    const { date = ['', ''], peopleType = '' } = formValues || {};
    const [startDate, endDate] = date;

    dispatch({
      type: 'logQuery/fetchLogQuery',
      payload: {
        ...tablePage,
        ...sortedInfo,
        ...formValues,
        deviceId: listSelectedBean._id,
        startDate,
        endDate,
        peopleType,
      },
    });
  };

  table_handleSelectRows = rows => {
    this.setState({
      tableSelectedRows: rows,
    });
  };

  table_columns = () => {
    const { listSelectedBean } = this.state;

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
        // sorter: (a, b) => a.name - b.name,
        // sortOrder: this.state.sortedInfo.columnKey === 'name' && this.state.sortedInfo.order,
      },
      {
        title: formatMessage({ id: 'oal.face.staffid' }),
        key: 'staffid',
        dataIndex: 'staffid',
        render: (text, record) => <span>{record.staffid || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.log-query.group' }),
        key: 'group',
        dataIndex: 'group',
        render: (text, record) => <span>{record.peopleType === '2' ? formatMessage({ id: 'oal.common.visitor' }) : (record.group && record.group.length > 0 && record.group[0].name || '-')}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.type' }),
        key: 'peopleType',
        dataIndex: 'peopleType',
        render: (text, record) => <span>{peopleTypeMap[record.peopleType] && formatMessage({ id: peopleTypeMap[record.peopleType] }) || '-'}</span>,
      },
      // {
      //   title: formatMessage({ id: 'oal.log-query.device' }),
      //   key: 'device',
      //   dataIndex: 'device',
      //   render: (text, record) => <span>{record.device && record.device.name || '-'}</span>,
      // },
      {
        title: formatMessage({ id: 'oal.log-query.animalHeat' }),
        key: 'animalHeat',
        dataIndex: 'animalHeat',
        sorter: (a, b) => a.animalHeat - b.animalHeat,
        sortOrder: this.state.sortedInfo.columnKey === 'animalHeat' && this.state.sortedInfo.order,
        render: (text, record) => <span>{record.animalHeat ? (listSelectedBean && listSelectedBean.temperatureUnit === '1' ? temperatureC2F(record.animalHeat) + '℉' : record.animalHeat + '℃') : '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.time' }),
        key: 'time',
        dataIndex: 'time',
        sorter: (a, b) => a.time - b.time,
        sortOrder: this.state.sortedInfo.columnKey === 'time' && this.state.sortedInfo.order,
        width: 150,
        render: (text, record) => <span>{moment(record.updateAt).format('YYYY-MM-DD HH:mm') || '2020-04-12 15:16'}</span>,
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
      const { date } = fieldsValue;
      this.setState({
        formValues: {
          ...fieldsValue,
          date: date[0] && date[1] && [date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD')] || [],
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
    const { form, logQueryListLoading, deviceListLoading } = this.props;
    const { getFieldDecorator } = form;
    const { formValues } = this.state;
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
          <Col xxl={6} xl={6} lg={6} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.type' })}>
              {getFieldDecorator('peopleType', {
                initialValue: '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                  style={{
                    width: '100%',
                  }}
                // onChange={this.handleTypeChange}
                >
                  <Option value=""><FormattedMessage id={peopleTypeMap['']} /></Option>
                  <Option value="0"><FormattedMessage id={peopleTypeMap['0']} /></Option>
                  {/* <Option value="1"><FormattedMessage id={peopleTypeMap['1']} /></Option> */}
                  <Option value="2"><FormattedMessage id={peopleTypeMap['2']} /></Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          {/* {
            formValues && formValues.peopleType === '0' ?
              (<Col xxl={6} xl={6} lg={8} md={8} sm={24}>
                <FormItem label={formatMessage({ id: 'oal.log-query.selectGroup' })}>
                  {getFieldDecorator('group')(<Input placeholder={formatMessage({ id: 'oal.log-query.pleaseSelectGroup' })} />)}
                </FormItem>
              </Col>) : ''
          } */}
          <Col xxl={6} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.fullName' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'oal.face.enterFullName' })} />)}
            </FormItem>
          </Col>
          <Col xxl={7} xl={8} lg={9} md={10} sm={24}>
            <FormItem label="">
              {getFieldDecorator('date', {
                initialValue: [moment(date[0], 'YYYY-MM-DD'), moment(date[1], 'YYYY-MM-DD')],
              })(<RangePicker
                ranges={{
                  [formatMessage({ id: 'oal.log-query.today' })]: [moment(), moment()],
                  [formatMessage({ id: 'oal.log-query.latestWeek' })]: [moment().subtract(1, 'weeks'), moment()],
                  [formatMessage({ id: 'oal.log-query.latestMonth' })]: [moment().subtract(1, 'months'), moment()],
                }}
                disabledDate={this.handleDisabledDate}
                allowClear={false}
              />)}
            </FormItem>
          </Col>
          <Col xxl={4} lg={6} md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={this.table_handleSearch} type="primary" htmlType="submit" loading={logQueryListLoading || deviceListLoading}>
                <FormattedMessage id="oal.face.search" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                loading={logQueryListLoading || deviceListLoading}
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

  handleDisabledDate = current => current && current >= moment().endOf('day');

  // handleTypeChange = value => {
  //   const { formValues } = this.state;

  //   this.setState({
  //     formValues: {
  //       ...formValues,
  //       peopleType: value,
  //     }
  //   })
  // };

  handleExport = () => {
    this.ref_download && this.ref_download.click();
    // const { dispatch } = this.props;
    // const { sortedInfo, formValues, listSelectedBean } = this.state;

    // // 8126TODO 需对接
    // dispatch({
    //   type: 'logQuery/export',
    //   payload: {
    //     ...sortedInfo,
    //     ...formValues,
    //     featureState: 'all',
    //     deviceId: listSelectedBean._id,
    //   },
    // }).then(res => {
    //   if (res && res.res > 0) {
    //     if (this.ref_download) {
    //       this.ref_download.href = res.data.length > 0 ? res.data : `http://lango-tech.com/XBH/lango19/data/users.zip`;
    //       this.ref_download.click();
    //     }
    //   } else {
    //     console.log(res);
    //   }
    // }).catch(err => {
    //   console.log(err);
    // });
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
      deviceList,
      deviceListLoading,
      logQueryList,
      logQueryListLoading,
    } = this.props;
    const {
      tableSelectedRows,
      listSelectedBean,
      tableSelectedBean,
      viewVisible,
      formValues,
    } = this.state;
    const { peopleType, name, date } = formValues;

    logQueryList && logQueryList.pagination && (logQueryList.pagination.showTotal = (total, range) => (formatMessage({
      id: 'oal.log-query.currentToTotal',
    }, {
      total,
    })));

    return (
      <PageHeaderWrapper title=" " className={styles.myPageHeaderWrapper} >
        <Card bordered={false}>
          <div className={styles.main} >
            <div className={styles.left}>
              {
                deviceListLoading ?
                  <Spin spinning={deviceListLoading} /> :
                  (<List
                    itemLayout="horizontal"
                    split={false}
                    dataSource={deviceList}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Icon type="tablet" theme={listSelectedBean._id === item._id ? "twoTone" : "outlined"} style={{ fontSize: '16px', }} />}
                          title={<a className={`oal-list-content ${listSelectedBean._id === item._id ? "active" : ""}`}>{item.name}</a>}
                          onClick={(e) => this.list_handleClickItem(e, item)}
                        />
                      </List.Item>
                    )}
                  />)
              }
            </div>

            <div className={styles.right}>
              <div className={styles.tableListForm}>{this.table_renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  type="primary"
                  loading={logQueryListLoading || deviceListLoading}
                  onClick={this.handleExport}
                >
                  <FormattedMessage id="oal.common.export" />
                </Button>
                <a ref={el => { this.ref_download = el }} href={`/guard-web/a/record/export?deviceId=${listSelectedBean && listSelectedBean._id || ''}&startDate=${date && date[0] || ''}&endDate=${date && date[1] || ''}&peopleType=${peopleType || ''}&faceName=${name || ''}`} />
              </div>
              <StandardTable
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                needRowSelection={false}
                selectedRows={tableSelectedRows}
                loading={logQueryListLoading || deviceListLoading}
                data={logQueryList}
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(logQuery);
