import React from 'react';
import { Result, Statistic, Row, Col, Card, Button } from 'antd';
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';


const UploadInfo = (fileList, successList, errorList, resetUpload, excludeNum) => {
    const onUpload = fileList.length > successList.length + errorList.length
    // console.log('----', successList, errorList, excludeNum)
    const result = {
        title: onUpload ? <div>人脸上传中: {successList.length + errorList.length}/{fileList.length} </div> : <div>上传完毕，共 {fileList.length} 张</div>,
    }
    if (onUpload) {
        result.icon = <LoadingOutlined />
    } else {
        result.status = 'success'
        result.extra = [
            <Button type="primary" key="console" onClick={resetUpload}>
                确定
            </Button>,
        ]
    }
    return result
}
const UploadProgress = props => {
    const { fileList, errorList, successList, resetUpload, excludeNum, openDetail } = props;
    if (!fileList || fileList.length === 0) {
        return null
    }
    // console.log('UploadProgress---', fileList, errorList, successList)
    return (
        <Result
            { ...UploadInfo(fileList, successList, errorList, resetUpload, excludeNum) }
        >
        <div className="desc">
            <Row gutter={16}>
                    <Col span={12}>
                        <Card hoverable={true} onClick={() => openDetail('success')}>
                        <Statistic
                            title="成功"
                            value={successList.length}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<CheckOutlined />}
                        />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card hoverable={true} onClick={() => openDetail('error')}>
                        <Statistic
                            title="失败"
                            value={errorList.length}
                            precision={0}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<CloseOutlined />}
                        />
                        </Card>
                    </Col>
                </Row>
        </div>
    </Result>
    )
}

export default UploadProgress;
