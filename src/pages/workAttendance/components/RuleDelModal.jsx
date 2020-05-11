import { Modal, Button } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const RuleDelModal = props => {
  const { bean, visible, handleSubmit, handleCancel } = props;

  const title = `${formatMessage({ id: 'oal.common.delete' })}(${bean.name || '-'})`;

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onCancel={handleCancel}
      maskClosable={false}
      footer={[
        <Button key="no" onClick={() => handleSubmit(bean, 0)}>
          <FormattedMessage id="oal.common.no" />
        </Button>,
        <Button key="yes" type="danger" onClick={() => handleSubmit(bean, 1)}>
          <FormattedMessage id="oal.common.yes" />
        </Button>,
      ]}
    >
      <p><FormattedMessage id="oal.work-rule.deleteRuleConfirm" /></p>
    </Modal>
  );
};
export default RuleDelModal;
