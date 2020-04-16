import { Modal, Form, Input, Switch, Icon, Popover, Radio, Button, message } from 'antd';
import React, { useState } from 'react';
import OptionView from './OptionView';
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
const styles = {
  icon: {
    marginLeft: '5px',
    cursor: 'pointer',
  },
};
const FaceKeyModal = props => {
  const { form, visible, handleSubmit, confirmLoading, handleCancel, faceKey } = props;
  const { getFieldDecorator } = form;
  const [optionVisible, setOptionVisible] = useState(false);
  const options = (faceKey && faceKey.componentInfo && faceKey.componentInfo.data) || [];
  const [optionData, setOptionData] = useState([]);

  let title = formatMessage({ id: 'oal.settings.addFaceAttributes' });
  let isEdit = false;
  if (faceKey && faceKey.name) {
    title = formatMessage({ id: 'oal.settings.modifyAttributes' });
    isEdit = true;
  }

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = fieldsValue;
      if (fieldsValue.type === 2) {
        if (options.length === 0 && optionData.length === 0) {
          message.error(formatMessage({ id: 'oal.settings.dropdownOptionNotConfigTips' }));
          return;
        }
        if (options.length > 0 && optionData.length === 0) {
          params.componentInfo = {
            type: 2,
            data: options,
          };
        } else {
          // eslint-disable-next-line no-underscore-dangle
          let _optionData = [];
          optionData.map(o => {
            _optionData.push({ value: o.value, text: o.text });
          });
          params.componentInfo = {
            type: 2,
            data: _optionData,
          };
        }
      } else {
        params.componentInfo = {
          type: 1,
        };
      }
      if (isEdit) {
        // eslint-disable-next-line no-underscore-dangle
        params._id = faceKey._id;
      }
      handleSubmit(params, () => {
        setOptionData([]);
      });
    });
  };

  const toConfigOpt = e => {
    e.stopPropagation();
    setOptionVisible(true);
  }

  const submitOption = (data, callback) => {
    setOptionData(data);
    setOptionVisible(false);
    callback();
  }

  const cancelOption = callback => {
    setOptionVisible(false);
    callback();
  }

  console.log('form-------', form.getFieldsValue());
  const textPre = formatMessage({ id: 'oal.settings.newOrModifyVal' });
  const values = form.getFieldsValue();

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
        <Form.Item label={formatMessage({ id: 'oal.common.name' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.enterName' }),
              },
              {
                max: 50,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '50' }),
              },
            ],
            initialValue: faceKey && faceKey.name,
          })(<Input placeholder={formatMessage({ id: 'oal.common.name' })} />)}
        </Form.Item>
        <Form.Item label="key">
          {getFieldDecorator('key', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.settings.enterKey' }),
              },
              {
                pattern: /^\w+$/,
                message: formatMessage({ id: 'oal.settings.enterKeyError' }),
              },
              {
                max: 50,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '50' }),
              },
            ],
            initialValue: faceKey && faceKey.key,
          })(<Input placeholder="key" disabled={isEdit}/>)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.controlTypes' })}>
          {getFieldDecorator('type', {
            initialValue: (faceKey && faceKey.componentInfo && faceKey.componentInfo.type) || 1,
          })(<Radio.Group>
            <Radio value={1}><FormattedMessage id="oal.settings.inputBox" /></Radio>
            <Radio value={2}>
              <FormattedMessage id="oal.settings.dropdownSelectionBox" />
            </Radio>
          </Radio.Group>)}
          {
            form.getFieldValue('type') === 1 ?
              null
              :
              <Button type="link" onClick={toConfigOpt}>
                <FormattedMessage id="oal.settings.configOption" />
              </Button>
          }
        </Form.Item>
        <Form.Item extra={values.required ? `${textPre}${formatMessage({ id: 'oal.common.required' })}` : `${textPre}${formatMessage({ id: 'oal.common.notRequired' })}`} label={formatMessage({ id: 'oal.settings.isRequired' })}>
          {getFieldDecorator('required', {
            valuePropName: 'checked',
            initialValue: (faceKey && faceKey.required) || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item extra={values.isUnique ? `${textPre}${formatMessage({ id: 'oal.settings.uniqueInSystem' })}` : `${textPre}${formatMessage({ id: 'oal.settings.nonUniqueness' })}`} label={formatMessage({ id: 'oal.settings.uniqueConstraint' })}>
          {getFieldDecorator('isUnique', {
            valuePropName: 'checked',
            initialValue: (faceKey && faceKey.isUnique) || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item extra={values.readOnly ? formatMessage({ id: 'oal.settings.existingDataCannotModify' }) : formatMessage({ id: 'oal.settings.existingDataCanModify' })} label={formatMessage({ id: 'oal.settings.readOnly' })}>
          {getFieldDecorator('readOnly', {
            valuePropName: 'checked',
            initialValue: (faceKey && faceKey.readOnly) || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item extra={values.reportQuery ? formatMessage({ id: 'oal.settings.addToFilterConditionOfAttendanceReport' }) : ''} label={formatMessage({ id: 'oal.settings.reportQuery' })}>
          {getFieldDecorator('reportQuery', {
            valuePropName: 'checked',
            initialValue: (faceKey && faceKey.reportQuery) || false,
          })(<Switch />)}
        </Form.Item>
      </Form>
      <OptionView
        visible={optionVisible}
        optionData={isEdit ? options : optionData}
        handleCancel={cancelOption}
        handleSubmit={submitOption}
      />
    </Modal>
  );
};
const WrappedFaceKeyModal = Form.create({ name: 'faceKeyModal' })(FaceKeyModal);
export default WrappedFaceKeyModal;
