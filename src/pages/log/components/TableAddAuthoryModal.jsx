import { Modal, Tree, message, List, Icon, Spin, } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { findIndex } from 'lodash';
import { toTree } from '@/utils/utils';

const { TreeNode } = Tree;

const getPidFn = (pid, list, res = []) => {
  const index = findIndex(list, item => item._id === pid);

  if (index > -1) {
    return getPidFn(list[index].pid, list, res.concat(pid));
  } else {
    return res;
  }
};

// let myTreeOriginalData = [];
let mySelectedPeopleIds = [];

const TableAddAuthoryModal = props => {
  const { visible, handleSubmit, handleCancel, curDeviceId, dispatch, confirmLoading } = props;
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [initTreeLoading, setInitTreeLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // 建议：每次 Modal 关闭时重置
  useEffect(() => {
    if (visible === false) {
      resetAllVar();
    } else {
      setInitTreeLoading(true);
      dispatch({
        type: 'log/fetchGroupTree',
        payload: {
          groupId: '',
          deviceId: curDeviceId,
        },
      }).then(res => {
        if (!visible) return;

        if (res && res.res > 0 && res.data) {
          const _data = res.data;
          // myTreeOriginalData.push(..._data);
          setTreeData(toTree(_data) || []);
          setCheckedKeys(checkedKeys.concat(_data.filter(node => node.isPeople && node.isRelateDevice).map(node => node._id)));
        } else {
          console.log(res);
        }

        setInitTreeLoading(false);
      }).catch(err => {
        console.log(err);
        setInitTreeLoading(false);
      });
    }
  }, [visible]);

  const resetAllVar = () => {
    setTreeData([]);
    setCheckedKeys([]);
    setSelectedPeople([]);
    setInitTreeLoading(false);
    setModalLoading(false);
    // myTreeOriginalData = [];
    mySelectedPeopleIds = [];
  };

  const handleCheck = (_checkedKeys, info) => {
    setCheckedKeys(_checkedKeys);

    const {
      node: {
        props: {
          dataRef: _curDataRef,
        }
      },
      checked: _curIsChecked,
      checkedNodes
    } = info;
    const { _id: _curId, isPeople: _curIsPeople } = _curDataRef;

    if (_curIsPeople) {
      const _curIndex = findIndex(selectedPeople, people => people._id === _curId);

      if (_curIsChecked) {
        if (!~_curIndex) setSelectedPeople(selectedPeople.concat(_curDataRef));
      } else {
        if (_curIndex > -1) setSelectedPeople(selectedPeople.filter(people => people._id !== _curId));
      }
    } else {
      let _checkedGroupIdList = [];
      let _checkedPeopleIdList = [];
      let _checkedPeopleInfoList = [];

      checkedNodes.forEach(node => {
        const {
          props: {
            dataRef,
          }
        } = node;
        const { _id, isPeople, isRelateDevice } = dataRef;

        if (!isPeople) {
          _checkedGroupIdList.push(_id);
        } else if (!isRelateDevice) {
          _checkedPeopleIdList.push(_id);
          _checkedPeopleInfoList.push(dataRef);
        }
      });

      setModalLoading(true);
      dispatch({
        type: 'log/fetchPeopleByGroupId',
        payload: {
          groupId: _checkedGroupIdList.join(','),
          deviceId: curDeviceId,
        },
      }).then(res => {
        if (!visible) return;

        if (res && res.res > 0 && res.data) {
          let _data = [];

          res.data.forEach(item => {
            if (!~_checkedPeopleIdList.indexOf(item._id) && !item.isRelateDevice) _data.push(item);
          });

          const _selectedPeopleList = [..._data, ..._checkedPeopleInfoList];
          setSelectedPeople(_selectedPeopleList);
          mySelectedPeopleIds = _selectedPeopleList.map(item => item._id);
          _data = null;
        } else {
          console.log(res);
        }

        _checkedGroupIdList = null;
        _checkedPeopleIdList = null;
        _checkedPeopleInfoList = null;
        setModalLoading(false);
      }).catch(err => {
        console.log(err);
        _checkedGroupIdList = null;
        _checkedPeopleIdList = null;
        _checkedPeopleInfoList = null;
        setModalLoading(false);
      });
    }
  };

  const handleOk = () => {
    if (selectedPeople && selectedPeople.length > 0) {
      handleSubmit(selectedPeople.map(people => people._id).join(','), () => {
        resetAllVar();
      });
    } else {
      message.error(formatMessage({ id: 'oal.log.pleaseSelectUser' }));
    }
  };

  const onLoadData = treeNode => new Promise((resolve, reject) => {
    const {
      props: {
        dataRef: {
          _id: _curId,
        },
        children,
        checked: _curIsChecked,
      }
    } = treeNode;

    if (children) {
      resolve();
      return;
    }

    dispatch({
      type: 'log/fetchGroupTree',
      payload: {
        groupId: _curId,
        deviceId: curDeviceId,
      },
    }).then(res => {
      if (!visible) {
        resolve();
        return;
      }

      if (res && res.res > 0 && res.data) {
        let _data = res.data;

        // myTreeOriginalData.push(..._data);
        treeNode.props.dataRef.children = _data;
        setTreeData([...treeData]);

        if (_curIsChecked) {
          setCheckedKeys(checkedKeys.concat(_data.filter(node => node.isPeople && node.pIds.indexOf(_curId) > -1).map(node => node._id)));
          setSelectedPeople([...selectedPeople, ..._data.filter(node => node.isPeople && node.pIds.indexOf(_curId) > -1 && !~mySelectedPeopleIds.indexOf(node._id))]);
        } else {
          setCheckedKeys(checkedKeys.concat(_data.filter(node => node.isPeople && node.isRelateDevice).map(node => node._id)));
        }

        resolve();
      } else {
        console.log(res);
        reject();
      }
    }).catch(err => {
      console.log(err);
      reject();
    });
  });


  const renderNodes = data =>
    data.map(item => {
      const _isRoot = item._id === (treeData[0] && treeData[0]._id || '0');
      const _isVisitor = item.type === '2';

      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item._id}
            title={_isRoot ? `${item.name} (${item.num || 0})` : (_isVisitor ? formatMessage({ id: 'oal.common.visitor' }) : (item.name || '-'))}
            {...item}
            dataRef={item}
          >
            {renderNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode
        key={item._id}
        title={_isRoot ? `${item.name} (${item.num || 0})` : (_isVisitor ? formatMessage({ id: 'oal.common.visitor' }) : (item.name || '-'))}
        disableCheckbox={item.isPeople && item.isRelateDevice || false}
        {...item}
        dataRef={item} />;
    });

  const removeUser = (e, item) => {
    const { _id: _curId, pIds: _curPIds, } = item;
    const _relateIdList = [_curId, ...(_curPIds && _curPIds.split(',') || [])];

    setCheckedKeys(checkedKeys.filter(key => !~_relateIdList.indexOf(key)));
    setSelectedPeople(selectedPeople.filter(people => people._id !== _curId));
  };

  return (
    <Modal
      width="50%"
      destroyOnClose
      title={formatMessage({ id: 'oal.log.addAuthoryTitle' }, { num: selectedPeople && selectedPeople.length || 0 })}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
      okText={formatMessage({ id: 'oal.common.save' })}
    >
      <Spin spinning={modalLoading} size="large">
        <div style={{ display: 'flex', position: 'relative', }}>
          <div style={{ height: '50vh', overflow: 'auto', flex: 2, }}>
            {
              !initTreeLoading ?
                (<Tree
                  checkable
                  loadData={onLoadData}
                  defaultExpandedKeys={[treeData && treeData.length > 0 && treeData[0]._id || '0']}
                  checkedKeys={checkedKeys}
                  onCheck={handleCheck}
                >
                  {renderNodes(treeData)}
                </Tree>) :
                <Spin />
            }
          </div>

          <div className="oal-user-list" style={{ height: '50vh', overflow: 'auto', flex: 1, paddingLeft: '24px' }}>
            <List
              itemLayout="horizontal"
              dataSource={selectedPeople}
              split={false}
              renderItem={item =>
                (<List.Item
                  key={item._id}
                  style={{ padding: '5px 0' }}
                  actions={[<a key="list-loadmore-edit" onClick={e => removeUser(e, item)}><Icon type="close-circle" theme="filled" /></a>]}
                >
                  <List.Item.Meta
                    title={item.name || '-'}
                  />
                </List.Item>)}
            />
          </div>
          {/* {
            modalLoading ?
              (<div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', }}>
                <Spin size="large" />
              </div>) : ''
          } */}
        </div>
      </Spin>
    </Modal>
  );
};
export default TableAddAuthoryModal;
