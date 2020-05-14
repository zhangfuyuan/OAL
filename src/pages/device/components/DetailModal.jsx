import { Modal, Descriptions, Button } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';

const recognitionModeType = {
  '0': 'oal.device.attendanceMode',
  '1': 'oal.device.standardMode',
  '2': 'oal.device.maskMode',
};

const infraredThermometerType = {
  '0': 'oal.device.nonsupport',
  '1': 'oal.device.support',
}

const DetailModal = props => {
  const { bean, visible, handleSubmit } = props;

  let title = formatMessage({ id: 'oal.device.deviceInfo' });

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleSubmit}
      maskClosable={false}
      width="60%"
      footer={[
        <Button key="submit" type="primary" onClick={handleSubmit}>
          <FormattedMessage id="oal.common.confirm" />
        </Button>,
      ]}
    >
      <div className="oal-descriptions">
        <Descriptions>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.deviceName' })}>{bean.name || '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.deviceId' })}>{bean.deviceUuid || '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.regtime' })}>{moment(bean.createAt).format('YYYY-MM-DD HH:mm') || '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.recentlyLaunched' })}>{moment(bean.heartbeatAt).format('YYYY-MM-DD HH:mm') || '-'}</Descriptions.Item>
          <Descriptions.Item label="IP">{bean.ip || '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.mac' })}>{bean.mac || '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.firmwareVersion' })}>{bean.firmwareVersion || '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.softwareRelease' })}>{bean.deviceVersion || '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.recognitionMode' })}>{recognitionModeType[bean.recognitionMode] ? formatMessage({ id: recognitionModeType[bean.recognitionMode] }) : '-'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'oal.device.infraredThermometer' })}>{infraredThermometerType[bean.infraredThermometer] ? formatMessage({ id: infraredThermometerType[bean.infraredThermometer] }) : '-'}</Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default DetailModal;
