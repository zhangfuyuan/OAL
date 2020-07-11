import {
  Modal,
  Form,
  Input,
  Radio,
  Button,
  Switch,
  Tooltip,
  Icon,
  Checkbox,
  Slider,
  Row,
  Col,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { parseRecognitionModeToStr, parseRecognitionModeToArr, temperatureC2F, temperatureF2C } from '@/utils/utils';

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
const faceInRecognitionMode = ['4', '7', '1', '5'];

const RenameModal = props => {
  const { form, bean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator, getFieldError } = form;
  const [showWaitShutdownTime, setShowWaitShutdownTime] = useState(false);
  const [showLowTemperature, setShowLowTemperature] = useState(false);
  const [showFaceMode, setShowFaceMode] = useState(false);
  const [recognitionRateSlider, setRecognitionRateSlider] = useState(90.0);
  const [recognitionRateInput, setRecognitionRateInput] = useState('90.0%');

  let title = formatMessage({ id: 'oal.common.set' });

  useEffect(() => {
    if (visible === true) {
      setShowWaitShutdownTime((bean && (bean.relayOperationMode === '1' || bean.relayOperationMode === '4')) || false);
      setShowLowTemperature((bean && bean.lowTemperatureRetest === '1') || false);
      setShowFaceMode((bean && faceInRecognitionMode.indexOf(bean.recognitionMode) > -1) || false);
      let _recognitionRate = (bean && parseFloat(bean.recognitionRate)) || 90.0;
      _recognitionRate = _recognitionRate > 1 ? _recognitionRate : _recognitionRate * 100;
      setRecognitionRateSlider(_recognitionRate);
      setRecognitionRateInput(`${_recognitionRate.toFixed(1)}%`);
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
        recognitionMode,
        fastMovingDetection,
      } = fieldsValue;
      const params = {
        ...fieldsValue,
        alarm: alarm ? '1' : '0',
        isSaveRecord: isSaveRecord ? '1' : '0',
        lowTemperatureRetest: lowTemperatureRetest ? '1' : '0',
        recognitionMode: recognitionMode ? parseRecognitionModeToStr(recognitionMode) : '',
        recognitionRate: recognitionRateSlider && (recognitionRateSlider / 100).toFixed(3) || '0.900',
        fastMovingDetection: fastMovingDetection ? '1' : '0',
      };

      alarmValue && (params.alarmValue = alarmValue.replace(/((℃)|(℉))$/, ''));
      lowTemperatureValue && (params.lowTemperatureValue = lowTemperatureValue.replace(/((℃)|(℉))$/, ''));
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
    const lowTemperatureValue = form.getFieldValue('lowTemperatureValue');
    const _unit = value === '1' ? '℉' : '℃';

    if (value && alarmValue) {
      form.setFieldsValue({
        alarmValue: (value === '1' ? temperatureC2F(alarmValue) : temperatureF2C(alarmValue)) + _unit,
        // alarmValue: bean && bean.alarmValue && bean.temperatureUnit === value ? (bean.alarmValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultAlarmValue[value || '0'],
      });
    }

    if (value && lowTemperatureValue) {
      form.setFieldsValue({
        lowTemperatureValue: (value === '1' ? temperatureC2F(lowTemperatureValue) : temperatureF2C(lowTemperatureValue)) + _unit,
        // lowTemperatureValue: bean && bean.lowTemperatureValue && bean.temperatureUnit === value ? (bean.lowTemperatureValue + (bean.temperatureUnit === '1' ? '℉' : '℃')) : defaultLowTemperatureValue[value || '0'],
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

  const handleRecognitionRateSliderChange = value => {
    setRecognitionRateSlider(value);
    setRecognitionRateInput(`${value.toFixed(1)}%`);
  };

  const handleRecognitionRateFocus = e => {
    const { value } = e.target;

    if (value && /%$/.test(value)) {
      setRecognitionRateInput(value.replace(/%$/, ''));
    }
  };

  const handleRecognitionRateBlur = e => {
    const { value } = e.target;

    if (value && !checkRecognitionRateInputIsError(value)) {
      setRecognitionRateSlider(parseFloat(value));
      setRecognitionRateInput(`${parseFloat(value).toFixed(1)}%`);
    } else {
      let _recognitionRate = (bean && parseFloat(bean.recognitionRate)) || 90.0;
      _recognitionRate = _recognitionRate > 1 ? _recognitionRate : _recognitionRate * 100;
      setRecognitionRateSlider(_recognitionRate);
      setRecognitionRateInput(`${_recognitionRate.toFixed(1)}%`);
    }
  };

  const checkRecognitionRateInputIsError = value => {
    let isError = false;

    if (value) {
      if (/^[\d]{2}(\.[\d]{1})?$/.test(value.replace(/%$/, ''))) {
        let _val = parseFloat(value);

        if (_val < 85.0 || _val > 99.9) {
          isError = true;
        }
      } else {
        isError = true;
      }
    }

    return isError;
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
      <Form {...formItemLayout} style={{ maxHeight: '60vh', overflow: 'auto' }}>
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
        <Form.Item label={formatMessage({ id: 'oal.device.recognitionMode' })} style={showFaceMode ? { marginBottom: 0 } : {}}>
          {getFieldDecorator('recognitionMode', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseSelect' }),
              },
            ],
            initialValue: bean && bean.recognitionMode && parseRecognitionModeToArr(bean.recognitionMode) || [],
          })(
            <Checkbox.Group onChange={checkedValue => setShowFaceMode(checkedValue.indexOf('face') > -1)} style={{ width: '100%' }}>
              <Checkbox value="face"><FormattedMessage id="oal.common.face" /></Checkbox>
              <Checkbox value="mask"><FormattedMessage id="oal.common.mask" /></Checkbox>
              <Checkbox value="temperature"><FormattedMessage id="oal.common.temperature" /></Checkbox>
            </Checkbox.Group>
          )}
        </Form.Item>
        {
          showFaceMode ?
            (<Form.Item label="" style={{ paddingLeft: '25%' }}>
              {getFieldDecorator('faceMode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'oal.common.pleaseSelect' }),
                  },
                ],
                initialValue: bean && bean.faceMode || '0',
              })(
                <Radio.Group>
                  <Radio value="0"><FormattedMessage id="oal.device.precise" /></Radio>
                  <Radio value="1"><FormattedMessage id="oal.device.fast" /></Radio>
                </Radio.Group>
              )}
            </Form.Item>) : ''
        }
        <Form.Item label={formatMessage({ id: 'oal.device.recognitionRate' })}>
          {getFieldDecorator('recognitionRate')(
            <Row>
              <Col span={18}>
                <Slider
                  min={85.0}
                  max={99.9}
                  step={0.1}
                  onChange={handleRecognitionRateSliderChange}
                  value={recognitionRateSlider}
                  tipFormatter={null}
                  style={{ marginRight: 16 }}
                />
              </Col>
              <Col span={6}>
                <Input
                  value={recognitionRateInput}
                  onChange={e => setRecognitionRateInput(e.target.value)}
                  onFocus={handleRecognitionRateFocus}
                  onBlur={handleRecognitionRateBlur}
                />
              </Col>
            </Row>
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.device.fastMovingDetection' })}>
          {getFieldDecorator('fastMovingDetection', {
            valuePropName: 'checked',
            initialValue: bean && bean.fastMovingDetection === '1' ? true : false,
          })(<Switch />)}
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
