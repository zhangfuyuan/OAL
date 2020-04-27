import React, { Component, Fragment } from 'react';
import { List, Button, Result, message, Popconfirm, Avatar } from 'antd';
import logo from '@/assets/logo.svg';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;

class SystemView extends Component {
  setUrl = path => {
    if (!path) {
      return ''
    }
    const { origin } = window.location;
    const href = `${origin}${publicPath}user/${path}/login`;
    return href;
  };

  handleModify = () => {
    const { openModal } = this.props;
    openModal();
  };

  handleModifyIcons = () => {
    const { openUploadModal } = this.props;
    openUploadModal();
  };

  getData = (currentUser, version, icons) => {
    const orgInfo = (currentUser && currentUser.org) || {};
    const items = [
      {
        title: formatMessage({ id: 'oal.settings.accessAddress' }),
        description: (
          <Fragment>
            {this.setUrl((orgInfo && orgInfo.path) || '')}
          </Fragment>
        ),
        actions: [],
      },
    ];

    if (currentUser.type === 0 && orgInfo.type === 0) {
      items.push({
        title: formatMessage({ id: 'oal.settings.sysname' }),
        description: (
          <Fragment>
            {orgInfo.saasName}
          </Fragment>
        ),
        actions: [
          <a key="sysname" onClick={() => this.handleModify()}>
            <FormattedMessage id="oal.common.modify" />
          </a>,
        ],
      }, {
        title: (
          <Fragment>
            <span style={{ marginRight: '16px' }}><FormattedMessage id="oal.settings.systemIcons" /></span>
            {/* 8126TODO 动态显示系统图标 */}
            <Avatar src={orgInfo.img ? logo : (icons || '/faceImg/8081/4,0c734d7546')} />
          </Fragment>
        ),
        description: '',
        actions: [
          <a key="systemIcons" onClick={() => this.handleModifyIcons()}>
            <FormattedMessage id="oal.common.modify" />
          </a>,
        ],
      })
    }
    items.push({
      title: formatMessage({ id: 'oal.settings.systemVersion' }),
      description: (
        <Fragment>{version}</Fragment>
      ),
      actions: [],
    });
    return items;
  };

  render() {
    const { currentUser, version, icons } = this.props;
    const data = this.getData(currentUser, version, icons);
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={data}
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

export default SystemView;
