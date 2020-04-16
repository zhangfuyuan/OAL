import { Modal, Form, Input } from 'antd';
import React from 'react';
import { validateMobile } from '@/utils/utils';
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
const AddOrUpdateUser = props => {
  const { form, userBean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  let title = formatMessage({ id: 'oal.user-manage.newUsers' });
  if (userBean && userBean.name) {
    title = `${formatMessage({ id: 'oal.user-manage.modifyUsers' })}(${userBean.name})`;
  }

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = fieldsValue;
      if (userBean) {
        // eslint-disable-next-line no-underscore-dangle
        params.id = userBean._id;
      }
      handleSubmit(params, () => {
        form.resetFields();
      });
    });
  };

  const checkMobile = (rule, value, callback) => {
    if (value && !validateMobile(value)) {
      callback(formatMessage({ id: 'oal.common.enterPhoneNumber' }));
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.common.username' })}>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.user-manage.enterUsername' }),
              },
              {
                pattern: /^[a-zA-Z]+$/,
                message: formatMessage({ id: 'oal.user-manage.enterUsernameError' }),
              },
              {
                max: 50,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '50' }),
              },
            ],
            initialValue: userBean.name,
          })(<Input placeholder={formatMessage({ id: 'oal.common.username' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.common.nickname' })}>
          {getFieldDecorator('nickName', {
            initialValue: userBean.nickName,
          })(<Input placeholder={formatMessage({ id: 'oal.common.nickname' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.common.phoneNumber' })}>
          {getFieldDecorator('mobile', {
            rules: [
              {
                validator: checkMobile,
              },
            ],
            initialValue: userBean.mobile,
          })(<Input placeholder={formatMessage({ id: 'oal.common.phoneNumber' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.common.emailAddress' })}>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: formatMessage({ id: 'oal.common.enterCorrectEmailAddress' }),
              },
            ],
            initialValue: userBean.email,
          })(<Input placeholder={formatMessage({ id: 'oal.common.emailAddress' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedAddOrUpdateUser = Form.create({ name: 'addOrUpdate' })(AddOrUpdateUser);
export default WrappedAddOrUpdateUser;
