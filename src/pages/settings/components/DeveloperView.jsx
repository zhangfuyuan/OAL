import React, { Component, Fragment } from 'react';
import { List, Button, Result, message, Popconfirm, Spin } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

class DeveloperView extends Component {
  state = {

  }

  handleCopy = key => {
    const copyArea = document.getElementById(`${key}`);
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

  handleReset = () => {
    const { toReset } = this.props;
    toReset();
  };

  setSecret = value => {
    let str = '';
    if (value) {
      str = `${value.substr(0, 4)}********************************${value.substr((value.length - 4), value.length)}`;
    }
    return str;
  };

  getData = devInfo => [
    {
      title: 'key',
      description: (
        <Fragment>
          {devInfo.key}
        </Fragment>
      ),
      actions: [
        <a href="#" onClick={() => this.handleCopy('key')}>
          <FormattedMessage id="oal.common.copy" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'oal.settings.secretKey' }),
      description: (
        <Fragment>
          {this.setSecret(devInfo.secret)}
        </Fragment>
      ),
      actions: [
        <Popconfirm title={formatMessage({ id: 'oal.settings.confirmResetKey' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.handleReset()}>
          <a href="#"><FormattedMessage id="oal.common.reset" /></a>
        </Popconfirm>,
        <a key="copy" onClick={() => this.handleCopy('secret')}>
          <FormattedMessage id="oal.common.copy" />
        </a>,
      ],
    },
  ];

  render() {
    const { devInfo, toApply, loading } = this.props;
    if (loading) {
      return (
        <Result
          icon={<div></div>}
          extra={<Spin size="large" />}
        />
      )
    }
    if (!devInfo) {
      return (
        <Result
          status="404"
          title={formatMessage({ id: 'oal.settings.noApplicationForDeveloperAccount' })}
          extra={<Button type="primary" onClick={toApply}><FormattedMessage id="oal.settings.clickApplication" /></Button>}
        />
      )
    }
    const data = this.getData(devInfo);
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <input id="key" defaultValue={devInfo.key} style={{ position: 'absolute', top: '-999px', left: '-999px' }}/>
        <input id="secret" defaultValue={devInfo.secret} style={{ position: 'absolute', top: '-999px', left: '-999px' }}/>
      </Fragment>
    );
  }
}

export default DeveloperView;
