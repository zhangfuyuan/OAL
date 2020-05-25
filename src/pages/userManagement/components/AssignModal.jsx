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
const AssignModal = props => {
  const { form, visible, bean, currentUser, handleCancel, handleSubmit, confirmLoading } = props;
  const { getFieldDecorator } = form;
  const authorizedPoints = currentUser.authorizedPoints || {};

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSubmit({
        userId: bean._id,
        points: parseInt(fieldsValue.points) || 0,
        diff: parseInt(fieldsValue.points) - bean.terminalTotal + bean.terminalAssigned || 0,
      });
    });
  };

  const normalizeNum = value => value === '0' ? '0' : (value && value.replace && parseInt(value.replace(/[^\d]/g, '')) || '') + '';

  const checkPoints = (rule, value, callback) => {
    if (value &&
      value.replace &&
      parseInt(value.replace(/[^\d]/g, '')) > (authorizedPoints.terminalTotal - authorizedPoints.terminalAssigned + bean.terminalTotal - bean.terminalAssigned || 0)) {
      callback(formatMessage({ id: 'oal.common.insufficientPoints' }));
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title={`${formatMessage({ id: 'oal.common.assignTo' })} ${bean && bean.userName || '-'}`}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      maskClosable={false}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span>
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            <FormattedMessage id="oal.common.myAvailablePoints" /> :
                 </span>
          <span style={{ margin: '0 50px 0 10px' }}>{authorizedPoints.terminalTotal - authorizedPoints.terminalAssigned || 0}</span>
        </span>
        <span>
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            <FormattedMessage id="oal.user-manage.agentPoints" /> :
                </span>
          <span style={{ margin: '0 50px 0 10px' }}>{bean && bean.terminalAssigned || 0}/{bean && bean.terminalTotal || 0}</span>
        </span>
      </div>

      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.user-manage.agentAvailablePoints' })}>
          {getFieldDecorator('points', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                validator: checkPoints,
              },
            ],
            normalize: normalizeNum,
            initialValue: (bean && bean.terminalTotal && bean.terminalAssigned && bean.terminalTotal - bean.terminalAssigned || 0) + '',
          })(<Input autoFocus placeholder={formatMessage({ id: 'oal.user-manage.agentAvailablePoints' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedAssignModal = Form.create({ name: 'assignModal' })(AssignModal);
export default WrappedAssignModal;
