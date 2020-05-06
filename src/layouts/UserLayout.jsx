import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
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
  let oemName = 'LangoAI';
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
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{oemName}</span>
              </Link>
            </div>
            <div className={styles.desc}>{systemVersion ? `v${systemVersion}` : ''}</div>
          </div>
          {children}
        </div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ global: { systemVersion }, settings, login }) => ({ systemVersion, ...settings, login }))(UserLayout);
