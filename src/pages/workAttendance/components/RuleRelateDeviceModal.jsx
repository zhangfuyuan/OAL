import { Modal, Button, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { findIndex } from 'lodash';

const dUuid = dBean => `${dBean.name}(${dBean._id})`;

const RuleRelateDeviceModal = props => {
  const { bean: {
    selectedBean,
    deviceList,
  }, visible, handleSubmit, handleCancel } = props;
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // 8126TODO 遍历
    // 每次 visible 发生变化，刷新已选设备属性 selectedItems 的值
    if (visible === true) {
      setSelectedItems(
        selectedBean &&
        selectedBean.deviceInfo &&
        selectedBean.deviceInfo._id &&
        [dUuid(selectedBean.deviceInfo)] ||
        []
      );
    } else {
      resetAllVar();
    }
  }, [visible]);

  const resetAllVar = () => {
    // 重置 state
    setSelectedItems([]);
  };

  const title = `${formatMessage({ id: 'oal.work-rule.relateDevice' })}(${selectedBean && selectedBean.ruleName || '--'})`;

  const handleChange = selectedItems => {
    setSelectedItems(selectedItems);
  };

  const handleOk = () => {
    handleSubmit(selectedBean, selectedItems.map(item => item.substring(item.lastIndexOf('(') + 1, item.lastIndexOf(')'))).join(','));
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText={formatMessage({ id: 'oal.common.save' })}
    >
      <Select
        mode="multiple"
        placeholder={formatMessage({ id: 'oal.work-rule.pleaseSelectAssociatedDevice' })}
        value={selectedItems}
        style={{ width: '100%' }}
        onChange={handleChange}
      >
        {
          deviceList.filter(item => !selectedItems.includes(dUuid(item))).map(item => (
            <Select.Option key={dUuid(item)} value={dUuid(item)} title={dUuid(item)}>
              {dUuid(item)}
            </Select.Option>
          ))}
      </Select>
    </Modal>
  );
};
export default RuleRelateDeviceModal;
