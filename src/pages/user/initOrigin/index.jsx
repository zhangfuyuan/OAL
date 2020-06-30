import { Alert, Icon, Button, Spin, Form, Input, } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import { SYSTEM_PATH } from '@/utils/constants';

const FormItem = Form.Item;

@connect(({ global: { systemOrigin }, loading }) => ({
  systemOrigin,
  submitting: loading.effects['global/updateSystemOrigin'],
}))
class InitOrigin extends Component {

  UNSAFE_componentWillMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getSystemVersion',
    });
    dispatch({
      type: 'login/getOrgInfo',
      payload: localStorage.getItem(SYSTEM_PATH) || 'admin',
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'global/updateSystemOrigin',
        payload: {
          ip: fieldsValue.ip,
        },
      }).then(res => {
        if (res && res.res > 0) {
          router.push(`/user/${localStorage.getItem(SYSTEM_PATH) || 'admin'}/login`);
        } else {
          console.log(res);
        }
      }).catch(err => {
        console.log(err);
      });
    });
  };

  checkOrigin = (rule, value, callback) => {
    if (value && (value.indexOf('.') < 1 || !/^http(s)?:\/\//.test(value))) {
      callback(formatMessage({ id: 'oal.init.enterIpErrorTips' }));
    }
    callback();
  };

  render() {
    const { systemOrigin, form, submitting } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.init}>
        <h3 className={styles.initTitle}>
          <FormattedMessage id="menu.initOrigin" />
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('ip', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'oal.init.enterIpTips' }),
                },
                {
                  validator: this.checkOrigin,
                },
              ],
              initialValue: systemOrigin || window.location.origin,
            })(<Input size="large" prefix={<Icon type="global" className={styles.prefixIcon} />} id="ip" placeholder={formatMessage({ id: 'oal.init.enterIpTips' })} />)}
          </FormItem>
          <FormItem>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="oal.common.nextStep" />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(InitOrigin);
