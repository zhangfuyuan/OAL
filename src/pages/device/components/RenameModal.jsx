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
const RenameModal = props => {
  const { form, bean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  let title = '修改设备';
  if (bean && bean.name) {
    title = `修改设备(${bean.name})`;
  }

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
    //   console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = fieldsValue;
      params.deviceId = bean._id;
      handleSubmit(params, () => {
        form.resetFields();
      });
    });
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
        <Form.Item label="设备名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入设备名称',
              },
            ],
            initialValue: bean.name,
          })(<Input placeholder="设备名称" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedRenameDevice = Form.create({ name: 'rename' })(RenameModal);
export default WrappedRenameDevice;
