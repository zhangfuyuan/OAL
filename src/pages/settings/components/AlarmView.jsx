import React, { Component, Fragment } from 'react';
import { List, Button, Result, message, Popconfirm, Avatar, Upload, notification, Spin, Form, Input, Tooltip } from 'antd';
import logo from '@/assets/logo.png';
import { FormattedMessage, formatMessage, getLocale } from 'umi-plugin-react/locale';

const { TextArea } = Input;
const alarmEventsMap = {
  'temperatureAnomalies': 'oal.settings.temperatureAnomalies',
  'notWearMask': 'oal.settings.notWearMask',
}
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

class AlarmView extends Component {
  state = {
    isModifyAlarmContent: false,
  };

  handleModifyAlarmContent = () => {
    const { updateAlarmContent, form, currentUser } = this.props;
    const { isModifyAlarmContent } = this.state;

    if (isModifyAlarmContent) {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const params = fieldsValue;
        if (currentUser && currentUser.org) params.orgId = currentUser.org._id;
        params.mailLanguage = getLocale();
        updateAlarmContent(params, () => {
          this.setState({
            isModifyAlarmContent: false,
          });
        });
      });
    } else {
      this.setState({
        isModifyAlarmContent: true,
      });
    }
  };

  useDefaultTemplate = () => {
    this.props.form.setFieldsValue({ mailContent: formatMessage({ id: 'oal.settings.mailContentTemplate' }) });
  };

  clickCopyEventVariable = variable => {
    const copyArea = document.getElementById(`copyArea_${variable}`);

    copyArea.select(); // 选择对象

    try {
      if (document.execCommand('copy', false, null)) {
        document.execCommand('Copy');
        message.success(formatMessage({ id: 'oal.common.copySuccessfully' }));
      } else {
        message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
      }
    } catch (error) {
      message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
    }
  };

  getData = () => {
    const {
      form,
      currentUser,
      orgId,
      openSendSettingsModal,
      deleteAlarmSendSettings,
      openReceiveSettingsModal,
      deleteAlarmReceiveSettings,
      openEventsModal,
      updateAlarmContent,
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { isModifyAlarmContent } = this.state;
    const alarmInfo = (currentUser && currentUser.alarmSet) || {};

    const items = [
      {
        title: formatMessage({ id: 'oal.settings.sendSettings' }),
        description: (
          <Fragment>
            {alarmInfo && alarmInfo.username || formatMessage({ id: 'oal.common.unset' })}
          </Fragment>
        ),
        actions: alarmInfo && alarmInfo.username ?
          [
            <a key="modify" onClick={openSendSettingsModal}>
              <FormattedMessage id="oal.common.modify" />
            </a>,
            <a key="delete" onClick={deleteAlarmSendSettings} style={{ color: '#FF4D4F', }} >
              <FormattedMessage id="oal.common.delete" />
            </a>,
          ] :
          [
            <a key="modify" onClick={openSendSettingsModal}>
              <FormattedMessage id="oal.common.modify" />
            </a>,
          ]
      },
      {
        title: formatMessage({ id: 'oal.settings.receiveSettings' }),
        description: (
          <Fragment>
            {alarmInfo && alarmInfo.receiveMail || formatMessage({ id: 'oal.common.unset' })}
          </Fragment>
        ),
        actions: alarmInfo && alarmInfo.receiveMail ?
          [
            <a key="modify" onClick={openReceiveSettingsModal}>
              <FormattedMessage id="oal.common.modify" />
            </a>,
            <a key="delete" onClick={deleteAlarmReceiveSettings} style={{ color: '#FF4D4F', }} >
              <FormattedMessage id="oal.common.delete" />
            </a>,
          ] :
          [
            <a key="modify" onClick={openReceiveSettingsModal}>
              <FormattedMessage id="oal.common.modify" />
            </a>,
          ],
      },
      {
        title: formatMessage({ id: 'oal.settings.alarmEvents' }),
        description: (
          <Fragment>
            {alarmInfo && alarmInfo.alarmEvents && alarmInfo.alarmEvents.split(',').map(item => formatMessage({ id: alarmEventsMap[item] || 'oal.common.unset' })).join('、') || formatMessage({ id: 'oal.common.unset' })}
          </Fragment>
        ),
        actions: [
          <a key="modify" onClick={openEventsModal}>
            <FormattedMessage id="oal.common.modify" />
          </a>,
        ],
      },
      {
        title: formatMessage({ id: 'oal.settings.alarmContent' }),
        description: (
          <Fragment>
            {
              isModifyAlarmContent ?
                (<div className="oal-alarm-content">
                  <Form {...formItemLayout}>
                    <Form.Item label={formatMessage({ id: 'oal.settings.mailSubject' })}>
                      {getFieldDecorator('mailSubject', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'oal.common.pleaseEnter' }),
                          },
                          {
                            max: 30,
                            message: formatMessage({ id: 'oal.common.maxLength' }, { num: '30' }),
                          },
                        ],
                        initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.mailSubject || '',
                      })(<Input
                        placeholder={formatMessage({ id: 'oal.settings.mailSubject' })}
                      />)}
                      <span style={{ paddingLeft: '20px' }}>{getFieldValue('mailSubject').length}/30</span>
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'oal.settings.mailContent' })}>
                      {getFieldDecorator('mailContent', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'oal.common.pleaseEnter' }),
                          },
                          {
                            max: 500,
                            message: formatMessage({ id: 'oal.common.maxLength' }, { num: '500' }),
                          },
                        ],
                        initialValue: currentUser && currentUser.alarmSet && currentUser.alarmSet.mailContent || formatMessage({ id: 'oal.settings.mailContentTemplate' }),
                      })(<TextArea
                        placeholder={formatMessage({ id: 'oal.settings.mailContent' })}
                        autoSize={{ minRows: 5 }}
                      />)}
                      <span style={{ paddingLeft: '20px' }}>{getFieldValue('mailContent').length}/500</span>
                    </Form.Item>
                  </Form>

                  <a
                    style={{ position: 'absolute', bottom: '82px', right: '22%' }}
                    onClick={this.useDefaultTemplate}>
                    <FormattedMessage id="oal.settings.defaultTemplate" />
                  </a>

                  <div style={{ paddingLeft: '25%', paddingTop: '20px' }}>
                    <p><FormattedMessage id="oal.settings.clickCopyEventVariable" /></p>

                    <p>
                      <Tooltip title="${name}" >
                        <a
                          style={{ marginRight: '20px' }}
                          onClick={() => this.clickCopyEventVariable('name')}>
                          <FormattedMessage id="oal.settings.nickname" />

                          <textarea cols="40" rows="5" id="copyArea_name" defaultValue="${name}" style={{ position: 'absolute', top: '-999px', left: '-999px' }} />
                        </a>
                      </Tooltip>

                      <Tooltip title="${devicename}">
                        <a
                          style={{ marginRight: '20px' }}
                          onClick={() => this.clickCopyEventVariable('devicename')}>
                          <FormattedMessage id="oal.settings.devicename" />

                          <textarea cols="40" rows="5" id="copyArea_devicename" defaultValue="${devicename}" style={{ position: 'absolute', top: '-999px', left: '-999px' }} />
                        </a>
                      </Tooltip>

                      <Tooltip title="${time}">
                        <a
                          style={{ marginRight: '20px' }}
                          onClick={() => this.clickCopyEventVariable('time')}>
                          <FormattedMessage id="oal.settings.dateTime" />

                          <textarea cols="40" rows="5" id="copyArea_time" defaultValue="${time}" style={{ position: 'absolute', top: '-999px', left: '-999px' }} />
                        </a>
                      </Tooltip>

                      <Tooltip title="${personName}">
                        <a
                          style={{ marginRight: '20px' }}
                          onClick={() => this.clickCopyEventVariable('personName')}>
                          <FormattedMessage id="oal.settings.personName" />

                          <textarea cols="40" rows="5" id="copyArea_personName" defaultValue="${personName}" style={{ position: 'absolute', top: '-999px', left: '-999px' }} />
                        </a>
                      </Tooltip>

                      <Tooltip title="${jobNumber}">
                        <a
                          style={{ marginRight: '20px' }}
                          onClick={() => this.clickCopyEventVariable('jobNumber')}>
                          <FormattedMessage id="oal.settings.jobNumber" />

                          <textarea cols="40" rows="5" id="copyArea_jobNumber" defaultValue="${jobNumber}" style={{ position: 'absolute', top: '-999px', left: '-999px' }} />
                        </a>
                      </Tooltip>

                      <Tooltip title="${alarmEvents}">
                        <a
                          style={{ marginRight: '20px' }}
                          onClick={() => this.clickCopyEventVariable('alarmEvents')}>
                          <FormattedMessage id="oal.settings.alarmEvents" />

                          <textarea cols="40" rows="5" id="copyArea_alarmEvents" defaultValue="" style={{ position: 'absolute', top: '-999px', left: '-999px' }} />
                        </a>
                      </Tooltip>
                    </p>
                  </div>
                </div>) : ''
            }
          </Fragment>
        ),
        actions: [
          <a key="modify" onClick={this.handleModifyAlarmContent}>
            {
              isModifyAlarmContent ?
                <FormattedMessage id="oal.common.complete" /> :
                <FormattedMessage id="oal.common.modify" />
            }
          </a>,
        ],
      },
    ];

    return items;
  };

  render() {
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item
              actions={item.actions}
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default Form.create()(AlarmView);
