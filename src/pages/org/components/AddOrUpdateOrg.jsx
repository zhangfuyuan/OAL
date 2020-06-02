import { Modal, Form, Input, Tooltip, Icon } from 'antd';
import React from 'react';
// import { validateMobile } from '@/utils/utils';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;
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
const AddOrUpdateOrg = props => {
  const { form, orgBean, visible, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  // eslint-disable-next-line no-underscore-dangle
  const isEdit = !!(orgBean && orgBean._id);

  let title = formatMessage({ id: 'oal.org.newOrg' });
  if (isEdit) {
    title = formatMessage({ id: 'oal.org.modifyOrg' });
  }

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = fieldsValue;
      if (isEdit) {
        // eslint-disable-next-line no-underscore-dangle
        params.orgId = orgBean._id;
      }
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

  const checkPath = (rule, value, callback) => {
    const reg = /^[A-Za-z]+$/;
    if (value && !reg.test(value)) {
      callback(formatMessage({ id: 'oal.org.enterEnglishString' }));
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
      width="50%"
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.org.orgName' })}>
          {getFieldDecorator('orgName', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.org.enterOrgNameTips' }),
              },
              {
                max: 40,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '40' }),
              },
              // {
              //   validator: checkIllegalCharacter,
              // },
            ],
            initialValue: orgBean && orgBean.name || '',
          })(<Input placeholder={formatMessage({ id: 'oal.org.orgName' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.settings.sysname' })}>
          {getFieldDecorator('saasName', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.org.enterSaasNameTips' }),
              },
              {
                max: 40,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
              // {
              //   validator: checkIllegalCharacter,
              // },
            ],
            initialValue: orgBean && orgBean.saasName || '',
          })(<Input placeholder={formatMessage({ id: 'oal.settings.sysname' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.org.contacts' })}>
          {getFieldDecorator('contactName', {
            rules: [
              {
                max: 20,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
              // {
              //   validator: checkIllegalCharacter,
              // },
            ],
            initialValue: orgBean && orgBean.contact && orgBean.contact.nickName || '',
          })(<Input placeholder={formatMessage({ id: 'oal.org.contactName' })} />)}
        </Form.Item>
        {/* <Form.Item label={formatMessage({ id: 'oal.common.emailAddress' })}>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: formatMessage({ id: 'oal.common.enterCorrectEmailAddress' }),
              },
            ],
            initialValue: orgBean && orgBean.contact && orgBean.contact.email,
          })(<Input placeholder={formatMessage({ id: 'oal.common.emailAddress' })} />)}
        </Form.Item> */}
        <Form.Item label={formatMessage({ id: 'oal.common.phoneNumber' })}>
          {getFieldDecorator('mobile', {
            rules: [
              {
                validator: checkMobile,
              },
            ],
            initialValue: orgBean && orgBean.contact && orgBean.contact.mobile || '',
          })(<Input placeholder={formatMessage({ id: 'oal.common.phoneNumber' })} />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              <FormattedMessage id="oal.org.orgPath" />&nbsp;
              <Tooltip title={formatMessage({ id: 'oal.org.usersAccessAppTips' })}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          className="oal-form-item"
          extra={`${formatMessage({ id: 'oal.org.accessPath' })} : ${window.location.origin}${publicPath}user/${isEdit && orgBean && orgBean.path || form.getFieldValue('path') || '*'}/login`}
        >
          {getFieldDecorator('path', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.org.enterPathTips' }),
              },
              {
                max: 10,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '10' }),
              },
              {
                validator: checkPath,
              }
            ],
            initialValue: orgBean && orgBean.path || '',
          })(<Input placeholder={formatMessage({ id: 'oal.org.orgPath' })} disabled={isEdit} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedAddOrUpdateOrg = Form.create({ name: 'addOrUpdate' })(AddOrUpdateOrg);
export default WrappedAddOrUpdateOrg;
