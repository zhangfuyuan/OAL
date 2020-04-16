import { Modal, Form, Input, Select } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

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

  const title = formatMessage({ id: 'oal.face.modifyFaceInfo' });

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
        <Form.Item label={formatMessage({ id: 'oal.common.fullName' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.face.enterFullName' }),
              },
            ],
            initialValue: bean.name,
          })(<Input placeholder={formatMessage({ id: 'oal.face.enterFullName' })} />)}
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
                      message: `${formatMessage({ id: 'oal.common.pleaseSelect' })}${item.name}`,
                    }
                    :
                    {},
                  ],
                  initialValue: bean.profile && bean.profile[item.key],
                })(<Select placeholder={`${formatMessage({ id: 'oal.common.pleaseSelect' })}${item.name}`} disabled={item.readOnly && bean.profile && bean.profile[item.key]}>
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
                    message: `${formatMessage({ id: 'oal.common.pleaseEnter' })}${item.name}`,
                  }
                  :
                  {},
                ],
                initialValue: bean.profile && bean.profile[item.key],
              })(<Input placeholder={`${formatMessage({ id: 'oal.common.pleaseEnter' })}${item.name}`} disabled={item.readOnly && bean.profile && bean.profile[item.key]}/>)}
            </Form.Item>
          )
        })}
      </Form>
    </Modal>
  );
};
const WrappedModifyModal = Form.create({ name: 'modifyFace' })(ModifyModal);
export default WrappedModifyModal;
