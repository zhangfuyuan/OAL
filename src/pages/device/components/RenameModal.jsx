import { Modal, Form, Input } from 'antd';
import React from 'react';
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
const RenameModal = props => {
  const { form, bean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  let title = formatMessage({ id: 'oal.device.modifyDevice' });
  if (bean && bean.name) {
    title = `${formatMessage({ id: 'oal.device.modifyDevice' })}(${bean.name})`;
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
        <Form.Item label={formatMessage({ id: 'oal.device.deviceName' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.device.enterDeviceName' }),
              },
            ],
            initialValue: bean.name,
          })(<Input placeholder={formatMessage({ id: 'oal.device.deviceName' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedRenameDevice = Form.create({ name: 'rename' })(RenameModal);
export default WrappedRenameDevice;
