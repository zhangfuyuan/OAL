import React, { Component, Fragment } from 'react';
import { List } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="oal.settings.strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="oal.settings.medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="oal.settings.weak" />
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
      title: formatMessage({ id: 'oal.common.password' }),
      description: (
        <Fragment>
          <FormattedMessage id="oal.settings.currentPasswordStrength" />
          ：{passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a href="#" onClick={() => this.handleModify()}>
          <FormattedMessage id="oal.common.modify" />
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
