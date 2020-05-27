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
  const {
    form,
    visible,
    bean = {},
    currentUserAuthorizedPoints: {
      terminalTotal: currentUserTerminalTotal = 0,
      terminalAssigned: currentUserTerminalAssigned = 0,
    },
    handleCancel,
    handleSubmit,
    confirmLoading
  } = props;
  const {
    terminalTotal: beanTerminalTotal = 0,
    terminalAssigned: beanTerminalAssigned = 0,
  } = bean.authorizedPoints || {};
  const { getFieldDecorator } = form;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSubmit({
        userId: bean._id,
        points: parseInt(fieldsValue.points) || 0,
        diff: parseInt(fieldsValue.points) - beanTerminalTotal || 0,
      });
    });
  };

  const normalizeNum = value => value === '0' ? '0' : (value && value.replace && parseInt(value.replace(/[^\d]/g, '')) || '') + '';

  const checkPoints = (rule, value, callback) => {
    if (value && value.replace) {
      const _val = parseInt(value.replace(/[^\d]/g, ''));

      if (_val < beanTerminalAssigned) {
        callback(formatMessage({ id: 'oal.user-manage.totalNotLessAssign' }));
      } else if (_val > currentUserTerminalTotal - currentUserTerminalAssigned + beanTerminalTotal) {
        callback(formatMessage({ id: 'oal.common.insufficientPoints' }));
      }
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
          <span style={{ margin: '0 50px 0 10px' }}>{currentUserTerminalTotal - currentUserTerminalAssigned || 0}</span>
        </span>
        <span>
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            <FormattedMessage id="oal.user-manage.agentPoints" /> :
                </span>
          <span style={{ margin: '0 50px 0 10px' }}>{beanTerminalAssigned || 0}/{beanTerminalTotal || 0}</span>
        </span>
      </div>

      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.user-manage.agentTotalPoints' })}>
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
            initialValue: (beanTerminalTotal || 0) + '',
          })(<Input autoFocus placeholder={formatMessage({ id: 'oal.user-manage.agentTotalPoints' })} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedAssignModal = Form.create({ name: 'assignModal' })(AssignModal);
export default WrappedAssignModal;
