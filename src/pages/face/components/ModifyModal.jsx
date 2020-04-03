import { Modal, Form, Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

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
const ModifyModal = props => {
  const { form, bean, visible, handleSubmit, confirmLoading, handleCancel, faceKeyList } = props;
  const { getFieldDecorator } = form;

  const title = '修改人脸信息';

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {};
      params.faceId = bean._id;
      params.name = fieldsValue.name;
      params.profile = {};
      // eslint-disable-next-line no-unused-expressions
      faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
        params.profile[item.key] = fieldsValue[item.key];
      });
      handleSubmit(params, () => {
        form.resetFields();
      });
    });
  };

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
        <Form.Item label="姓名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入姓名',
              },
            ],
            initialValue: bean.name,
          })(<Input placeholder="请输入姓名" />)}
        </Form.Item>
        {faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
          const type = item.componentInfo && item.componentInfo.type;
          const data = item.componentInfo && item.componentInfo.data;
          if (type === 2 && data && data.length > 0) {
            return (
              <Form.Item label={item.name} key={`formItem_${item.key}`}>
                {getFieldDecorator(item.key, {
                  rules: [
                    item.required ?
                    {
                      required: true,
                      message: `请选择${item.name}`,
                    }
                    :
                    {},
                  ],
                  initialValue: bean.profile && bean.profile[item.key],
                })(<Select placeholder={`请选择${item.name}`} disabled={item.readOnly && bean.profile && bean.profile[item.key]}>
                    {data.map(option => (
                      <Option value={option.value} key={`option_${option.value}`}>{option.text}</Option>
                    ))}
                </Select>)}
              </Form.Item>
            )
          }
          return (
            <Form.Item label={item.name} key={`formItem_${item.key}`}>
              {getFieldDecorator(item.key, {
                rules: [
                  item.required ?
                  {
                    required: true,
                    message: `请输入${item.name}`,
                  }
                  :
                  {},
                ],
                initialValue: bean.profile && bean.profile[item.key],
              })(<Input placeholder={`请输入${item.name}`} disabled={item.readOnly && bean.profile && bean.profile[item.key]}/>)}
            </Form.Item>
          )
        })}
      </Form>
    </Modal>
  );
};
const WrappedModifyModal = Form.create({ name: 'modifyFace' })(ModifyModal);
export default WrappedModifyModal;
