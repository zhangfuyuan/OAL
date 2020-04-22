/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
// import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import SettingPassword from '@/components/SettingPassword';
import SettingSaasInfo from '@/components/SettingSaasInfo';
import { DEFAULT_SYS_NAME } from '@/utils/constants';
import logo from '../assets/logo.svg';

const footerRender = (_, defaultDom) => {
  return <div></div>;
};

const BasicLayout = props => {
  const { dispatch, children, settings, user, modifyPwdLoading, menuList } = props;

  const fetchCurrent = () => {
    dispatch({
      type: 'user/fetchCurrent',
    }).then(data => {
      if (!data || !data.data || !data.data.agent) {
        return
      }
      let sysName = DEFAULT_SYS_NAME;
      const { agent } = data.data;
      if (agent && agent.saasName) {
        sysName = agent.saasName;
      }
      dispatch({
        type: 'settings/changeSettingName',
        payload: { title: sysName },
      });
    });
  }

  useEffect(() => {
    if (dispatch) {
      fetchCurrent();
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  const setPsw = payload => {
    if (dispatch) {
      dispatch({
        type: 'user/modifyPassword',
        payload,
      });
    }
  };
  const setSaasInfo = payload => {
    // eslint-disable-next-line no-underscore-dangle
    payload._id = user.org._id;
    if (dispatch) {
      dispatch({
        type: 'user/modifySaasInfo',
        payload,
      });
    }
  };
  if (user.passwordVersion === 0) {
    return <SettingPassword onSubmit={setPsw} loading={modifyPwdLoading}/>
  }
  if (user.type === 0 && user.org.type === 0 && !user.org.saasName) {
    return <SettingSaasInfo onSubmit={setSaasInfo} loading={modifyPwdLoading}/>
  }
  return (
    <ProLayout
      logo={logo}
      menuHeaderRender={(logo, title) => (
        <Link to="/">
          {logo}
          {title}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      menuProps={{ onSelect: () => fetchCurrent() }}
      breadcrumbRender={(routes = []) => []}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={() => menuList}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings, user }) => ({
  collapsed: global.collapsed,
  settings,
  user: user.currentUser,
  modifyPwdLoading: user.modifyPwdLoading,
  menuList: user.menuList,
}))(BasicLayout);
