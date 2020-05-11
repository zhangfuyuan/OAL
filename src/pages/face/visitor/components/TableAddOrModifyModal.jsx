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
  message,
  DatePicker,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import imgNull from '@/assets/img_null.png';
import defaultSettings from '../../../../../config/defaultSettings';
import moment from 'moment';
// import { validateMobile } from '@/utils/utils';

const { RangePicker } = DatePicker;
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
  const { form, bean, visible, handleSubmit, handleCancel, dispatch } = props;
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

  const checkUserPhotos = (rule, value, callback) => {
    const len = value && value.length || 0;

    if (value && len > 0) {
      const curFile = value[len - 1].originFileObj;
      console.log('图片信息：', curFile.type, curFile.size, curFile.name);

      const fileType = curFile.type;
      const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
      const isLt240KB = curFile.size / 1024 < 240;

      if (!isJpgOrPng) {
        callback(formatMessage({ id: 'oal.face.uploadImageFormatLimit' }));
        setImageUrl(null);
      }
      if (!isLt240KB) {
        callback(formatMessage({ id: 'oal.face.uploadImageSizeLimit' }));
        setImageUrl(null);
      }
      if (isJpgOrPng && isLt240KB) {
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
      const { name, mobile, validity, userPhotos } = fieldsValue;
      const params = {
        name,
        mobile,
        isEdit,
        startDate: validity[0].format('YYYY-MM-DD'),
        endDate: validity[1].format('YYYY-MM-DD'),
        peopleType: '2',
      }

      isEdit && (params.faceId = bean._id);
      setUploadLoading(true);
      dispatch({
        type: 'faceVisitor/addOrEditInfo',
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

  // const checkMobile = (rule, value, callback) => {
  //   if (value && !validateMobile(value)) {
  //     callback(formatMessage({ id: 'oal.common.enterPhoneNumber' }));
  //   }
  //   callback();
  // };

  const checkMobile = (rule, value, callback) => {
    const reg = /^[\d\*\#\+]{1,14}$/;
    if (value && !reg.test(value)) {
      callback(formatMessage({ id: 'oal.common.formatError' }));
    }
    callback();
  };

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  const wuInit = newFileList => {
    if (uploader) wuDestroy();

    uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server: '/guard-web/a/face/visitor/addOrEditFace',
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: true // 分片上传
    });

    newFileList.forEach((item, index) => {
      let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item);
      let newfile = new window.WebUploader.File(wuFile);

      isEdit && (newfile.faceId = bean._id);
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
      const { file: { md5, isEdit, faceId } } = block;

      data.md5 = md5;
      data.isEdit = isEdit;
      isEdit && (data.faceId = faceId);
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
          })(<Input placeholder={formatMessage({ id: 'oal.face-visitor.enterVisitorFullName' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.common.phoneNumber' })}>
          {getFieldDecorator('mobile', {
            rules: [
              {
                validator: checkMobile,
              },
            ],
            initialValue: bean && bean.contact && bean.contact.mobile,
          })(<Input placeholder={formatMessage({ id: 'oal.common.phoneNumber' })} />)}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.face-visitor.validity' })}>
          {getFieldDecorator('validity', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'oal.common.pleaseEnter' }),
              },
            ],
            initialValue: ((startDate, endDate) => {
              let res = [moment(moment(), 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')];

              if (startDate && endDate) {
                res = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')];
              }

              return res;
            })(bean && bean.startDate || '', bean && bean.endDate || ''),
          })(<RangePicker
            ranges={{
              [formatMessage({ id: 'oal.face-visitor.today' })]: [moment(), moment()],
              [formatMessage({ id: 'oal.face-visitor.thisWeek' })]: [moment().week(moment().week()).startOf('week'), moment().week(moment().week()).endOf('week')],
              [formatMessage({ id: 'oal.face-visitor.thisMonth' })]: [moment().week(moment().week()).startOf('month'), moment().week(moment().week()).endOf('month')],
            }} />)}
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
              action="/guard-web/a/face/visitor/addOrEditFace"
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
          <p style={{ color: '#999', margin: '8px 0 0', lineHeight: '22px', }}><FormattedMessage id="oal.face-visitor.uploadExplainP1" /></p>
          <p style={{ color: '#999', lineHeight: '22px', }}><FormattedMessage id="oal.face-visitor.uploadExplainP2" /></p>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const WrappedTableAddOrModifyModal = Form.create({ name: 'tableAddOrModify' })(TableAddOrModifyModal);
export default WrappedTableAddOrModifyModal;
