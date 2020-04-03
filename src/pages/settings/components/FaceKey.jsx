import React, { Fragment } from 'react';
import { Table, Button, Popconfirm, Divider, Popover, Icon } from 'antd';

const FaceKey = props => {
    const { data, loading, toAdd, toDelete, toEdit } = props;

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: 'key',
            dataIndex: 'key',
        },
        {
            title: '控件类型',
            key: 'type',
            render: (text, record) => {
                const type = (record && record.componentInfo && record.componentInfo.type) || 1;
                const options = (record && record.componentInfo && record.componentInfo.data) || [];
                let spanText = '文本框';
                if (type === 2) {
                    spanText = '下拉框';
                }
                return (
                    <span>
                        {spanText}
                        {type === 2 && options.length > 0 ?
                            <Popover
                                title="下拉选项"
                                content={
                                    options.map(item => <p key={`option_${item.value}`}><span style={{ marginRight: '16px' }}>value: {item.value}</span><span>text: {item.text}</span></p>)
                                }
                            >
                                <a href="#" style={{ marginLeft: '16px' }}>
                                    <Icon type="unordered-list" />
                                </a>
                            </Popover>
                            :
                            null
                        }
                    </span>
                )
            },
        },
        {
            title: '是否必填',
            key: 'required',
            render: (text, record) => (
                <span>{record && record.required ? '是' : '否'}</span>
            ),
        },
        {
            title: '是否唯一',
            key: 'isUnique',
            render: (text, record) => (
                <span>{record && record.isUnique ? '是' : '否'}</span>
            ),
        },
        {
            title: '报表查询',
            key: 'reportQuery',
            render: (text, record) => (
                <span>{record && record.reportQuery ? '是' : '否'}</span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={() => toEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => toDelete(record)}
                    >
                        <a href="#">删除</a>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <Fragment>
            <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={toAdd}
            >
                新增
            </Button>
            <Table
                rowKey={record => record._id}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
            />
        </Fragment>
    );
}

export default FaceKey;
