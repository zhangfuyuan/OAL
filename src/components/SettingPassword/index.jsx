import React, { useState } from 'react';
import { Card, Alert, Input, Button, Icon, message } from 'antd';
import CryptoJS from 'crypto-js';
import { PSW_REG } from '@/utils/constants';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const SettingPsw = props => {
  const [newpsw, setNewPsw] = useState('');
  const [newpswError, setNewPswError] = useState('');
  const [renewpsw, setReNewPsw] = useState('');
  const [renewpswError, setReNewPswError] = useState('');

  const onChange = (key, value) => {
    // console.log(key, value);
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
        setNewPswError(
          formatMessage({
            id: 'oal.common.enterPassword',
          }),
        );
      } else if (!PSW_REG.test(value)) {
        setNewPswError(
          formatMessage({
            id: 'oal.common.enterPasswordError',
          }),
        );
      } else {
        setNewPswError('');
      }
    } else if (key === 'renewpsw') {
      if (value === '') {
        setReNewPswError(
          formatMessage({
            id: 'oal.common.enterPassword',
          }),
        );
      } else if (!PSW_REG.test(value)) {
        setReNewPswError(
          formatMessage({
            id: 'oal.common.enterPasswordError',
          }),
        );
      } else if (value !== newpsw) {
        setReNewPswError(
          formatMessage({
            id: 'oal.common.enterPasswordDifferent',
          }),
        );
      } else {
        setReNewPswError('');
      }
    }
  }

  const onSubmit = () => {
    if (!newpsw) {
      // message.error('请输入密码');
      setNewPswError(
        formatMessage({
          id: 'oal.common.enterPassword',
        }),
      );
      setReNewPswError(
        formatMessage({
          id: 'oal.common.enterConfirmPassword',
        }),
      );
      return;
    }
    if (newpsw !== renewpsw) {
      // message.error('两次输入的密码不相同');
      setReNewPswError(
        formatMessage({
          id: 'oal.common.enterPasswordDifferent',
        }),
      );
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
          message={formatMessage({
            id: 'oal.common.setPassword',
          })}
          description={formatMessage({
            id: 'oal.common.resetPasswordTips',
          })}
          type="error"
          showIcon
        />
        <br/>
        <Input.Password
          placeholder={formatMessage({
            id: 'oal.common.enterNewPassword',
          })}
          value={newpsw}
          onChange={e => onChange('newpsw', e.target.value)}
          onBlur={e => onBlur('newpsw', e.target.value)}
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
        />
        <span style={{ color: '#ff0000' }}>{newpswError}</span>
        <br/>
        <br/>
        <Input.Password
          placeholder={formatMessage({
            id: 'oal.common.newPasswordConfirm',
          })}
          value={renewpsw}
          onChange={e => onChange('renewpsw', e.target.value)}
          onBlur={e => onBlur('renewpsw', e.target.value)}
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
        />
        <span style={{ color: '#ff0000' }}>{renewpswError}</span>
        <br/>
        <br/>
        <Button onClick={onSubmit} type="primary" htmlType="submit" className="login-form-button" loading={props.loading} block>
          <FormattedMessage id="oal.common.nextStep" />
        </Button>
      </Card>
    </div>
  )
};

export default SettingPsw;
