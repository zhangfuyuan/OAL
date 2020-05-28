import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const TableDelModal = props => {
  const { bean, visible, handleSubmit, handleCancel, confirmLoading } = props;

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.device.deleteDeviceTitle' }, { num: bean.length })}
      visible={visible}
      onOk={() => handleSubmit()}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
      okText={formatMessage({ id: 'oal.common.delete' })}
      okType="danger"
    >
      <p><FormattedMessage id="oal.log-query.removeConfirm" /></p>
    </Modal>
  );
};
export default TableDelModal;
