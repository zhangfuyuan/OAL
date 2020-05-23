import { Modal, Upload, Icon, message, Progress, notification, Button } from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;
const { Dragger } = Upload;

let uploader = null;

const AuthorizedPointsUpload = props => {
  const { visible, dispatch, authorizedPointsUploadWay, handleSubmit, handleCancel } = props;
  const [uploadLoading, setUploadLoading] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);
  const [deviceCode, setDeviceCode] = useState('');

  // 建议：每次 Modal 关闭时重置
  useEffect(() => {
    if (visible === true) {
      if (authorizedPointsUploadWay === 'offline') {
        // 离线认证获取设备码
        dispatch({
          type: 'settingInfo/fetchDeviceCode',
          payload: {},
        }).then(res => {
          if (res && res.res > 0 && res.data) {
            setDeviceCode(res.data.equipmentCode);
          } else {
            notification.error({
              message: formatMessage({ id: 'oal.face.authorizationFailure' }),
              description: formatMessage({ id: 'oal.face.uploadAbort' }),
            });
          }
        });
      }
    } else {
      resetAllVar();
    }
  }, [visible]);

  const resetAllVar = () => {
    // 重置 state
    setUploadLoading(false);
    setLicenseFile(null);
    setDeviceCode('');

    // 重置 全局变量
    if (uploader) wuDestroy();
  };

  const handleUploadAbort = (unNotification) => {
    if (!unNotification) {
      notification.error({
        message: formatMessage({ id: 'oal.face.authorizationFailure' }),
        description: formatMessage({ id: 'oal.face.uploadAbort' }),
      });
    }

    setUploadLoading(false);

    if (uploader) wuDestroy();
  };

  const beforeUploadLicenseFile = file => {
    if (file.name && file.name.indexOf(authorizedPointsUploadWay === 'offline' ? '.offline' : '.net') > -1) {
      setLicenseFile(file);
    } else {
      notification.error({
        message: formatMessage({ id: 'oal.face.authorizationFailure' }),
        description: formatMessage({ id: 'oal.face.IncorrectFileFormat' }),
      });
    }

    return false;
  };

  const handleModalOk = () => {
    if (licenseFile) {
      if (window.WebUploader) {
        setUploadLoading(true);
        wuInit([licenseFile]);
      } else {
        notification.error({
          message: formatMessage({ id: 'oal.face.authorizationFailure' }),
          description: formatMessage({ id: 'oal.face.uploadAbort' }),
        });
      }
    } else {
      notification.error({
        message: formatMessage({ id: 'oal.face.authorizationFailure' }),
        description: formatMessage({ id: 'oal.face.pleaseUploadFile' }),
      });
    }
  };

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  const wuInit = newFileList => {
    if (uploader) wuDestroy();

    uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server: authorizedPointsUploadWay === 'offline' ? '/guard-web/a/sys/office/offlineLicenseNeedFile' : '/guard-web/a/sys/office/onlineLicenseNeedFile',
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: false // 分片上传
    });

    newFileList.forEach((item, index) => {
      let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item);
      let newfile = new window.WebUploader.File(wuFile);

      uploader.addFiles(newfile);
      wuFile = null;
      newfile = null;
    });

    wuUpload();
  };

  // 触发 WebUploader 上传图片/视频资源
  const wuUpload = () => {
    if (!uploader) return false;

    // uploader.on('uploadStart', file => {});

    uploader.on('uploadBeforeSend', (block, data) => {
      if (!visible) return;
      data.md5 = block.file.md5;
    });

    // uploader.on('uploadProgress', (file, percentage) => {
    //   if (!visible) return;
    // });

    uploader.on('uploadError', (file, reason) => {
      if (!visible) return;
      console.log(`${file.name} : ${reason}`);

      handleUploadAbort();
    });

    uploader.on('uploadSuccess', (file, response) => {
      if (!visible) return;
      const { res, errcode, msg, data } = response || {};

      if (res > 0 && data) {
        handleSubmit(data);
      } else if (res === 0) {
        // 分片文件上传成功时返回，啥也不做
      } else if (res === -1 && errcode === 6009) {
        // 无效文件
        notification.error({
          message: formatMessage({ id: 'oal.face.authorizationFailure' }),
          description: formatMessage({ id: 'oal.ajax.6009' }),
        });
        handleUploadAbort(true);
      } else {
        handleUploadAbort();
      }
    });

    // uploader.on('uploadComplete', file => {});

    uploader.on('error', type => {
      if (!visible) return;
      console.log(`errorType：`, type);

      handleUploadAbort();
    });

    uploader.upload();
  };

  // 销毁 WebUploader 实例对象
  const wuDestroy = () => {
    if (!uploader) return false;

    uploader.destroy();
    uploader = null;
  };

  /********************************************** WebUploader API End **********************************************/

  const handleDelLicenseFile = () => {
    setLicenseFile(null);
  };

  const handleCopy = () => {
    const copyArea = document.getElementById('copyArea');
    copyArea.select(); // 选择对象
    try {
      if (document.execCommand('copy', false, null)) {
        document.execCommand('Copy');
        message.success(formatMessage({ id: 'oal.settings.copySuccessfully' }));
      } else {
        message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
      }
    } catch (error) {
      message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
    }
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.settings.addAuthorizationPoints' })}
      visible={visible}
      maskClosable={false}
      confirmLoading={uploadLoading}
      onOk={handleModalOk}
      onCancel={handleCancel}
    >
      <div>
        <Dragger
          accept={authorizedPointsUploadWay === 'offline' ? '.offline' : '.net'}
          action={authorizedPointsUploadWay === 'offline' ? '/guard-web/a/sys/office/offlineLicenseNeedFile' : '/guard-web/a/sys/office/onlineLicenseNeedFile'}
          withCredentials
          showUploadList={false}
          beforeUpload={beforeUploadLicenseFile}
          style={{ marginBottom: '20px', }}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 30px' }}>
            <Icon type="file" theme="filled" style={{ fontSize: '48px', }} />

            <div style={{ textAlign: 'left', paddingLeft: '30px' }}>
              <p style={{ fontSize: '24px', }}>
                <FormattedMessage id="oal.settings.licenseFile" />
                ({authorizedPointsUploadWay === 'offline' ? '.offline' : '.net'})
              </p>
              <p>
                <FormattedMessage id="oal.face.batchAddPersonnelDataDragtips2" />
              </p>
            </div>
          </div>
        </Dragger>

        <div>
          {
            licenseFile ?
              (<div>
                <span>
                  <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
                    <div className="ant-upload-list-item-info">
                      <span>
                        <Icon type="paper-clip" />
                        <span
                          className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                          title={licenseFile.name}
                        >
                          {licenseFile.name}
                        </span>
                        {
                          !uploadLoading ?
                            (<span className="ant-upload-list-item-card-actions ">
                              <a
                                title={formatMessage({ id: 'oal.common.delete' })}
                                onClick={handleDelLicenseFile}
                              >
                                <Icon type="close" />
                              </a>
                            </span>) : ''
                        }
                      </span>
                    </div>
                  </div>
                </span>
              </div>) : ''
          }
        </div>

        <div style={{ marginTop: '30px', color: '#999', }}>
          {
            authorizedPointsUploadWay === 'offline' ?
              (<Fragment>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', }}>
                  <FormattedMessage id="oal.settings.machineCode" />
                </h3>
                <p>
                  {deviceCode}
                </p>
                <p>
                  <a onClick={handleCopy} >
                    <FormattedMessage id="oal.common.copy" />
                  </a>
                  <textarea cols="40" rows="5" id="copyArea" defaultValue={deviceCode} style={{ position: 'absolute', top: '-999px', left: '-999px' }} />
                </p>
                <p>
                  <FormattedMessage id="oal.settings.authorizedPointsUploadTips1" />
                </p>
              </Fragment>) :
              (<Fragment>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', }}>
                  <FormattedMessage id="oal.face.uploadExplain" />
                </h3>

                <p>
                  <FormattedMessage id="oal.settings.authorizedPointsUploadTips2" />
                </p>
              </Fragment>)
          }

        </div>
      </div>

      <Modal
        destroyOnClose
        maskClosable={false}
        title={formatMessage({ id: 'oal.settings.pleaseLater' })}
        centered
        visible={uploadLoading}
        closable={false}
        footer={[]}
      >
        <p style={{ fontWeight: 'bold' }}>
          <FormattedMessage id="oal.settings.parsingFileTips" />
        </p>
      </Modal>
    </Modal>
  );
};

export default AuthorizedPointsUpload;
