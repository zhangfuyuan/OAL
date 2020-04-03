import React, { Component, Fragment } from 'react';
import { List, Button, Result, message, Popconfirm, Spin } from 'antd';

class DeveloperView extends Component {
  state = {

  }

  handleCopy = key => {
    const copyArea = document.getElementById(`${key}`);
    copyArea.select(); // 选择对象
    try {
      if (document.execCommand('copy', false, null)) {
        document.execCommand('Copy');
        message.success('复制成功');
      } else {
        message.error('复制失败,可以尝试手动复制');
      }
    } catch (error) {
      message.error('复制失败,可以尝试手动复制');
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
          复制
        </a>,
      ],
    },
    {
      title: '密钥',
      description: (
        <Fragment>
          {this.setSecret(devInfo.secret)}
        </Fragment>
      ),
      actions: [
        <Popconfirm title="确定重置密钥？" okText="确定" cancelText="取消" onConfirm={() => this.handleReset()}>
          <a href="#">重置</a>
        </Popconfirm>,
        <a key="copy" onClick={() => this.handleCopy('secret')}>
          复制
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
          title="未申请开发者账号"
          extra={<Button type="primary" onClick={toApply}>点击申请</Button>}
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
