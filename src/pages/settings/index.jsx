import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu, message } from 'antd';
import { connect } from 'dva';
import CryptoJS from 'crypto-js';
import BaseView from './components/BaseView';
import SecurityView from './components/SecurityView';
import SystemView from './components/SystemView';
import DeveloperView from './components/DeveloperView';
import ModifyPswModal from './components/ModifyPswModal';
import ModifySysName from './components/ModifySysName';
import FaceKey from './components/FaceKey';
import FaceKeyModal from './components/FaceKeyModal';
import FaceLibrary from './components/FaceLibrary';
import styles from './style.less';

const { Item } = Menu;

@connect(({ user, settingInfo, settings, faceKey, global: { systemVersion }, loading }) => ({
  currentUser: user.currentUser,
  settingInfo,
  systemVersion,
  devInfo: settingInfo.devInfo,
  devInfoLoading: loading.effects['settingInfo/getDevInfo'],
  settings,
  faceKeyList: faceKey.faceKeyList,
  faceKeyListLoading: loading.effects['faceKey/faceKeyList'],
  addFaceKeyLoading: loading.effects['faceKey/addFaceKey'],
  sysConfigs: settingInfo.sysConfigs,
}))
class Settings extends Component {
  constructor(props) {
    super(props);
    const menuMap = {
      base: '基本信息',
      security: '安全设置',
      system: '系统信息',
      developer: '开发者',
      faceKey: '人脸属性',
      faceLibrary: '人脸底库',
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
      modifyPswVisible: false,
      modifySysNameVisible: false,
      faceKeyVisible: false,
      selectedFaceKey: {},
    };
  }

  loadDevInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/getDevInfo',
    });
  };

  loadFaceKeyList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'faceKey/getFaceKeyList',
    });
  };

  loadSysConfig = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/toGetSysConfigs',
    });
  }

  getMenu = (isAdmin = false) => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => {
      if (!isAdmin && item === 'faceKey') return null;
      return <Item key={item}>{menuMap[item]}</Item>
    });
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = key => {
    this.setState({
      selectKey: key,
    });
    if (key === 'developer') {
      this.loadDevInfo();
    } else if (key === 'faceKey') {
      this.loadFaceKeyList();
    }
  };

  submitBaseInfo = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/modifyUser',
      payload: values,
    }).then(res => {
      if (res && res.res > 0) {
        message.success('修改成功');
      }
    });
  };

  applyDevAccount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/applyDevAccount',
    }).then(res => {
      if (res && res.res > 0) {
        message.success('申请成功');
      }
    });
  };

  resetSecret = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/resetSecret',
    }).then(res => {
      if (res && res.res > 0) {
        message.success('重置成功');
      }
    });
  };

  openModifyPswModal = () => {
    this.setState({ modifyPswVisible: true });
  };

  closeModifyPswModal = () => {
    this.setState({ modifyPswVisible: false });
  };

  submitModifyPsw = values => {
    const { dispatch } = this.props;
    const params = {
      oldpassword: CryptoJS.MD5(values.oldpassword).toString(),
      newpassword: CryptoJS.MD5(values.newpassword).toString(),
    };
    dispatch({
      type: 'user/modifyPassword',
      payload: params,
    }).then(res => {
      if (res && res.res > 0) {
        message.success('修改密码成功，请重新登录');
        dispatch({
          type: 'login/logout',
        });
      }
    });
  };

  openModifySysName = () => {
    this.setState({ modifySysNameVisible: true });
  };

  closeModifySysName = () => {
    this.setState({ modifySysNameVisible: false });
  };

  submitSysName = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/modifySaasInfo',
      payload: values,
    }).then(res => {
      if (res && res.res > 0) {
        message.success('修改成功');
        this.closeModifySysName();
        dispatch({
          type: 'settings/changeSettingName',
          payload: { title: values.saasName },
        });
      }
    });
  };

  setFaceKeyModal = flag => {
    this.setState({ faceKeyVisible: !!flag });
  };

  submitFaceKey = (values, callback) => {
    const { dispatch } = this.props;
    // eslint-disable-next-line no-underscore-dangle
    if (values._id) {
      dispatch({
        type: 'faceKey/updateFaceKey',
        payload: values,
      }).then(res => {
        if (res && res.res > 0) {
          message.success('修改成功');
          this.setFaceKeyModal(false);
          this.loadFaceKeyList();
          callback();
        }
      });
    } else {
      dispatch({
        type: 'faceKey/addFaceKey',
        payload: values,
      }).then(res => {
        if (res && res.res > 0) {
          message.success('新增成功');
          this.setFaceKeyModal(false);
          this.loadFaceKeyList();
          callback();
        }
      });
    }
  };

  deleteFaceKey = faceKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'faceKey/deleteFaceKey',
      payload: {
        // eslint-disable-next-line no-underscore-dangle
        attributeId: faceKey._id,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success('删除成功');
        this.loadFaceKeyList();
      }
    });
  };

  toEditFaceKey = faceKey => {
    this.setFaceKeyModal(true);
    this.setState({ selectedFaceKey: faceKey })
  };

  toEditConfigs = configs => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/toSetSysConfigs',
      payload: {
        data: [
          {
            key: 'faceSize',
            value: {
              min: configs.minSize,
              max: configs.maxSize,
            },
          },
          {
            key: 'maxFaceCount',
            value: configs.maxFaceCount,
          },
        ],
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success('保存成功');
      }
    });
  };

  renderChildren = () => {
    const { currentUser, devInfo, devInfoLoading, faceKeyList, faceKeyListLoading, sysConfigs, systemVersion } = this.props;
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'base':
        return <BaseView
          currentUser={currentUser}
          toSubmit={this.submitBaseInfo}
        />;
      case 'security':
        return <SecurityView
          openModal={this.openModifyPswModal}
        />;
      case 'system':
        return <SystemView
          version={systemVersion}
          currentUser={currentUser}
          openModal={this.openModifySysName}
        />;
      case 'developer':
        return <DeveloperView
          devInfo={devInfo}
          loading={devInfoLoading}
          toApply={this.applyDevAccount}
          toReset={this.resetSecret}
        />;
      case 'faceKey':
        return <FaceKey
          data={faceKeyList}
          loading={faceKeyListLoading}
          toAdd={() => { this.setFaceKeyModal(true); this.setState({ selectedFaceKey: {} }) }}
          toDelete={this.deleteFaceKey}
          toEdit={this.toEditFaceKey}
        />
      case 'faceLibrary':
        return <FaceLibrary
          data ={sysConfigs}
          toEdit={this.toEditConfigs}
        />
      default:
        break;
    }
    return null;
  };

  switchMenu = ({ key }) => {
    if (key === 'faceLibrary') {
      this.loadSysConfig();
    }
    this.selectKey(key)
  }

  render() {
    const { currentUser, addFaceKeyLoading } = this.props;
    const { type } = currentUser;
    const {
      mode,
      selectKey,
      modifyPswVisible,
      modifySysNameVisible,
      faceKeyVisible,
      selectedFaceKey,
    } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={this.switchMenu}
            >
              {this.getMenu(Boolean(type === 0))}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
        <ModifyPswModal
          visible={modifyPswVisible}
          handleCancel={this.closeModifyPswModal}
          handleSubmit={this.submitModifyPsw}
        />
        <ModifySysName
          visible={modifySysNameVisible}
          currentUser={currentUser}
          handleCancel={this.closeModifySysName}
          handleSubmit={this.submitSysName}
        />
        <FaceKeyModal
          visible={faceKeyVisible}
          handleSubmit={this.submitFaceKey}
          handleCancel={() => this.setFaceKeyModal(false)}
          confirmLoading={addFaceKeyLoading}
          setOptionVisible={() => this.setOptionVisible(true)}
          faceKey={selectedFaceKey}
        />
      </GridContent>
    )
  }
}

export default Settings;
