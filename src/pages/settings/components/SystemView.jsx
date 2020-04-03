import React, { Component, Fragment } from 'react';
import { List, Button, Result, message, Popconfirm, Avatar } from 'antd';
import logo from '@/assets/logo.svg';

class SystemView extends Component {
  setUrl = path => {
    if (!path) {
      return ''
    }
    const { origin } = window.location;
    const href = `${origin}/user/${path}/login`;
    return href;
  };

  handleModify = () => {
    const { openModal } = this.props;
    openModal();
  };

  getData = (currentUser, version) => {
    const orgInfo = (currentUser && currentUser.org) || {};
    const items = [
      {
        title: '访问地址',
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
        title: '系统名称',
        description: (
          <Fragment>
            {orgInfo.saasName}
          </Fragment>
        ),
        actions: [
          <a key="copy" onClick={() => this.handleModify()}>
            修改
          </a>,
        ],
      }, {
        title: (
          <Fragment>
            <span style={{ marginRight: '16px' }}>系统图标</span>
            <Avatar src={logo} />
          </Fragment>
        ),
        description: '',
        actions: [],
      })
    }
    items.push({
      title: '系统版本',
      description: (
        <Fragment>{version}</Fragment>
      ),
      actions: [],
    });
    return items;
  };

  render() {
    const { currentUser, version } = this.props;
    const data = this.getData(currentUser, version);
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
