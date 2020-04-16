import { Modal, Form, Input } from 'antd';
import React from 'react';
import { PSW_REG } from '@/utils/constants';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

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
      callback(formatMessage({ id: 'oal.settings.differentFromNewPassword' }));
    } else {
      callback();
    }
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.settings.modifyPassword' })}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.settings.oldPassword' })}>
          {getFieldDecorator('oldpassword', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.settings.enterOldPassword' }),
              },
            ],
          })(<Input.Password placeholder={formatMessage({ id: 'oal.settings.oldPassword' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.newPassword' })}>
          {getFieldDecorator('newpassword', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'oal.common.enterNewPassword',
                }),
              },
              {
                pattern: PSW_REG,
                message: formatMessage({
                  id: 'oal.common.enterPasswordError',
                }),
              },
            ],
          })(<Input.Password placeholder={formatMessage({ id: 'oal.settings.newPassword' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.confirmPassword' })}>
          {getFieldDecorator('confirmpassword', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'oal.common.enterConfirmPassword',
                }),
              },
              {
                pattern: PSW_REG,
                message: formatMessage({
                  id: 'oal.common.enterPasswordError',
                }),
              },
              {
                validator: compareToNewPassword,
              },
            ],
          })(<Input.Password placeholder={formatMessage({ id: 'oal.settings.confirmPassword' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedModifyPsw = Form.create({ name: 'modifyPsw' })(ModifyPswModal);
export default WrappedModifyPsw;
