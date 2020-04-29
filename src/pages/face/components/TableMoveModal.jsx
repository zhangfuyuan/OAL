import { Modal, Tree, message } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const { TreeNode } = Tree;

const TableMoveModal = props => {
  const { treeData, visible, handleSubmit, handleCancel } = props;
  const [treeFocusKey, setTreeFocusKey] = useState('');

  const resetAllVar = () => {
    // 重置 state
    setTreeFocusKey('');
  };

  const handleSelect = (selectedKeys, e) => {
    console.log(8126, '移动用户到', selectedKeys[0]);
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
          <TreeNode key={item.id} title={`${item.name} (${item.num})`} dataRef={item}>
            {renderNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={`${item.name} (${item.num})`} {...item} dataRef={item} />;
    });

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.face.moveUserTo' })}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.save' })}
    >
      <Tree
        defaultExpandAll
        blockNode
        onSelect={handleSelect}
      >
        {renderNodes(treeData)}
      </Tree>
    </Modal>
  );
};
export default TableMoveModal;
