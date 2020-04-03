import React from 'react';
import { Drawer, Tabs, Table, Tooltip } from 'antd';

const { TabPane } = Tabs;

const errorCodeList = {
    400: {
        text: '格式不允许',
        desc: '只允许上传 .jpg, .jpeg, .png 格式的照片',
    },
    6007: {
        text: '尺寸不合法',
        desc: '图片太大或太小',
    },
    6008: {
        text: '命名不规范',
        desc: '请按照提示中的规范命名方式: 0_名字_扩展属性...',
    },
    4003: {
        text: '字典值错误',
        desc: '对应的值在人脸扩展属性中配置的“下拉框”组件，请确保上传的值在下拉框值配置的范围内',
    },
    5005: {
        text: '缺少必填值',
        desc: '缺少人脸扩展属性中必填的字段',
    },
    5007: {
        text: '唯一性约束',
        desc: '人脸信息中存在值必须唯一的字段，请检查冲突',
    },
}

const successColumns = [
    {
      title: '照片',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '大小(KB)',
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
      title: '照片',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '原因',
      dataIndex: 'uploadRes',
      width: 123,
      render: uploadRes => {
        if (!uploadRes) {
            return '未知错误'
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

const UploadDetail = props => {
    const { successList, errorList, onChildrenDrawerClose, childrenDrawer, changeTab, childrenTabIndex } = props
    return (
        <Drawer
            title="上传详情"
            width={480}
            closable={false}
            onClose={onChildrenDrawerClose}
            visible={childrenDrawer}
          >
            <Tabs activeKey={childrenTabIndex} onChange={changeTab}>
                <TabPane tab="上传成功" key="success" style={{ height: 'calc( 100vh - 160px )' }}>
                    <Table columns={successColumns} dataSource={successList} pagination={{ pageSize: 50 }} scroll={{ y: 'calc( 100vh - 268px )' }} />
                </TabPane>
                <TabPane tab="上传失败" key="error" style={{ height: 'calc( 100vh - 160px )' }}>
                    <Table columns={errorColumns} dataSource={errorList} pagination={{ pageSize: 50 }} scroll={{ y: 'calc( 100vh - 268px )' }} />
                </TabPane>
            </Tabs>
          </Drawer>
    )
}
export default UploadDetail
