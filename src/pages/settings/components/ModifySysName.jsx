import { Modal, Form, Input } from 'antd';
import React from 'react';

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
const ModifySysName = props => {
  const { form, visible, currentUser, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = fieldsValue;
      handleSubmit(params);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="修改系统名称"
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label="系统名称">
          {getFieldDecorator('saasName', {
            rules: [
              {
                required: true,
                message: '请输入系统名称',
              },
            ],
            initialValue: currentUser && currentUser.org && currentUser.org.saasName,
          })(<Input placeholder="系统名称" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedModifySysName = Form.create({ name: 'modifySysName' })(ModifySysName);
export default WrappedModifySysName;
