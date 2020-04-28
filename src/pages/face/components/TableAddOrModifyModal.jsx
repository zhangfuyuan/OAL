import {
  Modal,
  Form,
  Input,
  // Select,
  Upload,
  Icon,
  Button,
  notification,
  Progress
} from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import imgNull from '@/assets/img_null.png';

// const { Option } = Select;

const normFile = e => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
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
  const { form, bean, visible, handleSubmit, handleCancel, faceKeyList } = props;
  const { getFieldDecorator, setFieldsValue } = form;
  const [imageUrl, setImageUrl] = useState(null);
  // const [uploadProgress, setUploadProgress] = useState(0);

  const title = formatMessage({ id: (bean && bean._id ? 'oal.common.edit' : 'oal.face.add') });

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
      console.log('文件信息：', curFile.type, curFile.size);

      const fileType = curFile.type;
      const isJpgOrPng = fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg';
      const isLt500KB = curFile.size / 1024 < 500;

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
      if (!isLt500KB) {
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
      if (isJpgOrPng && isLt500KB) {
        getBase64(curFile, imageUrl => {
          setImageUrl(imageUrl);
        });
      }
    }
    callback();
  };

  const beforeUpload = () => {
    // console.log('文件信息：', file.type, file.size);
    // const isLt500KB = file.size / 1024 < 500;
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    // if (!isJpgOrPng) {
    //   notification.error({
    //     message: formatMessage({ id: 'oal.face.failToUpload' }),
    //     description: formatMessage({ id: 'oal.face.uploadImageFormatLimit' }),
    //   });
    // }
    // if (!isLt500KB) {
    //   notification.error({
    //     message: formatMessage({ id: 'oal.face.failToUpload' }),
    //     description: formatMessage({ id: 'oal.face.uploadImageSizeLimit' }),
    //   });
    // }
    // if (isJpgOrPng && isLt500KB) {
    //   const newFileList = [file];

    //   getBase64(file, imageUrl => {
    //     setImageUrl(imageUrl);
    //   });
    // }
    return false;
  };

  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      console.log(8126, '添加/编辑人脸信息', fieldsValue);

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

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
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
          <img src={imageUrl || imgNull} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: 5, objectFit: 'contain', }} />
          <div className="oal-progress" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 5, }}>
            <Progress percent={50} showInfo={false} />
          </div>
        </div>
        <Form.Item label={formatMessage({ id: 'oal.face.userPhotos' })}>
          {getFieldDecorator('userPhotos', {
            rules: [
              {
                required: true,
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
