import { Card, Tabs, message, Alert } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import io from 'socket.io-client';
import { AUTH_TOKEN } from '@/utils/constants';
import DeviceList from './components/DeviceList';
import RenameModal from './components/RenameModal';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const { TabPane } = Tabs;

const tabArray = [
    { key: 'pass', name: 'oal.device.approve', value: 1 },
    { key: 'wait', name: 'oal.device.toAudit', value: 0 },
    { key: 'fail', name: 'oal.device.notApprove', value: -1 },
];

@connect(({ device, loading, user }) => ({
    device,
    loginUser: user,
    deviceListLoading: loading.effects['device/fetch'],
}))
class Device extends Component {
    state = {
        modalVisible: false,
        alertVisible: true,
        deviceBean: {},
    };

    componentDidMount() {
        this.loadData();
        this.initSocket();
    }

    componentWillUnmount() {
      if (this.scoket) {
        this.scoket.close()
         this.scoket = null;
      }
    }

    initSocket = () => {
      if (!this.scoket) {
        // console.log(AUTH_TOKEN, '--scoket--5345345--->', `/?auth_token=${sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN)}`)
        this.socket = io(`/?auth_token=${sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN)}`, { forceNew: true })
        // console.log(io, '--scoket----->', this.socket)
        this.socket.on('connect', () => {
          console.log('-------connect!-------');
        });
        this.socket.on('MESSAGE', msg => {
          console.log('MESSAGE from server:', msg);
          if (msg.data.code === 1000 || msg.data.code === 1001) {
            // 有设备上线
            this.props.dispatch({
                type: 'device/setDeviceInfo',
                payload: msg.data.entity,
            });
          }
        });
      }
    }

    loadData = key => {
        if (!key) {
            key = this.props.match.params.type;
        }
        const tabBean = tabArray.find(item => item.key === key);
        const verity = tabBean.value;
        const { dispatch } = this.props;
        dispatch({
            type: 'device/fetch',
            payload: {
                verity,
            },
        });
    };

    changeTab = key => {
        router.push(`/device/${key}`)
        this.loadData(key)
    };

    openRenameModal = bean => {
        this.setState({ modalVisible: true, deviceBean: bean });
    };

    closeRenameModal = () => {
        this.setState({ modalVisible: false, deviceBean: {} });
    };

    renameDevice = (params, callback) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'device/rename',
            payload: params,
        }).then(res => {
            if (res.res === 1) {
                message.success(formatMessage({ id: 'oal.common.modifySuccessfully' }));
                this.closeRenameModal();
                this.loadData();
                callback();
            }
        });
    };

    submitDelete = bean => {
        const { dispatch } = this.props;
        dispatch({
            type: 'device/delete',
            payload: { deviceId: bean._id },
        }).then(res => {
            if (res.res === 1) {
                message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
                this.loadData();
            }
        });
    };

    submitVerity = (type, bean) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'device/verify',
            payload: { deviceId: bean._id, result: type === 'pass' ? 1 : -1 },
        }).then(res => {
            if (res.res === 1) {
                message.success(formatMessage({ id: 'oal.device.auditSuccessfully' }));
                this.loadData();
            }
        });
    };

    handleClose = () => {
        this.setState({ alertVisible: false })
    }

    render() {
        const {
            device: { deviceList },
            deviceListLoading,
            loginUser,
        } = this.props;
        const { modalVisible, deviceBean, alertVisible } = this.state;
        const { type } = this.props.match.params;
        // console.log('loginUser----', loginUser)
        return (
            <PageHeaderWrapper>
                {loginUser.currentUser && loginUser.currentUser.org && alertVisible ? (
                    <Alert message={<div><FormattedMessage id="oal.device.deviceRegistrationPath" />: <span style={{ color: 'red', marginLeft: 12 }}>{loginUser.currentUser.org.path}</span></div>} type="info" showIcon style={{ marginBottom: 8 }} closable afterClose={this.handleClose} />
                ) : null}
                <Card bordered={false}>
                    <Tabs activeKey={type} onChange={this.changeTab}>
                        {
                            tabArray.map(item => (
                                <TabPane tab={item.name && formatMessage({ id: item.name }) || '--'} key={item.key}>
                                    <DeviceList
                                        type={item.key}
                                        data={deviceList}
                                        loading={deviceListLoading}
                                        openRenameModal={this.openRenameModal}
                                        submitDelete={this.submitDelete}
                                        submitVerity={this.submitVerity}
                                    />
                                </TabPane>
                            ))
                        }
                    </Tabs>
                    <RenameModal
                        visible={modalVisible}
                        bean={deviceBean}
                        handleCancel={this.closeRenameModal}
                        handleSubmit={this.renameDevice}
                    />
                </Card>
            </PageHeaderWrapper>
        )
    }
}
export default Device;
