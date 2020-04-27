import { Modal, Form, Input, Radio, Button } from 'antd';
import React, { useState } from 'react';
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
  const [submitLoading, setSubmitLoading] = useState(false);

  let title = formatMessage({ id: 'oal.common.set' });

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      //   console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = fieldsValue;
      params.deviceId = bean._id;
      setSubmitLoading(true);
      handleSubmit(params, () => {
        form.resetFields();
        setSubmitLoading(false);
      });
    });
  };

  const checkSixNumber = (rule, value, callback) => {
    if (value && !/^[0-9]{1,6}$/.test(value)) {
      callback(formatMessage({ id: 'oal.device.enterDevicePaswTips2' }));
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      footer={[
        <Button key="submit" type="primary" loading={submitLoading} onClick={handleOk}>
          <FormattedMessage id="oal.common.save" />
        </Button>,
      ]}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.device.deviceName' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.device.enterDeviceNameTips' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
            ],
            initialValue: bean.name,
          })(<Input placeholder={formatMessage({ id: 'oal.device.deviceName' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.devicePasw' })}>
          {getFieldDecorator('pasw', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.device.enterDevicePaswTips' }),
              },
              {
                validator: checkSixNumber,
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'oal.device.devicePasw' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.temperatureDisplay' })}>
          {getFieldDecorator('temperatureDisplay', {
            initialValue: bean.temperatureDisplay || '0',
          })(
            <Radio.Group>
              <Radio value="0"><FormattedMessage id="oal.device.centigradeDegree" /></Radio>
              <Radio value="1"><FormattedMessage id="oal.device.fahrenheitDegree" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.recognitionMode' })}>
          {getFieldDecorator('recognitionMode', {
            initialValue: bean.recognitionMode || '0',
          })(
            <Radio.Group>
              <Radio value="0"><FormattedMessage id="oal.device.standardMode" /></Radio>
              <Radio value="1"><FormattedMessage id="oal.device.maskMode" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
      <p style={{ textAlign: 'center', color: '#999', }}><FormattedMessage id="oal.device.deviceSetTips" /></p>
    </Modal>
  );
};
const WrappedRenameDevice = Form.create({ name: 'rename' })(RenameModal);
export default WrappedRenameDevice;
