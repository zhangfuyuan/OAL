import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const TreeDelModal = props => {
  const { bean, visible, handleSubmit, handleCancel } = props;

  const title = `${formatMessage({ id: 'oal.common.delete' })}(${bean && bean.name || '--'})`;

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={() => handleSubmit(bean && bean.id || '')}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.delete' })}
      okType="danger"
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
      <p><FormattedMessage id="oal.face.deleteGroupConfirm" /></p>
    </Modal>
  );
};
export default TreeDelModal;
