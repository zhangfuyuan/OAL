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

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getSystemVersion',
    });
/**
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
 **/
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser, org } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // console.log('*********************************', currentUser)
    // const isLogin = currentUser && currentUser._id;
    const isLogin = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);
    const queryString = stringify({
      redirect: window.location.origin,
      // redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
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
}))(SecurityLayout);
