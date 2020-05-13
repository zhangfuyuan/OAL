import { Alert, Checkbox, Icon, Result, Button, Spin, notification } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
// import CryptoJS from 'crypto-js';
import { SYSTEM_PATH } from '@/utils/constants';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
import { pswBase64Thrice, pswBase64ThriceRestore } from '@/utils/utils';
import router from 'umi/router';

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
    const { dispatch } = this.props;

    dispatch({
      type: 'login/getLoginStateInServer',
    }).then(res => {
      if (res && res.res > 0 && res.data && res.data.isLogin) {
        console.log(org, '后台已登录');
        dispatch({
          type: 'login/login',
          payload: {},
        });
      } else {
        console.log(org, '后台未登录');
      }
    });
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
    if (!err) {
      const { org } = this.props.match.params;
      const { pwd } = values;
      // values.password = CryptoJS.MD5(pwd).toString();
      values.pwd = pswBase64Thrice(pwd);
      localStorage.setItem(SYSTEM_PATH, org);
      const { dispatch } = this.props;
      const params = { ...values, path: org };

      dispatch({
        type: 'login/login',
        payload: {
          ...params,
          errorHandler: (err) => {
            console.log(err);

            if (err &&
              err.toString &&
              err.toString() === 'TypeError: Failed to fetch' &&
              document.cookie.indexOf('loginTryAgain=1') > -1) {
              // 重定向处理
              console.log('自动登录两次╮(╯▽╰)╭');
              this.handleSubmit(null, {
                ...params,
                pwd,
              });
            } else {
              notification.error({
                message: formatMessage({ id: 'oal.ajax.401-message' }),
                description: formatMessage({ id: 'oal.ajax.401-description' }),
              });
            }
          }
        },
      }).then(res => {
        if (res && res.res === 0) {
          console.log('自动登录两次╮(╯▽╰)╭');
          this.handleSubmit(null, {
            ...params,
            pwd,
          });
        }
      }).catch(err => {
        console.log(err);
        notification.error({
          message: formatMessage({ id: 'oal.ajax.401-message' }),
          description: formatMessage({ id: 'oal.ajax.401-description' }),
        });
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
      // subTitle={formatMessage({ id: 'oal.user-login.infoNotFoundTips' })}
      // extra={
      //   <Button size="large" type="primary">
      //     <FormattedMessage id="oal.user-login.contactUs" />
      //   </Button>
      // }
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

  checkAccount = (rule, value, callback) => {
    const reg = /^[A-Za-z]+$/;
    if (value && !reg.test(value)) {
      callback(formatMessage({ id: 'oal.user-login.enterAccountErrorTips' }));
    }
    callback();
  };

  render() {
    const { userLogin, submitting, orgLoading, systemVersion } = this.props;
    const { status } = userLogin;
    const { type, autoLogin } = this.state;
    // console.log('render org-->', orgLoading, userLogin);
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
              id: 'oal.common.account',
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'oal.user-login.enterAccountTips',
                }),
              },
              {
                validator: this.checkAccount,
              },
            ]}
          />
          <Password
            name="pwd"
            placeholder={formatMessage({
              id: 'user-login.login.password',
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'oal.user-login.enterPasswordTips',
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
        {/* {systemVersion ?
          <div style={{ textAlign: 'center' }}><FormattedMessage id="oal.user-login.release" />: {systemVersion}</div> : null
        } */}
      </div>
    );
  }
}

export default Login;
