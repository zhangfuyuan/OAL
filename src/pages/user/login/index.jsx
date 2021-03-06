import { Alert, Checkbox, Icon, Result, Button, Spin } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
import { SYSTEM_PATH } from '@/utils/constants';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ login, global: { systemVersion }, loading }) => ({
  systemVersion,
  userLogin: login,
  submitting: loading.effects['login/login'],
  orgLoading: loading.effects['login/getOrgInfo'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    const { org } = this.props.match.params;
    console.log('login page org:', org);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getSystemVersion',
    });
    dispatch({
      type: 'login/getOrgInfo',
      payload: org,
    });
  }

  componentDidMount() {
    // 暂不能很好兼容 IE 浏览器
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      alert(formatMessage({ id: 'oal.common.notSupportBrowserTips' }));
    }
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { org } = this.props.match.params;
    values.password = CryptoJS.MD5(values.password).toString();
    if (!err) {
      localStorage.setItem(SYSTEM_PATH, org);
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values, path: org },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () => {
    // eslint-disable-next-line no-new
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  // eslint-disable-next-line class-methods-use-this
  errorOrg() {
    return (
      <Result
        status="404"
        title={formatMessage({ id: 'oal.user-login.infoNotFound' })}
        subTitle={formatMessage({ id: 'oal.user-login.infoNotFoundTips' })}
        extra={
          <Button size="large" type="primary">
            <FormattedMessage id="oal.user-login.contactUs" />
          </Button>
        }
      />
    );
  }

  // eslint-disable-next-line class-methods-use-this
  loadingCom() {
    return (
      <div
        style={{
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.05)',
          marginBottom: 20,
          padding: '30px 50px',
          margin: '20px 0',
        }}
      >
        <Spin />
      </div>
    );
  }

  render() {
    const { userLogin, submitting, orgLoading, systemVersion } = this.props;
    const { status } = userLogin;
    const { type, autoLogin } = this.state;
    console.log('render org-->', orgLoading, userLogin);
    if (orgLoading) {
      return this.loadingCom();
    }
    if (userLogin.org === 'error') {
      return this.errorOrg();
    }
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          {status === 'error' &&
            // type === 'account' &&
            !submitting &&
            this.renderMessage(
              formatMessage({
                id: 'user-login.login.message-invalid-credentials',
              }),
            )}
          <UserName
            name="userName"
            placeholder={formatMessage({
              id: 'user-login.login.userName',
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'user-login.userName.required',
                }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={formatMessage({
              id: 'user-login.login.password',
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'user-login.password.required',
                }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();

              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
          {/* <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              <FormattedMessage id="user-login.login.forgot-password" />
            </a>
          </div> */}
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
        </LoginComponents>
        {systemVersion ?
          <div style={{ textAlign: 'center' }}><FormattedMessage id="oal.user-login.release" />: {systemVersion}</div> : null
        }
      </div>
    );
  }
}

export default Login;
