import { Modal, Upload, Icon, message, Progress, notification, Result, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage, getLocale } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;
const { Dragger } = Upload;
let uploader = null;
let myFileList = [];
let myFileListLen = 0
let uploadSuccessNum = 0;

const userImportTemplateLinkMap = {
  'zh-CN': 'http://lango-tech.com/XBH/lango19/data/users.zip',
  'zh-TW': 'http://lango-tech.com/XBH/lango19/data/zh-TW/users.zip',
  'en-US': 'http://lango-tech.com/XBH/lango19/data/en/users.zip',
};

const TableBatchAddModal = props => {
  const { visible, groupId, handleSubmit, handleCancel } = props;
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [folderName, setFolderName] = useState('');
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  const selectedLang = getLocale();

  const resetAllVar = () => {
    // 重置 state
    setUploadLoading(false);
    setUploadProgress(0);
    setFolderName('');
    setIsUploadSuccess(false);

    // 重置 全局变量
    if (uploader) wuDestroy();
    myFileList = [];
    myFileListLen = 0;
    uploadSuccessNum = 0;
  };

  const beforeUpload = file => {
    myFileList.push(file);

    if (myFileList && myFileList.length === 1) {
      const { webkitRelativePath } = file;
      const webkitRelativePathSplit = webkitRelativePath && webkitRelativePath.split('/') || [''];
      setFolderName(webkitRelativePathSplit[0]);
    }

    return false;
  };

  const beforeUploadCheck = callback => {
    const len = myFileList && myFileList.length || 0;
    let isError = 0;
    let hasXls = false;

    for (let i = 0; i < len; i++) {
      const { name, size, type } = myFileList[i];
      const isJpgOrPng = type === 'image/jpeg' || type === 'image/png' || type === 'image/jpg';
      const isXls = /(\.xls)|(\.xlsx)|(\.csv)/i.test(name);

      if (isJpgOrPng) {
        const isGt500KB = size / 1024 > 500;

        if (isGt500KB) {
          isError = 1;
          break;
        }
      } else if (isXls) {
        hasXls = true;
      } else {
        isError = 1;
        break;
      }
    }

    if (!hasXls) isError = 1;

    callback(isError);
  };

  const uploadSuccessCheck = () => {
    if (uploadSuccessNum >= myFileListLen) {
      setIsUploadSuccess(true);
      setUploadLoading(false);
    }
  };

  const handleModalOk = () => {
    if (isUploadSuccess) {
      handleSubmit();
      resetAllVar();
    } else {
      setUploadLoading(true);
      beforeUploadCheck(isError => {
        if (isError === 1) {
          notification.error({
            message: formatMessage({ id: 'oal.face.failToUpload' }),
            description: formatMessage({ id: 'oal.face.batchAddErrorTips' }),
          });
          resetAllVar();
        } else {
          const len = myFileList && myFileList.length || 0;

          if (window.WebUploader && len > 0) {
            myFileListLen = len;
            wuInit(myFileList);
          } else {
            resetAllVar();
          }
          console.log(8126, '批量添加', myFileList);
        }
      });
    }
  };

  const handleModalCancel = () => {
    handleCancel();
    resetAllVar();
  };

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  const wuInit = newFileList => {
    if (uploader) wuDestroy();

    uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // 8126TODO 文件接收服务端
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: true // 分片上传
    });

    newFileList.forEach((item, index) => {
      let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item);
      let newfile = new window.WebUploader.File(wuFile);

      newfile.index = index;
      newfile.groupId = groupId;
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
      data.groupId = block.file.groupId;
    });

    // uploader.on('uploadProgress', (file, percentage) => {
    //   if (!visible) return;
    // });

    uploader.on('uploadError', (file, reason) => {
      if (!visible) return;
      console.log(`${file.name} : ${reason}`);

      message.error(formatMessage({ id: 'oal.face.failToUpload' }));
      resetAllVar();
    });

    uploader.on('uploadSuccess', (file, response) => {
      if (!visible) return;
      // const { errcode, data, msg } = response;
      // 8126TODO 上传成功返回数据

      if (response.status === 'done' && response.url) {
        uploadSuccessNum++;
        setUploadProgress(parseInt(uploadSuccessNum / myFileListLen * 100));
        uploadSuccessCheck();
      } else if (response && response.res === 10002) {
        // 8126TODO 异常情况：用户数已超出
        notification.error({
          message: formatMessage({ id: 'oal.face.failToUpload' }),
          description: formatMessage({ id: 'oal.face.userNumLimit' }),
        });
        resetAllVar();
      } else {
        message.error(formatMessage({ id: 'oal.face.failToUpload' }));
        resetAllVar();
      }

      // if (errcode === 0 && data && data.fileLink) {
      //   message.success('uploadSuccess');
      //   setUploadLoading(false);
      // } else if (errcode === 0 && data === 'upload_chunk') {
      //   // 分片文件上传成功时返回，啥也不做
      // } else if (msg && /false/i.test(msg)) {
      //   message.error('false');
      //   setUploadLoading(false);
      // }
    });

    // uploader.on('uploadComplete', file => {});

    uploader.on('error', type => {
      if (!visible) return;
      console.log(`errorType：`, type);

      message.error(formatMessage({ id: 'oal.face.failToUpload' }));
      resetAllVar();
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

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.face.batchAdd' })}
      visible={visible}
      confirmLoading={uploadLoading}
      maskClosable={false}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
    >
      {
        isUploadSuccess ?
          (<Result
            status="success"
            title={formatMessage({ id: 'oal.face.addSuccessfully' })}
            subTitle={formatMessage({ id: 'oal.face.batchAddSuccessTips' }, { num: myFileListLen })}
          />) :
          (<div>
            <Dragger
              accept=".png, .jpg, .jpeg, .xls, .xlsx, .csv"
              multiple
              directory
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              withCredentials
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text" style={{ fontSize: '14px' }}>
                <FormattedMessage id="oal.face.draggerTips" />
              </p>
            </Dragger>

            <div>
              {
                folderName ?
                  (<div>
                    <span>
                      <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
                        <div className="ant-upload-list-item-info">
                          <span>
                            <Icon type="paper-clip" />
                            <span className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1" title={folderName}>{folderName}</span>
                            <span className="ant-upload-list-item-card-actions ">
                              <a
                                title={formatMessage({ id: 'oal.face.batchAdd' })}
                                onClick={resetAllVar}
                              >
                                <Icon type="close" />
                              </a>
                            </span>
                          </span>
                        </div>
                      </div>
                    </span>
                  </div>) : ''
              }
              {
                uploadProgress > 0 ?
                  (<Progress percent={uploadProgress} showInfo={false} strokeWidth={5} />) : ''
              }
            </div>

            <div style={{ marginTop: '30px', color: '#999', }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#999', }}>
                <FormattedMessage id="oal.face.uploadExplain" />
              </h3>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#999', }}>
                  <FormattedMessage id="oal.face.importTemplate" />
                </h3>
                <p>
                  <FormattedMessage id="oal.face.importTemplateTips1" />
                &nbsp;
                <a href={userImportTemplateLinkMap[selectedLang] || 'http://lango-tech.com/XBH/lango19/data/users.zip'}>
                    <FormattedMessage id="oal.face.importTemplateTips2" />
                  </a>
                &nbsp;
                <FormattedMessage id="oal.face.importTemplateTips3" />
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#999', }}>
                  <FormattedMessage id="oal.face.fileUpload" />
                </h3>
                <p>
                  <FormattedMessage id="oal.face.fileUploadTips" />
                </p>
              </div>
            </div>
          </div>)
      }
    </Modal>
  );
};

export default TableBatchAddModal;
