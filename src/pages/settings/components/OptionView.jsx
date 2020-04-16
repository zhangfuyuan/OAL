import { Modal, Input, Row, Col, Icon, message } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const styles = {
    row: {
        margin: '12px 0',
    },
    col: {
        display: 'flex',
        padding: '0 8px',
    },
    deleteBtn: {
        cursor: 'pointer',
        position: 'relative',
        top: '4px',
        fontSize: '24px',
        color: '#999',
        transition: 'all 0.3s',
        marginRight: '16px',
    },
    addBtn: {
        cursor: 'pointer',
        position: 'relative',
        top: '4px',
        fontSize: '24px',
        color: '#40a9ff',
        transition: 'all 0.3s',
    },
    inputError: {
        border: '1px solid #ff0000',
    },
    spanError: {
        color: '#ff0000',
        fontSize: '12px',
        marginLeft: '45px',
    },
};

class OptionView extends Component {
    state = {
        optionData: [{ value: '', text: '' }],
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps.optionData----->', nextProps.optionData);
        if (nextProps.visible && nextProps.visible !== this.props.visible) {
            this.setState({
                optionData: nextProps.optionData.length > 0 ? nextProps.optionData : [{ value: '', text: '' }],
            })
        }
    }

    onCancel = () => {
        const { handleCancel } = this.props;
        handleCancel(() => {
            this.setState({ optionData: [{ value: '', text: '' }] });
        });
    }

    handleOk = () => {
        const { handleSubmit } = this.props;
        const { optionData } = this.state;
        const index = optionData.findIndex(item => (item.errorMsg && item.errorMsg.value) || (item.errorMsg && item.errorMsg.text));
        if (index >= 0) {
            return;
        }
        const index1 = optionData.findIndex(item => item.value === '' || item.text === '');
        if (index1 >= 0) {
            message.error(formatMessage({ id: 'oal.settings.completeInfo' }));
        } else {
            handleSubmit(optionData, () => {
                this.setState({ optionData: [{ value: '', text: '' }] });
            });
        }
    };

    handleOption = (type, index) => {
        const { optionData } = this.state;
        // eslint-disable-next-line no-underscore-dangle
        const _optionData = optionData;
        if (type === 'add') {
            _optionData.push({ value: '', text: '' });
        } else {
            _optionData.splice(index, 1);
        }
        this.setState({ optionData: _optionData });
    }

    onChange = (index, type, value) => {
        const reg = /^\w+$/;
        const { optionData } = this.state;
        // eslint-disable-next-line no-underscore-dangle
        const _optionData = optionData;
        if (!_optionData[index].errorMsg) {
            _optionData[index].errorMsg = {};
        }
        if (type === 'value') {
            _optionData[index].value = value;
            if (value && (!reg.test(value) || value.length > 50)) {
                _optionData[index].errorMsg.value = formatMessage({ id: 'oal.settings.optionDataError' }, { num: '50' });
            } else {
                _optionData[index].errorMsg.value = '';
            }
        } else {
            _optionData[index].text = value;
            if (value && value.length > 50) {
                _optionData[index].errorMsg.text = formatMessage({ id: 'oal.common.maxLength' }, { num: '50' });
            } else {
                _optionData[index].errorMsg.text = '';
            }
        }
        this.setState({ optionData: _optionData });
    }

    render() {
        const { visible } = this.props;
        const { optionData } = this.state;
        return (
            <Modal
                destroyOnClose
                title={formatMessage({ id: 'oal.settings.configDropdownOptions' })}
                width={600}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.onCancel}
                maskClosable={false}
            >
                <div>
                    {
                        optionData.length > 0 && optionData.map((item, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={`option_${index}`}>
                                <Row style={styles.row}>
                                    <Col span={10} style={styles.col}>
                                        <span>value：</span>
                                        <Input style={item.errorMsg && item.errorMsg.value ? styles.inputError : null} value={item.value} onChange={e => this.onChange(index, 'value', e.target.value)} />
                                    </Col>
                                    <Col span={10} style={styles.col}>
                                        <span>text：</span>
                                        <Input style={item.errorMsg && item.errorMsg.text ? styles.inputError : null} value={item.text} onChange={e => this.onChange(index, 'text', e.target.value)} />
                                    </Col>
                                    <Col span={4} style={styles.col}>
                                        {optionData.length === 1 ?
                                            null
                                            :
                                            <Icon
                                                style={styles.deleteBtn}
                                                type="minus-circle-o"
                                                onClick={() => this.handleOption('remove', index)}
                                            />
                                        }
                                        {index === (optionData.length - 1) ?
                                            <Icon
                                                style={styles.addBtn}
                                                type="plus-circle"
                                                onClick={() => this.handleOption('add')}
                                            />
                                            :
                                            null
                                        }
                                    </Col>
                                </Row>
                                <Row style={styles.row}>
                                    <Col span={10} style={styles.col}>
                                        {item.errorMsg && item.errorMsg.value ?
                                            <span style={styles.spanError}>
                                                {item.errorMsg.value}
                                            </span>
                                            :
                                            null
                                        }
                                    </Col>
                                    <Col span={10} style={styles.col}>
                                        {item.errorMsg && item.errorMsg.text ?
                                            <span style={styles.spanError}>
                                                {item.errorMsg.text}
                                            </span>
                                            :
                                            null
                                        }
                                    </Col>
                                    <Col span={4} style={styles.col}>
                                    </Col>
                                </Row>
                            </div>
                        ))
                    }
                </div>
            </Modal>
        )
    }
}
export default OptionView;
