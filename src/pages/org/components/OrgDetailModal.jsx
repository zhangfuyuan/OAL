import { Modal, message } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const OrgDetailModal = props => {
  const { orgBean, visible, handleSubmit, handleCancel } = props;

  const title = formatMessage({ id: 'oal.org.orgUsersKnow' });

  const { origin } = window.location;
  const href = `${origin}/user/${orgBean.path}/login`;
  const copyText = `${formatMessage({ id: 'oal.org.visit' })}${href},${formatMessage({ id: 'oal.org.login' })}admin/admin`

  const handleOk = () => {
    const copyArea = document.getElementById('copyArea');
    copyArea.select(); // 选择对象
    try {
      if (document.execCommand('copy', false, null)) {
        document.execCommand('Copy');
        handleSubmit();
        message.success(formatMessage({ id: 'oal.common.copySuccessfully' }));
      } else {
        message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
      }
    } catch (error) {
      message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
    }
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.copy' })}
      cancelText={formatMessage({ id: 'oal.common.close' })}
    >
        <p><FormattedMessage id="oal.org.giveUserFollowingInfo" /></p>
        <p><FormattedMessage id="oal.org.visit" />{href}</p>
        <p><FormattedMessage id="oal.org.login" />admin/admin</p>
        <textarea cols="40" rows="5" id="copyArea" defaultValue={copyText} style={{ position: 'absolute', top: '-999px', left: '-999px' }}/>
    </Modal>
  );
};
export default OrgDetailModal;
