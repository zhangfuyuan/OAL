import {
  Modal,
  Form,
  Input,
  // Select,
  Upload,
  Icon,
  Button,
  notification,
  Progress,
  message
} from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import imgNull from '@/assets/img_null.png';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;
let uploader = null;
// const { Option } = Select;

const normFile = e => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const TableAddOrModifyModal = props => {
  const { form, bean, visible, handleSubmit, handleCancel, dispatch, groupId } = props;
  const { getFieldDecorator, setFieldsValue, resetFields } = form;
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);

  const isEdit = !!bean && !!bean._id;
  const title = formatMessage({ id: (isEdit ? 'oal.common.modify' : 'oal.face.add') });

  // 建议：每次 Modal 关闭时重置
  useEffect(() => {
    if (visible === false) {
      resetAllVar();
    }
  }, [visible]);

  const resetAllVar = () => {
    // 重置 state
    setUploadLoading(false);
    setImageUrl(null);
    setUploadProgress(0);

    // 重置 表单数据
    resetFields();
    setFieldsValue({});

    // 重置 全局变量
    if (uploader) wuDestroy();
  };

  const checkStaffid = (rule, value, callback) => {
    const reg = /^[0-9A-Za-z]+$/;
    if (value && !reg.test(value)) {
      callback(formatMessage({ id: 'oal.common.enterEnglishStringOrNumber' }));
    }
    callback();
  };

  const checkUserPhotos = (rule, value, callback) => {
    const len = value && value.length || 0;

    if (value && len > 0) {
      const curFile = value[len - 1].originFileObj;
      const staffid = form.getFieldValue('staffid');
      console.log('图片信息：', curFile.type, curFile.size, curFile.name);

      const fileType = curFile.type;
      const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
      const isLt240KB = curFile.size / 1024 < 240;
      const isMatchStaffid = staffid && curFile.name.indexOf(staffid) > -1;

      if (!isJpgOrPng) {
        callback(formatMessage({ id: 'oal.face.uploadImageFormatLimit' }));
        setImageUrl(null);
      }
      if (!isLt240KB) {
        callback(formatMessage({ id: 'oal.face.uploadImageSizeLimit' }));
        setImageUrl(null);
      }
      if (!isMatchStaffid) {
        callback(formatMessage({ id: 'oal.face.uploadImageNotMatchStaffid' }));
        setImageUrl(null);
      }
      if (isJpgOrPng && isLt240KB && isMatchStaffid) {
        getBase64(curFile, imageUrl => {
          setImageUrl(imageUrl);
        });
      }
    }

    callback();
  };

  const beforeUpload = () => false;

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { name, staffid, userPhotos } = fieldsValue;
      const params = {
        name,
        staffid,
        groupId,
        isEdit,
      }

      isEdit && (params.faceId = bean._id);
      setUploadLoading(true);
      dispatch({
        type: 'face/addOrEditInfo',
        payload: params,
      }).then(res => {
        if (!visible) return;

        if (res && res.res > 0) {
          const len = userPhotos && userPhotos.length || 0;

          if (window.WebUploader && len > 0) {
            wuInit([userPhotos[len - 1].originFileObj]);
          } else if (isEdit) {
            // 编辑，可不修改图片直接结束
            handleSubmit(isEdit);
            resetAllVar();
          } else {
            console.log(userPhotos);
            setUploadLoading(false);
          }
        } else if (res && res.errcode === 6007) {
          // 异常情况1：工号重复
          notification.error({
            message: formatMessage({ id: 'oal.face.staffidRepeat' }),
            description: formatMessage({ id: 'oal.face.staffidRepeatTips' }),
          });
          setUploadLoading(false);
          // } else if (res && res.res === 10002) {
          //   // 8126TODO 异常情况2：用户数已超出
          //   notification.error({
          //     message: formatMessage({ id: 'oal.face.addFailed' }),
          //     description: formatMessage({ id: 'oal.face.userNumLimit' }),
          //   });
          //   setUploadLoading(false);
        } else {
          console.log(res);
          setUploadLoading(false);
        }
      }).catch(err => {
        console.log(err);
        setUploadLoading(false);
      });
    });
  };

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  const wuInit = newFileList => {
    if (uploader) wuDestroy();

    uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server: '/guard-web/a/sys/face/addOrEditFace',
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: true // 分片上传
    });

    newFileList.forEach((item, index) => {
      let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item);
      let newfile = new window.WebUploader.File(wuFile);

      isEdit && (newfile.faceId = bean._id);
      newfile.groupId = groupId;
      newfile.isEdit = isEdit;
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
      const { file: { md5, groupId, isEdit, _id } } = block;

      data.md5 = md5;
      data.groupId = groupId;
      data.isEdit = isEdit;
      isEdit && (data.faceId = _id);
    });

    uploader.on('uploadProgress', (file, percentage) => {
      if (!visible) return;
      setUploadProgress(parseInt(percentage * 100));
    });

    uploader.on('uploadError', (file, reason) => {
      if (!visible) return;
      console.log(`${file.name} : ${reason}`);

      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
        description: formatMessage({ id: 'oal.face.pleaseUploadFileAgain' }),
      });
      setUploadLoading(false);
      setUploadProgress(0);
    });

    uploader.on('uploadSuccess', (file, response) => {
      if (!visible) return;
      const { res, errcode, msg } = response;

      if (res > 0) {
        handleSubmit(isEdit);
        resetAllVar();
      } else if (res === 0) {
        // 分片文件上传成功时返回，啥也不做
      } else if (res < 0 || errcode === 500 || /false/i.test(msg)) {
        notification.error({
          message: formatMessage({ id: 'oal.face.failToUpload' }),
          description: formatMessage({ id: 'oal.face.pleaseUploadFileAgain' }),
        });
        setUploadLoading(false);
        setUploadProgress(0);
      }
    });

    // uploader.on('uploadComplete', file => {});

    uploader.on('error', type => {
      if (!visible) return;
      console.log(`errorType：`, type);

      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
        description: formatMessage({ id: 'oal.face.pleaseUploadFileAgain' }),
      });
      setUploadLoading(false);
      setUploadProgress(0);
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

  const checkIllegalCharacter = (rule, value, callback) => {
    const errReg = /[<>|*?/:\s]/;
    if (value && errReg.test(value)) {
      callback(formatMessage({ id: 'oal.common.illegalCharacterTips' }));
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={uploadLoading}
    >
      <Form {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'oal.common.fullName' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
              {
                validator: checkIllegalCharacter,
              },
            ],
            initialValue: bean && bean.name || '',
          })(<Input placeholder={formatMessage({ id: 'oal.face.enterFullName' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.face.staffid' })}>
          {getFieldDecorator('staffid', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'oal.common.maxLength' }, { num: '20' }),
              },
              {
                validator: checkStaffid,
              },
            ],
            initialValue: bean && bean.profile && bean.profile.jobNumber || '',
          })(<Input placeholder={formatMessage({ id: 'oal.face.enterStaffid' })} disabled={!!bean && !!bean.profile && !!bean.profile.jobNumber} />)}
        </Form.Item>
        <div style={{ position: 'relative', width: 155, height: 155, margin: '0 0 24px 25%', }}>
          <img src={imageUrl || (isEdit ? bean.imgPath : imgNull)} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'contain', }} />
          {
            uploadProgress > 0 ?
              (<div className="oal-progress" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 5, }}>
                <Progress percent={uploadProgress} showInfo={false} />
              </div>) : ''
          }
        </div>
        <Form.Item label={formatMessage({ id: 'oal.face.userPhotos' })}>
          {getFieldDecorator('userPhotos', {
            rules: [
              {
                required: !isEdit,
                message: formatMessage({ id: 'oal.face.enterUserPhotosTips' }),
              },
              {
                validator: checkUserPhotos,
              },
            ],
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          })(
            <Upload
              name="userPhotos"
              accept="image/*"
              listType="picture"
              showUploadList={false}
              action="/guard-web/a/sys/face/addOrEditFace"
              withCredentials
              beforeUpload={beforeUpload}
            >
              <Button>
                <Icon type="upload" /> <FormattedMessage id="oal.common.upload" />
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.face.uploadExplain' })}>
          <p style={{ color: '#999', margin: 0, }}><FormattedMessage id="oal.face.uploadExplainP1" /></p>
          <p style={{ color: '#999', margin: '-8px 0 0', lineHeight: '22px', }}><FormattedMessage id="oal.face.uploadExplainP2" /></p>
          <p style={{ color: '#999', margin: 0, lineHeight: '22px', }}><FormattedMessage id="oal.face.uploadExplainP3" /></p>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedTableAddOrModifyModal = Form.create({ name: 'tableAddOrModify' })(TableAddOrModifyModal);
export default WrappedTableAddOrModifyModal;
