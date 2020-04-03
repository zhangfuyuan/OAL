import React from 'react';
import { Table, Drawer, Descriptions, Divider, Avatar, Popover } from 'antd';
import moment from 'moment';

const accessType = ['进入', '离开'];

const DetailDrawer = props => {
    const { visible, selectedBean, data, loading, onClose, faceKeyList } = props;
    const name = (selectedBean && selectedBean.faceInfo && selectedBean.faceInfo.name) || '';
    // eslint-disable-next-line no-underscore-dangle
    const deviceDate = selectedBean && selectedBean._id && selectedBean._id.deviceDate;
    const deviceName = (selectedBean && selectedBean.deviceInfo && selectedBean.deviceInfo.name) || '';
    const title = `${name}的考勤详情`;

    const columns = [
        {
            title: '照片',
            key: 'avatar',
            width: 100,
            render: (text, record) => (
                    <Popover content={<div><img src={record.img} alt="" /></div>} title={name}>
                        <Avatar src={`${record.img}.jpg?height=64&width=64&mode=fit`} shape="square" size="large"/>
                    </Popover>
                ),
        },
        {
            title: '时间',
            key: 'time',
            render: (text, record) => <span>{moment(record.deviceTime).format('HH:mm:ss')}</span>,
        },
        {
            title: '类型',
            key: 'accessType',
            render: (text, record) => <span>{accessType[record.accessType - 1]}</span>,
        },
        {
            title: '温度',
            key: 'temperature',
            render: (text, record) => { console.log(record); return (<span>{record.extendInfo && record.extendInfo.temperature || '--'}</span>)},
        },
    ];

    return (
        <Drawer
            width={500}
            visible={visible}
            onClose={onClose}
        >
            <Descriptions title={title}>
                <Descriptions.Item label="姓名">{name}</Descriptions.Item>
                <Descriptions.Item label="考勤设备">{deviceName}</Descriptions.Item>
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
