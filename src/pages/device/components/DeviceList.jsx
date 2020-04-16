import {
    Divider,
    Popconfirm,
    Badge,
    Modal,
    Menu,
    Dropdown,
    Table,
    Icon,
    Button,
} from 'antd';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const deviceType = [
    { value: 1, text: 'oal.device.accessControlDevice' },
    { value: 2, text: 'EAIS' },
];
const statusMap = ['error', 'success'];
const status = ['oal.device.offline', 'oal.device.online'];

class DeviceList extends Component {
    state = {

    }

    columns = type => {
        const MoreBtn = ({ item }) => (
            <Dropdown
                overlay={
                    <Menu onClick={({ key }) => this.modifyAndDelete(key, item)}>
                        <Menu.Item key="modify"><FormattedMessage id="oal.common.modify" /></Menu.Item>
                        <Menu.Item key="delete"><FormattedMessage id="oal.common.delete" /></Menu.Item>
                    </Menu>
                }
            >
                <a>
                    <FormattedMessage id="oal.common.more" /> <Icon type="down" />
                </a>
            </Dropdown>
        );
        let cl = [
            {
                title: formatMessage({ id: 'oal.device.deviceName' }),
                dataIndex: 'name',
                render: text => text || '--',
            },
            {
                title: formatMessage({ id: 'oal.device.ipAddress' }),
                dataIndex: 'ip',
                render: text => text || '--',
            },
            {
                title: formatMessage({ id: 'oal.common.type' }),
                dataIndex: 'deviceType',
                render(val) {
                    const bean = deviceType.find(item => item.value === val);
                    return <span>{bean.value===2 ? bean.text : (bean.text && formatMessage({ id: bean.text }) || '--')}</span>;
                },
            },
            {
                title: formatMessage({ id: 'oal.device.softwareRelease' }),
                dataIndex: 'deviceVersion',
                render: text => text || '--',
            },
        ];
        if (type === 'pass') {
            cl.push(
                {
                    title: formatMessage({ id: 'oal.common.status' }),
                    dataIndex: 'networkState',
                    render(val) {
                        return <Badge status={statusMap[val]} text={status[val] && formatMessage({ id: status[val] }) || '--'} />;
                    },
                },
                {
                    title: formatMessage({ id: 'oal.common.handle' }),
                    dataIndex: 'action',
                    render: (text, record) => (
                        <Fragment>
                            <a href="#" onClick={() => this.modifyAndDelete('modify', record)}><FormattedMessage id="oal.common.modify" /></a>
                            <Divider type="vertical" />
                            <Popconfirm title={formatMessage({ id: 'oal.device.confirmDeleteDevice' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.modifyAndDelete('deletePass', record)}>
                                <a href="#"><FormattedMessage id="oal.common.delete" /></a>
                            </Popconfirm>
                        </Fragment>
                    ),
                },
            );
        }
        if (type === 'wait') {
            cl.push(
                {
                    title: formatMessage({ id: 'oal.device.applicationTime' }),
                    dataIndex: 'createAt',
                    render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--',
                },
                {
                    title: formatMessage({ id: 'oal.common.audit' }),
                    dataIndex: 'action',
                    render: (text, record) => (
                        <Fragment>
                            <Popconfirm
                                title={formatMessage({ id: 'oal.device.confirmNotApproveDevice' })}
                                okText={formatMessage({ id: 'oal.common.confirm' })}
                                cancelText={formatMessage({ id: 'oal.common.cancel' })}
                                onConfirm={() => this.handleVerity('fail', record)}
                            >
                                <a href="#"><FormattedMessage id="oal.common.reject" /></a>
                            </Popconfirm>
                            <Divider type="vertical" />
                            <Popconfirm
                                title={formatMessage({ id: 'oal.device.confirmApproveDevice' })}
                                okText={formatMessage({ id: 'oal.common.confirm' })}
                                cancelText={formatMessage({ id: 'oal.common.cancel' })}
                                onConfirm={() => this.handleVerity('pass', record)}
                            >
                                <Button type="primary"><FormattedMessage id="oal.common.accept" /></Button>
                            </Popconfirm>
                        </Fragment>
                    ),
                },
            );
        }
        if (type === 'fail') {
            cl.push(
                {
                    title: formatMessage({ id: 'oal.device.auditor' }),
                    dataIndex: 'verifyUser',
                    render: (text, record) => (
                        <span>{record.verifyInfo && record.verifyInfo.auditor && record.verifyInfo.auditor.userName ? record.verifyInfo.auditor.userName : '--'}</span>
                    ),
                },
                {
                    title: formatMessage({ id: 'oal.device.auditTime' }),
                    dataIndex: 'verifyAt',
                    render: (text, record) => (
                        <span>{record.verifyInfo && record.verifyInfo.at ? moment(record.verifyInfo.at).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                    ),
                },
                {
                    title: formatMessage({ id: 'oal.common.handle' }),
                    dataIndex: 'action',
                    render: (text, record) => (
                        <Fragment>
                            <Popconfirm title={formatMessage({ id: 'oal.device.confirmDeleteDevice' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.modifyAndDelete('deletePass', record)}>
                                <a href="#"><FormattedMessage id="oal.common.delete" /></a>
                            </Popconfirm>
                        </Fragment>
                    ),
                },
            );
        }
        return cl;
    }

    handleVerity = (type, record) => {
        const { submitVerity } = this.props;
        submitVerity(type, record);
    };

    modifyAndDelete = (type, record) => {
        const { openRenameModal, submitDelete } = this.props;
        if (type === 'modify') {
            openRenameModal(record);
        } else if (type === 'delete') {
            Modal.confirm({
                title: formatMessage({ id: 'oal.device.removeDevice' }),
                content: formatMessage({ id: 'oal.device.confirmRemoveDevice' }),
                okText: formatMessage({ id: 'oal.common.affirm' }),
                cancelText: formatMessage({ id: 'oal.common.cancel' }),
                onOk: () => submitDelete(record),
            });
        } else {
            submitDelete(record);
        }
    };

    render() {
        const { loading, data, type } = this.props;
        return (
            <Table
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                loading={loading}
                dataSource={data}
                columns={this.columns(type)}
                pagination={false}
            />
        )
    }
}
export default DeviceList;
