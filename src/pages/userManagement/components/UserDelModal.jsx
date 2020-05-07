import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const UserDelModal = props => {
  const { userBean, visible, handleSubmit, handleCancel, confirmLoading } = props;

  // const title = `${formatMessage({ id: 'oal.user-manage.disableAccount' })}(${userBean.userName})`;

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.user-manage.disableAccount' })}
      visible={visible}
      onOk={() => handleSubmit(userBean)}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.disable' })}
      okType="danger"
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
        <p><FormattedMessage id="oal.user-manage.deleteAccountConfirm" /></p>
    </Modal>
  );
};
export default UserDelModal;
