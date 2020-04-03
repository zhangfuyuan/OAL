import { Modal, message } from 'antd';
import React from 'react';

const OrgDetailModal = props => {
  const { orgBean, visible, handleSubmit, handleCancel } = props;

  const title = '组织用户需知';

  const { origin } = window.location;
  const href = `${origin}/user/${orgBean.path}/login`;
  const copyText = `访问：${href},登录：admin/admin`

  const handleOk = () => {
    const copyArea = document.getElementById('copyArea');
    copyArea.select(); // 选择对象
    try {
      if (document.execCommand('copy', false, null)) {
        document.execCommand('Copy');
        handleSubmit();
        message.success('复制成功');
      } else {
        message.error('复制失败,可以尝试手动复制');
      }
    } catch (error) {
      message.error('复制失败,可以尝试手动复制');
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
      okText="复制"
      cancelText="关闭"
    >
        <p>请给用户以下信息：</p>
        <p>访问：{href}</p>
        <p>登录：admin/admin</p>
        <textarea cols="40" rows="5" id="copyArea" defaultValue={copyText} style={{ position: 'absolute', top: '-999px', left: '-999px' }}/>
    </Modal>
  );
};
export default OrgDetailModal;
