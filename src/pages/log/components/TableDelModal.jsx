import { Modal } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const TableDelModal = props => {
  const { bean, visible, handleSubmit, handleCancel } = props;

  let title = formatMessage({ id: 'oal.log.remove' });
  if (bean && bean.length > 0) {
    if (bean.length === 1) {
      title = `${formatMessage({ id: 'oal.log.remove' })}(${bean && bean[0] && bean[0].name || '--'})`;
    } else {
      title = formatMessage({ id: 'oal.log.removeAuthoryTitle' }, { num: bean.length });
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
      okText={formatMessage({ id: 'oal.log.remove' })}
      okType="danger"
    >
      <p><FormattedMessage id="oal.log.removeAuthoryConfirm" /></p>
    </Modal>
  );
};
export default TableDelModal;
