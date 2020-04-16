import React, { Fragment } from 'react';
import { Table, Button, Popconfirm, Divider, Popover, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const FaceKey = props => {
    const { data, loading, toAdd, toDelete, toEdit } = props;

    const columns = [
        {
            title: formatMessage({ id: 'oal.common.name' }),
            dataIndex: 'name',
        },
        {
            title: 'key',
            dataIndex: 'key',
        },
        {
            title: formatMessage({ id: 'oal.settings.controlTypes' }),
            key: 'type',
            render: (text, record) => {
                const type = (record && record.componentInfo && record.componentInfo.type) || 1;
                const options = (record && record.componentInfo && record.componentInfo.data) || [];
                let spanText = formatMessage({ id: 'oal.settings.textarea' });
                if (type === 2) {
                    spanText = formatMessage({ id: 'oal.settings.dropdown' });
                }
                return (
                    <span>
                        {spanText}
                        {type === 2 && options.length > 0 ?
                            <Popover
                                title={formatMessage({ id: 'oal.settings.dropdownOption' })}
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
            title: formatMessage({ id: 'oal.settings.isRequired' }),
            key: 'required',
            render: (text, record) => (
                <span>{record && record.required ? formatMessage({ id: 'oal.common.yes' }) : formatMessage({ id: 'oal.common.no' })}</span>
            ),
        },
        {
            title: formatMessage({ id: 'oal.settings.isOnly' }),
            key: 'isUnique',
            render: (text, record) => (
                <span>{record && record.isUnique ? formatMessage({ id: 'oal.common.yes' }) : formatMessage({ id: 'oal.common.no' })}</span>
            ),
        },
        {
            title: formatMessage({ id: 'oal.settings.reportQuery' }),
            key: 'reportQuery',
            render: (text, record) => (
                <span>{record && record.reportQuery ? formatMessage({ id: 'oal.common.yes' }) : formatMessage({ id: 'oal.common.no' })}</span>
            ),
        },
        {
            title: formatMessage({ id: 'oal.common.handle' }),
            key: 'action',
            width: 120,
            render: (text, record) => (
                <span>
                    <a href="#" onClick={() => toEdit(record)}><FormattedMessage id="oal.common.edit" /></a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={formatMessage({ id: 'oal.settings.confirmDelete' })}
                        okText={formatMessage({ id: 'oal.common.confirm' })}
                        cancelText={formatMessage({ id: 'oal.common.cancel' })}
                        onConfirm={() => toDelete(record)}
                    >
                        <a href="#"><FormattedMessage id="oal.common.delete" /></a>
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
                <FormattedMessage id="oal.common.new" />
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
