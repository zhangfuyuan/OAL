import React, { Component, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import { Avatar, Upload, Button, Icon, Card, Radio, Input, Drawer, Badge, Alert, Dropdown, Menu, Popconfirm, message, Modal, Divider, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva';
import { findIndex, groupBy } from 'lodash';
import { AUTH_TOKEN } from '../../utils/constants';
import styles from './style.less';
import ModifyModal from './components/ModifyModal';
import UploadProgress from './components/UploadProgress';
import UploadDetail from './components/UploadDetail';
import StandardTable from '@/components/StandardTable'

const { Search } = Input;
const { confirm } = Modal;

const renderStatusText = data => {
  let statusText = <Badge status="processing" text="授权中" />
  if (data.featureState === 1) {
    statusText = <Badge status="success" text="已授权" />
  } else if (data.featureState === -1) {
    statusText = <Badge status="error" text="授权失败" />
  }
  return (
    <span>{statusText}</span>
  )
}

const listSubName = data => {
  let subNameText = <span><Icon type="loading" style={{ marginRight: 8 }} /> 提取特征中 </span>;
  if (data.featureState === 1) {
    subNameText = <span><Icon type="check-circle" style={{ marginRight: 8, color: '#52C418' }} />已提取特征</span>
  } else if (data.featureState === -1) {
    subNameText = <span><Icon type="close-circle" style={{ marginRight: 8, color: '#f5222d' }} />特征提取失败</span>
    if (data.featureErrorCode && data.featureErrorCode.errorMsg) {
      subNameText += `:${data.featureErrorCode.errorMsg}`
    }
  }
  return subNameText;
}

@connect(({ user, face, faceKey, loading }) => ({
  face,
  user: user.currentUser,
  loading: loading.effects['face/fetch'],
  modifyLoading: loading.effects['face/modify'],
  faceKeyList: faceKey.faceKeyList,
  sysConfigs: face.sysConfigs,
}))
class Face extends Component {
  state = {
    uploadVisible: false,
    featureState: 'all',
    modifyVisible: false,
    selectedBean: {},
    viewVisible: false,
    selectedRows: [],
    infoVisible: true,
    fileList: [],
    errorList: [],
    successList: [],
    childrenDrawer: false, // 上传的明细右侧栏
    childrenTabIndex: 'success', // 明细中展示的tab类型
  };

  componentDidMount() {
    this.loadFaceList();
    this.loadFaceKeyList();
    this.loadSysConfig();
    // this.errorList = [];
    this.excludeNum = 0
  }

  loadFaceList = (pagination, fs) => {
    const { dispatch } = this.props;
    if (!pagination) {
      // eslint-disable-next-line no-param-reassign
      pagination = {
        current: 1,
        pageSize: 10,
      }
    }
    const payload = {
      ...pagination,
      featureState: (fs || fs === '0') ? fs : this.state.featureState,
    }
    if (this.nameRef.input && this.nameRef.input.input && this.nameRef.input.input.value) {
      payload.name = this.nameRef.input.input.value
    }
    dispatch({
      type: 'face/fetch',
      payload,
    });
  };

  loadFaceKeyList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'faceKey/getFaceKeyList',
    });
  };

  loadSysConfig = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/toGetSysConfigs',
    })
  };

  columns = () => {
    const { user, faceKeyList } = this.props;
    const MoreBtn = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.editAndDelete(key, item)}>
            <Menu.Item key="modify">修改</Menu.Item>
            <Menu.Item key="editPhoto">改照片</Menu.Item>
          </Menu>
        }
      >
        <a>
          编辑 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const cl = [
      {
        title: '照片',
        key: 'avatar',
        width: 100,
        render: (text, record) => <Avatar src={`${record.imgPath}.jpg?height=64&width=64&mode=fit`} shape="square" size="large" onClick={() => this.openViewModal(record)} />,
      },
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name',
        ellipsis: true,
      },
      // {
      //   title: '状态',
      //   key: 'status',
      //   width: 150,
      //   render: (text, record) => renderStatusText(record),
      // },
    ];
    // 遍历人脸属性列表，根据人脸列表字段profile里面的进行对应渲染，其中如果是下拉控件（type=2），还要拿到value对应的text
    // eslint-disable-next-line no-unused-expressions
    faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
      cl.push({
        title: item.name,
        key: item.key,
        ellipsis: true,
        render: (text, record) => {
          const type = item.componentInfo && item.componentInfo.type; // 文本框1，下拉框2
          const data = item.componentInfo && item.componentInfo.data; // 下拉选项value，text的对象数组
          let spanText = '';
          if (record && record.profile && record.profile[item.key]) {
            if (type === 2 && data && data.length > 0) {
              const option = data.find(bean => bean.value == record.profile[item.key]);
              spanText = (option && option.text) || '';
            } else {
              spanText = record.profile[item.key];
            }
          }
          return <span>{spanText}</span>
        },
      });
    });

    cl.push(
      {
        title: '更新时间',
        key: 'updateAt',
        width: 150,
        render: (text, record) => <span>{record.updateAt ? moment(record.updateAt).format('YYYY-MM-DD HH:mm') : ''}</span>,
      },
      {
        title: '操作',
        width: 150,
        render: (text, record) => (
          <Fragment>
            <Popconfirm placement="topLeft" title="是否删除此人脸?" onConfirm={() => this.deleteFace(record)} okText="删除" cancelText="取消">
              <a key="remove">
                删除
            </a>
            </Popconfirm>
            <Divider type="vertical" />
            <MoreBtn item={record} />
          </Fragment>
        ),
      });
    return cl;
  };

  getImgName = str => {
    const temp = str.split('.');
    temp.pop();
    return temp.join('.')
  }

  getErrorName = (str, errorIndex) => {
    const temp = str.split('.');
    const pix = temp[temp.length - 1];
    temp.pop();
    const nameStr = temp.join('.')
    const nameArray = nameStr.split('_')
    const tp = nameArray.map((item, index) => {
      if (errorIndex === index) {
        return <span style={{ color: 'red', fontWeight: 700 }}>{item}</span>
      }
      return item
    })
    const resultArray = [];
    for (let i = 0; i < tp.length; i++ ) {
      resultArray.push(tp[i])
      if (i !== nameArray.length - 1) {
        resultArray.push('_');
      }
    }
    return (
      <div>
        {
          resultArray
        }
        .{pix}
      </div>
    )
  }

  addToList = (orgList, bean) => {
    const tpIndex = findIndex(orgList, item => item.uid === bean.uid)
    if (tpIndex === -1) {
      orgList.push(bean)
    }
    return orgList;
  }

  onBeforeUpload = (file, fList, isDirectory, uniqueIndex) => {
    let { fileList, errorList } = this.state;
    if (fileList.length === 0) {
      this.setState({ fileList: fList })
    }
    if (!isDirectory) {
      return true;
    }

    let flag = true
    const nameArray = this.getImgName(file.name).split('_');
    for (let i = 0; i < fList.length; i++) {
      if (fList[i].uid !== file.uid) {
        // 只有不相同的做对比
        const temp = this.getImgName(fList[i].name).split('_')
        // 遍历取每条数据比较
        for (let p = 0; p < uniqueIndex.length; p++) {
          // 遍历唯一约束列
          if (nameArray[uniqueIndex[p].index + 2] && (temp[uniqueIndex[p].index + 2] === nameArray[uniqueIndex[p].index + 2])) {
            // 对比唯一约束列
            // 唯一约束列结果一致，加入到错误列表
            this.excludeNum++;
            errorList = this.addToList(errorList,
              {
                name: file.name,
                size: file.size,
                uid: file.uid,
                uploadRes: { res: -1, errorCode: 5007 },
              });
              this.setState({ errorList })
            flag = false
            break
          }
        }
        if (!flag) {
          // 只需要找到一个违反唯一约束的，就退出
          break;
        }
      }
    }
    return flag
  }

  onBeforeUploadbak = (file, fList, isDirectory, uniqueIndex) => {
    console.log('beforeUploadFile-------', fList);
    // 这里只校验会影响数据的那种唯一性约束的字段，其他均无校验的必要，如果唯一性校验失败，终止上传
    const { fileList, errorList } = this.state;
    if (fileList.length === 0) {
      this.setState({ fileList: fList })
    }

    if (!isDirectory) {
      return true;
    }
    // const { errorList } = this;
    const isIn = findIndex(errorList,
      item => (item.uid === file.uid || item.equalToUid === file.uid))
    if (isIn !== -1) {
      return false
    }
    let flag = true
    // const { sysConfigs, faceKeyList } = this.props;
    // console.log('fList---', fList)
    const nameArray = this.getImgName(file.name).split('_')
    for (let i = 0; i < fList.length; i++) {
      if (fList[i].uid !== file.uid) {
        // 只有不相同的做对比
        const temp = this.getImgName(fList[i].name).split('_')
        // 遍历取每条数据比较
        for (let p = 0; p < uniqueIndex.length; p++) {
          // 遍历唯一约束列
          if (nameArray[uniqueIndex[p].index + 2] && (temp[uniqueIndex[p].index + 2] === nameArray[uniqueIndex[p].index + 2])) {
            // 对比唯一约束列
            // 唯一约束列结果一致，加入到错误列表
            errorList.push({
              uid: file.uid,
              equalInfo: [file.name, fList[i].name],
              equalToUid: fList[i].uid,
              equalAt: p,
            })

            notification.error({
              message: <div><span style={{ fontWeight: 700 }}>{uniqueIndex[p].name}</span>字段重复</div>,
              description: (<div>
                <div style={{ marginTop: '1em' }}>{this.getErrorName(file.name, uniqueIndex[p].index + 2)}</div>
                <div style={{ marginTop: '1em' }}>{this.getErrorName(fList[i].name, uniqueIndex[p].index + 2)}</div>
              </div>),
              duration: null,
            });
            flag = false
          }
        }
      }
    }
    this.errorList = errorList
    return flag;
  };

  renderUpload = (isDirectory, Btn, bean) => {
    // eslint-disable-next-line no-underscore-dangle
    const { fileList, errorList, successList } = this.state;
    const { faceKeyList } = this.props;

    // 寻找出不可重复的字段
    const uniqueIndex = []
    if (faceKeyList && faceKeyList.length > 0) {
      for (let i = 0; i < faceKeyList.length; i++) {
        if (faceKeyList[i].isUnique) {
          // 该字段不能重复
          uniqueIndex.push({ index: i, name: faceKeyList[i].name })
        }
      }
    }

    const isEdit = !!(bean && bean._id);
    const authToken = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);
    const props = {
      // eslint-disable-next-line no-underscore-dangle
      accept: '.png, .jpg, .jpeg',
      action: isEdit ? `/api/face/manage/${bean._id}/upload` : '/api/face/manage/upload',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      multiple: !isEdit,
      directory: isDirectory,
      // showUploadList: {
      //   showPreviewIcon: true,
      //   showRemoveIcon: false,
      //   showDownloadIcon: false,
      // },
      fileList,
      showUploadList: false,
      beforeUpload: (file, fList) => this.onBeforeUpload(file, fList, isDirectory, uniqueIndex),
      onError: (err, res, file) => {
        console.log('onError file:', typeof err)
        // console.log('fList status:', res) // <h2>400 Bad Request</h2>
        // console.log('event:', oc.event)
        errorList.push({ name: file.name, size: file.size, uploadRes: 400, uid: file.uid })
        this.setState({ errorList });
      },
      onSuccess: (result, file) => {
        console.log('onSuccess oc:', result, file)
        const temp = { name: file.name, size: file.size, uploadRes: result, uid: file.uid }
        if (result.res < 1) {
          errorList.push(temp)
          this.setState({ errorList });
        } else {
          successList.push(temp)
          this.setState({ successList });
        }
      },
    }
    return (
      <Upload {...props}>
        {Btn}
      </Upload>
    )
  }

  showDrawer = () => {
    this.setState({
      uploadVisible: true,
    });
  };

  onCloseDrawer = () => {
    this.setState({
      uploadVisible: false,
      selectedBean: {},
    });
    this.loadFaceList();
  };

  onPageChange = (page, pageSize) => {
    this.loadFaceList({
      current: page,
      pageSize,
    })
  }

  faceStateChange = e => {
    this.loadFaceList({
      current: 1,
      pageSize: 10,
    }, e.target.value)
    this.setState({
      featureState: e.target.value,
    })
  }

  renderUploadPanel = () => {
    const { uploadVisible, selectedBean, fileList } = this.state;
    const { sysConfigs, faceKeyList } = this.props;
    const isUploading = fileList.length > 0
    // eslint-disable-next-line no-underscore-dangle
    const isEdit = !!(selectedBean && selectedBean._id);
    let title = '上传人脸照片';
    if (isEdit) {
      title = `修改${selectedBean.name}的人脸照片`;
    }
    const faceSizeBean = sysConfigs.find(item => item.key === 'faceSize');
    const maxFaceCountBean = sysConfigs.find(item => item.key === 'maxFaceCount');
    let exampleStr = '';
    // eslint-disable-next-line no-unused-expressions
    faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
      exampleStr += `_${item.name}`;
    })
    return (
      <Drawer
        title={title}
        placement="right"
        onClose={this.onCloseDrawer}
        visible={uploadVisible}
        width={580}
      >
        {
          isUploading ? null : <Alert
          message={
            <div>
              <div>
                1、图片名称需按<span style={{ color: 'green', margin: '0 8px' }}>0_姓名_扩展属性1_扩展属性2_......</span>的格式命名；
              </div>
              <div>
                2、什么是扩展属性？可移步
                <span style={{ color: 'green', margin: '0 8px' }}>设置 > 人脸属性</span>进行设置；
              </div>
              <div>
                例如：<span style={{ color: 'red' }}>0_张三<span>{exampleStr}</span>.jpeg</span>
              </div>
              <div>
                3、可上传图片尺寸(kb)
                <div style={{ marginLeft: '22px' }}>
                  最小值：
                  <span style={{ color: 'green' }}>
                    {faceSizeBean && faceSizeBean.value && faceSizeBean.value.min ?
                      `${faceSizeBean && faceSizeBean.value && faceSizeBean.value.min}kb`
                      :
                      '未设置'
                    }
                  </span>
                </div>
                <div style={{ marginLeft: '22px' }}>
                  最大值：
                  <span style={{ color: 'green' }}>
                    {faceSizeBean && faceSizeBean.value && faceSizeBean.value.max ?
                      `${faceSizeBean && faceSizeBean.value && faceSizeBean.value.max}kb`
                      :
                      '未设置'
                    }
                  </span>
                </div>
              </div>
              <div>
                4、底库最大数量：
                <span style={{ color: 'green' }}>
                  {maxFaceCountBean && maxFaceCountBean.value ?
                    `${maxFaceCountBean && maxFaceCountBean.value}张`
                    :
                    '未设置'
                  }
                </span>
              </div>
              <div>
                5、人脸图片规格和底库数量设置，请移步
                <span style={{ color: 'green', margin: '0 8px' }}>设置 > 人脸底库</span>进行设置；
              </div>
            </div>
          }
          type="warning"
        />
        }

        <div style={{ display: isUploading ? 'none' : 'flex', marginTop: '16px' }}>
          {isEdit ? null : this.renderUpload(true, (
            <Button>
              <Icon type="upload" /> 上传文件夹
            </Button>
          ))}
          {this.renderUpload(false, (
            <Button style={{ marginLeft: 16 }}>
              <Icon type="upload" /> 上传图片
            </Button>
          ), selectedBean)}
        </div>

        <UploadProgress fileList={this.state.fileList}
            resetUpload={() => {
              this.setState({
                fileList: [],
                errorList: [],
                successList: [],
              })
              this.excludeNum = 0;
            }}
            openDetail ={tab => {
              this.setState({ childrenDrawer: true, childrenTabIndex: tab })
            }}
            excludeNum = {this.excludeNum}
            errorList={this.state.errorList}
            successList={this.state.successList}/>
          <UploadDetail childrenDrawer={this.state.childrenDrawer}
              childrenTabIndex={this.state.childrenTabIndex}
              changeTab = {tabType => this.setState({ childrenTabIndex: tabType })}
              errorList={this.state.errorList}
              successList={this.state.successList}
              onChildrenDrawerClose={() => this.setState({ childrenDrawer: false })}/>
      </Drawer>
    )
  }


  deleteFace = bean => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/delete',
      // eslint-disable-next-line no-underscore-dangle
      payload: { faceId: bean._id },
    }).then(res => {
      if (res.res > 0) {
        this.loadFaceList();
        message.success('删除成功');
      }
    });
  };

  editAndDelete = (key, bean) => {
    if (key === 'modify') {
      this.setState({ modifyVisible: true, selectedBean: bean })
    } else {
      this.setState({ uploadVisible: true, selectedBean: bean })
    }
  };

  closeModifyModal = () => {
    this.setState({ modifyVisible: false, selectedBean: {} })
  };

  submitModify = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'face/modify',
      payload: params,
    }).then(res => {
      if (res.res > 0) {
        this.closeModifyModal();
        this.loadFaceList();
        message.success('修改成功');
        callback();
      }
    });
  };

  openViewModal = bean => {
    this.setState({ viewVisible: true, selectedBean: bean })
  };

  closeViewModal = () => {
    this.setState({ viewVisible: false, selectedBean: {} })
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = pagination => {
    this.loadFaceList({
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
  };

  handleInfoClose = () => {
    this.setState({ infoVisible: false })
  }

  showConfirmRemoveAll = () => {
    const self = this;
    confirm({
      title: '是否删除所有人脸?',
      icon: <ExclamationCircleOutlined />,
      content: '点击“确定”将会清空人脸库，且会同步到相应的设备',
      onOk() {
        const { dispatch } = self.props;
        return dispatch({
          type: 'face/removeAll',
        }).then(res => {
          if (res.res > 0) {
            self.loadFaceList();
            message.success('删除成功');
          }
        });
      },
      onCancel() {},
    });
  }

  render() {
    const extraContent = (
      <div className={styles.extraContent}>
        {/* <Popover content="授权成功的人脸才能被系统识别" title="什么是授权?">
          <Button shape="circle" icon="question" size="small" style={{ marginRight: 16 }} />
        </Popover>
        <RadioGroup defaultValue="all" onChange={this.faceStateChange}>
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="1">已授权</RadioButton>
          <RadioButton value="0">授权中</RadioButton>
          <RadioButton value="-1">失败</RadioButton>
        </RadioGroup> */}
        <Search className={styles.extraContentSearch} placeholder="搜索姓名" ref={ref => {
          this.nameRef = ref
        }} onSearch={() => {
          this.onPageChange(1, 10)
        }} />
      </div>
    );
    const MoreBtn = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.editAndDelete(key, item)}>
            <Menu.Item key="modify">修改</Menu.Item>
            <Menu.Item key="editPhoto">改照片</Menu.Item>
          </Menu>
        }
      >
        <a>
          编辑 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const { modifyVisible, selectedBean, viewVisible, selectedRows, infoVisible } = this.state;
    const { face, loading, user, modifyLoading, faceKeyList } = this.props;
    return (
      <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          title="人脸列表"
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
          extra={extraContent}
        >
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              icon="plus"
              onClick={this.showDrawer}
              ref={component => {
                // eslint-disable-next-line  react/no-find-dom-node
                this.addBtn = findDOMNode(component);
              }}
            >
              新增
            </Button>
            <Button
              style={{ marginRight: 8 }}
              onClick={this.showConfirmRemoveAll}
              ref={component => {
                // eslint-disable-next-line  react/no-find-dom-node
                this.addBtn = findDOMNode(component);
              }}
            >
              全部删除
            </Button>
          </div>

          {infoVisible ? (
              <Alert showIcon message={ <div>更多属性配置，请移步: <span style={{ color: 'red', marginLeft: 8 }}> 设置 > 人脸属性</span></div>} type="info" closable afterClose={this.handleInfoClose} style={{ marginBottom: 8 }}/>
            ) : null}
          <StandardTable
            rowKey={record => record._id}
            needRowSelection={false}
            selectedRows={selectedRows}
            loading={loading}
            data={face.faceList}
            columns={this.columns()}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        {this.renderUploadPanel()}
        <ModifyModal
          visible={modifyVisible}
          bean={selectedBean}
          faceKeyList={faceKeyList}
          confirmLoading={modifyLoading}
          handleCancel={this.closeModifyModal}
          handleSubmit={this.submitModify}
        />
        <Modal
          title={selectedBean.name}
          visible={viewVisible}
          footer={null}
          onCancel={this.closeViewModal}
        >
          <img src={selectedBean.imgPath} alt="" style={{ width: '100%', height: '100%' }} />
        </Modal>
      </div>
    )
  }
}
export default Face
