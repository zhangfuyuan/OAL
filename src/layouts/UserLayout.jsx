import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    systemVersion,
    route = {
      routes: [],
    },
    login,
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  // console.log('login---------------------->', login);
  if (login.org === 'error') {
    return (
      <DocumentTitle
        title={getPageTitle({
          pathname: location.pathname,
          breadcrumb,
          formatMessage,
          ...props,
        })}
      >
        <div className={styles.container}>{children}</div>
      </DocumentTitle>
    );
  }
  let subTitle = formatMessage({ id: 'oal.common.accessControlSystem' });
  let oemName = ' '; // 默认系统名称
  if (login.org && login.org.name) {
    subTitle = `${formatMessage({ id: 'oal.common.accessControlSystem' })}(${login.org.name})`;
  }
  if (login.agent.saasName) {
    oemName = login.agent.saasName;
  }
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}><SelectLang /></div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={login.org && login.org.saasIconsUrl || logo} />
                <span className={styles.title}>{oemName}</span>
              </Link>
            </div>
            <div className={styles.desc}>{systemVersion}</div>
          </div>
          {children}
          <div style={systemVersion && systemVersion.indexOf('polysense') > -1 ? { position: 'absolute', bottom: '24px', textAlign: 'center', width: '100%' } : { display: 'none' }}>
            <div>Polysense Technologies Inc.</div>
            <div>3000 Scott Blvd, Santa Clara, CA 95054</div>
            <div>Need help?  Please send email to :  Services@polysense.net</div>
          </div>
        </div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ global: { systemVersion }, settings, login }) => ({ systemVersion, ...settings, login }))(UserLayout);
