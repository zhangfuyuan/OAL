import React, { Component, Fragment } from 'react';
import { List, Button, Result, message, Popconfirm, Avatar, Upload, notification } from 'antd';
import logo from '@/assets/logo.svg';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../../../../config/defaultSettings';

const { publicPath } = defaultSettings;

class SystemView extends Component {
  uploader = null;

  setUrl = path => {
    if (!path) {
      return ''
    }
    const { origin } = window.location;
    const href = `${origin}${publicPath}user/${path}/login`;
    return href;
  };

  handleModify = () => {
    const { openModal } = this.props;
    openModal();
  };

  handleModifyIcons = saasIconsUrl => {
    const { updateSysIcons } = this.props;
    updateSysIcons(saasIconsUrl);
  };

  beforeUpload = file => {
    console.log('上传的系统图标信息：', file.type, file.size);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
        description: formatMessage({ id: 'oal.face.uploadImageFormatLimit' }),
      });
    }
    const isLt240KB = file.size / 1024 < 240;
    if (!isLt240KB) {
      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
        description: formatMessage({ id: 'oal.common.uploadImageSizeLimit' }, { size: '240KB' }),
      });
    }
    if (isJpgOrPng && isLt240KB) {
      this.wuInit(file);
    }
    return false;
  };

  getData = (currentUser, version) => {
    const orgInfo = (currentUser && currentUser.org) || {};
    const items = [
      {
        title: formatMessage({ id: 'oal.settings.accessAddress' }),
        description: (
          <Fragment>
            {this.setUrl((orgInfo && orgInfo.path) || '')}
          </Fragment>
        ),
        actions: [],
      },
    ];

    if (currentUser.type === 0 && orgInfo.type === 0) {
      items.push({
        title: formatMessage({ id: 'oal.settings.sysname' }),
        description: (
          <Fragment>
            {orgInfo.saasName}
          </Fragment>
        ),
        actions: [
          <a key="sysname" onClick={() => this.handleModify()}>
            <FormattedMessage id="oal.common.modify" />
          </a>,
        ],
      }, {
        title: (
          <Fragment>
            <span style={{ marginRight: '16px' }}><FormattedMessage id="oal.settings.systemIcons" /></span>
            <Avatar src={orgInfo.saasIconsUrl || logo} />
          </Fragment>
        ),
        description: '',
        actions: [
          <Upload
            name="saasIcons"
            accept="image/*"
            showUploadList={false}
            action="/guard-web/a/org/editSaasIcons"
            withCredentials
            beforeUpload={this.beforeUpload}
          >
            <Button type="link">
              <FormattedMessage id="oal.common.modify" />
            </Button>
          </Upload>,
        ],
      })
    }
    items.push({
      title: formatMessage({ id: 'oal.settings.systemVersion' }),
      description: (
        <Fragment>{version}</Fragment>
      ),
      actions: [],
    });
    return items;
  };

  /********************************************** WebUploader API Start **********************************************/

  // 初始化 WebUploader 实例对象
  wuInit = file => {
    if (this.uploader) this.wuDestroy();
    const { orgId } = this.props;

    this.uploader = window.WebUploader.create({
      swf: (process.env === 'production' ? publicPath : '/') + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
      server: '/guard-web/a/org/editSaasIcons', // 8126TODO 文件接收服务端
      thumb: false, // 不生成缩略图
      compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
      prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
      chunked: true // 分片上传
    });

    let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), file);
    let newfile = new window.WebUploader.File(wuFile);

    newfile.orgId = orgId;
    this.uploader.addFiles(newfile);
    wuFile = null;
    newfile = null;

    this.wuUpload();
  };

  // 触发 WebUploader 上传图片/视频资源
  wuUpload = () => {
    if (!this.uploader) return false;

    // this.uploader.on('uploadStart', file => {});

    this.uploader.on('uploadBeforeSend', (block, data) => {
      data.md5 = block.file.md5;
      data.orgId = block.file.orgId;
    });

    // this.uploader.on('uploadProgress', (file, percentage) => {});

    this.uploader.on('uploadError', (file, reason) => {
      console.log(`${file.name} : ${reason}`);

      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
      });
      this.wuDestroy();
    });

    this.uploader.on('uploadSuccess', (file, response) => {
      const { res, data, msg } = response;

      if (res > 0 && data && data.saasIconsUrl) {
        this.handleModifyIcons(data.saasIconsUrl);
        this.wuDestroy();
      } else if (res === 0 || msg === 'upload_chunk' || errcode === 200) {
        // 分片文件上传成功时返回，啥也不做
      } else if (res < 0 || /false/i.test(msg) || errcode === 500) {
        notification.error({
          message: formatMessage({ id: 'oal.face.failToUpload' }),
        });
        this.wuDestroy();
      }
    });

    // this.uploader.on('uploadComplete', file => {});

    this.uploader.on('error', type => {
      console.log(`errorType：`, type);

      notification.error({
        message: formatMessage({ id: 'oal.face.failToUpload' }),
      });
      this.wuDestroy();
    });

    this.uploader.upload();
  };

  // 销毁 WebUploader 实例对象
  wuDestroy = () => {
    if (!this.uploader) return false;

    this.uploader.destroy();
    this.uploader = null;
  };

  /********************************************** WebUploader API End **********************************************/

  render() {
    const { currentUser, version } = this.props;
    const data = this.getData(currentUser, version);
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item
              actions={item.actions}
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SystemView;
