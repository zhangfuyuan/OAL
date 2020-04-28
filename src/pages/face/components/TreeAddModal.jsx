import { Modal, Form, Input } from 'antd';
import React from 'react';
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
const TreeAddModal = props => {
  const { form, visible, bean, handleCancel, handleSubmit } = props;
  const { getFieldDecorator } = form;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSubmit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.face.addGroup' })}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.face.groupName' })}>
          {getFieldDecorator('groupName', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.face.enterGroupNameTips' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
            ],
            initialValue: '',
          })(<Input placeholder={formatMessage({ id: 'oal.face.groupName' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedTreeAdd = Form.create({ name: 'treeAdd' })(TreeAddModal);
export default WrappedTreeAdd;
