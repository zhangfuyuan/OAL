import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Form,
  Divider,
  Input,
  Icon,
  TimePicker,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { findIndex } from 'lodash';
import moment from 'moment';
import styles from './style.less';
import { getPageQuery } from '@/utils/utils';

const FormItem = Form.Item;
let id = 1;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

@connect(({ workAttendanceRuleEdit, loading }) => ({
  workAttendanceRuleEdit,
  detailsLoading: loading.effects['workAttendanceRuleEdit/getDetails'],
  editLoading: loading.effects['workAttendanceRuleEdit/edit'],
}))
class Demo extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    formValues: {
      ruleId: getPageQuery().ruleId,
      ruleName: '',
      workAttendanceTimes: [],
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    // 8126TODO 需对接
    dispatch({
      type: 'workAttendanceRuleEdit/getDetails',
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        ruleId: formValues.ruleId,
      },
    }).then(res => {
      if (res && res.res > 0) {
        const { ruleName, workAttendanceTimes } = res.data;

        this.setState({
          formValues: {
            ruleName: ruleName || '-',
            workAttendanceTimes: workAttendanceTimes || [
              {
                "workStartTime": "00:00",
                "workEndTime": "00:00",
                "workAttendanceStartTime": "00:00",
                "workAttendanceEndTime": "00:00",
              },
            ],
          }
        });
      }
    });
  }

  componentWillUnmount() {

  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, ruleName, times } = values;
        let hasError = false;
        let workAttendanceTimes = [];

        workAttendanceTimes = keys.map((k, index) => {
          const workStartTime = times[`${k}-0`].format('HH:mm');
          const attendanceStartTime = times[`${k}-1`].format('HH:mm');
          const workEndTime = times[`${k}-2`].format('HH:mm');
          const attendanceEndTime = times[`${k}-3`].format('HH:mm');

          if (workStartTime > workEndTime) {
            message.error(formatMessage({ id: 'oal.work-rule.workShouldLater' }));
            hasError = true;
          } else if (workStartTime < attendanceStartTime) {
            message.error(formatMessage({ id: 'oal.work-rule.attendanceShouldEarlier' }));
            hasError = true;
          } else if (workEndTime > attendanceEndTime) {
            message.error(formatMessage({ id: 'oal.work-rule.attendanceShouldLater' }));
            hasError = true;
          }

          return {
            workStartTime,
            workEndTime,
            workAttendanceStartTime: attendanceStartTime,
            workAttendanceEndTime: attendanceEndTime,
          };
        });

        if (!hasError) {
          const { dispatch } = this.props;
          // 8126TODO 需对接
          dispatch({
            type: 'workAttendanceRuleEdit/edit',
            payload: {
              // eslint-disable-next-line no-underscore-dangle
              ruleName,
              workAttendanceTimes,
            },
          }).then(res => {
            if (res && res.res > 0) {
              message.success(formatMessage({ id: 'oal.common.saveSuccessfully' }));
              router.push('/workAttendance/rule');
            }
          });
        }
      }
    });
  };

  // checkWorkStartTime = (rule, value, callback) => {
  //   const { form } = this.props;
  //   const ruleField = rule.field;
  //   const keysIndex = ruleField.substring(ruleField.indexOf('[') + 1, ruleField.indexOf('-'));
  //   const workStartTime = value.format('HH:mm');
  //   const times = form.getFieldValue('times');
  //   const attendanceStartTime = times[`${keysIndex}-1`].format('HH:mm');

  //   if (workStartTime < attendanceStartTime) {
  //     callback(formatMessage({ id: 'oal.work-rule.attendanceShouldEarlier' }));
  //   }
  //   callback();
  // };

  // checkAttendanceStartTime = (rule, value, callback) => {
  //   const { form } = this.props;
  //   const ruleField = rule.field;
  //   const keysIndex = ruleField.substring(ruleField.indexOf('[') + 1, ruleField.indexOf('-'));
  //   const attendanceStartTime = value.format('HH:mm');
  //   const times = form.getFieldValue('times');
  //   const workStartTime = times[`${keysIndex}-0`].format('HH:mm');

  //   if (workStartTime < attendanceStartTime) {
  //     callback(formatMessage({ id: 'oal.work-rule.attendanceShouldEarlier' }));
  //   }
  //   callback();
  // };

  // checkWorkEndTime = (rule, value, callback) => {
  //   const { form } = this.props;
  //   const ruleField = rule.field;
  //   const keysIndex = ruleField.substring(ruleField.indexOf('[') + 1, ruleField.indexOf('-'));
  //   const workEndTime = value.format('HH:mm');
  //   const times = form.getFieldValue('times');
  //   const attendanceEndTime = times[`${keysIndex}-3`].format('HH:mm');

  //   if (workEndTime > attendanceEndTime) {
  //     callback(formatMessage({ id: 'oal.work-rule.attendanceShouldLater' }));
  //   }
  //   callback();
  // };

  // checkAttendanceEndTime = (rule, value, callback) => {
  //   const { form } = this.props;
  //   const ruleField = rule.field;
  //   const keysIndex = ruleField.substring(ruleField.indexOf('[') + 1, ruleField.indexOf('-'));
  //   const attendanceEndTime = value.format('HH:mm');
  //   const times = form.getFieldValue('times');
  //   const workEndTime = times[`${keysIndex}-2`].format('HH:mm');

  //   if (workEndTime > attendanceEndTime) {
  //     callback(formatMessage({ id: 'oal.work-rule.attendanceShouldLater' }));
  //   }
  //   callback();
  // };

  render() {
    const {
      detailsLoading,
      form: {
        getFieldDecorator,
        getFieldValue,
      }
    } = this.props;
    const { formValues: {
      ruleName,
      workAttendanceTimes,
    } } = this.state;
    getFieldDecorator('keys', { initialValue: workAttendanceTimes.map((item, index) => index) });
    const keys = getFieldValue('keys');
    const keysLen = keys.length;
    const formItems = keys.map((k, index) => (
      <div
        className={styles.timeItem}
        key={k}
      >
        <h3 className={styles.timeItemLine}>
          <FormattedMessage id="oal.work-rule.workTime" />
          {/* 暂时隐藏 "新增工作时段" */}
          {/* {
            index === 0 ?
              (keysLen < 3 ? <a onClick={this.add} style={{ fontWeight: 'bold', fontSize: '14px', }}><FormattedMessage id="oal.work-rule.newWorkTime" /></a> : '') :
              <Icon className="dynamic-delete-button" type="minus-circle-o"  style={{ fontSize: '18px', color: '#FF4D4F' }} onClick={() => this.remove(k)} />
          } */}
        </h3>

        <div className={styles.timeItemLine}>
          <Form.Item
            className={styles.timeItemLineLeft}
            label={formatMessage({ id: 'oal.work-rule.workStartTime' })}
            key={`${k + '-0'}`}
          >
            {getFieldDecorator(`times[${k + '-0'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterWorkStartTimeTips' })
                },
                // {
                //   validator: this.checkWorkStartTime,
                // },
              ],
              initialValue: moment(workAttendanceTimes[k].workStartTime, 'HH:mm'),
            })(<TimePicker format={'HH:mm'} />)}
          </Form.Item>

          <Form.Item
            className={styles.timeItemLineRight}
            label={formatMessage({ id: 'oal.work-rule.attendanceStartTime' })}
            key={`${k + '-1'}`}
          >
            {getFieldDecorator(`times[${k + '-1'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterWorkStartTimeTips' })
                },
                // {
                //   validator: this.checkAttendanceStartTime,
                // },
              ],
              initialValue: moment(workAttendanceTimes[k].workAttendanceStartTime, 'HH:mm'),
            })(<TimePicker format={'HH:mm'} />)}
          </Form.Item>
        </div>

        <div className={styles.timeItemLine}>
          <Form.Item
            className={styles.timeItemLineLeft}
            label={formatMessage({ id: 'oal.work-rule.workEndTime' })}
            key={`${k + '-2'}`}
          >
            {getFieldDecorator(`times[${k + '-2'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterAttendanceStartTimeTips' })
                },
                // {
                //   validator: this.checkWorkEndTime,
                // },
              ],
              initialValue: moment(workAttendanceTimes[k].workEndTime, 'HH:mm'),
            })(<TimePicker format={'HH:mm'} />)}
          </Form.Item>

          <Form.Item
            className={styles.timeItemLineRight}
            label={formatMessage({ id: 'oal.work-rule.attendanceEndTime' })}
            key={`${k + '-3'}`}
          >
            {getFieldDecorator(`times[${k + '-3'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterAttendanceEndTimeTips' })
                },
                // {
                //   validator: this.checkAttendanceEndTime,
                // },
              ],
              initialValue: moment(workAttendanceTimes[k].workAttendanceEndTime, 'HH:mm'),
            })(<TimePicker format={'HH:mm'} />)}
          </Form.Item>
        </div>
      </div>
    ));

    return (
      <PageHeaderWrapper title=" " className={styles.myPageHeaderWrapper} >
        <Card bordered={false}>
          <div className={styles.main}>
            <Form onSubmit={this.handleSubmit}>
              <div className={styles.info}>
                <h2><FormattedMessage id="oal.work-rule.basicInfo" /></h2>
                <Form.Item
                  {...formItemLayout}
                  label={formatMessage({ id: 'oal.work-rule.ruleName' })}
                >
                  {getFieldDecorator('ruleName', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: formatMessage({ id: 'oal.work-rule.enterRuleNameTips' }),
                      },
                    ],
                    initialValue: ruleName,
                  })(<Input placeholder={formatMessage({ id: 'oal.work-rule.enterRuleName' })} />)}
                </Form.Item>
              </div>

              <Divider />

              <div className={styles.times}>
                <h2><FormattedMessage id="oal.work-rule.attendanceTime" /></h2>
                {formItems}
              </div>

              <Divider />

              <Form.Item style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" loading={detailsLoading}>
                  <FormattedMessage id="oal.common.save" />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Demo);
