import { Modal, Form, Input } from 'antd';
import React from 'react';
import { validateMobile } from '@/utils/utils';
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
const AddOrUpdateUser = props => {
  const { form, userBean, currentUser, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;
  const isEdit = !!(userBean && userBean._id);

  let title = formatMessage({ id: 'oal.user-manage.newAccount' });
  if (isEdit) {
    title = formatMessage({ id: 'oal.common.modify' });
  }

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = fieldsValue;
      if (isEdit) params.userId = userBean._id;
      handleSubmit(params, () => {
        form.resetFields();
      });
    });
  };

  const checkMobile = (rule, value, callback) => {
    const reg = /^[\d\*\#\+]{1,14}$/;
    if (value && !reg.test(value)) {
      callback(formatMessage({ id: 'oal.common.formatError' }));
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
        <Form.Item label={formatMessage({ id: 'oal.user-manage.accountName' })}>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.user-manage.enterAccountNameTips' }),
              },
              {
                pattern: /^[a-zA-Z]+$/,
                message: formatMessage({ id: 'oal.user-manage.enterUsernameError' }),
              },
              {
                max: 10,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '10' }),
              },
            ],
            initialValue: isEdit ? userBean.userName : '',
          })(<Input placeholder={formatMessage({ id: 'oal.user-manage.accountName' })} disabled={isEdit} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.common.nickname' })}>
          {getFieldDecorator('nickName', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.user-manage.enterNicknameTips' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
              // {
              //   validator: checkIllegalCharacter,
              // },
            ],
            initialValue: isEdit ? userBean.profile && userBean.profile.nickName : '',
          })(<Input placeholder={formatMessage({ id: 'oal.common.nickname' })} disabled={isEdit} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.common.phoneNumber' })}>
          {getFieldDecorator('mobile', {
            rules: [
              {
                validator: checkMobile,
              },
            ],
            initialValue: isEdit ? userBean.profile && userBean.profile.mobile : '',
          })(<Input placeholder={formatMessage({ id: 'oal.common.phoneNumber' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.common.emailAddress' })}>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: formatMessage({ id: 'oal.common.formatError' }),
              },
              {
                max: 80,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '80' }),
              },
            ],
            initialValue: isEdit ? userBean.profile && userBean.profile.email : '',
          })(<Input placeholder={formatMessage({ id: 'oal.common.emailAddress' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedAddOrUpdateUser = Form.create({ name: 'addOrUpdate' })(AddOrUpdateUser);
export default WrappedAddOrUpdateUser;
