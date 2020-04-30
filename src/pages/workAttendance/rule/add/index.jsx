import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Form,
  Divider,
  Input,
  Icon,
  TimePicker,
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

@connect(({ workAttendanceRuleAdd, loading }) => ({
  workAttendanceRuleAdd,
  addLoading: loading.effects['workAttendanceRuleAdd/add'],
}))
class Demo extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    formValues: {},
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
        // const { keys, ruleName, time } = values;
        console.log(8126, values);
      }
    });
  };

  render() {
    const {
      addLoading,
      form: {
        getFieldDecorator,
        getFieldValue,
      }
    } = this.props;
    getFieldDecorator('keys', { initialValue: [0] }); // 8126TODO edit
    const keys = getFieldValue('keys');
    const keysLen = keys.length;
    const formItems = keys.map((k, index) => (
      <div
        className={styles.timeItem}
        key={k}
      >
        <h3 className={styles.timeItemLine}>
          <FormattedMessage id="oal.work-rule.workTime" />
          {
            index === 0 ?
              (keysLen < 3 ? <a onClick={this.add} style={{ fontWeight: 'bold', fontSize: '14px', }}><FormattedMessage id="oal.work-rule.newWorkTime" /></a> : '') :
              <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k)} />
          }
        </h3>

        <div className={styles.timeItemLine}>
          <Form.Item
            className={styles.timeItemLineLeft}
            label={formatMessage({ id: 'oal.work-rule.workStartTime' })}
            key={`${k + '-0'}`}
          >
            {getFieldDecorator(`time[${k + '-0'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterWorkStartTimeTips' })
                }
              ],
              // initialValue: moment('12:08', 'HH:mm'), // 8126TODO edit
            })(<TimePicker format={'HH:mm'} />)}
          </Form.Item>

          <Form.Item
            className={styles.timeItemLineRight}
            label={formatMessage({ id: 'oal.work-rule.attendanceStartTime' })}
            key={`${k + '-1'}`}
          >
            {getFieldDecorator(`time[${k + '-1'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterWorkStartTimeTips' })
                }
              ],
            })(<TimePicker format={'HH:mm'} />)}
          </Form.Item>
        </div>

        <div className={styles.timeItemLine}>
          <Form.Item
            className={styles.timeItemLineLeft}
            label={formatMessage({ id: 'oal.work-rule.workEndTime' })}
            key={`${k + '-2'}`}
          >
            {getFieldDecorator(`time[${k + '-2'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterAttendanceStartTimeTips' })
                }
              ],
            })(<TimePicker format={'HH:mm'} />)}
          </Form.Item>

          <Form.Item
            className={styles.timeItemLineRight}
            label={formatMessage({ id: 'oal.work-rule.attendanceEndTime' })}
            key={`${k + '-3'}`}
          >
            {getFieldDecorator(`time[${k + '-3'}]`, {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.work-rule.enterAttendanceEndTimeTips' })
                }
              ],
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
                <Button type="primary" htmlType="submit">
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
