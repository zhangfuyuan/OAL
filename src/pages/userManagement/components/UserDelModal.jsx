import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const UserDelModal = props => {
  const { userBean, visible, handleSubmit, handleCancel } = props;

  const title = `${formatMessage({ id: 'oal.user-manage.deleteAccount' })}(${userBean.userName})`;

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={() => handleSubmit(userBean)}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.delete' })}
      okType="danger"
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
        <p><FormattedMessage id="oal.user-manage.deleteAccountConfirm" /></p>
    </Modal>
  );
};
export default UserDelModal;
