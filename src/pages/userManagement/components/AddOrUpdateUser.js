import { Modal, Form, Input } from 'antd';
import React from 'react';
import { validateMobile } from '@/utils/utils';

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

  let title = '新增用户';
  if (userBean && userBean.name) {
    title = `修改用户(${userBean.name})`;
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
      callback('请输入正确的手机号');
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
        <Form.Item label="用户名">
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
              {
                pattern: /^[a-zA-Z]+$/,
                message: '只能输入字母',
              },
              {
                max: 50,
                message: '最大长度为50',
              },
            ],
            initialValue: userBean.name,
          })(<Input placeholder="用户名" />)}
        </Form.Item>
        <Form.Item label="昵称">
          {getFieldDecorator('nickName', {
            initialValue: userBean.nickName,
          })(<Input placeholder="昵称" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('mobile', {
            rules: [
              {
                validator: checkMobile,
              },
            ],
            initialValue: userBean.mobile,
          })(<Input placeholder="手机号" />)}
        </Form.Item>
        <Form.Item label="邮箱地址">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: '请输入正确的邮箱地址',
              },
            ],
            initialValue: userBean.email,
          })(<Input placeholder="邮箱地址" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedAddOrUpdateUser = Form.create({ name: 'addOrUpdate' })(AddOrUpdateUser);
export default WrappedAddOrUpdateUser;
