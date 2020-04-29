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
  const title = formatMessage({ id: (isEdit ? 'oal.common.edit' : 'oal.face.add') });

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
      console.log('图片信息：', curFile.type, curFile.size);

      const fileType = curFile.type;
      const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
      const isGt500KB = curFile.size / 1024 > 500;

      if (!isJpgOrPng) {
        notification.error({
          message: formatMessage({ id: 'oal.face.failToUpload' }),
          description: formatMessage({ id: 'oal.face.uploadImageFormatLimit' }),
        });
        setFieldsValue({
          userPhotos: [],
        });
        setImageUrl(null);
        callback(formatMessage({ id: 'oal.face.uploadImageFormatLimit' }));
      }
      if (isGt500KB) {
        notification.error({
          message: formatMessage({ id: 'oal.face.failToUpload' }),
          description: formatMessage({ id: 'oal.face.uploadImageSizeLimit' }),
        });
        setFieldsValue({
          userPhotos: [],
        });
        setImageUrl(null);
        callback(formatMessage({ id: 'oal.face.uploadImageSizeLimit' }));
      }
      if (isJpgOrPng && !isGt500KB) {
        getBase64(curFile, imageUrl => {
          setImageUrl(imageUrl);
        });
      }
    }
    callback();
  };

  const beforeUpload = () => {
    return false;
  };

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { name, staffid, userPhotos } = fieldsValue;
      const params = {
        name,
        staffid,
        groupId,
      }

      isEdit && (params._id = bean._id);
      setUploadLoading(true);
      dispatch({
        type: 'face/addOrEditFace',
        payload: params,
      }).then(res => {
        if (res && res.res > 0) {
          const len = userPhotos && userPhotos.length || 0;

          if (window.WebUploader && len > 0) {
            console.log(8126, '添加/更新人脸图片', userPhotos);
            wuInit([userPhotos[len - 1].originFileObj]);
          } else if (isEdit) {
            // 编辑，可不修改图片直接结束
            handleSubmit();
            resetAllVar();
          } else {
            console.log(userPhotos);
            setUploadLoading(false);
          }
        } else if (res && res.res === 10001) {
          // 8126TODO 异常情况1：工号重复
          notification.error({
            message: formatMessage({ id: 'oal.face.staffidRepeat' }),
            description: formatMessage({ id: 'oal.face.staffidRepeatTips' }),
          });
          setUploadLoading(false);
        } else if (res && res.res === 10002) {
          // 8126TODO 异常情况2：用户数已超出
          notification.error({
            message: formatMessage({ id: 'oal.face.addFailed' }),
            description: formatMessage({ id: 'oal.face.userNumLimit' }),
          });
          setUploadLoading(false);
        } else {
          console.log(res);
          setUploadLoading(false);
        }
      }).catch(err => {
        console.log(err);
        setUploadLoading(false);
      });


      // const params = {};
      // params.faceId = bean._id;
      // params.name = fieldsValue.name;
      // params.profile = {};
      // // eslint-disable-next-line no-unused-expressions
      // faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
      //   params.profile[item.key] = fieldsValue[item.key];
      // });
      // handleSubmit(params, () => {
      //   form.resetFields();
      // });
    });
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
      isEdit && (newfile._id = bean._id);
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
      data.md5 = block.file.md5;
      isEdit && (data._id = block.file._id);
      data.groupId = block.file.groupId;
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
      // const { errcode, data, msg } = response;
      // 8126TODO 上传成功返回数据

      if (response.status === 'done' && response.url) {
        handleSubmit(isEdit);
        resetAllVar();
      } else {
        message.error('false');
      }

      setUploadLoading(false);

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
                message: formatMessage({ id: 'oal.face.enterFullNameTips' }),
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
                message: formatMessage({ id: 'oal.face.enterStaffidTips' }),
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
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              withCredentials
              beforeUpload={beforeUpload}
            >
              <Button>
                <Icon type="upload" /> <FormattedMessage id="oal.face.uploadFile" />
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'oal.face.uploadExplain' })}>
          <p style={{ color: '#999', margin: 0, }}><FormattedMessage id="oal.face.uploadExplainP1" /></p>
          <p style={{ color: '#999', margin: '-8px 0 0', lineHeight: '22px', }}><FormattedMessage id="oal.face.uploadExplainP2" /></p>
          <p style={{ color: '#999', margin: 0, lineHeight: '22px', }}><FormattedMessage id="oal.face.uploadExplainP3" /></p>
        </Form.Item>
        {/* {faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
          const type = item.componentInfo && item.componentInfo.type;
          const data = item.componentInfo && item.componentInfo.data;
          if (type === 2 && data && data.length > 0) {
            return (
              <Form.Item label={item.name} key={`formItem_${item.key}`}>
                {getFieldDecorator(item.key, {
                  rules: [
                    item.required ?
                      {
                        required: true,
                        message: `${formatMessage({ id: 'oal.common.pleaseSelect' })}${item.name}`,
                      }
                      :
                      {},
                  ],
                  initialValue: bean.profile && bean.profile[item.key],
                })(<Select placeholder={`${formatMessage({ id: 'oal.common.pleaseSelect' })}${item.name}`} disabled={!!item.readOnly && !!bean.profile && !!bean.profile[item.key]}>
                  {data.map(option => (
                    <Option value={option.value} key={`option_${option.value}`}>{option.text}</Option>
                  ))}
                </Select>)}
              </Form.Item>
            )
          }
          return (
            <Form.Item label={item.name} key={`formItem_${item.key}`}>
              {getFieldDecorator(item.key, {
                rules: [
                  item.required ?
                    {
                      required: true,
                      message: `${formatMessage({ id: 'oal.common.pleaseEnter' })}${item.name}`,
                    }
                    :
                    {},
                ],
                initialValue: bean.profile && bean.profile[item.key],
              })(<Input placeholder={`${formatMessage({ id: 'oal.common.pleaseEnter' })}${item.name}`} disabled={!!item.readOnly && !!bean.profile && !!bean.profile[item.key]} />)}
            </Form.Item>
          )
        })} */}
      </Form>
    </Modal>
  );
};
const WrappedTableAddOrModifyModal = Form.create({ name: 'tableAddOrModify' })(TableAddOrModifyModal);
export default WrappedTableAddOrModifyModal;
