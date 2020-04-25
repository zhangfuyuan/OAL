import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const OrgResetModal = props => {
  const { orgBean, visible, handleSubmit, handleCancel } = props;

  const title = formatMessage({ id: 'oal.org.resetPassword' });

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.reset' })}
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
        <p><FormattedMessage id="oal.org.resetPasswordConfirm" /></p>
    </Modal>
  );
};
export default OrgResetModal;
