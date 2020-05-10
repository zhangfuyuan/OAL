import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const DeviceDelModal = props => {
  const { deviceBeanList, visible, handleSubmit, handleCancel, confirmLoading } = props;

  let title = '';
  if (deviceBeanList) {
    const len = deviceBeanList.length;

    if (len === 1) {
      title = `${formatMessage({ id: 'oal.common.delete' })}(${deviceBeanList[0].name})`;
    } else if (len > 1) {
      title = `${formatMessage({ id: 'oal.device.deleteDeviceTitle' }, { num: len })}`;
    } else {
      title = formatMessage({ id: 'oal.common.delete' });
    }
  }

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={() => handleSubmit(deviceBeanList)}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
      okText={formatMessage({ id: 'oal.common.delete' })}
      okType="danger"
      cancelText={formatMessage({ id: 'oal.common.cancel' })}
    >
      <p><FormattedMessage id="oal.device.deleteDeviceConfirm" /></p>
    </Modal>
  );
};
export default DeviceDelModal;
