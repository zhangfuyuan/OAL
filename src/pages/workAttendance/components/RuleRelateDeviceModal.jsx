import { Modal, Button, Select, Checkbox, Row, Col, Empty } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { findIndex } from 'lodash';

const dUuid = dBean => `${dBean.name}(${dBean._id})`;

const RuleRelateDeviceModal = props => {
  const { bean: {
    selectedBean,
    deviceList,
  }, visible, handleSubmit, handleCancel, confirmLoading } = props;
  // const [selectedItems, setSelectedItems] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState([]);

  useEffect(() => {
    // 8126TODO 遍历
    // 每次 visible 发生变化，刷新已选设备属性 selectedItems 的值
    if (visible === true) {
      // setSelectedItems(
      //   selectedBean &&
      //   selectedBean.deviceInfo &&
      //   selectedBean.deviceInfo._id &&
      //   [dUuid(selectedBean.deviceInfo)] ||
      //   []
      // );
      setCheckboxChecked(deviceList &&
        deviceList.length > 0 &&
        deviceList.filter(device => device.relateRuleId && device.relateRuleId.indexOf(selectedBean._id) > -1 || false).map(device => device._id) ||
        []
      )
    } else {
      resetAllVar();
    }
  }, [visible]);

  const resetAllVar = () => {
    // 重置 state
    // setSelectedItems([]);
    setCheckboxChecked([]);
  };

  // const title = `${formatMessage({ id: 'oal.work-rule.relateDevice' })}(${selectedBean && selectedBean.name || '-'})`;

  // const handleChange = selectedItems => {
  //   setSelectedItems(selectedItems);
  // };

  const handleOk = () => {
    // handleSubmit(selectedBean, selectedItems.map(item => item.substring(item.lastIndexOf('(') + 1, item.lastIndexOf(')'))).join(','));
    handleSubmit(selectedBean, checkboxChecked.join(','));
  };

  const handleCheckboxChange = checkedValue => {
    setCheckboxChecked(checkedValue);
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.work-rule.relateDevice' })}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
      okText={formatMessage({ id: 'oal.common.save' })}
    >
      {/* <Select
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
      </Select> */}
      <div className="oal-rule-relate" style={{ width: '100%', height: '50vh', overflow: 'auto' }}>
        {
          deviceList && deviceList.length > 0 ?
            (<Checkbox.Group
              style={{ width: '100%' }}
              defaultValue={checkboxChecked}
              // options={deviceList.map(device => {
              //   return {
              //     label: device.name,
              //     value: device._id,
              //   };
              // })}
              value={checkboxChecked}
              onChange={handleCheckboxChange}
            >
              {
                deviceList.map(device => (<Row key={device._id}>
                  <Col span={24}>
                    <Checkbox value={device._id}>{device.name}</Checkbox>
                  </Col>
                </Row>))
              }
            </Checkbox.Group>) : <Empty />
        }
      </div>
    </Modal>
  );
};
export default RuleRelateDeviceModal;
