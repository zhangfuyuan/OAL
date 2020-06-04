import { Modal, Form, Input, Radio, Button, Switch, Tooltip, Icon, } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
// import { pswBase64Thrice, pswBase64ThriceRestore } from '@/utils/utils';

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
const defaultAlarmValue = {
  '0': '37.3℃',
  '1': '100.4℉',
};

const RenameModal = props => {
  const { form, bean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator, getFieldError } = form;
  const [showAlarm, setShowAlarm] = useState(false);
  const [showWaitShutdownTime, setShowWaitShutdownTime] = useState(false);

  let title = formatMessage({ id: 'oal.common.set' });

  useEffect(() => {
    if (visible === true) {
      setShowAlarm((bean && bean.alarm === '1') || false);
      setShowWaitShutdownTime((bean && (bean.relayOperationMode === '1' || bean.relayOperationMode === '4')) || false)
    }
  }, [visible]);

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      //   console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const { pwd, alarmValue, waitShutdownTime, alarm, isSaveRecord } = fieldsValue;
      const params = {
        ...fieldsValue,
        alarm: alarm ? '1' : '0',
        isSaveRecord: isSaveRecord ? '1' : '0',
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

    if (value && alarmValue) {
      form.setFieldsValue({
        alarmValue: bean && bean.alarmValue && bean.temperatureUnit === value ? (bean.alarmValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultAlarmValue[value || '0'],
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
      if (/^[\d]{2,3}(\.[\d]{1})?$/.test(value.replace(/((℃)|(℉))$/, ''))) {
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
      let _val = parseFloat(value).toFixed(1);

      form.setFieldsValue({
        alarmValue: `${_val}${form.getFieldValue('temperatureUnit') === '1' ? '℉' : '℃'}`,
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
      if (/^[\d]{1,3}$/.test(value.replace(/s$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 3 || _val > 120) {
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
      width="50%"
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
              // {
              //   validator: checkIllegalCharacter,
              // },
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
            <Radio.Group onChange={handleTemperatureUnitChange}>
              <Radio value="0"><FormattedMessage id="oal.device.centigradeDegree" /></Radio>
              <Radio value="1"><FormattedMessage id="oal.device.fahrenheitDegree" /></Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.highTemperatureAlarm' })}>
          {getFieldDecorator('alarm', {
            valuePropName: 'checked',
            initialValue: (bean && bean.alarm === '1') || false,
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
                initialValue: bean && bean.alarmValue && bean.temperatureUnit === form.getFieldValue('temperatureUnit') ? (bean.alarmValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultAlarmValue[form.getFieldValue('temperatureUnit') || '0'],
              })(<Input placeholder="34.0-120.0（℃/℉）" onFocus={handleAlarmValueFocus} onBlur={handleAlarmValueBlur} />)}
            </Form.Item>) : ''
        }
        <Form.Item label={formatMessage({ id: 'oal.device.relayOperationMode' })}>
          {getFieldDecorator('relayOperationMode', {
            initialValue: bean && bean.relayOperationMode || '1',
          })(
            <Radio.Group onChange={e => setShowWaitShutdownTime(e.target.value === '1' || e.target.value === '4')} >
              <Radio value="1"><FormattedMessage id="oal.device.openWhenVerifySuccessfully" /></Radio>
              <Radio value="4"><FormattedMessage id="oal.device.openWhenVerifyFailed" /></Radio>
              <Radio value="2"><FormattedMessage id="oal.device.normallyOpen" /></Radio>
              <Radio value="3"><FormattedMessage id="oal.device.normallyClose" /></Radio>
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
              })(<Input placeholder="3-120（s）" onFocus={handleWaitShutdownTimeFocus} onBlur={handleWaitShutdownTimeBlur} />)}
            </Form.Item>) : ''
        }
        <Form.Item label={formatMessage({ id: 'oal.device.recognitionMode' })}>
          {getFieldDecorator('recognitionMode', {
            initialValue: bean && bean.recognitionMode || '',
          })(
            <Radio.Group>
              <Radio value="1"><FormattedMessage id="oal.device.faceAndTemperature" /></Radio>
              <Radio value="2"><FormattedMessage id="oal.device.maskAndTtemperature" /></Radio>
              <Radio value="4"><FormattedMessage id="oal.device.faceAndMaskAndTemperature" /></Radio>
              <Radio value="3"><FormattedMessage id="oal.device.temperature" /></Radio>
              {/* <Radio value="2">
                <FormattedMessage id="oal.device.maskMode" />
                &nbsp;&nbsp;
                <Tooltip title={formatMessage({ id: 'oal.device.maskModeTips' })}>
                  <Icon type="info-circle" theme="twoTone" style={{ fontSize: '18px' }} />
                </Tooltip>
              </Radio> */}
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.identifyRecord' })}>
          {getFieldDecorator('isSaveRecord', {
            valuePropName: 'checked',
            initialValue: bean && bean.isSaveRecord === '0' ? false : true,
          })(<Switch />)}
        </Form.Item>
      </Form>
      {/* <p style={{ textAlign: 'center', color: '#999', }}><FormattedMessage id="oal.device.deviceSetTips" /></p> */}
    </Modal>
  );
};
const WrappedRenameDevice = Form.create({ name: 'rename' })(RenameModal);
export default WrappedRenameDevice;
