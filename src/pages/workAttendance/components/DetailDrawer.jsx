import React from 'react';
import { Table, Drawer, Descriptions, Divider, Avatar, Popover } from 'antd';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const accessType = ['oal.work.enter', 'oal.work.leave'];

const DetailDrawer = props => {
    const { visible, selectedBean, data, loading, onClose, faceKeyList } = props;
    const name = (selectedBean && selectedBean.faceInfo && selectedBean.faceInfo.name) || '';
    // eslint-disable-next-line no-underscore-dangle
    const deviceDate = selectedBean && selectedBean._id && selectedBean._id.deviceDate;
    const deviceName = (selectedBean && selectedBean.deviceInfo && selectedBean.deviceInfo.name) || '';
    const title = formatMessage({ id: 'oal.work.attendanceDetailsOf' }, { name });

    const columns = [
        {
            title: formatMessage({ id: 'oal.common.photo' }),
            key: 'avatar',
            width: 100,
            render: (text, record) => (
                    <Popover content={<div><img src={record.img} alt="" /></div>} title={name}>
                        <Avatar src={`${record.img}.jpg?height=64&width=64&mode=fit`} shape="square" size="large"/>
                    </Popover>
                ),
        },
        {
            title: formatMessage({ id: 'oal.common.time' }),
            key: 'time',
            render: (text, record) => <span>{moment(record.deviceTime).format('HH:mm:ss')}</span>,
        },
        {
            title: formatMessage({ id: 'oal.common.type' }),
            key: 'accessType',
            render: (text, record) => <span>{accessType[record.accessType - 1] && formatMessage({ id: accessType[record.accessType - 1] }) || '--'}</span>,
        },
        {
            title: formatMessage({ id: 'oal.work.temperature' }),
            key: 'temperature',
            render: (text, record) => <span>{record.extendInfo && record.extendInfo.temperature || '--'}</span>,
        },
    ];

    return (
        <Drawer
            width={500}
            visible={visible}
            onClose={onClose}
        >
            <Descriptions title={title}>
                <Descriptions.Item label={formatMessage({ id: 'oal.common.fullName' })}>{name}</Descriptions.Item>
                <Descriptions.Item label={formatMessage({ id: 'oal.work.attendanceDevice' })}>{deviceName}</Descriptions.Item>
                {
                    faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
                        if (item.reportQuery) {
                            const type = item.componentInfo && item.componentInfo.type; // 文本框1，下拉框2
                            const options = item.componentInfo && item.componentInfo.data; // 下拉选项value，text的对象数组
                            let spanText = '';
                            if (selectedBean && selectedBean.faceInfo && selectedBean.faceInfo.profile && selectedBean.faceInfo.profile[item.key]) {
                                if (type === 2 && options && options.length > 0) {
                                    const option = options.find(bean => bean.value == selectedBean.faceInfo.profile[item.key]);
                                    spanText = (option && option.text) || '';
                                } else {
                                    spanText = selectedBean.faceInfo.profile[item.key];
                                }
                            }
                            return <Descriptions.Item key={`description_${item.key}`} label={item.name}>{spanText}</Descriptions.Item>
                        }
                        return null;
                    })
                }
            </Descriptions>
            <Divider orientation="left">{moment(deviceDate || selectedBean.min).format('YYYY-MM-DD')}</Divider>
            <Table
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
            />
        </Drawer>
    );
}

export default DetailDrawer;
