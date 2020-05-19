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

const Hours = Array.from(Array(24), (v, k) => k);
const Minutes = Array.from(Array(60), (v, k) => k);
// const Seconds = Array.from(Array(60), (v, k) => k);

@connect(({ workAttendanceRuleAdd, loading }) => ({
  workAttendanceRuleAdd,
  addLoading: loading.effects['workAttendanceRuleAdd/add'],
}))
class WorkAttendanceRuleAdd extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    // formValues: {},
  };

  componentDidMount() {

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

          dispatch({
            type: 'workAttendanceRuleAdd/add',
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

  checkIllegalCharacter = (rule, value, callback) => {
    const errReg = /[<>|*?/:\s]/;
    if (value && errReg.test(value)) {
      callback(formatMessage({ id: 'oal.common.illegalCharacterTips' }));
    }
    callback();
  };

  // 开始考勤时间限制-hour
  disAttendanceStartHouse = k => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    let eH = -1;
    let eM = -1;
    let oM = attendanceStartTime && attendanceStartTime.minute() || 0;
    let startSliceIndex = 0;
    let endSliceIndex = 24;

    if (startTime) {
      eH = startTime.hour();
      eM = startTime.minute();
    } else if (endTime) {
      eH = endTime.hour();
      eM = endTime.minute();
    } else if (attendanceEndTime) {
      eH = attendanceEndTime.hour();
      eM = attendanceEndTime.minute();
    }

    if (eH > -1 && eM > -1) {
      endSliceIndex = oM < eM ? eH + 1 : eH;
    }

    return [...Hours.slice(0, startSliceIndex), ...Hours.slice(endSliceIndex, 24)];
  };

  // 开始考勤时间限制-minute
  disAttendanceStartMinute = (k, h) => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    // let sM = -1;
    let eM = -1;
    let startSliceIndex = 0;
    let endSliceIndex = 60;

    if (startTime) {
      if (h == startTime.hour()) {
        eM = startTime.minute();
      } else if (h > startTime.hour()) {
        eM = startSliceIndex;
      }
    } else if (endTime) {
      if (h == endTime.hour()) {
        eM = endTime.minute();
      } else if (h > endTime.hour()) {
        eM = startSliceIndex;
      }
    } else if (attendanceEndTime) {
      if (h == attendanceEndTime.hour()) {
        eM = attendanceEndTime.minute();
      } else if (h > attendanceEndTime.hour()) {
        eM = startSliceIndex;
      }
    }

    if (eM > -1) {
      endSliceIndex = eM;
    }

    return [...Minutes.slice(0, startSliceIndex), ...Minutes.slice(endSliceIndex, 60)];
  };

  // 上班时间限制-hour
  disStartHouse = k => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    let sH = -1;
    let sM = -1;
    let oM = startTime && startTime.minute() || 0;
    let eH = -1;
    let eM = -1;
    let startSliceIndex = 0;
    let endSliceIndex = 24;

    if (attendanceStartTime) {
      sH = attendanceStartTime.hour();
      sM = attendanceStartTime.minute();
    }

    if (sH > -1 && sM > -1) {
      startSliceIndex = oM > sM ? sH : sH + 1;
    }

    if (endTime) {
      eH = endTime.hour();
      eM = endTime.minute();
    } else if (attendanceEndTime) {
      eH = attendanceEndTime.hour();
      eM = attendanceEndTime.minute();
    }

    if (eH > -1 && eM > -1) {
      endSliceIndex = oM < eM ? eH + 1 : eH;
    }

    return [...Hours.slice(0, startSliceIndex), ...Hours.slice(endSliceIndex, 24)];
  };

  // 上班时间限制-minute
  disStartMinute = (k, h) => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    let sM = -1;
    let eM = -1;
    let startSliceIndex = 0;
    let endSliceIndex = 60;

    if (attendanceStartTime) {
      if (h == attendanceStartTime.hour()) {
        sM = attendanceStartTime.minute();
      } else if (h < attendanceStartTime.hour()) {
        sM = endSliceIndex;
      }
    }

    if (sM > -1) {
      startSliceIndex = sM + 1;
    }

    if (endTime) {
      if (h == endTime.hour()) {
        eM = endTime.minute();
      } else if (h > endTime.hour()) {
        eM = startSliceIndex;
      }
    } else if (attendanceEndTime) {
      if (h == attendanceEndTime.hour()) {
        eM = attendanceEndTime.minute();
      } else if (h > attendanceEndTime.hour()) {
        eM = startSliceIndex;
      }
    }

    if (eM > -1) {
      endSliceIndex = eM;
    }

    return [...Minutes.slice(0, startSliceIndex), ...Minutes.slice(endSliceIndex, 60)];
  };

  // 下班时间限制-hour
  disEndHouse = k => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    let sH = -1;
    let sM = -1;
    let oM = endTime && endTime.minute() || 0;
    let eH = -1;
    let eM = -1;
    let startSliceIndex = 0;
    let endSliceIndex = 24;

    if (startTime) {
      sH = startTime.hour();
      sM = startTime.minute();
    } else if (attendanceStartTime) {
      sH = attendanceStartTime.hour();
      sM = attendanceStartTime.minute();
    }

    if (sH > -1 && sM > -1) {
      startSliceIndex = oM > sM ? sH : sH + 1;
    }

    if (attendanceEndTime) {
      eH = attendanceEndTime.hour();
      eM = attendanceEndTime.minute();
    }

    if (eH > -1 && eM > -1) {
      endSliceIndex = oM < eM ? eH + 1 : eH;
    }

    return [...Hours.slice(0, startSliceIndex), ...Hours.slice(endSliceIndex, 24)];
  };

  // 下班时间限制-minute
  disEndMinute = (k, h) => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    let sM = -1;
    let eM = -1;
    let startSliceIndex = 0;
    let endSliceIndex = 60;

    if (startTime) {
      if (h == startTime.hour()) {
        sM = startTime.minute();
      } else if (h < startTime.hour()) {
        sM = endSliceIndex;
      }
    } else if (attendanceStartTime) {
      if (h == attendanceStartTime.hour()) {
        sM = attendanceStartTime.minute();
      } else if (h < attendanceStartTime.hour()) {
        sM = endSliceIndex;
      }
    }

    if (sM > -1) {
      startSliceIndex = sM + 1;
    }

    if (attendanceEndTime) {
      if (h == attendanceEndTime.hour()) {
        eM = attendanceEndTime.minute();
      } else if (h > attendanceEndTime.hour()) {
        eM = startSliceIndex;
      }
    }

    if (eM > -1) {
      endSliceIndex = eM;
    }

    return [...Minutes.slice(0, startSliceIndex), ...Minutes.slice(endSliceIndex, 60)];
  };

  // 结束考勤时间限制-hour
  disAttendanceEndHouse = k => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    let sH = -1;
    let sM = -1;
    let oM = attendanceEndTime && attendanceEndTime.minute() || 0;
    let eH = -1;
    let eM = -1;
    let startSliceIndex = 0;
    let endSliceIndex = 24;

    if (endTime) {
      sH = endTime.hour();
      sM = endTime.minute();
    } else if (startTime) {
      sH = startTime.hour();
      sM = startTime.minute();
    } else if (attendanceStartTime) {
      sH = attendanceStartTime.hour();
      sM = attendanceStartTime.minute();
    }

    if (sH > -1 && sM > -1) {
      startSliceIndex = oM > sM ? sH : sH + 1;
    }

    return [...Hours.slice(0, startSliceIndex), ...Hours.slice(endSliceIndex, 24)];
  };

  // 结束考勤时间限制-minute
  disAttendanceEndMinute = (k, h) => {
    const { getFieldValue } = this.props.form;
    const attendanceStartTime = getFieldValue(`times[${k + '-1'}]`);
    const startTime = getFieldValue(`times[${k + '-0'}]`);
    const endTime = getFieldValue(`times[${k + '-2'}]`);
    const attendanceEndTime = getFieldValue(`times[${k + '-3'}]`);
    let sM = -1;
    // let eM = -1;
    let startSliceIndex = 0;
    let endSliceIndex = 60;

    if (endTime) {
      if (h == endTime.hour()) {
        sM = endTime.minute();
      } else if (h < endTime.hour()) {
        sM = endSliceIndex;
      }
    } else if (startTime) {
      if (h == startTime.hour()) {
        sM = startTime.minute();
      } else if (h < startTime.hour()) {
        sM = endSliceIndex;
      }
    } else if (attendanceStartTime) {
      if (h == attendanceStartTime.hour()) {
        sM = attendanceStartTime.minute();
      } else if (h < attendanceStartTime.hour()) {
        sM = endSliceIndex;
      }
    }

    if (sM > -1) {
      startSliceIndex = sM + 1;
    }

    return [...Minutes.slice(0, startSliceIndex), ...Minutes.slice(endSliceIndex, 60)];
  };

  render() {
    const {
      addLoading,
      form: {
        getFieldDecorator,
        getFieldValue,
      }
    } = this.props;
    getFieldDecorator('keys', { initialValue: [0] });
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
          {/* k-0 上班时间 */}
          <Form.Item
            className={styles.timeItemLineLeft}
            label={formatMessage({ id: 'oal.work-rule.workStartTime' })}
            key={`${k + '-0'}`}
          >
            {getFieldDecorator(`times[${k + '-0'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.common.pleaseSelect' })
                },
                // {
                //   validator: this.checkWorkStartTime,
                // },
              ],
            })(<TimePicker
              format={'HH:mm'}
              disabledHours={() => this.disStartHouse(k, null)}
              disabledMinutes={h => this.disStartMinute(k, h)}
            />)}
          </Form.Item>

          {/* k-1 开始考勤时间 */}
          <Form.Item
            className={styles.timeItemLineRight}
            label={formatMessage({ id: 'oal.work-rule.attendanceStartTime' })}
            key={`${k + '-1'}`}
          >
            {getFieldDecorator(`times[${k + '-1'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.common.pleaseSelect' })
                },
                // {
                //   validator: this.checkAttendanceStartTime,
                // },
              ],
            })(<TimePicker
              format={'HH:mm'}
              disabledHours={() => this.disAttendanceStartHouse(k, null)}
              disabledMinutes={h => this.disAttendanceStartMinute(k, h)}
            />)}
          </Form.Item>
        </div>

        <div className={styles.timeItemLine}>
          {/* k-2 下班时间 */}
          <Form.Item
            className={styles.timeItemLineLeft}
            label={formatMessage({ id: 'oal.work-rule.workEndTime' })}
            key={`${k + '-2'}`}
          >
            {getFieldDecorator(`times[${k + '-2'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.common.pleaseSelect' })
                },
                // {
                //   validator: this.checkWorkEndTime,
                // },
              ],
            })(<TimePicker
              format={'HH:mm'}
              disabledHours={() => this.disEndHouse(k, null)}
              disabledMinutes={h => this.disEndMinute(k, h)}
            />)}
          </Form.Item>

          {/* k-3 结束考勤时间 */}
          <Form.Item
            className={styles.timeItemLineRight}
            label={formatMessage({ id: 'oal.work-rule.attendanceEndTime' })}
            key={`${k + '-3'}`}
          >
            {getFieldDecorator(`times[${k + '-3'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.common.pleaseSelect' })
                },
                // {
                //   validator: this.checkAttendanceEndTime,
                // },
              ],
            })(<TimePicker
              format={'HH:mm'}
              disabledHours={() => this.disAttendanceEndHouse(k, null)}
              disabledMinutes={h => this.disAttendanceEndMinute(k, h)}
            />)}
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
                        message: formatMessage({ id: 'oal.common.pleaseEnter' }),
                      },
                      {
                        max: 20,
                        message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
                      },
                      {
                        validator: this.checkIllegalCharacter,
                      },
                    ],
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
                <Button type="primary" htmlType="submit" loading={addLoading}>
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

export default Form.create()(WorkAttendanceRuleAdd);
