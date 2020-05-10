import { Modal, Form, Input, Radio, Button, Switch, Tooltip, Icon, } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { pswBase64Thrice, pswBase64ThriceRestore } from '@/utils/utils';

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
  const { getFieldDecorator, getFieldError } = form;
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
      const { pwd, alarmValue, waitShutdownTime } = fieldsValue;
      const params = {
        ...fieldsValue,
        pwd: pswBase64Thrice(pwd),
      };

      alarmValue && (params.alarmValue = alarmValue.replace(/((℃)|(℉))$/, ''));
      waitShutdownTime && (params.waitShutdownTime = waitShutdownTime.replace(/s$/, ''));
      params.deviceId = bean._id;
      handleSubmit(params, () => {
        form.resetFields();
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

  const handleTemperatureUnitChange = e => {
    const { value } = e.target;
    const alarmValue = form.getFieldValue('alarmValue');

    if (value && !checkAlarmValueIsError(alarmValue) && /((℃)|(℉))$/.test(alarmValue)) {
      form.setFieldsValue({
        alarmValue: `${alarmValue.replace(/((℃)|(℉))$/, '')}${value === '1' ? '℉' : '℃'}`,
      });
    }
  };

  const handleAlarmValueFocus = e => {
    const { value } = e.target;

    if (value && /((℃)|(℉))$/.test(value)) {
      form.setFieldsValue({
        alarmValue: value.replace(/((℃)|(℉))$/, ''),
      });
    }
  };

  const checkAlarmValueIsError = value => {
    let isError = false;

    if (value) {
      if (/^[\d]{2,3}\.[\d]{1}$/.test(value.replace(/((℃)|(℉))$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 34 || _val > 120) {
          isError = true;
        }
      } else {
        isError = true;
      }
    }

    return isError;
  }

  const handleAlarmValueBlur = e => {
    const { value } = e.target;

    if (value && !checkAlarmValueIsError(value)) {
      form.setFieldsValue({
        alarmValue: `${value.replace(/((℃)|(℉))$/, '')}${form.getFieldValue('temperatureUnit') === '1' ? '℉' : '℃'}`,
      });
    }
  };

  const checkAlarmValue = (rule, value, callback) => {
    if (value && checkAlarmValueIsError(value)) {
      callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
    }
    callback();
  };

  const checkWaitShutdownTimeIsError = value => {
    let isError = false;

    if (value) {
      if (/^[\d]{2,3}$/.test(value.replace(/s$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 10 || _val > 120) {
          isError = true;
        }
      } else {
        isError = true;
      }
    }

    return isError;
  };

  const checkWaitShutdownTime = (rule, value, callback) => {
    if (value && checkWaitShutdownTimeIsError(value)) {
      callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
    }
    callback();
  };

  const handleWaitShutdownTimeBlur = e => {
    const { value } = e.target;

    if (value && !checkWaitShutdownTimeIsError(value)) {
      form.setFieldsValue({
        waitShutdownTime: `${value.replace(/s$/, '')}s`,
      });
    }
  };

  const handleWaitShutdownTimeFocus = e => {
    const { value } = e.target;

    if (value && /s$/.test(value)) {
      form.setFieldsValue({
        waitShutdownTime: value.replace(/s$/, ''),
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
      confirmLoading={confirmLoading}
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
            initialValue: bean && bean.pwd && pswBase64ThriceRestore(bean.pwd) || '',
          })(<Input placeholder={formatMessage({ id: 'oal.device.devicePaswPlaceholder' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.temperatureUnit' })}>
          {getFieldDecorator('temperatureUnit', {
            initialValue: bean && bean.temperatureUnit || '0',
          })(
            <Radio.Group onChange={handleTemperatureUnitChange}>
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
                    validator: checkAlarmValue,
                  },
                ],
                initialValue: bean && bean.alarmValue ? `${bean.alarmValue}${bean && bean.temperatureUnit === '1' ? '℉' : '℃'}` : '',
              })(<Input placeholder="34.0-120.0（℃/℉）" onFocus={handleAlarmValueFocus} onBlur={handleAlarmValueBlur} />)}
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
              })(<Input placeholder="10-120（s）" onFocus={handleWaitShutdownTimeFocus} onBlur={handleWaitShutdownTimeBlur} />)}
            </Form.Item>) : ''
        }
        <Form.Item label={formatMessage({ id: 'oal.device.recognitionMode' })}>
          {getFieldDecorator('recognitionMode', {
            initialValue: bean && bean.recognitionMode || '1',
          })(
            <Radio.Group>
              <Radio value="1"><FormattedMessage id="oal.device.attendanceMode" /></Radio>
              <Radio value="2">
                <FormattedMessage id="oal.device.maskMode" />
                &nbsp;&nbsp;
                <Tooltip title={formatMessage({ id: 'oal.device.maskModeTips' })}>
                  <Icon type="info-circle" theme="twoTone" style={{ fontSize: '18px' }} />
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
