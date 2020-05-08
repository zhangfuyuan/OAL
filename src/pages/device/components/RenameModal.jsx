import { Modal, Form, Input, Radio, Button, Switch, Tooltip } from 'antd';
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
const RenameModal = props => {
  const { form, bean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [showWaitShutdownTime, setShowWaitShutdownTime] = useState(false);

  let title = formatMessage({ id: 'oal.common.set' });

  useEffect(() => {
    if (visible === true) {
      setShowAlarm((bean && !!bean.alarm) || false);
      setShowWaitShutdownTime((bean && bean.relayOperationMode === '2') || false)
    }
  }, [visible]);

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
      callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
    }
    callback();
  };

  const checkIllegalCharacter = (rule, value, callback) => {
    const errReg = /[<>|*?/:\s]/;
    if (value && errReg.test(value)) {
      callback(formatMessage({ id: 'oal.common.illegalCharacterTips' }));
    }
    callback();
  };

  const handleAlarmValueBlur = e => {
    const { value } = e.target;

    if (value) {
      form.setFieldsValue({
        alarmValue: `${value}${/((℃)|(℉))$/.test(value) ? '' : (form.getFieldValue('temperatureUnit') === '1' ? '℉' : '℃')}`,
      });
    }
  };

  const checkAlarmThresholdValue = (rule, value, callback) => {
    if (value) {
      if (/^[\d]{2,3}\.[\d]{1}$/.test(value.replace(/((℃)|(℉))$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 34 || _val > 120) {
          callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
        }
      } else {
        callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
      }
    }
    callback();
  };

  const checkWaitShutdownTime = (rule, value, callback) => {
    if (value) {
      if (/^[\d]{2,3}$/.test(value.replace(/s$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 10 || _val > 120) {
          callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
        }
      } else {
        callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
      }
    }
    callback();
  };

  const handleWaitShutdownTime = e => {
    const { value } = e.target;

    if (value) {
      form.setFieldsValue({
        alarmValue: `${value}${/s$/.test(value) ? '' : 's'}`,
      });
    }
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.device.deviceName' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
              {
                validator: checkIllegalCharacter,
              },
            ],
            initialValue: bean && bean.name || '',
          })(<Input placeholder={formatMessage({ id: 'oal.device.deviceName' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.devicePasw' })}>
          {getFieldDecorator('pwd', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                max: 6,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '6' }),
              },
              {
                validator: checkSixNumber,
              },
            ],
            initialValue: bean && bean.pwd || '',
          })(<Input placeholder={formatMessage({ id: 'oal.device.devicePaswPlaceholder' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.temperatureUnit' })}>
          {getFieldDecorator('temperatureUnit', {
            initialValue: bean && bean.temperatureUnit || '0',
          })(
            <Radio.Group>
              <Radio value="0"><FormattedMessage id="oal.device.centigradeDegree" /></Radio>
              <Radio value="1"><FormattedMessage id="oal.device.fahrenheitDegree" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.highTemperatureAlarm' })}>
          {getFieldDecorator('alarm', {
            valuePropName: 'checked',
            initialValue: (bean && !!bean.alarm) || false,
          })(<Switch onChange={checked => setShowAlarm(checked)} />)}
        </Form.Item>
        {
          showAlarm ?
            (<Form.Item label={formatMessage({ id: 'oal.device.alarmThresholdValue' })}>
              {getFieldDecorator('alarmValue', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'oal.common.pleaseEnter' }),
                  },
                  {
                    max: 6,
                    message: formatMessage({ id: 'oal.common.maxLength' }, { num: '6' }),
                  },
                  {
                    validator: checkAlarmThresholdValue,
                  },
                ],
                initialValue: bean && bean.alarmValue ? `${bean.alarmValue}${bean && bean.temperatureUnit === '1' ? '℉' : '℃'}` : '',
              })(<Input placeholder="34.0-120.0（℃/℉）" onBlur={handleAlarmValueBlur} />)}
            </Form.Item>) : ''
        }
        <Form.Item label={formatMessage({ id: 'oal.device.relayOperationMode' })}>
          {getFieldDecorator('relayOperationMode', {
            initialValue: bean && bean.relayOperationMode || '2',
          })(
            <Radio.Group onChange={e => setShowWaitShutdownTime(e.target.value === '2')} >
              <Radio value="2"><FormattedMessage id="oal.device.identifyControl" /></Radio>
              <Radio value="1"><FormattedMessage id="oal.device.normallyOpen" /></Radio>
              <Radio value="0"><FormattedMessage id="oal.device.normallyClose" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {
          showWaitShutdownTime ?
            (<Form.Item label={formatMessage({ id: 'oal.device.waitShutdownTime' })}>
              {getFieldDecorator('waitShutdownTime', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'oal.common.pleaseEnter' }),
                  },
                  {
                    validator: checkWaitShutdownTime,
                  },
                ],
                initialValue: bean && bean.waitShutdownTime ? `${bean.waitShutdownTime}s` : '',
              })(<Input placeholder="10-120（s）" onBlur={handleWaitShutdownTime} />)}
            </Form.Item>) : ''
        }
        <Form.Item label={formatMessage({ id: 'oal.device.recognitionMode' })}>
          {getFieldDecorator('recognitionMode', {
            initialValue: bean && bean.recognitionMode || '1',
          })(
            <Radio.Group>
              <Radio value="1"><FormattedMessage id="oal.device.attendanceMode" /></Radio>
              <Radio value="2">
                <FormattedMessage id="oal.device.maskMode" />&nbsp;
                <Tooltip title={formatMessage({ id: 'oal.device.maskModeTips' })}>
                  <Icon type="info-circle" />
                </Tooltip>
              </Radio>
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
