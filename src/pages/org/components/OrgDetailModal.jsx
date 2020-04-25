import { Modal, message, Divider } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;

const OrgDetailModal = props => {
  const { orgBean, visible, handleSubmit, handleCancel } = props;

  const title = formatMessage({ id: 'oal.org.orgUsersKnow' });

  const { origin } = window.location;
  const href = `${origin}${publicPath}user/${orgBean.path}/login`;
  const copyText = `${formatMessage({ id: 'oal.org.accessAddress' })} : ${href}\n${formatMessage({ id: 'oal.org.loginAccount' })} : admin\n${formatMessage({ id: 'oal.org.initialPassword' })} : admin`;

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
        <p><FormattedMessage id="oal.org.orgName" /> : {orgBean.name}</p>
        <p><FormattedMessage id="oal.org.contacts" /> : {orgBean.contact && orgBean.contact.nickName}</p>
        <p><FormattedMessage id="oal.common.phoneNumber" /> : {orgBean.contact && orgBean.contact.mobile}</p>
        <Divider />
        <p><FormattedMessage id="oal.org.giveUserFollowingInfo" /> : </p>
        <p><FormattedMessage id="oal.org.accessAddress" /> : {href}</p>
        <p><FormattedMessage id="oal.org.loginAccount" /> : admin</p>
        <p><FormattedMessage id="oal.org.initialPassword" /> : admin</p>
        <textarea cols="40" rows="5" id="copyArea" defaultValue={copyText} style={{ position: 'absolute', top: '-999px', left: '-999px' }}/>
    </Modal>
  );
};
export default OrgDetailModal;
