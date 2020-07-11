import React, { Component, Fragment } from 'react';
import { List, Button, Result, message, Popconfirm, Spin, Form, Input, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

let counter = 1;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

class DeveloperView extends Component {
  state = {
    devInfo: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'settingInfo/getDevInfo',
      payload: {},
    }).then(res => {
      if (res && res.res > 0 && res.data) {
        this.setState({
          devInfo: res.data,
        });
      }
    });
  }

  // handleCopy = key => {
  //   const copyArea = document.getElementById(`${key}`);
  //   copyArea.select(); // 选择对象
  //   try {
  //     if (document.execCommand('copy', false, null)) {
  //       document.execCommand('Copy');
  //       message.success(formatMessage({ id: 'oal.common.copySuccessfully' }));
  //     } else {
  //       message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
  //     }
  //   } catch (error) {
  //     message.error(formatMessage({ id: 'oal.common.copyFailedTips' }));
  //   }
  // };

  // handleReset = () => {
  //   const { toReset } = this.props;
  //   toReset();
  // };

  // setSecret = value => {
  //   let str = '';
  //   if (value) {
  //     str = `${value.substr(0, 4)}********************************${value.substr((value.length - 4), value.length)}`;
  //   }
  //   return str;
  // };

  // getData = devInfo => [
  //   {
  //     title: 'key',
  //     description: (
  //       <Fragment>
  //         {devInfo.key}
  //       </Fragment>
  //     ),
  //     actions: [
  //       <a href="#" onClick={() => this.handleCopy('key')}>
  //         <FormattedMessage id="oal.common.copy" />
  //       </a>,
  //     ],
  //   },
  //   {
  //     title: formatMessage({ id: 'oal.settings.secretKey' }),
  //     description: (
  //       <Fragment>
  //         {this.setSecret(devInfo.secret)}
  //       </Fragment>
  //     ),
  //     actions: [
  //       <Popconfirm title={formatMessage({ id: 'oal.settings.confirmResetKey' })} okText={formatMessage({ id: 'oal.common.confirm' })} cancelText={formatMessage({ id: 'oal.common.cancel' })} onConfirm={() => this.handleReset()}>
  //         <a href="#"><FormattedMessage id="oal.common.reset" /></a>
  //       </Popconfirm>,
  //       <a key="copy" onClick={() => this.handleCopy('secret')}>
  //         <FormattedMessage id="oal.common.copy" />
  //       </a>,
  //     ],
  //   },
  // ];

  remove = info => {
    const { id, _id } = info;
    const { form, dispatch } = this.props;
    const { devInfo } = this.state;

    if (id) {
      dispatch({
        type: 'settingInfo/deltDevInfo',
        payload: {
          id,
        },
      }).then(res => {
        if (res && res.res > 0) {
          message.success(formatMessage({ id: 'oal.common.deletedSuccessfully' }));
          this.setState({
            devInfo: devInfo.filter(info => info.id !== id),
          });
        }
      });
    } else {
      this.setState({
        devInfo: devInfo.filter(info => info._id !== _id),
      });
    }
  };

  add = () => {
    const { devInfo } = this.state;

    this.setState({
      devInfo: [...devInfo, { _id: counter++ }],
    });
  };

  save = info => {
    const { id, _id } = info;
    const { form, dispatch } = this.props;
    const { validateFields, getFieldValue, setFieldsValue } = form;
    const { devInfo } = this.state;

    validateFields([`${(id || _id) + '-apikey'}`], (err, values) => {
      if (!err) {
        const params = {
          apikey: getFieldValue(`${(id || _id) + '-apikey'}`),
          remarks: getFieldValue(`${(id || _id) + '-remarks'}`),
          type: '1',
        };

        id && (params.id = id);
        dispatch({
          type: 'settingInfo/setDevInfo',
          payload: params,
        }).then(res => {
          if (res && res.res > 0 && res.data) {
            message.success(formatMessage({ id: 'oal.common.saveSuccessfully' }));

            if (!id && _id) {
              const { id: resId, apikey: resApikey, remarks: resRemarks } = res.data;

              this.setState({
                devInfo: devInfo.map(info => {
                  const _info = info;

                  if (!_info.id && _info._id === _id) {
                    _info.id = resId;
                  }

                  return _info;
                }),
              });
              setFieldsValue({
                [`${resId + '-apikey'}`]: resApikey,
                [`${resId + '-remarks'}`]: resRemarks,
              });
            }
          } else if (res.errcode === 6015) {
            message.error(formatMessage({ id: 'oal.face.fieldRepeat' }));
          }
        });
      }
    });
  };

  render() {
    const { loading, form } = this.props;
    const { devInfo = [] } = this.state;

    if (loading) {
      return (
        <Result
          icon={<div></div>}
          extra={<Spin size="large" />}
        />
      )
    }

    // if (!devInfo) {
    //   return (
    //     <Result
    //       status="404"
    //       title={formatMessage({ id: 'oal.settings.noApplicationForDeveloperAccount' })}
    //       extra={<Button type="primary" onClick={toApply}><FormattedMessage id="oal.settings.clickApplication" /></Button>}
    //     />
    //   )
    // }

    // const data = this.getData(devInfo);
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <Form {...formItemLayout}>
          {devInfo.map((info, index) => (
            <div key={info.id || info._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item
                label="key"
                style={{ flex: '1' }}
              >
                {getFieldDecorator(`${(info.id || info._id) + '-apikey'}`, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: formatMessage({
                        id: 'oal.common.pleaseEnter',
                      }),
                    },
                    {
                      pattern: /^[0-9A-Za-z]+$/,
                      message: formatMessage({
                        id: 'oal.device.incorrectFormat',
                      }),
                    },
                  ],
                  initialValue: info.apikey || '',
                })(<Input maxLength={100} onBlur={() => this.save(info)} />)}
              </Form.Item>

              <Form.Item
                label="remarks"
                style={{ flex: '1' }}
              >
                {getFieldDecorator(`${(info.id || info._id) + '-remarks'}`, {
                  initialValue: info.remarks || '',
                })(<Input maxLength={100} onBlur={() => this.save(info)} />)}
              </Form.Item>

              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(info)}
                style={{ marginBottom: '24px', marginLeft: '10%' }}
              />
            </div>
          ))}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
              <Icon type="plus" /> <FormattedMessage id="oal.face.add" />
            </Button>
          </Form.Item>
        </Form>
        {/* <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <input id="key" defaultValue={devInfo.key} style={{ position: 'absolute', top: '-999px', left: '-999px' }}/>
        <input id="secret" defaultValue={devInfo.secret} style={{ position: 'absolute', top: '-999px', left: '-999px' }}/> */}
      </Fragment>
    );
  }
}

export default Form.create()(DeveloperView);
