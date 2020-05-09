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
  const { form, visible, bean, handleCancel, handleSubmit, confirmLoading } = props;
  const { getFieldDecorator } = form;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSubmit({
        ...fieldsValue,
        groupPid: bean._id,
      });
    });
  };

  const checkIllegalCharacter = (rule, value, callback) => {
    const errReg = /[<>|*?/:\s]/;
    if (value && errReg.test(value)) {
      callback(formatMessage({ id: 'oal.common.illegalCharacterTips' }));
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.face.addGroup' })}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
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
                max: 40,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '40' }),
              },
              {
                validator: checkIllegalCharacter,
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
