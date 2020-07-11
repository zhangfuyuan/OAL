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
const defaultLowTemperatureValue = {
  '0': '',
  '1': '',
};
const defaultLowerTemperatureBound = {
  '0': '',
  '1': '',
};
const defaultUpperTemperatureBound = {
  '0': '',
  '1': '',
};

const RenameModal = props => {
  const { form, bean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator, getFieldError } = form;
  const [showWaitShutdownTime, setShowWaitShutdownTime] = useState(false);
  const [showLowTemperature, setShowLowTemperature] = useState(false);

  let title = formatMessage({ id: 'oal.common.set' });

  useEffect(() => {
    if (visible === true) {
      setShowWaitShutdownTime((bean && (bean.relayOperationMode === '1' || bean.relayOperationMode === '4')) || false);
      setShowLowTemperature((bean && bean.lowTemperatureRetest === '1') || false);
    }
  }, [visible]);

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      //   console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const {
        pwd,
        alarmValue,
        waitShutdownTime,
        alarm,
        isSaveRecord,
        lowTemperatureRetest,
        lowTemperatureValue,
        detectionTemperatureTime,
        lowerTemperatureBound,
        upperTemperatureBound,
      } = fieldsValue;
      const params = {
        ...fieldsValue,
        alarm: alarm ? '1' : '0',
        isSaveRecord: isSaveRecord ? '1' : '0',
        lowTemperatureRetest: lowTemperatureRetest ? '1' : '0',
      };

      alarmValue && (params.alarmValue = alarmValue.replace(/((℃)|(℉))$/, ''));
      lowTemperatureValue && (params.lowTemperatureValue = lowTemperatureValue.replace(/((℃)|(℉))$/, ''));
      lowerTemperatureBound && (params.lowerTemperatureBound = lowerTemperatureBound.replace(/((℃)|(℉))$/, ''));
      upperTemperatureBound && (params.upperTemperatureBound = upperTemperatureBound.replace(/((℃)|(℉))$/, ''));
      waitShutdownTime && (params.waitShutdownTime = waitShutdownTime.replace(/s$/, ''));
      detectionTemperatureTime && (params.detectionTemperatureTime = detectionTemperatureTime.replace(/s$/, ''));
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
    const lowTemperatureValue = form.getFieldValue('lowTemperatureValue');
    const lowerTemperatureBound = form.getFieldValue('lowerTemperatureBound');
    const upperTemperatureBound = form.getFieldValue('upperTemperatureBound');

    if (value && alarmValue) {
      form.setFieldsValue({
        alarmValue: bean && bean.alarmValue && bean.temperatureUnit === value ? (bean.alarmValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultAlarmValue[value || '0'],
      });
    }

    if (value && lowTemperatureValue) {
      form.setFieldsValue({
        lowTemperatureValue: bean && bean.lowTemperatureValue && bean.temperatureUnit === value ? (bean.lowTemperatureValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultLowTemperatureValue[value || '0'],
      });
    }

    if (value && lowerTemperatureBound) {
      form.setFieldsValue({
        lowerTemperatureBound: bean && bean.lowerTemperatureBound && bean.temperatureUnit === value ? (bean.lowerTemperatureBound + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultLowerTemperatureBound[value || '0'],
      });
    }

    if (value && upperTemperatureBound) {
      form.setFieldsValue({
        upperTemperatureBound: bean && bean.upperTemperatureBound && bean.temperatureUnit === value ? (bean.upperTemperatureBound + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultUpperTemperatureBound[value || '0'],
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
  };

  const handleAlarmValueBlur = e => {
    const { value } = e.target;

    if (value && !checkAlarmValueIsError(value)) {
      let _val = parseFloat(value).toFixed(1);

      form.setFieldsValue({
        alarmValue: `${_val}${form.getFieldValue('temperatureUnit') === '1' ? '℉' : '℃'}`,
      });
    }
  };

  const handleLowTemperatureValueFocus = e => {
    const { value } = e.target;

    if (value && /((℃)|(℉))$/.test(value)) {
      form.setFieldsValue({
        lowTemperatureValue: value.replace(/((℃)|(℉))$/, ''),
      });
    }
  };

  const handleLowTemperatureValueBlur = e => {
    const { value } = e.target;

    if (value && !checkLowTemperatureValueIsError(value)) {
      let _val = parseFloat(value).toFixed(1);

      form.setFieldsValue({
        lowTemperatureValue: `${_val}${form.getFieldValue('temperatureUnit') === '1' ? '℉' : '℃'}`,
      });
    }
  };

  const checkAlarmValue = (rule, value, callback) => {
    if (value) {
      if (checkAlarmValueIsError(value)) {
        callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
      } else {
        const upperTemperatureBound = form.getFieldValue('upperTemperatureBound');
        const _val = parseFloat(value);

        if (upperTemperatureBound && _val >= parseFloat(upperTemperatureBound)) {
          callback(formatMessage({ id: 'oal.device.pleaseBelowUpperTemperatureBound' }));
        }
      }
    }
    callback();
  };

  const checkWaitShutdownTimeIsError = value => {
    let isError = false;

    if (value) {
      if (/^[\d]{1,3}$/.test(value.replace(/s$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 1 || _val > 120) {
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

  const checkLowTemperatureValue = (rule, value, callback) => {
    if (value) {
      const _errorType = checkLowTemperatureValueIsError(value);

      if (_errorType === 1) {
        callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
      } else if (_errorType === 2) {
        callback(formatMessage({ id: 'oal.device.lowTemperatureValueTips' }));
      } else {
        const alarmValue = form.getFieldValue('alarmValue');
        const upperTemperatureBound = form.getFieldValue('upperTemperatureBound');
        const _val = parseFloat(value);

        if (alarmValue && _val >= parseFloat(alarmValue)) {
          callback(formatMessage({ id: 'oal.device.pleaseBelowAlarmValue' }));
        } else if (upperTemperatureBound && _val >= parseFloat(upperTemperatureBound)) {
          callback(formatMessage({ id: 'oal.device.pleaseBelowUpperTemperatureBound' }));
        }
      }
    }
    callback();
  };

  const checkLowTemperatureValueIsError = value => {
    let errorType = 0;

    if (value) {
      if (/^[\d]{1,3}(\.[\d]{1})?$/.test(value.replace(/((℃)|(℉))$/, ''))) {
        let _val = parseFloat(value);
        let alarmValue = form.getFieldValue('alarmValue');

        if (alarmValue) {
          alarmValue = parseFloat(alarmValue);

          if (_val >= alarmValue) {
            errorType = 2;
          }
        }

        if (_val < 1 || _val > 120) {
          errorType = 1;
        }
      } else {
        errorType = 1;
      }
    }

    return errorType;
  };

  const checkDetectionTemperatureTimeIsError = value => {
    let isError = false;

    if (value) {
      if (/^[\d]{1,2}$/.test(value.replace(/s$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 1 || _val > 99) {
          isError = true;
        }
      } else {
        isError = true;
      }
    }

    return isError;
  };

  const checkDetectionTemperatureTime = (rule, value, callback) => {
    if (value && checkDetectionTemperatureTimeIsError(value)) {
      callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
    }
    callback();
  };

  const handleDetectionTemperatureTimeBlur = e => {
    const { value } = e.target;

    if (value && !checkDetectionTemperatureTimeIsError(value)) {
      form.setFieldsValue({
        detectionTemperatureTime: `${value.replace(/s$/, '')}s`,
      });
    }
  };

  const handleDetectionTemperatureTimeFocus = e => {
    const { value } = e.target;

    if (value && /s$/.test(value)) {
      form.setFieldsValue({
        detectionTemperatureTime: value.replace(/s$/, ''),
      });
    }
  };

  const checkLowerTemperatureBound = (rule, value, callback) => {
    if (value) {
      if (checkLowerTemperatureBoundIsError(value)) {
        callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
      } else {
        const lowTemperatureValue = form.getFieldValue('lowTemperatureValue');
        const alarmValue = form.getFieldValue('alarmValue');
        const upperTemperatureBound = form.getFieldValue('upperTemperatureBound');
        const _val = parseFloat(value);

        if (lowTemperatureValue && _val >= parseFloat(lowTemperatureValue)) {
          callback(formatMessage({ id: 'oal.device.pleaseBelowLowTemperatureValue' }));
        } else if (alarmValue && _val >= parseFloat(alarmValue)) {
          callback(formatMessage({ id: 'oal.device.pleaseBelowAlarmValue' }));
        } else if (upperTemperatureBound && _val >= parseFloat(upperTemperatureBound)) {
          callback(formatMessage({ id: 'oal.device.pleaseBelowUpperTemperatureBound' }));
        }
      }
    }
    callback();
  };

  const checkLowerTemperatureBoundIsError = value => {
    let isError = false;

    if (value) {
      if (/^[\d]{1,3}(\.[\d]{1})?$/.test(value.replace(/((℃)|(℉))$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 0 || _val > 120) {
          isError = true;
        }
      } else {
        isError = true;
      }
    }

    return isError;
  };

  const handleLowerTemperatureBoundFocus = e => {
    const { value } = e.target;

    if (value && /((℃)|(℉))$/.test(value)) {
      form.setFieldsValue({
        lowerTemperatureBound: value.replace(/((℃)|(℉))$/, ''),
      });
    }
  };

  const handleLowerTemperatureBoundBlur = e => {
    const { value } = e.target;

    if (value && !checkLowerTemperatureBoundIsError(value)) {
      let _val = parseFloat(value).toFixed(1);

      form.setFieldsValue({
        lowerTemperatureBound: `${_val}${form.getFieldValue('temperatureUnit') === '1' ? '℉' : '℃'}`,
      });
    }
  };

  const checkUpperTemperatureBound = (rule, value, callback) => {
    if (value && checkUpperTemperatureBoundIsError(value)) {
      callback(formatMessage({ id: 'oal.device.incorrectFormat' }));
    }
    callback();
  };

  const checkUpperTemperatureBoundIsError = value => {
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
  };

  const handleUpperTemperatureBoundFocus = e => {
    const { value } = e.target;

    if (value && /((℃)|(℉))$/.test(value)) {
      form.setFieldsValue({
        upperTemperatureBound: value.replace(/((℃)|(℉))$/, ''),
      });
    }
  };

  const handleUpperTemperatureBoundBlur = e => {
    const { value } = e.target;

    if (value && !checkUpperTemperatureBoundIsError(value)) {
      let _val = parseFloat(value).toFixed(1);

      form.setFieldsValue({
        upperTemperatureBound: `${_val}${form.getFieldValue('temperatureUnit') === '1' ? '℉' : '℃'}`,
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
      <Form {...formItemLayout} style={{ height: '60vh', overflow: 'auto' }}>
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
        <Form.Item label={formatMessage({ id: 'oal.device.detectionThreshold' })}>
          {getFieldDecorator('lowerTemperatureBound', {
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
                validator: checkLowerTemperatureBound,
              },
            ],
            initialValue: bean && bean.lowerTemperatureBound && bean.temperatureUnit === form.getFieldValue('temperatureUnit') ? (bean.lowerTemperatureBound + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultLowerTemperatureBound[form.getFieldValue('temperatureUnit') || ''],
          })(<Input placeholder="0.0-120.0（℃/℉）" onFocus={handleLowerTemperatureBoundFocus} onBlur={handleLowerTemperatureBoundBlur} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.highTemperatureAlarm' })}>
          {getFieldDecorator('alarm', {
            valuePropName: 'checked',
            initialValue: (bean && bean.alarm === '1') || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.alarmThresholdValue' })}>
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
            initialValue: bean && bean.alarmValue && bean.temperatureUnit === form.getFieldValue('temperatureUnit') ? (bean.alarmValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultAlarmValue[form.getFieldValue('temperatureUnit') || ''],
          })(<Input placeholder="34.0-120.0（℃/℉）" onFocus={handleAlarmValueFocus} onBlur={handleAlarmValueBlur} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.abnormalAlarm' })}>
          {getFieldDecorator('upperTemperatureBound', {
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
                validator: checkUpperTemperatureBound,
              },
            ],
            initialValue: bean && bean.upperTemperatureBound && bean.temperatureUnit === form.getFieldValue('temperatureUnit') ? (bean.upperTemperatureBound + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultUpperTemperatureBound[form.getFieldValue('temperatureUnit') || ''],
          })(<Input placeholder="34.0-120.0（℃/℉）" onFocus={handleUpperTemperatureBoundFocus} onBlur={handleUpperTemperatureBoundBlur} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.lowTemperatureRetest' })}>
          {getFieldDecorator('lowTemperatureRetest', {
            valuePropName: 'checked',
            initialValue: (bean && bean.lowTemperatureRetest === '1') || false,
          })(<Switch onChange={checked => setShowLowTemperature(checked)} />)}
        </Form.Item>
        {
          showLowTemperature ?
            (<Form.Item label={formatMessage({ id: 'oal.device.lowTemperatureValue' })}>
              {getFieldDecorator('lowTemperatureValue', {
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
                    validator: checkLowTemperatureValue,
                  },
                ],
                initialValue: bean && bean.lowTemperatureValue && bean.temperatureUnit === form.getFieldValue('temperatureUnit') ? (bean.lowTemperatureValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultLowTemperatureValue[form.getFieldValue('temperatureUnit') || ''],
              })(<Input placeholder="1.0-120.0（℃/℉）" onFocus={handleLowTemperatureValueFocus} onBlur={handleLowTemperatureValueBlur} />)}
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
              })(<Input placeholder="1-120（s）" onFocus={handleWaitShutdownTimeFocus} onBlur={handleWaitShutdownTimeBlur} />)}
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
        <Form.Item label={formatMessage({ id: 'oal.device.detectionTemperatureTime' })}>
          {getFieldDecorator('detectionTemperatureTime', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                max: 6,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '6' }),
              },
              // {
              //   validator: checkDetectionTemperatureTime,
              // },
            ],
            initialValue: bean && bean.detectionTemperatureTime ? `${bean.detectionTemperatureTime}s` : '',
          })(<Input placeholder="1-99（s）" onFocus={handleDetectionTemperatureTimeFocus} onBlur={handleDetectionTemperatureTimeBlur} />)}
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
