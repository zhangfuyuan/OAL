import { Modal, Form, Input, Checkbox, Row, Col } from 'antd';
import React from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const ModifyAlarmEvents = props => {
  const { form, visible, currentUser, handleSubmit, confirmLoading, handleCancel } = props;
  const { getFieldDecorator } = form;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log('---------fieldsValue----------', fieldsValue)
      if (err) return;
      const params = {
        alarmEvents: fieldsValue && fieldsValue.alarmEvents.join(',') || '',
      };
      if (currentUser && currentUser.org) params.orgId = currentUser.org._id;
      handleSubmit(params);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.settings.alarmEvents' })}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <div className="oal-alarm-events">
        <Form>
          <Form.Item label="">
            {getFieldDecorator('alarmEvents', {
              initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.alarmEvents && currentUser.alarmSet.alarmEvents.split(',') || ['', ''],
            })(
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                  <Col span={24}>
                    <Checkbox value="temperatureAnomalies">
                      <FormattedMessage id="oal.settings.temperatureAnomalies" />
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="notWearMask">
                      <FormattedMessage id="oal.settings.notWearMask" />
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
const WrappedModifyAlarmEvents = Form.create({ name: 'modifyAlarmEvents' })(ModifyAlarmEvents);
export default WrappedModifyAlarmEvents;
