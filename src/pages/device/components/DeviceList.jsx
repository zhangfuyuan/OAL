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

const deviceType = [
    { value: 1, text: '门禁设备' },
    { value: 2, text: 'EAIS' },
];
const statusMap = ['error', 'success'];
const status = ['离线', '在线'];

class DeviceList extends Component {
    state = {

    }

    columns = type => {
        const MoreBtn = ({ item }) => (
            <Dropdown
                overlay={
                    <Menu onClick={({ key }) => this.modifyAndDelete(key, item)}>
                        <Menu.Item key="modify">修改</Menu.Item>
                        <Menu.Item key="delete">删除</Menu.Item>
                    </Menu>
                }
            >
                <a>
                    更多 <Icon type="down" />
                </a>
            </Dropdown>
        );
        let cl = [
            {
                title: '设备名称',
                dataIndex: 'name',
                render: text => text || '--',
            },
            {
                title: 'IP地址',
                dataIndex: 'ip',
                render: text => text || '--',
            },
            {
                title: '类型',
                dataIndex: 'deviceType',
                render(val) {
                    const bean = deviceType.find(item => item.value === val);
                    return <span>{bean.text}</span>;
                },
            },
            {
                title: '软件版本',
                dataIndex: 'deviceVersion',
                render: text => text || '--',
            },
        ];
        if (type === 'pass') {
            cl.push(
                {
                    title: '状态',
                    dataIndex: 'networkState',
                    render(val) {
                        return <Badge status={statusMap[val]} text={status[val]} />;
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    render: (text, record) => (
                        <Fragment>
                            <a href="#" onClick={() => this.modifyAndDelete('modify', record)}>修改</a>
                            <Divider type="vertical" />
                            <Popconfirm title="确定删除该设备？" okText="确定" cancelText="取消" onConfirm={() => this.modifyAndDelete('deletePass', record)}>
                                <a href="#">删除</a>
                            </Popconfirm>
                        </Fragment>
                    ),
                },
            );
        }
        if (type === 'wait') {
            cl.push(
                {
                    title: '申请时间',
                    dataIndex: 'createAt',
                    render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--',
                },
                {
                    title: '审核',
                    dataIndex: 'action',
                    render: (text, record) => (
                        <Fragment>
                            <Popconfirm
                                title="确定审核不通过该设备？"
                                okText="确定"
                                cancelText="取消"
                                onConfirm={() => this.handleVerity('fail', record)}
                            >
                                <a href="#">拒绝</a>
                            </Popconfirm>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="确定审核通过该设备？"
                                okText="确定"
                                cancelText="取消"
                                onConfirm={() => this.handleVerity('pass', record)}
                            >
                                <Button type="primary">接受</Button>
                            </Popconfirm>
                        </Fragment>
                    ),
                },
            );
        }
        if (type === 'fail') {
            cl.push(
                {
                    title: '审核人',
                    dataIndex: 'verifyUser',
                    render: (text, record) => (
                        <span>{record.verifyInfo && record.verifyInfo.auditor && record.verifyInfo.auditor.userName ? record.verifyInfo.auditor.userName : '--'}</span>
                    ),
                },
                {
                    title: '审核时间',
                    dataIndex: 'verifyAt',
                    render: (text, record) => (
                        <span>{record.verifyInfo && record.verifyInfo.at ? moment(record.verifyInfo.at).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                    ),
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    render: (text, record) => (
                        <Fragment>
                            <Popconfirm title="确定删除该设备？" okText="确定" cancelText="取消" onConfirm={() => this.modifyAndDelete('deletePass', record)}>
                                <a href="#">删除</a>
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
                title: '删除设备',
                content: '确定删除该设备吗？',
                okText: '确认',
                cancelText: '取消',
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
