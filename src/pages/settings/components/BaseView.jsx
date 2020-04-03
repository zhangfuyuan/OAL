import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
import { validateMobile } from '@/utils/utils';
import styles from './baseView.less';

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
      callback('请输入正确的手机号');
    }
    callback();
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
    } = this.props;
    console.log('currentUser-------', currentUser);
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical">
            <FormItem
              label="姓名"
            >
              {getFieldDecorator('nickName', {
                initialValue: currentUser && currentUser.profile && currentUser.profile.nickName,
              })(<Input placeholder="姓名" />)}
            </FormItem>
            <FormItem
              label="所属组织"
            >
              {getFieldDecorator('org', {
                initialValue: currentUser && currentUser.org && currentUser.org.saasName,
              })(<Input placeholder="所属组织" disabled/>)}
            </FormItem>
            <FormItem
              label="联系邮箱"
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '请填写正确格式的邮箱地址',
                  },
                ],
                initialValue: currentUser && currentUser.profile && currentUser.profile.email,
              })(
                <Input placeholder="联系邮箱" />,
              )}
            </FormItem>
            <FormItem
              label="联系电话"
            >
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    validator: this.checkMobile,
                  },
                ],
                initialValue: currentUser && currentUser.mobile && currentUser.profile.mobile,
              })(
                <Input placeholder="联系电话" />,
              )}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              保存
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
