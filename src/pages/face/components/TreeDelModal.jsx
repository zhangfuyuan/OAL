import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const TreeDelModal = props => {
  const { bean, visible, handleSubmit, handleCancel, confirmLoading } = props;

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.common.delete' })}
      visible={visible}
      onOk={() => handleSubmit({ groupId: bean && bean._id || '', groupPid: bean && bean.pid || '' })}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.delete' })}
      okType="danger"
      confirmLoading={confirmLoading}
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
      <p><FormattedMessage id="oal.face.deleteGroupConfirm" /></p>
    </Modal>
  );
};
export default TreeDelModal;
