import { Modal, Upload, Icon, message, Progress, notification, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage, getLocale } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;
const { Dragger } = Upload;

let uploader = null;
// let myImgList = [];
// let myUploadAllSuccessNum = 0;
let taskId = '';
let myUploadLoading = false;
// let myImgTotal = 0; // 含文件格式不正确
// let myLegalImgTotalSize = 0;

const userImportTemplateLinkMap = {
  'de-DE': '/guardFile/model/users-de.zip',
  'en-US': '/guardFile/model/users-en.zip',
  'es-ES': '/guardFile/model/users-es.zip',
  'fr-FR': '/guardFile/model/users-fr.zip',
  'it-IT': '/guardFile/model/users-it.zip',
  'ja-JP': '/guardFile/model/users-ja.zip',
  'ko-KR': '/guardFile/model/users-ko.zip',
  'ms-MY': '/guardFile/model/users-ms.zip',
  'pt-BR': '/guardFile/model/users-pt.zip',
  'ru-RU': '/guardFile/model/users-ru.zip',
  'th-TH': '/guardFile/model/users-th.zip',
  'vi-VN': '/guardFile/model/users-vi.zip',
  'zh-CN': '/guardFile/model/users-cn-rZH.zip',
  'zh-TW': '/guardFile/model/users-cn-rTW.zip',
};

const TableBatchAddModal = props => {
  const { visible, groupId, handleSubmit, handleCancel, dispatch } = props;
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const [xlsFile, setXlsFile] = useState(null);
  // const [imgListLen, setImgListLen] = useState(0);
  const [isUnderAnalysis, setIsUnderAnalysis] = useState(false);
  // const [imgTotal, setImgTotal] = useState(0);
  const [zipFile, setZipFile] = useState(null);

  const selectedLang = getLocale();

  // 建议：每次 Modal 关闭时重置
  useEffect(() => {
    myUploadLoading = uploadLoading;

    if (visible === false) {
      resetAllVar();
    }
  }, [visible, uploadLoading]);

  const resetAllVar = () => {
    // 重置 state
    setUploadLoading(false);
    setUploadProgress(0);
    // setXlsFile(null);
    // setImgListLen(0);
    setIsUnderAnalysis(false);
    // setImgTotal(0);
    setZipFile(null);

    // 重置 全局变量
    if (uploader) wuDestroy();
    // myImgList = [];
    // myUploadAllSuccessNum = 0;
    taskId = '';
    myUploadLoading = false;
    // myImgTotal = 0;
    // myLegalImgTotalSize = 0;
  };

  const handleUploadAbort = (unNotification) => {
    if (!unNotification) {
      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
        description: formatMessage({ id: 'oal.face.uploadAbort' }),
      });
    }

    setUploadLoading(false);
    setUploadProgress(0);
    setIsUnderAnalysis(false);

    if (uploader) wuDestroy();
    // myUploadAllSuccessNum = 0;
    taskId = '';
    myUploadLoading = false;
  };

  // const beforeUploadXls = file => {
  //   if (file.size > 1024 * 1024 * 2) {
  //     notification.error({
  //       message: formatMessage({ id: 'oal.face.failToUpload' }),
  //       description: formatMessage({ id: 'oal.face.personnelDataFileTooLarge' }),
  //     });
  //   } else {
  //     setXlsFile(file);
  //   }

  //   return false;
  // };

  const beforeUploadZip = file => {
    if (file.size > 1024 * 1024 * 200) {
      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
        description: formatMessage({ id: 'oal.face.zipFileTooLarge' }),
      });
    } else {
      setZipFile(file);
    }

    return false;
  };

  // const beforeUploadImg = file => {
  //   const fileType = file.type;
  //   const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
  //   const isLt240KB = file.size / 1024 < 240;

  //   if (!isJpgOrPng) {
  //     notification.destroy();
  //     notification.error({
  //       message: formatMessage({ id: 'oal.face.failToUpload' }),
  //       description: formatMessage({ id: 'oal.face.IncorrectFileFormat' }),
  //     });
  //   } else if (!isLt240KB || myLegalImgTotalSize > 1024 * 1024 * 200) {
  //     notification.destroy();
  //     notification.error({
  //       message: formatMessage({ id: 'oal.face.failToUpload' }),
  //       description: formatMessage({ id: 'oal.face.staffPhotoFileTooLarge' }),
  //     });
  //   } else {
  //     myImgList.push(file);
  //     setImgListLen(myImgList.length);
  //     myLegalImgTotalSize += file.size;
  //   }

  //   myImgTotal++;
  //   setImgTotal(myImgTotal);
  //   return false;
  // };

  // const uploadSuccessCheck = () => {
  //   if (myUploadAllSuccessNum >= (imgListLen + 1)) {
  //     setIsUnderAnalysis(true);
  //     setUploadProgress(1);
  //     submit4_getBatchAddTaskProgress(taskId);
  //   } else if (myUploadAllSuccessNum >= imgListLen) {
  //     submit3_batchAddInfo(taskId);
  //   }
  // };

  const handleModalOk = () => {
    if (!zipFile) {
      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
        description: formatMessage({ id: 'oal.face.pleaseUploadFile' }),
      });
      // } else if (xlsFile.size > 1024 * 1024 * 2) {
      //   notification.error({
      //     message: formatMessage({ id: 'oal.face.failToUpload' }),
      //     description: formatMessage({ id: 'oal.face.personnelDataFileTooLarge' }),
      //   });
      // } else if (myLegalImgTotalSize > 1024 * 1024 * 200) {
      //   notification.error({
      //     message: formatMessage({ id: 'oal.face.failToUpload' }),
      //     description: formatMessage({ id: 'oal.face.staffPhotoFileTooLarge' }),
      //   });
    } else {
      if (window.WebUploader && dispatch) {
        setUploadLoading(true);
        submit1_getBatchAddTaskId();
      } else {
        handleUploadAbort();
      }
    }
  };

  // 上传第1步：获取创建任务ID
  const submit1_getBatchAddTaskId = () => {
    dispatch({
      type: 'face/getBatchAddTaskId',
      payload: {
        groupId,
        peopleType: '0',
        total: 0,
        type: '2',
      },
    }).then(res => {
      if (!visible || !myUploadLoading) return;

      if (res && res.res > 0 && res.data && res.data.taskId) {
        taskId = res.data.taskId;
        submit2_3_batchAddZip(taskId);
        // if (myImgList && myImgList.length > 0) {
        //   // 有图，先上传图再上传文档
        //   submit2_batchAddFace(taskId);
        // } else {
        //   // 无图，直接上传文档
        //   submit3_batchAddInfo(taskId);
        // }
      } else {
        handleUploadAbort();
      }
    }).catch(err => {
      handleUploadAbort();
      console.log(err);
    });
  };

  // 上传第2步：（人员-认证-列表4-2）批量上传人员照片
  // const submit2_batchAddFace = taskId => {
  //   wuInit(myImgList, '/guard-web/a/face/uploadFace', taskId);
  // };

  // 上传第3步：（人员-认证-列表4-3）上传人员数据xls文件
  // const submit3_batchAddInfo = taskId => {
  //   wuInit([xlsFile], '/guard-web/a/face/import', taskId);
  // };

  // 上传第2、3步：（人员-认证-列表4-3）上传人员数据xls文件
  const submit2_3_batchAddZip = taskId => {
    wuInit([zipFile], '/guard-web/a/face/uploadFaceZip', taskId);
  };

  // 上传第4步：轮询后台的解析数据进度
  const submit4_getBatchAddTaskProgress = taskId => {
    dispatch({
      type: 'face/getBatchAddTaskProgress',
      payload: {
        taskId,
        peopleType: '0',
      },
    }).then(res => {
      if (!visible || !myUploadLoading) return;

      if (res && res.res > 0 && res.data) {
        const { taskProgress, successNum } = res.data;

        if (taskProgress >= 100) {
          setTimeout(() => {
            handleSubmit(successNum);
          }, 500);
        } else {
          setTimeout(() => {
            if (!visible || !myUploadLoading) return;

            submit4_getBatchAddTaskProgress(taskId);
          }, 2000);
        }

        setUploadProgress(taskProgress > 100 ? 100 : (taskProgress || 1));
      } else {
        handleUploadAbort();
      }
    }).catch(err => {
      handleUploadAbort();
      console.log(err);
    });
  };

  // 上传可能触发：取消任务
  const submit_cancelBatchAddTask = () => {
    dispatch({
      type: 'face/cancelBatchAddTask',
      payload: {
        taskId,
        peopleType: '0',
      },
    }).then(res => {
      if (!visible || !myUploadLoading) return;

      if (res && res.res > 0) {
        handleUploadAbort(true);
      } else {
        handleUploadAbort();
      }
    }).catch(err => {
      handleUploadAbort();
      console.log(err);
    });
  };

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  const wuInit = (newFileList, server, taskId) => {
    if (uploader) wuDestroy();

    uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server,
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: true // 分片上传
    });

    newFileList.forEach((item, index) => {
      let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item);
      let newfile = new window.WebUploader.File(wuFile);

      newfile.taskId = taskId;
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
      if (!visible || !myUploadLoading) return;
      data.md5 = block.file.md5;
      data.taskId = block.file.taskId;
      data.peopleType = '0';
    });

    // uploader.on('uploadProgress', (file, percentage) => {
    //   if (!visible) return;
    // });

    uploader.on('uploadError', (file, reason) => {
      if (!visible || !myUploadLoading) return;
      console.log(`${file.name} : ${reason}`);

      handleUploadAbort();
    });

    uploader.on('uploadSuccess', (file, response) => {
      if (!visible || !myUploadLoading) return;
      const { res, errcode, msg } = response || {};

      if (res > 0) {
        setIsUnderAnalysis(true);
        setUploadProgress(1);
        submit4_getBatchAddTaskProgress(taskId);
        // myUploadAllSuccessNum++;
        // setUploadProgress(parseInt(myUploadAllSuccessNum / (imgListLen + 1) * 100));
        // uploadSuccessCheck();
      } else if (res === 0) {
        // 分片文件上传成功时返回，啥也不做
      } else {
        handleUploadAbort();
      }
    });

    // uploader.on('uploadComplete', file => {});

    uploader.on('error', type => {
      if (!visible || !myUploadLoading) return;
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

  // const handleDelXlsFile = () => {
  //   if (myUploadLoading) return;

  //   setXlsFile(null);
  // };

  const handleDelZipFile = () => {
    if (myUploadLoading) return;

    setZipFile(null);
  };

  // const handleDelImgList = () => {
  //   if (myUploadLoading) return;

  //   myImgList = [];
  //   setImgListLen(0);
  //   myImgTotal = 0;
  //   myLegalImgTotalSize = 0;
  //   setImgTotal(0);
  // };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.face.batchAdd' })}
      visible={visible}
      confirmLoading={uploadLoading}
      maskClosable={false}
      onOk={handleModalOk}
      onCancel={handleCancel}
    >
      <div>
        <div style={{ color: '#999' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', }}>
            <FormattedMessage id="oal.face.uploadExplain" />
          </h3>

          <p>
            <FormattedMessage id="oal.face.batchAddExplainTips1-1" />
            &nbsp;
            <a href={userImportTemplateLinkMap[selectedLang] || '/guardFile/model/users-en.zip'}>
              <FormattedMessage id="oal.face.batchAddExplainTips1-2" />
            </a>
            &nbsp;
            <FormattedMessage id="oal.face.batchAddExplainTips1-3" />
          </p>
          <p>
            <FormattedMessage id="oal.face.batchAddExplainTips2" />
          </p>
          <p>
            <FormattedMessage id="oal.face.batchAddExplainTips3(2)" />
          </p>
          <p>
            <FormattedMessage id="oal.face.batchAddExplainTips4(2)" />
          </p>
        </div>

        <div style={{ margin: '30px 0' }}>
          <Dragger
            accept=".zip"
            action="/guard-web/a/face/uploadFaceZip"
            withCredentials
            showUploadList={false}
            beforeUpload={beforeUploadZip}
            disabled={uploadLoading}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 30px' }}>
              <Icon type="file-zip" style={{ fontSize: '48px', }} />

              <div style={{ textAlign: 'left', paddingLeft: '30px' }}>
                <p style={{ fontSize: '24px', }}>
                  <FormattedMessage id="oal.face.batchAddZipDragTips1" />
                </p>
                <p>
                  <FormattedMessage id="oal.face.batchAddZipDragTips2" />
                </p>
              </div>
            </div>
          </Dragger>

          {
            zipFile ?
              (<div>
                <span>
                  <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
                    <div className="ant-upload-list-item-info">
                      <span>
                        <Icon type="paper-clip" />
                        <span
                          className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                          title={zipFile.name}
                        >
                          {zipFile.name}
                        </span>
                        {
                          !uploadLoading ?
                            (<span className="ant-upload-list-item-card-actions ">
                              <a
                                title={formatMessage({ id: 'oal.common.delete' })}
                                onClick={handleDelZipFile}
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

        {/* <Dragger
          accept=".xls, .xlsx, .csv"
          action="/guard-web/a/face/import"
          withCredentials
          showUploadList={false}
          beforeUpload={beforeUploadXls}
          style={{ marginBottom: '20px', }}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 30px' }}>
            <Icon type="file-excel" style={{ fontSize: '48px', }} />

            <div style={{ textAlign: 'left', paddingLeft: '30px' }}>
              <p style={{ fontSize: '24px', }}>
                <FormattedMessage id="oal.face.batchAddPersonnelDataDragtips1" />
              </p>
              <p>
                <FormattedMessage id="oal.face.batchAddPersonnelDataDragtips2" />
              </p>
            </div>
          </div>
        </Dragger>

        <Dragger
          accept=".png, .jpg, .jpeg"
          multiple
          action="/guard-web/a/face/uploadFace"
          withCredentials
          showUploadList={false}
          beforeUpload={beforeUploadImg}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 30px' }}>
            <Icon type="file-image" style={{ fontSize: '48px', }} />

            <div style={{ textAlign: 'left', paddingLeft: '30px' }}>
              <p style={{ fontSize: '24px', }}>
                <FormattedMessage id="oal.face.batchAddPersonnelPhotosDragtips1" />
              </p>
              <p>
                <FormattedMessage id="oal.face.batchAddPersonnelPhotosDragtips2" />
              </p>
            </div>
          </div>
        </Dragger> */}

        {/* <div>
          {
            xlsFile ?
              (<div>
                <span>
                  <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
                    <div className="ant-upload-list-item-info">
                      <span>
                        <Icon type="paper-clip" />
                        <span
                          className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                          title={xlsFile.name}
                        >
                          {xlsFile.name}
                        </span>
                        {
                          !uploadLoading ?
                            (<span className="ant-upload-list-item-card-actions ">
                              <a
                                title={formatMessage({ id: 'oal.common.delete' })}
                                onClick={handleDelXlsFile}
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
          {
            imgTotal > 0 ?
              (<div>
                <span>
                  <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
                    <div className="ant-upload-list-item-info">
                      <span>
                        <Icon type="paper-clip" />
                        <span
                          className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                          title={formatMessage({ id: 'oal.face.personnelPhotosNum' }, { num1: imgListLen, num2: imgTotal })}
                        >
                          <FormattedMessage id="oal.face.personnelPhotosNum" values={{ num1: imgListLen, num2: imgTotal }} />
                        </span>
                        {
                          !uploadLoading ?
                            (<span className="ant-upload-list-item-card-actions ">
                              <a
                                title={formatMessage({ id: 'oal.common.delete' })}
                                onClick={handleDelImgList}
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
        </div> */}
      </div>

      <Modal
        destroyOnClose
        maskClosable={false}
        title={formatMessage({ id: isUnderAnalysis ? 'oal.face.underAnalysis' : 'oal.face.inImport' })}
        centered
        visible={uploadLoading && !!uploadProgress}
        closable={false}
        width="30%"
        footer={[
          <Button key="cancel" onClick={submit_cancelBatchAddTask}>
            <FormattedMessage id="oal.common.cancel" />
          </Button>,
        ]}
      >
        {
          !!uploadProgress ? <Progress percent={uploadProgress} /> : ''
        }
        <p>
          {
            isUnderAnalysis ?
              <FormattedMessage id="oal.face.underAnalysisTips" /> :
              <FormattedMessage id="oal.face.inImportTips" />
          }
        </p>
      </Modal>
    </Modal>
  );
};

export default TableBatchAddModal;
