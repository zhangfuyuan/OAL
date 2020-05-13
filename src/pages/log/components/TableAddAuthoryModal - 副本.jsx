import { Modal, Tree, message, List, Icon, } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { findIndex } from 'lodash';

const { TreeNode } = Tree;

const getPidFn = (pid, list, res = []) => {
  const index = findIndex(list, item => item._id === pid);

  if (index > -1) {
    return getPidFn(list[index].pid, list, res.concat(pid));
  } else {
    return res;
  }
};

const TableAddAuthoryModal = props => {
  const { treeData, treeOriginalData, visible, handleSubmit, handleCancel, curDeviceId } = props;
  const [checkedKeys, setCheckedKeys] = useState([]);

  // 建议：每次 Modal 关闭时重置
  useEffect(() => {
    if (visible === false) {
      resetAllVar();
    } else {
      setCheckedKeys(treeOriginalData && treeOriginalData.filter(node => node.isPeople && node.relateDevice && node.relateDevice.indexOf(curDeviceId) > -1).map(node => node._id) || []);
    }
  }, [visible]);

  const resetAllVar = () => {
    // 重置 state
    setCheckedKeys([]);
  };

  const handleCheck = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys);
  };

  const handleOk = () => {
    if (checkedKeys && checkedKeys.length > 0) {
      handleSubmit(treeOriginalData.filter(node => node.isPeople && checkedKeys.indexOf(node._id) > -1).map(node => node._id).join(','), () => {
        resetAllVar();
      });
    } else {
      message.error(formatMessage({ id: 'oal.log.pleaseSelectUser' }));
    }
  };

  const renderNodes = data =>
    // TODO 已关联设备的节点要禁用
    data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item._id}
            title={item._id === treeData[0]._id ? `${item.name}(${item.num})` : item.name}
            dataRef={item}
          >
            {renderNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode
        key={item._id}
        title={item.name}
        disableCheckbox={item.isPeople && item.relateDevice && item.relateDevice.indexOf(curDeviceId) > -1 || false}
        {...item}
        dataRef={item} />;
    });

  const removeUser = (e, item) => {
    const nodeIndex = findIndex(treeOriginalData, node => node._id === item);
    const pids = getPidFn(treeOriginalData[nodeIndex].pid, treeOriginalData);
    setCheckedKeys(checkedKeys.filter(key => !~[item, ...pids].indexOf(key)));
  };

  return (
    <Modal
      width="60%"
      destroyOnClose
      title={formatMessage({ id: 'oal.log.addAuthoryTitle' }, { num: treeOriginalData.filter(node => node.isPeople && checkedKeys.indexOf(node._id) > -1).length })} // TODO 需判断是否为用户
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
            defaultExpandedKeys={[treeData && treeData.length > 0 && treeData[0]._id || '0']}
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
              const nodeIndex = findIndex(treeOriginalData, node => node._id === item && node.isPeople && (!node.relateDevice || !~node.relateDevice.indexOf(curDeviceId)));

              return nodeIndex > -1 && treeOriginalData[nodeIndex] ?
                (<List.Item
                  style={{ padding: '5px 0' }}
                  actions={[<a key="list-loadmore-edit" onClick={e => removeUser(e, item)}><Icon type="close-circle" theme="filled" /></a>]}
                >
                  <List.Item.Meta
                    title={treeOriginalData[nodeIndex].name || '-'}
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
