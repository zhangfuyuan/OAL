import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const TableDelModal = props => {
  const { bean, visible, handleSubmit, handleCancel, confirmLoading } = props;

  let title = formatMessage({ id: 'oal.common.delete' });
  if (bean && bean.length > 0) {
    if (bean.length === 1) {
      title = `${formatMessage({ id: 'oal.common.delete' })}(${bean && bean[0] && bean[0].name || '--'})`;
    } else {
      title = formatMessage({ id: 'oal.device.deleteDeviceTitle' }, { num: bean.length });
    }
  }

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={() => handleSubmit()}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
      okText={formatMessage({ id: 'oal.common.delete' })}
      okType="danger"
    >
      <p><FormattedMessage id="oal.log.removeAuthoryConfirm" /></p>
    </Modal>
  );
};
export default TableDelModal;
