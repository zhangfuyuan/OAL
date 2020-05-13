import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Divider,
  Input,
  Row,
  Select,
  message,
  Badge,
  Dropdown,
  Menu,
  Icon,
  Spin,
  Tree,
  Tooltip,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import Link from 'umi/link';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { findIndex } from 'lodash';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import { SYSTEM_PATH } from '@/utils/constants';
import styles from './style.less';

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['error', 'success'];
const status = ['oal.common.disable', 'oal.common.enable'];

@connect(({ setting, dashboard, loading }) => ({
  setting,
  dashboard,
  demoListLoading: loading.effects['dashboard/fetchList'],
}))
class Demo extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    demoLoading: true,
    treeData: [],
    selectedRows: [],
    formValues: {},
    page: {
      current: 1,
      pageSize: 10,
    },
    nodeTreeItem: null,
  };

  ref_leftDom = null;

  componentDidMount() {
    this.tree_loadData();
    this.table_loadData();
  }

  componentWillUnmount() {
    this.tree_clearMenu();
  }

  /************************************************* Tree *************************************************/

  tree_loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/fetch',
    }).then(res => {
      if (res && res.res > 0) {
        this.setState({
          demoLoading: false,
          treeData: [
            { title: 'Expand to load', key: '0' },
            { title: 'Expand to load', key: '1' },
            { title: 'Tree Node', key: '2', isLeaf: true },
          ],
        });
      }
    }).catch(err => {
      console.log(err);
    })
  };

  tree_onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 1000);
    });

  tree_renderNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.tree_renderNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  tree_onMouseEnter = (e) => {
    if (this.ref_leftDom && (!this.state.nodeTreeItem || !this.state.nodeTreeItem.isEditing)) {
      const { left: pLeft, top: pTop } = this.ref_leftDom.getBoundingClientRect();
      const { left, width, top } = e.event.currentTarget.getBoundingClientRect();
      const x = left - pLeft + width + this.ref_leftDom.scrollLeft;
      const y = top - pTop;
      const { eventKey, dataRef } = e.node.props;

      this.setState({
        nodeTreeItem: {
          nodeWidth: width,
          pageX: x,
          pageY: y,
          id: eventKey,
          dataRef,
        }
      });
    }
  };

  tree_getNodeTreeMenu() {
    if (this.state.nodeTreeItem) {
      const { pageX, pageY, isEditing, nodeWidth, dataRef } = { ...this.state.nodeTreeItem };
      const tmpStyle = {
        position: 'absolute',
        maxHeight: 40,
        textAlign: 'center',
        left: `${pageX + 10 - (isEditing ? nodeWidth + 10 : 0)}px`,
        top: `${pageY}px`,
        display: 'flex',
        flexDirection: 'row',
      };
      const menu = (
        <div
          style={tmpStyle}
          onClick={e => e.stopPropagation()}
        >
          {
            isEditing ?
              <Input
                size="small"
                defaultValue={dataRef && dataRef.title || ''}
                style={{ width: `${nodeWidth}px`, minWidth: `56px`, marginRight: '10px', }}
                autoFocus={true}
                onBlur={this.tree_handleEditSubInput}
                onPressEnter={this.tree_handleEditSubInput}
              /> : ''
          }
          <div style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer', }} onClick={this.tree_handleEditSub}>
            <Tooltip placement="bottom" title={formatMessage({ id: 'oal.common.modify' })}>
              <Icon type='edit' />
            </Tooltip>
          </div>
          <div style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer', }} onClick={this.tree_handleDeleteSub}>
            <Tooltip placement="bottom" title={formatMessage({ id: 'oal.common.delete' })}>
              <Icon type='minus-circle-o' />
            </Tooltip>
          </div>
          <div style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer', }} onClick={this.tree_handleAddSub}>
            <Tooltip placement="bottom" title={formatMessage({ id: 'oal.common.addItems' })}>
              <Icon type='plus-circle-o' />
            </Tooltip>
          </div>
        </div>
      );

      return menu;
    }

    return '';
  }

  tree_handleAddSub = (e) => {
    if (this.state.nodeTreeItem) {
      console.log("click add id :", this.state.nodeTreeItem.id);
    }
  };

  tree_handleEditSub = (e) => {
    if (this.state.nodeTreeItem) {
      console.log("click edit id :", this.state.nodeTreeItem.id);
      this.setState({
        nodeTreeItem: {
          ...this.state.nodeTreeItem,
          isEditing: true,
        },
      });
    }
  };

  tree_handleEditSubInput = (e) => {
    if (this.state.nodeTreeItem) {
      console.log("click edit value :", e.target.value);
      this.state.nodeTreeItem.dataRef.title = e.target.value;
      this.setState({
        nodeTreeItem: null,
        treeData: [...this.state.treeData],
      });
    }
  };

  tree_handleDeleteSub = (e) => {
    if (this.state.nodeTreeItem) {
      console.log("click delete id :", this.state.nodeTreeItem.id);
    }
  };

  tree_clearMenu = () => {
    this.setState({
      nodeTreeItem: null,
    });
  };

  tree_onSelect = (selectedKeys, e) => {
    console.log('selectedKeys : ', selectedKeys, e);
  };

  /************************************************* Table *************************************************/

  table_loadData = () => {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'dashboard/fetchList',
      payload: {
        ...page,
      },
    });
  };

  table_handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  table_columns = () => {
    const MoreBtn = ({ item }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => console.log('Dropdown', key, item)}>
            <Menu.Item key="modify" disabled={item.state === 0}><FormattedMessage id="oal.common.modify" /></Menu.Item>
            <Menu.Item key="open" disabled={item.state === 1}><FormattedMessage id="oal.common.enable" /></Menu.Item>
            <Menu.Item key="close" disabled={item.state === 0}><FormattedMessage id="oal.common.disable" /></Menu.Item>
          </Menu>
        }
      >
        <a>
          <FormattedMessage id="oal.common.more" /><Icon type="down" />
        </a>
      </Dropdown>
    );
    const cl = [
      {
        title: formatMessage({ id: 'oal.org.orgName' }),
        dataIndex: 'name',
      },
      {
        title: formatMessage({ id: 'oal.common.status' }),
        dataIndex: 'state',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val] && formatMessage({ id: status[val] }) || '-'} />;
        },
      },
      {
        title: formatMessage({ id: 'oal.org.path' }),
        dataIndex: 'path',
        render: (_text, record) => (
          <Fragment>
            <a onClick={() => console.log('path', record.path)}>{record.path}</a>
          </Fragment>
        ),
      },
      {
        title: formatMessage({ id: 'oal.org.contacts' }),
        dataIndex: 'contactName',
        render: (text, record) => <span>{(record && record.contact && record.contact.nickName) || '-'}</span>,
      },
      {
        title: formatMessage({ id: 'oal.common.handle' }),
        width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => console.log('handle', record)}><FormattedMessage id="oal.common.view" /></a>
            <Divider type="vertical" />
            <MoreBtn item={record} />
          </Fragment>
        ),
      },
    ];
    return cl;
  };

  table_handleChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    console.log('table_handleChange', params);
  };

  table_handleSearch = () => {
    const { form, dispatch } = this.props;
    const { page } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
        selectedRows: [],
      });
      const params = {
        ...page,
        ...fieldsValue,
      };
      console.log('table_handleSearch', params);
    });
  };

  table_handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    form.setFieldsValue({});
    const { page } = this.state;
    this.setState({
      formValues: {},
    });
    const params = {
      ...page,
      pageNo: 1,
    };
    console.log('table_handleFormReset', params);
  };

  table_renderSimpleForm = () => {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row
          gutter={{
            md: 4,
            lg: 24,
            xl: 48,
          }}
        >
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.org.orgName' })}>
              {getFieldDecorator('name')(<Input placeholder={formatMessage({ id: 'oal.org.enterOrgName' })} />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.org.path' })}>
              {getFieldDecorator('path')(<Input placeholder={formatMessage({ id: 'oal.org.enterPath' })} />)}
            </FormItem>
          </Col>
          <Col xxl={5} xl={6} lg={8} md={8} sm={24}>
            <FormItem label={formatMessage({ id: 'oal.common.status' })}>
              {getFieldDecorator('state')(
                <Select
                  placeholder={formatMessage({ id: 'oal.common.pleaseSelect' })}
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value=""><FormattedMessage id="oal.common.all" /></Option>
                  <Option value="0"><FormattedMessage id="oal.common.disable" /></Option>
                  <Option value="1"><FormattedMessage id="oal.common.enable" /></Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={4} lg={4} md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={this.table_handleSearch} type="primary" htmlType="submit" loading={loading}>
                <FormattedMessage id="oal.common.query" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.table_handleFormReset}
              >
                <FormattedMessage id="oal.common.reset" />
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  /************************************************* Other *************************************************/



  /************************************************ Render ************************************************/

  render() {
    const {
      dashboard: { demoList },
      demoListLoading,
    } = this.props;

    return (
      <PageHeaderWrapper /* title=" " */ className={styles.myPageHeaderWrapper} >
        <Card bordered={false}>
          <div className={styles.main} >
            <div
              className={styles.left}
              ref={ref => { this.ref_leftDom = ref; }}
              onClick={this.tree_clearMenu}
            >
              <Spin spinning={this.state.demoLoading} />
              <Tree
                loadData={this.tree_onLoadData}
                showLine={true}
                // blockNode={true}
                onMouseEnter={this.tree_onMouseEnter}
                onSelect={this.tree_onSelect}
              >
                {this.tree_renderNodes(this.state.treeData)}
              </Tree>
              {this.state.nodeTreeItem ? this.tree_getNodeTreeMenu() : ''}
            </div>

            <div className={styles.right}>
              <div className={styles.tableListForm}>{this.table_renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => console.log('plus')}>
                  <FormattedMessage id="oal.common.new" />
                </Button>
              </div>
              <StandardTable
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                needRowSelection={false}
                selectedRows={this.state.selectedRows}
                loading={demoListLoading}
                data={demoList}
                columns={this.table_columns()}
                onSelectRow={this.table_handleSelectRows}
                onChange={this.table_handleChange}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Demo);
