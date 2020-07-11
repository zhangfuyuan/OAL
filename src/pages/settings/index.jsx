import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Menu, message, notification } from 'antd';
import { connect } from 'dva';
// import CryptoJS from 'crypto-js';
import BaseView from './components/BaseView';
import SecurityView from './components/SecurityView';
import SystemView from './components/SystemView';
import AlarmView from './components/AlarmView';
import AuthorizedPoints from './components/AuthorizedPoints';
import DeveloperView from './components/DeveloperView';
import ModifyPswModal from './components/ModifyPswModal';
import ModifySysName from './components/ModifySysName';
import ModifyAlarmSendSettings from './components/ModifyAlarmSendSettings';
import ModifyAlarmReceiveSettings from './components/ModifyAlarmReceiveSettings';
import ModifyAlarmEvents from './components/ModifyAlarmEvents';
import AuthorizedPointsLoading from './components/AuthorizedPointsLoading';
import AuthorizedPointsUpload from './components/AuthorizedPointsUpload';
// import ModifySysIcons from './components/ModifySysIcons';
// import FaceKey from './components/FaceKey';
// import FaceKeyModal from './components/FaceKeyModal';
// import FaceLibrary from './components/FaceLibrary';
import styles from './style.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { pswBase64Thrice } from '@/utils/utils';

const { Item } = Menu;

@connect(({ user, settingInfo, settings, faceKey, global: { systemVersion }, loading }) => ({
  currentUser: user.currentUser,
  settingInfo,
  systemVersion,
  // devInfo: settingInfo.devInfo,
  devInfoLoading: loading.effects['settingInfo/getDevInfo'],
  settings,
  faceKeyList: faceKey.faceKeyList,
  faceKeyListLoading: loading.effects['faceKey/faceKeyList'],
  addFaceKeyLoading: loading.effects['faceKey/addFaceKey'],
  sysConfigs: settingInfo.sysConfigs,
  modifyPasswordLoading: loading.effects['user/modifyPassword'],
  modifySaasInfoLoading: loading.effects['user/modifySaasInfo'],
  baseViewLoading: loading.effects['user/modifyUser'],
  alarmSendSettingsLoading: loading.effects['settingInfo/alarmSendSettings'],
  alarmReceiveSettingsLoading: loading.effects['settingInfo/alarmReceiveSettings'],
  alarmEventsLoading: loading.effects['settingInfo/alarmEvents'],
  // alarmContentLoading: loading.effects['settingInfo/alarmContent'],
}))
class Settings extends Component {
  constructor(props) {
    super(props);
    const menuMap = {
      base: 'oal.settings.menu-base',
      security: 'oal.settings.menu-security',
      system: 'oal.settings.menu-system',
      alarm: 'oal.settings.menu-alarm',
      authorized: 'oal.settings.menu-authorized',
      developer: 'oal.settings.menu-developer',
      // faceKey: 'oal.settings.menu-faceKey',
      // faceLibrary: 'oal.settings.menu-faceLibrary',
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
      modifyPswVisible: false,
      modifySysNameVisible: false,
      modifyAlarmSendSettingsVisible: false,
      modifyAlarmReceiveSettingsVisible: false,
      modifyAlarmEventsVisible: false,
      authorizedPointsLoadingVisible: false,
      authorizedPointsUploadVisible: false,
      authorizedPointsUploadWay: 'net',
      // modifySysIconsVisible: false,
      faceKeyVisible: false,
      selectedFaceKey: {},
    };
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (currentUser && currentUser.org && currentUser.org._id) {
      dispatch({
        type: 'settingInfo/getAlarmSet',
        payload: {
          orgId: currentUser.org._id,
        },
      }).then(res => {
        if (res && res.res > 0 && res.data) {
          dispatch({
            type: 'user/modifySaasAlarmSet',
            payload: res.data,
          });
        }
      });
    } else {
      dispatch({
        type: 'user/fetchCurrent',
      }).then(res => {
        if (res && res.res > 0 && res.data && res.data.user && res.data.user.org && res.data.user.org._id) {
          dispatch({
            type: 'settingInfo/getAlarmSet',
            payload: {
              orgId: res.data.user.org._id,
            },
          }).then(res => {
            if (res && res.res > 0 && res.data) {
              dispatch({
                type: 'user/modifySaasAlarmSet',
                payload: res.data,
              });
            }
          });
        }
      });
    }
  }

  // loadDevInfo = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'settingInfo/getDevInfo',
  //   });
  // };

  // loadFaceKeyList = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'faceKey/getFaceKeyList',
  //   });
  // };

  loadSysConfig = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settingInfo/toGetSysConfigs',
    });
  }

  getMenu = (isAdmin = false, isAdminOrg = false) => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => {
      // admin 账号且 admin 组织才显示 "授权点数" 栏
      if ((!isAdmin || !isAdminOrg) && item === 'authorized') return null;
      // 非 admin 账号不显示 "系统信息" 栏
      if (!isAdmin && (item === 'system' || item === 'developer')) return null;
      // admin 账号且非 admin 组织才显示 "告警设置" 栏
      if ((!isAdmin || isAdminOrg) && item === 'alarm') return null;
      return <Item key={item}>{menuMap[item] && formatMessage({ id: menuMap[item] }) || '-'}</Item>
    });
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey] && formatMessage({ id: menuMap[selectKey] }) || '-';
  };

  selectKey = key => {
    this.setState({
      selectKey: key,
    });
    // if (key === 'developer') {
    //   this.loadDevInfo();
    // } else if (key === 'faceKey') {
    //   this.loadFaceKeyList();
    // }
  };

  submitBaseInfo = values => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'user/modifyUser',
      payload: {
        userId: currentUser._id,
        ...values,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
      }
    });
  };

  // applyDevAccount = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'settingInfo/applyDevAccount',
  //   }).then(res => {
  //     if (res && res.res > 0) {
  //       message.success(formatMessage({ id: 'oal.settings.applicationApproved' }));
  //     }
  //   });
  // };

  // resetSecret = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'settingInfo/resetSecret',
  //   }).then(res => {
  //     if (res && res.res > 0) {
  //       message.success(formatMessage({ id: 'oal.settings.resetSuccessfully' }));
  //     }
  //   });
  // };

  openModifyPswModal = () => {
    this.setState({ modifyPswVisible: true });
  };

  closeModifyPswModal = () => {
    this.setState({ modifyPswVisible: false });
  };

  submitModifyPsw = values => {
    const { dispatch, currentUser } = this.props;
    const params = {
      // oldpassword: CryptoJS.MD5(values.oldpassword).toString(),
      // newpassword: CryptoJS.MD5(values.newpassword).toString(),
      oldpassword: pswBase64Thrice(values.oldpassword),
      newpassword: pswBase64Thrice(values.newpassword),
    };
    dispatch({
      type: 'user/modifyPassword',
      payload: {
        userId: currentUser._id,
        ...params,
      },
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

  // openModifySysIcons = () => {
  //   this.setState({ modifySysIconsVisible: true });
  // };

  closeModifySysName = () => {
    this.setState({ modifySysNameVisible: false });
  };

  // closeModifySysIcons = () => {
  //   this.setState({ modifySysIconsVisible: false });
  // };

  submitSysName = values => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'user/modifySaasInfo',
      payload: {
        orgId: currentUser.org._id,
        ...values,
      },
    }).then(res => {
      if (res && res.res > 0) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        this.closeModifySysName();
        dispatch({
          type: 'settings/changeSettingInfo',
          payload: { title: res.data && res.data.org && res.data.org.saasName || values.saasName },
        });
      }
    });
  };

  submitSysIcons = saasIconsUrl => {
    // this.closeModifySysIcons();
    const { dispatch, currentUser: { org } } = this.props;

    dispatch({
      type: 'user/modifySaasIconsUrl',
      payload: {
        org: {
          ...org,
          saasIconsUrl,
        }
      },
    }).then(() => {
      message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
      dispatch({
        type: 'settings/changeSettingInfo',
        payload: { logo: saasIconsUrl },
      });
    })
  };

  // 告警-发送设置
  openModifyAlarmSendSettings = () => {
    this.setState({ modifyAlarmSendSettingsVisible: true });
  };

  closeModifyAlarmSendSettings = () => {
    this.setState({ modifyAlarmSendSettingsVisible: false });
  };

  submitAlarmSendSettings = values => {
    const { dispatch } = this.props;

    dispatch({
      type: 'settingInfo/alarmSendSettings',
      payload: values,
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        this.closeModifyAlarmSendSettings();
        dispatch({
          type: 'user/modifySaasAlarmSet',
          payload: res.data,
        });
      }
    });
  };

  deleteAlarmSendSettings = () => {
    const { dispatch, currentUser } = this.props;

    dispatch({
      type: 'settingInfo/alarmSendSettings',
      payload: {
        orgId: currentUser && currentUser.org && currentUser.org._id || '',
        username: '',
        password: '',
        smtpServer: '',
        port: '',
        isSsl: '1',
      },
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        dispatch({
          type: 'user/modifySaasAlarmSet',
          payload: res.data,
        });
      }
    });
  };

  // 告警-接受设置
  openModifyAlarmReceiveSettings = () => {
    this.setState({ modifyAlarmReceiveSettingsVisible: true });
  };

  closeModifyAlarmReceiveSettings = () => {
    this.setState({ modifyAlarmReceiveSettingsVisible: false });
  };

  submitAlarmReceiveSettings = values => {
    const { dispatch } = this.props;

    dispatch({
      type: 'settingInfo/alarmReceiveSettings',
      payload: values,
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        this.closeModifyAlarmReceiveSettings();
        dispatch({
          type: 'user/modifySaasAlarmSet',
          payload: res.data,
        });
      }
    });
  };

  deleteAlarmReceiveSettings = () => {
    const { dispatch, currentUser } = this.props;

    dispatch({
      type: 'settingInfo/alarmReceiveSettings',
      payload: {
        orgId: currentUser && currentUser.org && currentUser.org._id || '',
        receiveMail: '',
      },
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
        dispatch({
          type: 'user/modifySaasAlarmSet',
          payload: res.data,
        });
      }
    });
  };

  // 告警-告警事件
  openModifyAlarmEvents = () => {
    this.setState({ modifyAlarmEventsVisible: true });
  };

  closeModifyAlarmEvents = () => {
    this.setState({ modifyAlarmEventsVisible: false });
  };

  submitAlarmEvents = values => {
    const { dispatch } = this.props;

    dispatch({
      type: 'settingInfo/alarmEvents',
      payload: values,
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        this.closeModifyAlarmEvents();
        dispatch({
          type: 'user/modifySaasAlarmSet',
          payload: res.data,
        });
      }
    });
  };

  // 告警-告警内容
  submitAlarmContent = (values, callback) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'settingInfo/alarmContent',
      payload: values,
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
        callback && callback();
        dispatch({
          type: 'user/modifySaasAlarmSet',
          payload: res.data,
        });
      }
    });
  };

  // 授权点数 - 检测授权环境
  openAuthorizedPointsLoading = () => {
    this.setState({
      authorizedPointsLoadingVisible: true
    }, () => {
      this.submitAuthorizedPointsLoading();
    });
  };

  closeAuthorizedPointsLoading = () => {
    this.setState({ authorizedPointsLoadingVisible: false });
  };

  submitAuthorizedPointsLoading = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'settingInfo/fetchAuthorizationEnvironment',
      payload: {},
    }).then(res => {
      if (!this.state.authorizedPointsLoadingVisible) return;

      if (res && res.res > 0) {
        this.closeAuthorizedPointsLoading();

        if (res.data.state === '0') {
          // 离线认证
          this.openAuthorizedPointsUpload('offline');
        } else if (res.data.state === '1') {
          // 在线认证（默认）
          this.openAuthorizedPointsUpload('net');
        } else {
          notification.error({
            message: formatMessage({ id: 'oal.face.authorizationFailure' }),
            description: formatMessage({ id: 'oal.face.uploadAbort' }),
          });
        }
      } else if (res && res.res === 0) {
        setTimeout(() => {
          if (!this.state.authorizedPointsLoadingVisible) return;

          this.submitAuthorizedPointsLoading();
        }, 2000);
      } else {
        notification.error({
          message: formatMessage({ id: 'oal.face.authorizationFailure' }),
          description: formatMessage({ id: 'oal.face.uploadAbort' }),
        });
        this.closeAuthorizedPointsLoading();
      }
    }).catch(err => {
      console.log(err);
      if (!this.state.authorizedPointsLoadingVisible) return;
      notification.error({
        message: formatMessage({ id: 'oal.face.authorizationFailure' }),
        description: formatMessage({ id: 'oal.face.uploadAbort' }),
      });
      this.closeAuthorizedPointsLoading();
    });
  };

  // 授权点数 - 导入授权文件
  openAuthorizedPointsUpload = way => {
    this.setState({
      authorizedPointsUploadVisible: true,
      authorizedPointsUploadWay: way,
    });
  };

  closeAuthorizedPointsUpload = () => {
    this.setState({
      authorizedPointsUploadVisible: false,
      authorizedPointsUploadWay: 'net',
    });
  };

  submitAuthorizedPointsUpload = payload => {
    message.success(formatMessage({ id: 'oal.settings.authorizeSuccessfully' }));
    this.closeAuthorizedPointsUpload();
    this.props.dispatch({
      type: 'user/modifyAuthorizedPoints',
      payload,
    });
  };

  // setFaceKeyModal = flag => {
  //   this.setState({ faceKeyVisible: !!flag });
  // };

  // submitFaceKey = (values, callback) => {
  //   const { dispatch } = this.props;
  //   // eslint-disable-next-line no-underscore-dangle
  //   if (values._id) {
  //     dispatch({
  //       type: 'faceKey/updateFaceKey',
  //       payload: values,
  //     }).then(res => {
  //       if (res && res.res > 0) {
  //         message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
  //         this.setFaceKeyModal(false);
  //         this.loadFaceKeyList();
  //         callback();
  //       }
  //     });
  //   } else {
  //     dispatch({
  //       type: 'faceKey/addFaceKey',
  //       payload: values,
  //     }).then(res => {
  //       if (res && res.res > 0) {
  //         message.success(formatMessage({ id: 'oal.common.newSuccessfully' }));
  //         this.setFaceKeyModal(false);
  //         this.loadFaceKeyList();
  //         callback();
  //       }
  //     });
  //   }
  // };

  // deleteFaceKey = faceKey => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'faceKey/deleteFaceKey',
  //     payload: {
  //       // eslint-disable-next-line no-underscore-dangle
  //       attributeId: faceKey._id,
  //     },
  //   }).then(res => {
  //     if (res && res.res > 0) {
  //       message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
  //       this.loadFaceKeyList();
  //     }
  //   });
  // };

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
    const {
      currentUser,
      // devInfo,
      devInfoLoading,
      faceKeyList,
      faceKeyListLoading,
      sysConfigs,
      systemVersion,
      baseViewLoading,
      dispatch,
    } = this.props;
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'base':
        return <BaseView
          currentUser={currentUser}
          toSubmit={this.submitBaseInfo}
          loading={baseViewLoading}
        />;
      case 'security':
        return <SecurityView
          openModal={this.openModifyPswModal}
        />;
      case 'system':
        return <SystemView
          version={systemVersion}
          currentUser={currentUser}
          orgId={currentUser && currentUser.org && currentUser.org._id || ''}
          openModal={this.openModifySysName}
          updateSysIcons={this.submitSysIcons}
        // openUploadModal={this.openModifySysIcons}
        />;
      case 'developer':
        return <DeveloperView
          // devInfo={devInfo}
          loading={devInfoLoading}
          dispatch={dispatch}
        // toApply={this.applyDevAccount}
        // toReset={this.resetSecret}
        />;
      // case 'faceKey':
      //   return <FaceKey
      //     data={faceKeyList}
      //     loading={faceKeyListLoading}
      //     toAdd={() => { this.setFaceKeyModal(true); this.setState({ selectedFaceKey: {} }) }}
      //     toDelete={this.deleteFaceKey}
      //     toEdit={this.toEditFaceKey}
      //   />
      // case 'faceLibrary':
      //   return <FaceLibrary
      //     data={sysConfigs}
      //     toEdit={this.toEditConfigs}
      //   />
      case 'alarm':
        return <AlarmView
          currentUser={currentUser}
          orgId={currentUser && currentUser.org && currentUser.org._id || ''}
          openSendSettingsModal={this.openModifyAlarmSendSettings}
          deleteAlarmSendSettings={this.deleteAlarmSendSettings}
          openReceiveSettingsModal={this.openModifyAlarmReceiveSettings}
          deleteAlarmReceiveSettings={this.deleteAlarmReceiveSettings}
          openEventsModal={this.openModifyAlarmEvents}
          updateAlarmContent={this.submitAlarmContent}
        />;
      case 'authorized':
        return <AuthorizedPoints
          currentUser={currentUser && currentUser.authorizedPoints || {}}
          dispatch={dispatch}
          openAuthorizedPointsLoading={this.openAuthorizedPointsLoading}
          openAuthorizedPointsUpload={this.openAuthorizedPointsUpload}
        />;
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
    const {
      currentUser,
      addFaceKeyLoading,
      modifyPasswordLoading,
      modifySaasInfoLoading,
      alarmSendSettingsLoading,
      alarmReceiveSettingsLoading,
      alarmEventsLoading,
      dispatch,
    } = this.props;
    const { type } = currentUser;
    const { type: orgType } = currentUser && currentUser.org || {};
    const {
      mode,
      selectKey,
      modifyPswVisible,
      modifySysNameVisible,
      modifyAlarmSendSettingsVisible,
      modifyAlarmReceiveSettingsVisible,
      modifyAlarmEventsVisible,
      authorizedPointsLoadingVisible,
      authorizedPointsUploadVisible,
      authorizedPointsUploadWay,
      // modifySysIconsVisible,
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
              {this.getMenu(Boolean(type === 0), Boolean(orgType === 0))}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>

        <ModifyPswModal
          visible={modifyPswVisible}
          confirmLoading={modifyPasswordLoading}
          handleCancel={this.closeModifyPswModal}
          handleSubmit={this.submitModifyPsw}
        />
        <ModifySysName
          visible={modifySysNameVisible}
          currentUser={currentUser}
          confirmLoading={modifySaasInfoLoading}
          handleCancel={this.closeModifySysName}
          handleSubmit={this.submitSysName}
        />
        {/* <ModifySysIcons
          visible={modifySysIconsVisible}
          currentUser={currentUser}
          orgId={currentUser && currentUser.org && currentUser.org._id || ''}
          handleCancel={this.closeModifySysIcons}
          handleSubmit={this.submitSysIcons}
        /> */}
        {/* <FaceKeyModal
          visible={faceKeyVisible}
          handleSubmit={this.submitFaceKey}
          handleCancel={() => this.setFaceKeyModal(false)}
          confirmLoading={addFaceKeyLoading}
          setOptionVisible={() => this.setOptionVisible(true)}
          faceKey={selectedFaceKey}
        /> */}
        <ModifyAlarmSendSettings
          visible={modifyAlarmSendSettingsVisible}
          currentUser={currentUser}
          confirmLoading={alarmSendSettingsLoading}
          handleCancel={this.closeModifyAlarmSendSettings}
          handleSubmit={this.submitAlarmSendSettings}
        />
        <ModifyAlarmReceiveSettings
          visible={modifyAlarmReceiveSettingsVisible}
          currentUser={currentUser}
          confirmLoading={alarmReceiveSettingsLoading}
          handleCancel={this.closeModifyAlarmReceiveSettings}
          handleSubmit={this.submitAlarmReceiveSettings}
        />
        <ModifyAlarmEvents
          visible={modifyAlarmEventsVisible}
          currentUser={currentUser}
          confirmLoading={alarmEventsLoading}
          handleCancel={this.closeModifyAlarmEvents}
          handleSubmit={this.submitAlarmEvents}
        />
        <AuthorizedPointsLoading
          visible={authorizedPointsLoadingVisible}
          handleCancel={this.closeAuthorizedPointsLoading}
        />
        <AuthorizedPointsUpload
          visible={authorizedPointsUploadVisible}
          dispatch={dispatch}
          authorizedPointsUploadWay={authorizedPointsUploadWay}
          handleCancel={this.closeAuthorizedPointsUpload}
          handleSubmit={this.submitAuthorizedPointsUpload}
        />
      </PageHeaderWrapper>
    )
  }
}

export default Settings;
