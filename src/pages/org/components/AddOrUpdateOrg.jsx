import { Modal, Form, Input, Tooltip, Icon } from 'antd';
import React from 'react';
import { validateMobile } from '@/utils/utils';

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

  let title = '新增组织';
  if (isEdit) {
    title = `修改组织(${orgBean.name})`;
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
    if (value && !validateMobile(value)) {
      callback('请输入正确的手机号');
    }
    callback();
  };

  const checkPath = (rule, value, callback) => {
    const reg = /^[A-Za-z]+$/;
    if (value && !reg.test(value)) {
      callback('请输入英文字符串');
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
        <Form.Item label="组织名称">
          {getFieldDecorator('orgName', {
            rules: [
              {
                required: true,
                message: '请输入组织名称',
              },
            ],
            initialValue: orgBean.name,
          })(<Input placeholder="组织名称" />)}
        </Form.Item>
        <Form.Item label="联系人名称">
          {getFieldDecorator('contactName', {
            rules: [],
            initialValue: orgBean && orgBean.contact && orgBean.contact.nickName,
          })(<Input placeholder="联系人名称" />)}
        </Form.Item>
        <Form.Item label="邮箱地址">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: '请输入正确的邮箱地址',
              },
            ],
            initialValue: orgBean && orgBean.contact && orgBean.contact.email,
          })(<Input placeholder="邮箱地址" />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('mobile', {
            rules: [
              {
                validator: checkMobile,
              },
            ],
            initialValue: orgBean && orgBean.contact && orgBean.contact.mobile,
          })(<Input placeholder="手机号" />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              访问路径&nbsp;
              <Tooltip title="用户可以通过该路径访问自己的应用">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          extra={`${origin}/user/${form.getFieldValue('path') || '*'}/login`}
        >
          {getFieldDecorator('path', {
            rules: [{ required: true, message: '请输入访问路径!' }, {
              validator: checkPath,
            }],
            initialValue: orgBean.path,
          })(<Input disabled={isEdit}/>)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedAddOrUpdateOrg = Form.create({ name: 'addOrUpdate' })(AddOrUpdateOrg);
export default WrappedAddOrUpdateOrg;
