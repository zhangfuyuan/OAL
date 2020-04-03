import { Modal, Form, Input, Switch, Icon, Popover, Radio, Button, message } from 'antd';
import React, { useState } from 'react';
import OptionView from './OptionView';

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

  let title = '新增人脸属性';
  let isEdit = false;
  if (faceKey && faceKey.name) {
    title = '修改人脸属性';
    isEdit = true;
  }

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = fieldsValue;
      if (fieldsValue.type === 2) {
        if (options.length === 0 && optionData.length === 0) {
          message.error('未配置下拉选项，请完成配置后再提交');
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
  const textPre = '新增或修改的值'
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
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
              {
                max: 50,
                message: '最大长度为50',
              },
            ],
            initialValue: faceKey && faceKey.name,
          })(<Input placeholder="名称" />)}
        </Form.Item>
        <Form.Item label="key">
          {getFieldDecorator('key', {
            rules: [
              {
                required: true,
                message: '请输入key',
              },
              {
                pattern: /^\w+$/,
                message: '只能输入字母、数字、下划线',
              },
              {
                max: 50,
                message: '最大长度为50',
              },
            ],
            initialValue: faceKey && faceKey.key,
          })(<Input placeholder="key" disabled={isEdit}/>)}
        </Form.Item>
        <Form.Item label="控件类型">
          {getFieldDecorator('type', {
            initialValue: (faceKey && faceKey.componentInfo && faceKey.componentInfo.type) || 1,
          })(<Radio.Group>
            <Radio value={1}>输入框</Radio>
            <Radio value={2}>
              下拉选择框
            </Radio>
          </Radio.Group>)}
          {
            form.getFieldValue('type') === 1 ?
              null
              :
              <Button type="link" onClick={toConfigOpt}>
                配置选项
              </Button>
          }
        </Form.Item>
        <Form.Item extra={values.required ? `${textPre}必填` : `${textPre}非必填`} label="是否必填">
          {getFieldDecorator('required', {
            valuePropName: 'checked',
            initialValue: (faceKey && faceKey.required) || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item extra={values.isUnique ? `${textPre}系统中唯一` : `${textPre}不唯一`} label="唯一约束">
          {getFieldDecorator('isUnique', {
            valuePropName: 'checked',
            initialValue: (faceKey && faceKey.isUnique) || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item extra={values.readOnly ? '已存在的数据不可被修改' : '已存在的数据可被修改'} label="只读">
          {getFieldDecorator('readOnly', {
            valuePropName: 'checked',
            initialValue: (faceKey && faceKey.readOnly) || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item extra={values.reportQuery ? '加入到考勤报表的过滤条件中' : ''} label="报表查询">
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
