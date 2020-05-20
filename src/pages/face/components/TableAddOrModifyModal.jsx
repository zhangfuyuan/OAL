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

      const fileType = curFile.type;
      const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
      const isLt240KB = curFile.size / 1024 < 240;
      const isMatchStaffid = staffid && curFile.name.indexOf(`${staffid}.`) > -1;

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
      const _userPhotosLen = userPhotos && userPhotos.length || 0;
      const params = {
        faceId: isEdit && bean && bean._id || '',
        name,
        staffid,
        groupId,
        isEdit,
        peopleType: '0',
        isUpdateImg: _userPhotosLen > 0 ? '1' : '0',
      }

      if (isEdit && _userPhotosLen === 0) {
        // 编辑且不修改图片
        setUploadLoading(true);
        dispatch({
          type: 'face/addOrEditInfo',
          payload: params,
        }).then(res => {
          if (!visible) return;

          if (res && res.res > 0) {
            // 编辑，可不修改图片直接结束
            handleSubmit(isEdit);
            resetAllVar();
          } else {
            console.log(res);
            notification.error({
              message: formatMessage({ id: 'oal.face.failToUpload' }),
              description: formatMessage({ id: 'oal.face.pleaseUploadFileAgain' }),
            });
            setUploadLoading(false);
          }
        }).catch(err => {
          console.log(err);
          notification.error({
            message: formatMessage({ id: 'oal.face.failToUpload' }),
            description: formatMessage({ id: 'oal.face.pleaseUploadFileAgain' }),
          });
          setUploadLoading(false);
        });
      } else if (window.WebUploader && _userPhotosLen > 0) {
        // 含图片（添加/编辑）
        const _originFileObj = userPhotos[_userPhotosLen - 1].originFileObj;
        const { faceId, name, staffid, groupId, isEdit, peopleType, isUpdateImg } = params || {};

        faceId && (_originFileObj.faceId = faceId);
        _originFileObj.staffname = name;
        _originFileObj.staffid = staffid;
        _originFileObj.groupId = groupId;
        _originFileObj.isEdit = isEdit;
        _originFileObj.peopleType = peopleType;
        _originFileObj.isUpdateImg = isUpdateImg;
        setUploadLoading(true);
        wuInit([_originFileObj]);
      } else {
        console.log(userPhotos);
        notification.error({
          message: formatMessage({ id: 'oal.face.failToUpload' }),
          description: formatMessage({ id: 'oal.face.pleaseUploadFileAgain' }),
        });
      }

      // isEdit && (params.faceId = bean._id);
      // setUploadLoading(true);
      // dispatch({
      //   type: 'face/addOrEditInfo',
      //   payload: params,
      // }).then(res => {
      //   if (!visible) return;

      //   if (res && res.res > 0 && res.data) {
      //     const len = userPhotos && userPhotos.length || 0;

      //     if (window.WebUploader && len > 0) {
      //       const _originFileObj = userPhotos[len - 1].originFileObj;
      //       const { _id, name: _name, staffid: _staffid } = res.data;

      //       _originFileObj.faceId = _id;
      //       _originFileObj._name = _name;
      //       _originFileObj._staffid = _staffid;
      //       wuInit([_originFileObj]);
      //     } else if (isEdit) {
      //       // 编辑，可不修改图片直接结束
      //       handleSubmit(isEdit);
      //       resetAllVar();
      //     } else {
      //       console.log(userPhotos);
      //       setUploadLoading(false);
      //     }
      //   } else {
      //     console.log(res);
      //     setUploadLoading(false);
      //   }
      // }).catch(err => {
      //   console.log(err);
      //   setUploadLoading(false);
      // });
    });
  };

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  const wuInit = (newFileList) => {
    if (uploader) wuDestroy();

    uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server: '/guard-web/a/face/uploadFace', // （人员-认证-列表3-2）上传人员的头像
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: true // 分片上传
    });

    newFileList.forEach((item, index) => {
      let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item);
      let newfile = new window.WebUploader.File(wuFile);
      const { faceId, staffname, staffid, groupId, isEdit, peopleType, isUpdateImg } = item || {};

      faceId && (newfile.faceId = faceId);
      newfile.staffname = staffname;
      newfile.staffid = staffid;
      newfile.groupId = groupId;
      newfile.isEdit = isEdit;
      newfile.peopleType = peopleType;
      newfile.isUpdateImg = isUpdateImg;
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
      const { file: { md5, faceId, staffname, staffid, groupId, isEdit, peopleType, isUpdateImg } } = block || { file: {} };

      data.md5 = md5;
      faceId && (data.faceId = faceId);
      data.staffname = staffname;
      data.staffid = staffid;
      data.groupId = groupId;
      data.isEdit = isEdit;
      data.peopleType = peopleType;
      data.isUpdateImg = isUpdateImg;
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
      const { res, errcode, msg } = response || {};

      if (res > 0) {
        handleSubmit(isEdit);
        resetAllVar();
      } else if (res === 0) {
        // 分片文件上传成功时返回，啥也不做
      } else if (res === -1 && errcode === 6007) {
        // 工号重复
        notification.error({
          message: formatMessage({ id: 'oal.face.staffidRepeat' }),
          description: formatMessage({ id: 'oal.face.staffidRepeatTips' }),
        });
        setUploadLoading(false);
        setUploadProgress(0);
      } else if (!response || res < 0 || errcode === 500 || /false/i.test(msg)) {
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
          <img src={imageUrl || (isEdit ? `${bean.imgPath}?t=${Date.now()}` : imgNull)} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'contain', }} />
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
              accept=".png, .jpg, .jpeg"
              listType="picture"
              showUploadList={false}
              action="/guard-web/a/sys/face/addOrEditFace"
              withCredentials
              beforeUpload={beforeUpload}
            >
              <Button>
                <Icon type="upload" /> <FormattedMessage id="oal.face.uploadPhoto" />
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
