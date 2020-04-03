import { Modal, Form, Input } from 'antd';
import React from 'react';
import { PSW_REG } from '@/utils/constants';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const ModifyPswModal = props => {
  const { form, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = fieldsValue;
      handleSubmit(params);
    });
  };

  const compareToNewPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('newpassword')) {
      callback('和新密码输入不一致');
    } else {
      callback();
    }
  };

  return (
    <Modal
      destroyOnClose
      title="修改密码"
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label="旧密码">
          {getFieldDecorator('oldpassword', {
            rules: [
              {
                required: true,
                message: '请输入旧密码',
              },
            ],
          })(<Input.Password placeholder="旧密码" />)}
        </Form.Item>
        <Form.Item label="新密码">
          {getFieldDecorator('newpassword', {
            rules: [
              {
                required: true,
                message: '请输入新密码',
              },
              {
                pattern: PSW_REG,
                message: '密码须包含字母、数字、特殊符号，长度不小于8位',
              },
            ],
          })(<Input.Password placeholder="新密码" />)}
        </Form.Item>
        <Form.Item label="确认密码">
          {getFieldDecorator('confirmpassword', {
            rules: [
              {
                required: true,
                message: '请输入确认密码',
              },
              {
                pattern: PSW_REG,
                message: '密码须包含字母、数字、特殊符号，长度不小于8位',
              },
              {
                validator: compareToNewPassword,
              },
            ],
          })(<Input.Password placeholder="确认密码" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedModifyPsw = Form.create({ name: 'modifyPsw' })(ModifyPswModal);
export default WrappedModifyPsw;
