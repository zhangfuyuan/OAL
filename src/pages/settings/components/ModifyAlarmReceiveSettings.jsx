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
const ModifyAlarmReceiveSettings = props => {
  const { form, visible, currentUser, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = fieldsValue;
      if (currentUser && currentUser.org) params.orgId = currentUser.org._id;
      handleSubmit(params);
    });
  };

  const checkIllegalCharacter = (rule, value, callback) => {
    const errReg = /[<>|*?/:\s]/;
    if (value && errReg.test(value)) {
      callback(formatMessage({ id: 'oal.common.illegalCharacterTips' }));
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.settings.receiveSettings' })}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.settings.receiveMail' })}>
          {getFieldDecorator('receiveMail', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                max: 254,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '254' }),
              },
              {
                type: 'email',
                message: formatMessage({ id: 'oal.device.incorrectFormat' }),
              },
              {
                validator: checkIllegalCharacter,
              },
            ],
            initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.receiveMail || '',
          })(<Input placeholder={formatMessage({ id: 'oal.settings.receiveMail' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedModifyAlarmReceiveSettings = Form.create({ name: 'modifyAlarmReceiveSettings' })(ModifyAlarmReceiveSettings);
export default WrappedModifyAlarmReceiveSettings;
