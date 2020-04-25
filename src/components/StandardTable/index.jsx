import { Alert, Table } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './index.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

function initTotalList(columns) {
  if (!columns) {
    return [];
  }

  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends Component {
  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const currySelectedRowKeys = selectedRowKeys;
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;

    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({
      selectedRowKeys: currySelectedRowKeys,
      needTotalList,
    });
  };

  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  showTotal = (total, range) => (formatMessage({
    id: 'oal.common.currentToTotal',
  }, {
    range0: range[0],
    range1: range[1],
    total,
  }));

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data, rowKey, needRowSelection, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '30'],
      showTotal: this.showTotal,
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={styles.standardTable}>
        {needRowSelection &&
          <div className={styles.tableAlert}>
            <Alert
              message={
                <Fragment>
                  <FormattedMessage id="oal.common.selected" />{' '}
                  <a
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {selectedRowKeys.length}
                  </a>{' '}
                  <FormattedMessage id="oal.common.items" />&nbsp;&nbsp;
              {needTotalList.map((item, index) => (
                    <span
                      style={{
                        marginLeft: 8,
                      }}
                      key={item.dataIndex}
                    >
                      {item.title}
                      <FormattedMessage id="oal.common.total" />&nbsp;
                  <span
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {item.render ? item.render(item.total, item, index) : item.total}
                      </span>
                    </span>
                  ))}
                  <a
                    onClick={this.cleanSelectedKeys}
                    style={{
                      marginLeft: 24,
                    }}
                  >
                    <FormattedMessage id="oal.common.empty" />
              </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
        }
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={needRowSelection ? rowSelection : null}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
