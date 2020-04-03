import React, { Component, Fragment } from 'react';
import { List } from 'antd';

const passwordStrength = {
  strong: (
    <span className="strong">
      强
    </span>
  ),
  medium: (
    <span className="medium">
      中
    </span>
  ),
  weak: (
    <span className="weak">
      弱
    </span>
  ),
};

class SecurityView extends Component {
  state = {
  }

  handleModify = () => {
    const { openModal } = this.props;
    openModal();
  };

  getData = () => [
    {
      title: '密码',
      description: (
        <Fragment>
          当前密码强度
          ：{passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a href="#" onClick={() => this.handleModify()}>
          修改
        </a>,
      ],
    },
  ];

  render() {
    const data = this.getData();
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
      </Fragment>
    );
  }
}

export default SecurityView;
