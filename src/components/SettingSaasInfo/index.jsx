import React from 'react';
import { Card, Alert, Input, Button, message } from 'antd'; // loading components from code split

const SettingPsw = (props) => {
  let self = {};
  const onSubmit = () => {
    console.log('this.saasName---', self.saasName);
    console.log('this.refs.email.refs.input.value=', self.saasName.input.value);
    if (!self.saasName.input.value) {
      message.error('请填写服务名称');
      return
    }
    props.onSubmit({ saasName: self.saasName.input.value });
  }
  return (
    <div style={{ background: '#ECECEC', padding: '30px', height: '100Vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card bordered={false} style={{ width: 300 }}>
        <Alert
          message="设置服务信息"
          type="info"
          showIcon
        />
        <br />
        <Input ref={(ref) =>self.saasName = ref } size="large" placeholder="输入您的SAAS服务名称" />
        <br />
        <br />
        <Button onClick={onSubmit} type="primary" htmlType="submit" className="login-form-button" loading={props.loading} block>
          下一步
        </Button>
      </Card>
    </div>
  )
};

export default SettingPsw;
