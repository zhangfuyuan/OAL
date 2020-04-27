import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const UserResetModal = props => {
  const { userBean, visible, handleSubmit, handleCancel } = props;

  const title = formatMessage({ id: 'oal.user-manage.resetPassword' });

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={() => handleSubmit(userBean)}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.reset' })}
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
        <p><FormattedMessage id="oal.user-manage.resetPasswordConfirm" values={{ account: userBean.userName }} /></p>
    </Modal>
  );
};
export default UserResetModal;
