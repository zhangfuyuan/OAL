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
      title={formatMessage({ id: 'oal.settings.modifySysname' })}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.settings.sysname' })}>
          {getFieldDecorator('saasName', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.settings.enterSysname' }),
              },
            ],
            initialValue: currentUser && currentUser.org && currentUser.org.saasName,
          })(<Input placeholder={formatMessage({ id: 'oal.settings.sysname' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedModifySysName = Form.create({ name: 'modifySysName' })(ModifySysName);
export default WrappedModifySysName;
