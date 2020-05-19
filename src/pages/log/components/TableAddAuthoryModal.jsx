import { Modal, Tree, message, List, Icon, Spin, Divider, Checkbox, Row, Col, Empty, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { findIndex } from 'lodash';
import { toTree } from '@/utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;
let myCurGroupPeople = []; // 缓存对应分组所有人员集
let myCurGroupSearchPeopleList = [];  // 当前分组符合搜索条件的人员集
let myCurGroupSearchPeopleIdList = []; // 当前分组符合搜索条件的人员id集
let myCurGroupSearchPeopleIdListLen = 0; // 当前分组符合搜索条件的人员id集长度
let myCurGroupSearchRelateDevicePeopleIdList = []; // 当前分组已关联设备的人员id集
let myCurSelectedAllPeopleIdList = []; // 当前已选所有人员id集

// const getPidFn = (pid, list, res = []) => {
//   let index = findIndex(list, item => item._id === pid);

//   if (index > -1) {
//     return getPidFn(list[index].pid, list, res.concat(pid));
//   } else {
//     return res;
//   }
// };

const TableAddAuthoryModal = props => {
  const {
    visible,
    handleSubmit,
    handleCancel,
    curDeviceId,
    dispatch,
    confirmLoading,
    peopleTotal,
    groupTreeData,
  } = props;
  const [modalLoading, setModalLoading] = useState(false);
  const [treeSelectedKeys, setTreeSelectedKeys] = useState([]); // 当前选择的分组id集
  const [curGroupPeople, setCurGroupPeople] = useState([]); // 右下角当前选择分组的符合搜索条件的人员集
  const [checkboxChecked, setCheckboxChecked] = useState([]); //  右下角已勾选的当前选择分组的人员id集
  const [checkboxIndeterminate, setCheckboxIndeterminate] = useState(true);
  const [checkboxCheckAll, setCheckboxCheckAll] = useState(false);
  const [curSelectedAllPeople, setCurSelectedAllPeople] = useState([]); //  当前收集器的所有人员集
  const [searchVal, setSearchVal] = useState(''); //  当前收集器的所有人员集

  // 建议：每次 Modal 关闭时重置
  useEffect(() => {
    if (visible === true) {
    } else {
      resetAllVar();
    }
  }, [visible]);

  const resetAllVar = () => {
    setModalLoading(false);
    setTreeSelectedKeys([]);
    setCurGroupPeople([]);
    setCheckboxChecked([]);
    setCheckboxIndeterminate(true);
    setCheckboxCheckAll(false);
    setCurSelectedAllPeople([]);
    setSearchVal('');

    myCurGroupPeople = [];
    myCurGroupSearchPeopleList = [];
    myCurGroupSearchPeopleIdList = [];
    myCurGroupSearchPeopleIdListLen = 0;
    myCurGroupSearchRelateDevicePeopleIdList = [];
    myCurSelectedAllPeopleIdList = [];
  };

  const handleOk = () => {
    if (myCurSelectedAllPeopleIdList && myCurSelectedAllPeopleIdList.length > 0) {
      handleSubmit(myCurSelectedAllPeopleIdList.join(','), () => {
        resetAllVar();
      });
    } else {
      message.error(formatMessage({ id: 'oal.log.pleaseSelectUser' }));
    }
  };

  const renderNodes = data =>
    data.map(item => {
      let _isVisitorGroup = !item.isPeople && item.type === '3';
      delete item.isLeaf;

      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item._id}
            title={_isVisitorGroup ? `${formatMessage({ id: 'oal.common.visitor' })} (${item.num})` : (`${item.name} (${item.num || 0})` || '-')}
            {...item}
            dataRef={item}
          >
            {renderNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode
        key={item._id}
        title={_isVisitorGroup ? `${formatMessage({ id: 'oal.common.visitor' })} (${item.num})` : (`${item.name} (${item.num || 0})` || '-')}
        {...item}
        dataRef={item} />;
    });

  const removeUser = (e, user) => {
    let _checkedValue = checkboxChecked.filter(item => item !== user._id);
    let _checkedValueLen = _checkedValue.length;
    let _curSelectedAllPeople = [];
    myCurSelectedAllPeopleIdList = [];

    curSelectedAllPeople.forEach(item => {
      if (item._id !== user._id) {
        _curSelectedAllPeople.push(item);
        myCurSelectedAllPeopleIdList.push(item._id);
      }
    });

    setCheckboxChecked(_checkedValue);
    setCheckboxIndeterminate(!!_checkedValueLen && _checkedValueLen < myCurGroupSearchPeopleIdListLen);
    setCheckboxCheckAll(_checkedValueLen === myCurGroupSearchPeopleIdListLen);
    setCurSelectedAllPeople(_curSelectedAllPeople);
  };

  const handleCheckboxChange = checkedValue => {
    let _checkedValueLen = checkedValue.length;
    let _curSelectedAllPeople = [];
    let _changeIdList = [];

    if (_checkedValueLen > checkboxChecked.length) {
      // 新增勾选
      checkedValue.forEach(item => {
        if (!~checkboxChecked.indexOf(item)) {
          _changeIdList.push(item);
        }
      });

      _changeIdList.forEach(item => {
        let index = findIndex(myCurGroupSearchPeopleList, ite => ite._id === item);

        _curSelectedAllPeople.unshift(myCurGroupSearchPeopleList[index]);
        myCurSelectedAllPeopleIdList.push(item);
      });

      _curSelectedAllPeople = _curSelectedAllPeople.concat(curSelectedAllPeople);
    } else {
      // 取消勾选
      checkboxChecked.forEach(item => {
        if (!~checkedValue.indexOf(item)) {
          _changeIdList.push(item);
        }
      });

      myCurSelectedAllPeopleIdList = [];
      curSelectedAllPeople.forEach(item => {
        if (!~_changeIdList.indexOf(item._id)) {
          _curSelectedAllPeople.push(item);
          myCurSelectedAllPeopleIdList.push(item._id);
        }
      });
    }

    setCheckboxChecked(checkedValue);
    setCheckboxIndeterminate(!!_checkedValueLen && _checkedValueLen < myCurGroupSearchPeopleIdListLen);
    setCheckboxCheckAll(_checkedValueLen === myCurGroupSearchPeopleIdListLen);
    setCurSelectedAllPeople(_curSelectedAllPeople);
  };

  const handleCheckAllChange = e => {
    let _isCheckedAll = e.target.checked;
    let _checkedValue = _isCheckedAll ? myCurGroupSearchPeopleIdList : myCurGroupSearchRelateDevicePeopleIdList;
    let _checkedValueLen = _checkedValue.length;
    let _curSelectedAllPeople = [];

    setCheckboxChecked(_checkedValue);
    setCheckboxIndeterminate(!!_checkedValueLen && _checkedValueLen < myCurGroupSearchPeopleIdListLen);
    setCheckboxCheckAll(_isCheckedAll);

    if (_isCheckedAll) {
      myCurGroupSearchPeopleList.forEach(item => {
        if (!~myCurSelectedAllPeopleIdList.indexOf(item._id) && !item.isRelateDevice) {
          _curSelectedAllPeople.unshift(item);
          myCurSelectedAllPeopleIdList.push(item._id);
        }
      });

      _curSelectedAllPeople = _curSelectedAllPeople.concat(curSelectedAllPeople);
    } else {
      myCurSelectedAllPeopleIdList = [];
      curSelectedAllPeople.forEach(item => {
        if (!~myCurGroupSearchPeopleIdList.indexOf(item._id)) {
          _curSelectedAllPeople.push(item);
          myCurSelectedAllPeopleIdList.push(item._id);
        }
      });
    }

    setCurSelectedAllPeople(_curSelectedAllPeople);
  };

  const handleTreeSelect = selectedKeys => {
    setTreeSelectedKeys(selectedKeys);
    setModalLoading(true);
    dispatch({
      type: 'log/fetchPeopleByGroupId',
      payload: {
        isAll: selectedKeys.indexOf(groupTreeData[1] && groupTreeData[1]._id || '') > -1 ? '1' : '0',
        groupId: selectedKeys.join(','),
        deviceId: curDeviceId,
      },
    }).then(res => {
      if (!visible) return;

      if (res && res.res > 0 && res.data) {
        let _type = selectedKeys.indexOf(groupTreeData[0] && groupTreeData[0]._id || '') > -1 ? '3' : '0';
        myCurGroupPeople = [];
        myCurGroupSearchPeopleList = [];
        myCurGroupSearchPeopleIdList = [];
        myCurGroupSearchPeopleIdListLen = 0;
        myCurGroupSearchRelateDevicePeopleIdList = [];
        let _data = []; // 符合搜索条件的人员集
        let _dataLen = 0;
        let _checkedValue = []; // 已选的人员集
        let _checkedValueLen = 0;
        let noNamePeopleList = []; // 无名战士
        const _searchVal = searchVal;

        res.data.forEach(item => {
          if (item.type === _type) {
            // 对应分组
            myCurGroupPeople.push(item);

            if (!_searchVal) {
              // 无搜索条件
              if (!item.name) {
                // 无名
                noNamePeopleList.push(item);
              } else {
                // 有名
                _data.push(item);
              }

              myCurGroupSearchPeopleList.push(item);
              myCurGroupSearchPeopleIdList.push(item._id);
              myCurGroupSearchPeopleIdListLen++;
              _dataLen++;

              if (item.isRelateDevice || myCurSelectedAllPeopleIdList.indexOf(item._id) > -1) {
                // 已选的
                _checkedValue.push(item._id);
                _checkedValueLen++;
              }

              if (item.isRelateDevice) {
                // 已关联
                myCurGroupSearchRelateDevicePeopleIdList.push(item._id);
              }
            } else if (item.name && item.name.indexOf(_searchVal) > -1) {
              // 有名且符合搜索条件
              myCurGroupSearchPeopleList.push(item);
              myCurGroupSearchPeopleIdList.push(item._id);
              myCurGroupSearchPeopleIdListLen++;
              _data.push(item);
              _dataLen++;

              if (item.isRelateDevice || myCurSelectedAllPeopleIdList.indexOf(item._id) > -1) {
                // 已选的
                _checkedValue.push(item._id);
                _checkedValueLen++;
              }

              if (item.isRelateDevice) {
                // 已关联
                myCurGroupSearchRelateDevicePeopleIdList.push(item._id);
              }
            }
          }
        });

        _data.sort(function (a, b) {
          let v1 = a.name;
          let v2 = b.name;

          if (/[\u4e00-\u9fa5]/.test(v1) && /[\u4e00-\u9fa5]/.test(v2)) { // 实现中文按拼音排序
            return v1.localeCompare(v2, 'zh'); // 这里的参数 'zh' 很重要
          } else {
            if (v1 > v2) {
              return 1;
            } else if (v1 == v2) {
              return 0;
            } else {
              return -1;
            }
          }
        });
        _data = _data.concat(noNamePeopleList);

        setCurGroupPeople(_data);
        setCheckboxChecked(_checkedValue);
        setCheckboxIndeterminate(!!_checkedValueLen && _checkedValueLen < _dataLen);
        setCheckboxCheckAll(_dataLen === _checkedValueLen);
      }

      setModalLoading(false);
    }).catch(err => {
      console.log(err);
      setModalLoading(false);
    });
  };

  const handleSearch = searchVal => {
    setModalLoading(true);
    setTimeout(() => {
      myCurGroupSearchPeopleList = [];
      myCurGroupSearchPeopleIdList = [];
      myCurGroupSearchPeopleIdListLen = 0;
      myCurGroupSearchRelateDevicePeopleIdList = [];
      let _data = []; // 符合搜索条件的人员集
      let _dataLen = 0;
      let _checkedValue = []; // 已选的人员集
      let _checkedValueLen = 0;
      let noNamePeopleList = []; // 无名战士
      const _searchVal = searchVal;

      myCurGroupPeople.forEach(item => {
        if (!_searchVal) {
          // 无搜索条件
          if (!item.name) {
            // 无名
            noNamePeopleList.push(item);
          } else {
            // 有名
            _data.push(item);
          }

          myCurGroupSearchPeopleList.push(item);
          myCurGroupSearchPeopleIdList.push(item._id);
          myCurGroupSearchPeopleIdListLen++;
          _dataLen++;

          if (item.isRelateDevice || myCurSelectedAllPeopleIdList.indexOf(item._id) > -1) {
            // 已选的
            _checkedValue.push(item._id);
            _checkedValueLen++;
          }

          if (item.isRelateDevice) {
            // 已关联
            myCurGroupSearchRelateDevicePeopleIdList.push(item._id);
          }
        } else if (item.name && item.name.indexOf(_searchVal) > -1) {
          // 有名且符合搜索条件
          myCurGroupSearchPeopleList.push(item);
          myCurGroupSearchPeopleIdList.push(item._id);
          myCurGroupSearchPeopleIdListLen++;
          _data.push(item);
          _dataLen++;

          if (item.isRelateDevice || myCurSelectedAllPeopleIdList.indexOf(item._id) > -1) {
            // 已选的
            _checkedValue.push(item._id);
            _checkedValueLen++;
          }

          if (item.isRelateDevice) {
            // 已关联
            myCurGroupSearchRelateDevicePeopleIdList.push(item._id);
          }
        }
      });

      _data.sort(function (a, b) {
        let v1 = a.name;
        let v2 = b.name;

        if (/[\u4e00-\u9fa5]/.test(v1) && /[\u4e00-\u9fa5]/.test(v2)) { // 实现中文按拼音排序
          return v1.localeCompare(v2, 'zh'); // 这里的参数 'zh' 很重要
        } else {
          if (v1 > v2) {
            return 1;
          } else if (v1 == v2) {
            return 0;
          } else {
            return -1;
          }
        }
      });
      _data = _data.concat(noNamePeopleList);

      setSearchVal(searchVal);
      setCurGroupPeople(_data);
      setCheckboxChecked(_checkedValue);
      setCheckboxIndeterminate(!!_checkedValueLen && _checkedValueLen < _dataLen);
      setCheckboxCheckAll(_dataLen === _checkedValueLen);
      setModalLoading(false);
    }, 50);
  };

  return (
    <Modal
      width="50%"
      destroyOnClose
      title={formatMessage({ id: 'oal.log.addAuthoryTitle' }, { num: curSelectedAllPeople && curSelectedAllPeople.length || 0 })}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
    >
      <Spin spinning={modalLoading} size="large">
        <div style={{ height: '60vh', display: 'flex', position: 'relative', flexDirection: 'column', }}>
          <div className="oal-selected-list" style={{ overflow: 'auto', flex: 1, }}>
            <List
              grid={{ column: 6 }}
              dataSource={curSelectedAllPeople}
              split={false}
              renderItem={item =>
                (<List.Item
                  key={item._id}
                >
                  <a
                    style={{ marginRight: '10px', }}
                    onClick={e => removeUser(e, item)}
                  >
                    <Icon type="close-circle" theme="filled" />
                  </a>
                  {item.name || '-'}
                </List.Item>)}
            />
          </div>

          <Divider />

          <div style={{ display: 'flex', overflow: 'auto', flex: 2, }}>
            <div style={{ height: '100%', overflow: 'auto', flex: 1, }}>
              <Tree
                blockNode
                defaultExpandedKeys={[groupTreeData[1] && groupTreeData[1]._id || '0']}
                selectedKeys={treeSelectedKeys}
                onSelect={handleTreeSelect}
              >
                {renderNodes(groupTreeData)}
              </Tree>
            </div>

            <div className="oal-user-list" style={{ height: '100%', overflow: 'auto', flex: 1, paddingLeft: '24px', }}>
              <Search
                placeholder={formatMessage({ id: 'oal.face.searchFullName' })}
                onSearch={handleSearch}
                style={{ width: 200 }}
              />
              {
                curGroupPeople && curGroupPeople.length > 0 ?
                  (<div>
                    <Checkbox
                      style={{ marginBottom: '10px', fontWeight: 'bold', }}
                      indeterminate={checkboxIndeterminate}
                      onChange={handleCheckAllChange}
                      checked={checkboxCheckAll}
                    >
                      <FormattedMessage id="oal.common.checkAll" />
                    </Checkbox>
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      defaultValue={checkboxChecked}
                      value={checkboxChecked}
                      onChange={handleCheckboxChange}
                    >
                      {
                        curGroupPeople.map(item => (<Row key={item._id}>
                          <Col span={24}>
                            <Checkbox
                              value={item._id}
                              disabled={item.isRelateDevice}
                            >
                              {item.name || '-'}
                            </Checkbox>
                          </Col>
                        </Row>))
                      }
                    </Checkbox.Group>
                  </div>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};
export default TableAddAuthoryModal;
