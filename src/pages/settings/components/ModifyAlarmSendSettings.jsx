import { Modal, Form, Input, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
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
const ModifyAlarmSendSettings = props => {
  const { form, visible, currentUser, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;
  // const [showVerify, setShowVerify] = useState(false);

  // useEffect(() => {
  //   if (visible === true) {
  //     setShowVerify(currentUser && currentUser.alarmSet && currentUser.alarmSet.verify === '1' || false);
  //   }
  // }, [visible]);

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = {
        ...fieldsValue,
        isSsl: fieldsValue.isSsl ? '1' : '0',
      };
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
      title={formatMessage({ id: 'oal.settings.sendSettings' })}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.settings.sendMail' })}>
          {getFieldDecorator('username', {
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
            initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.username || '',
          })(<Input placeholder={formatMessage({ id: 'oal.settings.sendMail' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.passwordOrCode' })}>
          {getFieldDecorator('password', {
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
                validator: checkIllegalCharacter,
              },
            ],
            initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.password || '',
          })(<Input.Password placeholder={formatMessage({ id: 'oal.settings.passwordOrCode' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.SMTPServer' })}>
          {getFieldDecorator('smtpServer', {
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
                pattern: /.+[.].+/,
                message: formatMessage({ id: 'oal.device.incorrectFormat' }),
              },
              {
                validator: checkIllegalCharacter,
              },
            ],
            initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.smtpServer || '',
          })(<Input placeholder={formatMessage({ id: 'oal.settings.SMTPServer' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.port' })}>
          {getFieldDecorator('port', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                max: 3,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '3' }),
              },
              {
                pattern: /^[\d]{1,3}$/,
                message: formatMessage({ id: 'oal.device.incorrectFormat' }),
              },
            ],
            initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.port || '',
          })(<Input placeholder={formatMessage({ id: 'oal.settings.port' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.encrypt' })}>
          {getFieldDecorator('isSsl', {
            valuePropName: 'checked',
            initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.isSsl === '0' ? false : true,
          })(<Checkbox>SSL</Checkbox>)}
        </Form.Item>
        {/* <Form.Item label={formatMessage({ id: 'oal.settings.username' })}>
          {getFieldDecorator('username', {
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
                validator: checkIllegalCharacter,
              },
            ],
            initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.username || '',
          })(<Input placeholder={formatMessage({ id: 'oal.settings.username' })} />)}
        </Form.Item> */}

      </Form>
    </Modal>
  );
};
const WrappedModifyAlarmSendSettings = Form.create({ name: 'modifyAlarmSendSettings' })(ModifyAlarmSendSettings);
export default WrappedModifyAlarmSendSettings;
