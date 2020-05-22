import { Modal, Icon, message, notification, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const AuthorizedPointsLoading = props => {
  const { visible, handleCancel } = props;

  return (
    <Modal
      visible={visible}
      destroyOnClose
      maskClosable={false}
      title={formatMessage({ id: 'oal.settings.pleaseLater' })}
      centered
      closable={false}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          <FormattedMessage id="oal.common.cancel" />
        </Button>,
      ]}
    >
      <p style={{ fontWeight: 'bold' }}>
        <FormattedMessage id="oal.settings.testingAuthorizationEnvironment" />
      </p>
    </Modal>
  );
};

export default AuthorizedPointsLoading;
