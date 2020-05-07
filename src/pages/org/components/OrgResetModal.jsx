import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const OrgResetModal = props => {
  const { orgBean, visible, handleSubmit, handleCancel, confirmLoading } = props;

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.org.resetPassword' })}
      visible={visible}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.reset' })}
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
        <p><FormattedMessage id="oal.org.resetPasswordConfirm" values={{ org: orgBean.name }} /></p>
    </Modal>
  );
};
export default OrgResetModal;
