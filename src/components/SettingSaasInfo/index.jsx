import React from 'react';
import { Card, Alert, Input, Button, message } from 'antd'; // loading components from code split
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const SettingPsw = (props) => {
  let self = {};
  const onSubmit = () => {
    console.log('this.saasName---', self.saasName);
    console.log('this.refs.email.refs.input.value=', self.saasName.input.value);
    if (!self.saasName.input.value) {
      message.error(
        formatMessage({
          id: 'oal.common.enterServiceName',
        }),
      );
      return
    }
    props.onSubmit({ saasName: self.saasName.input.value });
  }
  return (
    <div style={{ background: '#ECECEC', padding: '30px', height: '100Vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card bordered={false} style={{ width: 300 }}>
        <Alert
          message={formatMessage({
            id: 'oal.common.setServiceInfo',
          })}
          type="info"
          showIcon
        />
        <br />
        <Input ref={(ref) =>self.saasName = ref } size="large" placeholder={formatMessage({ id: 'oal.common.enterSaasName' })} />
        <br />
        <br />
        <Button onClick={onSubmit} type="primary" htmlType="submit" className="login-form-button" loading={props.loading} block>
          <FormattedMessage id="oal.common.nextStep" />
        </Button>
      </Card>
    </div>
  )
};

export default SettingPsw;
