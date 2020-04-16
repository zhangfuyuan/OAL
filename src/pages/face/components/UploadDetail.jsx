import React from 'react';
import { Drawer, Tabs, Table, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const { TabPane } = Tabs;

const UploadDetail = props => {
    const { successList, errorList, onChildrenDrawerClose, childrenDrawer, changeTab, childrenTabIndex } = props;
    const errorCodeList = {
        400: {
            text: formatMessage({ id: 'oal.face.formatNotAllowed' }),
            desc: formatMessage({ id: 'oal.face.onlyPhotosAllowed' }),
        },
        6007: {
            text: formatMessage({ id: 'oal.face.illegalSize' }),
            desc: formatMessage({ id: 'oal.face.pictureTooBigOrSmall' }),
        },
        6008: {
            text: formatMessage({ id: 'oal.face.nomenclatureIrregularities' }),
            desc: formatMessage({ id: 'oal.face.followNamingPattern' }),
        },
        4003: {
            text: formatMessage({ id: 'oal.face.dictionaryError' }),
            desc: formatMessage({ id: 'oal.face.dictionaryErrorDesc' }),
        },
        5005: {
            text: formatMessage({ id: 'oal.face.missingRequiredValues' }),
            desc: formatMessage({ id: 'oal.face.missingRequiredValuesDesc' }),
        },
        5007: {
            text: formatMessage({ id: 'oal.face.uniquenessConstraint' }),
            desc: formatMessage({ id: 'oal.face.uniquenessConstraintDesc' }),
        },
    };
    
    const successColumns = [
        {
          title: formatMessage({ id: 'oal.common.photo' }),
          dataIndex: 'name',
          width: 300,
        },
        {
          title: `${formatMessage({ id: 'oal.face.size' })}(KB)`,
          dataIndex: 'size',
          width: 123,
          render: size => {
              if (!size || size === 0) {
                  return 0
              }
              return (size / 1024).toFixed(0)
          },
        },
    ];
    const errorColumns = [
        {
          title: formatMessage({ id: 'oal.common.photo' }),
          dataIndex: 'name',
          width: 300,
        },
        {
          title: formatMessage({ id: 'oal.face.reason' }),
          dataIndex: 'uploadRes',
          width: 123,
          render: uploadRes => {
            if (!uploadRes) {
                return formatMessage({ id: 'oal.common.unknownError' })
            }
            if (uploadRes === 400) {
                return (
                    <Tooltip title={errorCodeList[uploadRes].desc}>
                        <div>{errorCodeList[uploadRes].text}</div>
                    </Tooltip>
                )
            }
            return (
                <Tooltip title={errorCodeList[uploadRes.errorCode].desc}>
                    <div>{errorCodeList[uploadRes.errorCode].text}</div>
                </Tooltip>
            )
          },
        },
    ];
    return (
        <Drawer
            title={formatMessage({ id: 'oal.face.uploadDetails' })}
            width={480}
            closable={false}
            onClose={onChildrenDrawerClose}
            visible={childrenDrawer}
          >
            <Tabs activeKey={childrenTabIndex} onChange={changeTab}>
                <TabPane tab={formatMessage({ id: 'oal.face.uploadSuccessfully' })} key="success" style={{ height: 'calc( 100vh - 160px )' }}>
                    <Table columns={successColumns} dataSource={successList} pagination={{ pageSize: 50 }} scroll={{ y: 'calc( 100vh - 268px )' }} />
                </TabPane>
                <TabPane tab={formatMessage({ id: 'oal.face.failToUpload' })} key="error" style={{ height: 'calc( 100vh - 160px )' }}>
                    <Table columns={errorColumns} dataSource={errorList} pagination={{ pageSize: 50 }} scroll={{ y: 'calc( 100vh - 268px )' }} />
                </TabPane>
            </Tabs>
          </Drawer>
    )
}
export default UploadDetail
