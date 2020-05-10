import { Modal, Tree, message } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const { TreeNode } = Tree;

const TableMoveModal = props => {
  const { treeData, visible, handleSubmit, handleCancel, confirmLoading } = props;
  const [treeFocusKey, setTreeFocusKey] = useState('');

  const resetAllVar = () => {
    // 重置 state
    setTreeFocusKey('');
  };

  const handleSelect = (selectedKeys, e) => {
    setTreeFocusKey(selectedKeys[0]);
  };

  const handleOk = () => {
    if (treeFocusKey) {
      handleSubmit(treeFocusKey, () => {
        resetAllVar();
      });
    } else {
      message.error(formatMessage({ id: 'oal.face.pleaseSelectTargetGroup' }));
    }
  };

  const renderNodes = data =>
    data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item._id} title={item.name} dataRef={item}>
            {renderNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item._id} title={item.name} {...item} dataRef={item} />;
    });

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.face.moveUserTo' })}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
      okText={formatMessage({ id: 'oal.common.save' })}
    >
      <Tree
        defaultExpandedKeys={[treeData && treeData.length > 0 && treeData[0]._id || '0']}
        blockNode
        onSelect={handleSelect}
      >
        {renderNodes(treeData)}
      </Tree>
    </Modal>
  );
};
export default TableMoveModal;
