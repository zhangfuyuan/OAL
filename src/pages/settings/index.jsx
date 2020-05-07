import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu, message } from 'antd';
import { connect } from 'dva';
// import CryptoJS from 'crypto-js';
import BaseView from './components/BaseView';
import SecurityView from './components/SecurityView';
import SystemView from './components/SystemView';
import DeveloperView from './components/DeveloperView';
import ModifyPswModal from './components/ModifyPswModal';
import ModifySysName from './components/ModifySysName';
import ModifySysIcons from './components/ModifySysIcons';
import FaceKey from './components/FaceKey';
import FaceKeyModal from './components/FaceKeyModal';
import FaceLibrary from './components/FaceLibrary';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { pswBase64Thrice } from '@/utils/utils';

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
      base: formatMessage({ id: 'oal.settings.menu-base' }),
      security: formatMessage({ id: 'oal.settings.menu-security' }),
      system: formatMessage({ id: 'oal.settings.menu-system' }),
      // developer: formatMessage({ id: 'oal.settings.menu-developer' }),
      // faceKey: formatMessage({ id: 'oal.settings.menu-faceKey' }),
      // faceLibrary: formatMessage({ id: 'oal.settings.menu-faceLibrary' }),
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
      modifyPswVisible: false,
      modifySysNameVisible: false,
      modifySysIconsVisible: false,
      faceKeyVisible: false,
      selectedFaceKey: {},
      updateSysIcons: null,
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
      // if (!isAdmin && item === 'faceKey') return null;
      if (!isAdmin && item === 'system') return null;
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
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
      }
    });
  };

  applyDevAccount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/applyDevAccount',
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.settings.applicationApproved' }));
      }
    });
  };

  resetSecret = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/resetSecret',
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.settings.resetSuccessfully' }));
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
      // oldpassword: CryptoJS.MD5(values.oldpassword).toString(),
      // newpassword: CryptoJS.MD5(values.newpassword).toString(),
      oldpassword: pswBase64Thrice(values.oldpassword),
      newpassword: pswBase64Thrice(values.newpassword),
    };
    dispatch({
      type: 'user/modifyPassword',
      payload: params,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.settings.modifyPasswordSuccessfullyTips' }));
        dispatch({
          type: 'login/logout',
        });
      }
    });
  };

  openModifySysName = () => {
    this.setState({ modifySysNameVisible: true });
  };

  openModifySysIcons = () => {
    this.setState({ modifySysIconsVisible: true });
  };

  closeModifySysName = () => {
    this.setState({ modifySysNameVisible: false });
  };

  closeModifySysIcons = () => {
    this.setState({ modifySysIconsVisible: false });
  };

  submitSysName = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/modifySaasInfo',
      payload: values,
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        this.closeModifySysName();
        dispatch({
          type: 'settings/changeSettingName',
          payload: { title: values.saasName },
        });
      }
    });
  };

  submitSysIcons = values => {
    // 8126TODO 上传系统图标
    this.setState({ updateSysIcons: values });
    this.closeModifySysIcons();
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
          message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
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
          message.success(formatMessage({ id: 'oal.common.newSuccessfully' }));
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
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
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
        message.success(formatMessage({ id: 'oal.common.saveSuccessfully' }));
      }
    });
  };

  renderChildren = () => {
    const { currentUser, devInfo, devInfoLoading, faceKeyList, faceKeyListLoading, sysConfigs, systemVersion } = this.props;
    const { selectKey, updateSysIcons } = this.state;
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
          openUploadModal={this.openModifySysIcons}
          icons={updateSysIcons}
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
          data={sysConfigs}
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
      modifySysIconsVisible,
      faceKeyVisible,
      selectedFaceKey,
    } = this.state;
    return (
      <PageHeaderWrapper className={styles.myPageHeaderWrapper}>
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
        <ModifySysIcons
          visible={modifySysIconsVisible}
          currentUser={currentUser}
          handleCancel={this.closeModifySysIcons}
          handleSubmit={this.submitSysIcons}
        />
        <FaceKeyModal
          visible={faceKeyVisible}
          handleSubmit={this.submitFaceKey}
          handleCancel={() => this.setFaceKeyModal(false)}
          confirmLoading={addFaceKeyLoading}
          setOptionVisible={() => this.setOptionVisible(true)}
          faceKey={selectedFaceKey}
        />
      </PageHeaderWrapper>
    )
  }
}

export default Settings;
