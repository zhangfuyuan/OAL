import React, { useState } from 'react';
import { Card, Alert, Input, Button, Icon, message } from 'antd';
import CryptoJS from 'crypto-js';
import { PSW_REG } from '@/utils/constants';

const SettingPsw = props => {
  const [newpsw, setNewPsw] = useState('');
  const [newpswError, setNewPswError] = useState('');
  const [renewpsw, setReNewPsw] = useState('');
  const [renewpswError, setReNewPswError] = useState('');

  const onChange = (key, value) => {
    console.log(key, value);
    if (key === 'newpsw') {
      setNewPsw(value);
      setNewPswError('');
    } else {
      setReNewPsw(value);
      setReNewPswError('');
    }
  }
  const onBlur = (key, value) => {
    if (key === 'newpsw') {
      if (value === '') {
        setNewPswError('请输入密码');
      } else if (!PSW_REG.test(value)) {
        setNewPswError('密码须包含字母、数字、特殊符号，长度不小于8位');
      } else {
        setNewPswError('');
      }
    } else if (key === 'renewpsw') {
      if (value === '') {
        setReNewPswError('请输入密码');
      } else if (!PSW_REG.test(value)) {
        setReNewPswError('密码须包含字母、数字、特殊符号，长度不小于8位');
      } else if (value !== newpsw) {
        setReNewPswError('两次输入的密码不相同');
      } else {
        setReNewPswError('');
      }
    }
  }

  const onSubmit = () => {
    if (!newpsw) {
      // message.error('请输入密码');
      setNewPswError('请输入密码');
      setReNewPswError('请输入确认密码');
      return;
    }
    if (newpsw !== renewpsw) {
      // message.error('两次输入的密码不相同');
      setReNewPswError('两次输入的密码不相同');
      return;
    }
    const data = { newpassword: CryptoJS.MD5(newpsw).toString() };
    props.onSubmit(data);
  }

  return (
    <div style={{
      background: '#ECECEC',
      padding: '30px',
      height: '100Vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card bordered={false} style={{ width: 400 }}>
        <Alert
          message="设置密码"
          description="账号初次使用需要重新设置密码，密码须包含字母、数字、特殊符号，长度不小于8位"
          type="error"
          showIcon
        />
        <br/>
        <Input.Password
          placeholder="输入新密码"
          value={newpsw}
          onChange={e => onChange('newpsw', e.target.value)}
          onBlur={e => onBlur('newpsw', e.target.value)}
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
        />
        <span style={{ color: '#ff0000' }}>{newpswError}</span>
        <br/>
        <br/>
        <Input.Password
          placeholder="新密码确认"
          value={renewpsw}
          onChange={e => onChange('renewpsw', e.target.value)}
          onBlur={e => onBlur('renewpsw', e.target.value)}
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
        />
        <span style={{ color: '#ff0000' }}>{renewpswError}</span>
        <br/>
        <br/>
        <Button onClick={onSubmit} type="primary" htmlType="submit" className="login-form-button" loading={props.loading} block>
          下一步
        </Button>
      </Card>
    </div>
  )
};

export default SettingPsw;
