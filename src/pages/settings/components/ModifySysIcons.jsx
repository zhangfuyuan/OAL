import { Modal, Upload, Icon, message, Progress } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;
let uploader = null;
let okUrl = '';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const ModifySysIcons = props => {
  const { visible, currentUser, handleSubmit, confirmLoading, handleCancel, orgId } = props;
  const [imgLoading, setImgLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const [fileList, setFileList] = useState([]);

  // useEffect(() => {
  //   console.log(imageUrl);
  //   return () => {
  //     setImageUrl[null];
  //     console.log(imageUrl);
  //   }
  // }, [imageUrl]);

  const resetAllVar = () => {
    // 重置 state
    setImgLoading(false);
    setUploadLoading(false);
    setImageUrl(null);
    setUploadProgress(0);

    // 重置 全局变量
    if (uploader) wuDestroy();
    okUrl = '';
  };

  // const handleChange = info => {
  //   if (info.file.status === 'uploading') {
  //     setUploadLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, imageUrl => {
  //       setImageUrl(imageUrl);
  //       setUploadLoading(false);
  //     });
  //   }
  // };

  const beforeUpload = file => {
    setImgLoading(true);
    setUploadLoading(true);
    console.log('文件信息：', file.type, file.size);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      setImgLoading(false);
      setUploadLoading(false);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      setImgLoading(false);
      setUploadLoading(false);
    }
    if (isJpgOrPng && isLt2M) {
      // const newFileList = [...fileList, file];
      // 8126TODO 不显示上传列表可不用
      // setFileList(newFileList);
      const newFileList = [file];

      getBase64(file, imageUrl => {
        setImageUrl(imageUrl);
        setImgLoading(false);

        if (window.WebUploader && newFileList.length > 0) wuInit(newFileList);
      });
    }
    return false;
  };

  const uploadButton = (
    <div>
      <Icon type={imgLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const uploadingBox = (
    <div style={{ position: 'relative', width: '100%' }}>
      <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      <div className="oal-progress" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', }}>
        <Progress percent={uploadProgress} showInfo={false} />
      </div>
    </div>
  );

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  const wuInit = newFileList => {
    if (uploader) wuDestroy();
    const _orgId = orgId;

    uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server: '/guard-web/a/org/editSaasIcons', // 8126TODO 文件接收服务端
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: true // 分片上传
    });

    newFileList.forEach((item, index) => {
      let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item);
      let newfile = new window.WebUploader.File(wuFile);

      newfile.index = index;
      newfile.orgId = _orgId;
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
      data.md5 = block.file.md5;
    });

    uploader.on('uploadProgress', (file, percentage) => {
      setUploadProgress(parseInt(percentage * 100));
    });

    uploader.on('uploadError', (file, reason) => {
      console.log(`${file.name} : ${reason}`);

      message.error('uploadError');
      setUploadLoading(false);
    });

    uploader.on('uploadSuccess', (file, response) => {
      // const { res, data, msg } = response;
      // 8126TODO 上传成功返回数据

      if (response.status === 'done' && response.url) {
        message.success('uploadSuccess');
        okUrl = response.url;
      } else {
        message.error('false');
      }

      setUploadLoading(false);

      // if (res > 0 && data && data.fileUrl) {
      //   message.success('uploadSuccess');
      //   setUploadLoading(false);
      // } else if (res === 0) {
      //   // 分片文件上传成功时返回，啥也不做
      // } else if (res < 0 || /false/i.test(msg)) {
      //   message.error('false');
      //   setUploadLoading(false);
      // }
    });

    // uploader.on('uploadComplete', file => {});

    uploader.on('error', type => {
      console.log(`errorType：`, type);

      message.error('error');
      setUploadLoading(false);
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

  const handleModalOk = () => {
    handleSubmit(okUrl);
    resetAllVar();
  };

  const handleModalCancel = () => {
    handleCancel();
    resetAllVar();
  };

  return (
    <Modal
      destroyOnClose
      title={formatMessage({ id: 'oal.settings.modifySysIcons' })}
      visible={visible}
      confirmLoading={uploadLoading}
      maskClosable={false}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
    >
      <Upload
        accept="image/*"
        listType="picture-card"
        className="avatar-uploader oal-avatar-uploader-alone"
        showUploadList={false}
        // fileList={fileList}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        withCredentials
        beforeUpload={beforeUpload}
      // onChange={handleChange}
      >
        {imageUrl ? uploadingBox : uploadButton}
      </Upload>
    </Modal>
  );
};

export default ModifySysIcons;
