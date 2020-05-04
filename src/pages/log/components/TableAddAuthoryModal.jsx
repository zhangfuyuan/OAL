import { Modal, Tree, message, List, Icon, } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { findIndex } from 'lodash';

const { TreeNode } = Tree;

const getPidFn = (pid, list, res = []) => {
  const index = findIndex(list, item => item.id === pid);

  if (index > -1) {
    return getPidFn(list[index].pid, list, res.concat(pid));
  } else {
    return res;
  }
};

const TableAddAuthoryModal = props => {
  const { treeData, treeOriginalData, visible, handleSubmit, handleCancel, curDeviceId } = props;
  const [checkedKeys, setCheckedKeys] = useState([]);

  const resetAllVar = () => {
    // 重置 state
    setCheckedKeys([]);
  };

  const handleCheck = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys);
  };

  const handleOk = () => {
    if (checkedKeys && checkedKeys.length > 0) {
      handleSubmit(treeOriginalData.filter(node => checkedKeys.indexOf(node.id) > -1 && !node.num).map(node => node.id).join(','), () => {
        resetAllVar();
      });
    } else {
      message.error(formatMessage({ id: 'oal.log.pleaseSelectUser' }));
    }
  };

  const renderNodes = data =>
    // 8126TODO 已关联设备的节点要禁用
    data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item.id}
            title={item.name}
            dataRef={item}
          >
            {renderNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode
        key={item.id}
        title={item.name}
        disableCheckbox={item.relateDevice && item.relateDevice.map(device => device.id).indexOf(curDeviceId) > -1 || false}
        {...item}
        dataRef={item} />;
    });

  const removeUser = (e, item) => {
    const nodeIndex = findIndex(treeOriginalData, node => node.id === item);
    const pids = getPidFn(treeOriginalData[nodeIndex].pid, treeOriginalData)
    console.log(8126, '节点路径：', [item, ...pids]);
    setCheckedKeys(checkedKeys.filter(key => !~[item, ...pids].indexOf(key)));
  };

  return (
    <Modal
      width="60%"
      destroyOnClose
      title={formatMessage({ id: 'oal.log.addAuthoryTitle' }, { num: treeOriginalData.filter(node => checkedKeys.indexOf(node.id) > -1 && !node.num).length })} // 8126TODO 需判断是否为用户
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.save' })}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ height: '50vh', overflow: 'auto', flex: 7, }}>
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={checkedKeys}
            onCheck={handleCheck}
          >
            {renderNodes(treeData)}
          </Tree>
        </div>

        <div className="oal-user-list" style={{ height: '50vh', overflow: 'auto', flex: 3, paddingLeft: '24px' }}>
          <List
            itemLayout="horizontal"
            dataSource={checkedKeys}
            split={false}
            renderItem={item => {
              // 8126TODO 需判断是否为用户
              const nodeIndex = findIndex(treeOriginalData, node => node.id === item && !node.num);

              return nodeIndex > -1 && treeOriginalData[nodeIndex] ?
                (<List.Item
                  style={{ padding: '5px 0' }}
                  actions={[<a key="list-loadmore-edit" onClick={e => removeUser(e, item)}><Icon type="close-circle" theme="filled" /></a>]}
                >
                  <List.Item.Meta
                    title={treeOriginalData[nodeIndex].name || '--'}
                  />
                </List.Item>) :
                (<List.Item style={{ display: 'none' }} />);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
export default TableAddAuthoryModal;
