import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { AUTH_TOKEN, SYSTEM_PATH } from '@/utils/constants';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'login/getLoginStateInServer',
    }).then(res => {
      const isLogin = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);

      if (res && res.res > 0) {
        if (res.data && res.data.isLogin) {
          // 后台已登录
          if (isLogin) {
            // 前端已登录
            console.log(res.data.path, '后台已登录 & 前端已登录');
          } else {
            // 前端未登录
            console.log(res.data.path, '后台已登录 & 前端未登录');
            dispatch({
              type: 'login/login',
              payload: {},
            });
          }
        } else {
          // 后台未登录
          if (isLogin) {
            // 前端已登录
            console.log('null', '后台未登录 & 前端已登录');
            dispatch({
              type: 'login/logout',
              payload: {},
            });
          } else {
            // 前端未登录
            console.log('null', '后台未登录 & 前端未登录');
          }
        }
      }
    });
  }

  componentDidMount() {
    this.setState({
      isReady: true,
    });

    const { dispatch } = this.props;

    dispatch({
      type: 'global/getSystemVersion',
    });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser, org, getLoginStateInServerLoading } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // console.log('*********************************', currentUser)
    // const isLogin = currentUser && currentUser._id;
    const isLogin = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);
    const queryString = stringify({
      redirect: window.location.origin,
      // redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady || getLoginStateInServerLoading) {
      return <PageLoading />;
    }
    // console.log('-----currentUser--------->', currentUser, org, isLogin);
    if (!isLogin) {
      return <Redirect to={`/user/${org.path || localStorage.getItem(SYSTEM_PATH) || 'admin'}/login?${queryString}`}></Redirect>;
    }

    return children;
  }
}

export default connect(({ user, loading, login }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  org: login.org,
  getLoginStateInServerLoading: loading.effects['login/getLoginStateInServer'],
}))(SecurityLayout);
