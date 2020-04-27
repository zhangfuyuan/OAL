import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
import { validateMobile } from '@/utils/utils';
import styles from './baseView.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const FormItem = Form.Item;

class BaseView extends Component {
  handlerSubmit = () => {
    const { form, toSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      toSubmit(fieldsValue);
    });
  };

  checkMobile = (rule, value, callback) => {
    if (value && !validateMobile(value)) {
      callback(formatMessage({ id: 'oal.common.enterPhoneNumber' }));
    }
    callback();
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
    } = this.props;
    // console.log('currentUser-------', currentUser);
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical">
            <FormItem
              label={formatMessage({ id: 'oal.common.nickname' })}
            >
              {getFieldDecorator('nickName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'oal.user-manage.enterNicknameTips' }),
                  },
                  {
                    max: 20,
                    message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
                  },
                ],
                initialValue: currentUser && currentUser.profile && currentUser.profile.nickName,
              })(<Input placeholder={formatMessage({ id: 'oal.common.nickname' })} />)}
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'oal.settings.organisation' })}
            >
              {getFieldDecorator('org', {
                initialValue: currentUser && currentUser.org && currentUser.org.saasName,
              })(<Input placeholder={formatMessage({ id: 'oal.settings.organisation' })} disabled/>)}
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'oal.settings.contactEmail' })}
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: formatMessage({ id: 'oal.settings.enterCorrectEmailAddress' }),
                  },
                ],
                initialValue: currentUser && currentUser.profile && currentUser.profile.email,
              })(
                <Input placeholder={formatMessage({ id: 'oal.settings.contactEmail' })} />,
              )}
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'oal.settings.contactNumber' })}
            >
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    validator: this.checkMobile,
                  },
                ],
                initialValue: currentUser && currentUser.mobile && currentUser.profile.mobile,
              })(
                <Input placeholder={formatMessage({ id: 'oal.settings.contactNumber' })} />,
              )}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage id="oal.common.save" />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
