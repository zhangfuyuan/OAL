import {
    Button,
    Card,
    Col,
    Form,
    Row,
    Select,
    DatePicker,
    Icon,
    Input,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '../../components/StandardTable';
import DetailDrawer from './components/DetailDrawer';
import styles from './style.less';
import { exportCSV } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const day = moment().date();
const begin = moment().subtract(day - 1, 'days').format('YYYY-MM-DD');
const end = moment().format('YYYY-MM-DD');

@connect(({ report, faceKey, loading }) => ({
    report,
    attendList: report.attendList,
    attendListLoading: loading.effects['report/fetch'],
    perAttendList: report.perAttendList,
    perAttendListLoading: loading.effects['report/getPerAttendList'],
    faceKeyList: faceKey.faceKeyList,
    deviceList: report.deviceList,
}))
class AttendanceList extends Component {
    state = {
        formValues: {},
        selectedRows: [],
        page: {
            current: 1,
            pageSize: 10,
        },
        startDate: null,
        detailVisible: false,
        selectedBean: {},
        expandForm: false,
    };

    componentDidMount() {
        this.loadAttendList();
        this.loadFaceKeyList();
        this.loadDeviceList();
    }

    // profileQuery
    loadAttendList = () => {
        const { dispatch } = this.props;
        const { page } = this.state;
        dispatch({
            type: 'report/fetch',
            payload: {
                ...page,
                begin,
                end,
            },
        });
    };

    loadFaceKeyList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'faceKey/getFaceKeyList',
        });
    };

    loadPreAttendList = (faceId, date) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'report/getPerAttendList',
            payload: {
                faceId,
                date,
            },
        });
    };

    loadDeviceList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'report/getDeviceList',
            payload: {
                verity: 1,
            },
        });
    }

    columns = () => {
        const { faceKeyList } = this.props;
        const cl = [{
            title: '考勤设备',
            key: 'deviceName',
            dataIndex: 'deviceInfo_name',
            ellipsis: true,
            render: (_text, record) => (
                <span>
                    {(record && record.deviceInfo && record.deviceInfo.name) || ''}
                </span>
            ),
        },
        {
            title: '姓名',
            key: 'faceName',
            dataIndex: 'faceInfo_name',
            ellipsis: true,
            render: (_text, record) => (
                <span>
                    <a onClick={() => this.openDetailModal(record)}>
                        {(record && record.faceInfo && record.faceInfo.name) || ''}
                    </a>
                </span>
            ),
        }];
        // eslint-disable-next-line no-unused-expressions
        faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
            if (item.reportQuery) {
                const type = item.componentInfo && item.componentInfo.type; // 文本框1，下拉框2
                const options = item.componentInfo && item.componentInfo.data; // 下拉选项value，text的对象数组
                cl.push({
                    title: item.name,
                    key: `${item.key}`,
                    dataIndex: `faceInfo_profile_${item.key}`,
                    ellipsis: true,
                    options: type === 2 ? options : null,
                    render: (_text, record) => {
                        let spanText = '';
                        if (record && record.faceInfo && record.faceInfo.profile && record.faceInfo.profile[item.key]) {
                            if (type === 2 && options && options.length > 0) {
                                const option = options.find(bean => bean.value == record.faceInfo.profile[item.key]);
                                spanText = (option && option.text) || '';
                            } else {
                                spanText = record.faceInfo.profile[item.key];
                            }
                        }
                        return <span>{spanText}</span>
                    },
                });
            }
        });
        cl.push({
            title: '进出次数',
            key: 'count',
            dataIndex: 'count',
            width: 100,
            render: (_text, record) => (
                <span>{(record && record.accessTypes && record.accessTypes.length) || 0}</span>
            ),
        },
            {
                title: '时间',
                key: 'time',
                width: 200,
                render: (_text, record) => (
                    <span>{moment(record.min).format('YYYY-MM-DD HH:mm:ss')} ~ {moment(record.max).format('YYYY-MM-DD HH:mm:ss')}</span>
                ),
            });
        return cl;
    };

    openWin = path => {
        const { origin } = window.location;
        const href = `${origin}/user/${path}/login`;
        window.open(href);
    };

    handleSearch = () => {
        const { form, dispatch, faceKeyList } = this.props;
        const { page } = this.state;

        form.validateFields((err, fieldsValue) => {
            console.log('fieldValues------>', fieldsValue);
            if (err) return;
            this.setState({
                formValues: fieldsValue,
                selectedRows: [],
            });
            const params = {};
            params.faceName = fieldsValue.faceName;
            params.deviceRegion = fieldsValue.deviceRegion;
            params.begin = moment(fieldsValue.date[0]).format('YYYY-MM-DD');
            params.end = moment(fieldsValue.date[1]).format('YYYY-MM-DD');
            params.profileQuery = {};
            // eslint-disable-next-line no-unused-expressions
            faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
                if (item.reportQuery) {
                    params.profileQuery[item.key] = fieldsValue[item.key];
                }
              });
            dispatch({
                type: 'report/fetch',
                payload: {
                    ...page,
                    ...params,
                },
            });
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        form.setFieldsValue({});
        const { page } = this.state;
        this.setState({
            formValues: {},
        });
        const params = {
            ...page,
            current: 1,
            begin,
            end,
        };
        dispatch({
            type: 'report/fetch',
            payload: params,
        });
    };

    openDetailModal = record => {
        this.setState({ detailVisible: true, selectedBean: record });
        // eslint-disable-next-line no-underscore-dangle
        const faceId = record && record._id && record._id.faceId;
        // eslint-disable-next-line no-underscore-dangle
        const deviceDate = record && record._id && record._id.deviceDate;
        if (faceId && deviceDate) {
            this.loadPreAttendList(faceId, moment(deviceDate).format('YYYY-MM-DD'));
        }
    };

    closeDetailModal = () => {
        this.setState({ detailVisible: false, selectedBean: {} });
    };

    handleExport = data => {
        const { formValues } = this.state;
        const faceName = formValues.faceName || '';
        let beginDate = begin;
        let endDate = end;
        if (formValues.date) {
            beginDate = moment(formValues.date[0]).format('YYYY-MM-DD');
            endDate = moment(formValues.date[1]).format('YYYY-MM-DD');
        }
        let fileName = `${beginDate}到${endDate}_考勤.csv`;
        if (faceName) {
            fileName = `${faceName}_${beginDate}到${endDate}_考勤.csv`;
        }
        const headers = this.columns();
        const index = headers.findIndex(h => h.dataIndex === 'count');
        if (index > -1) {
            headers.splice(index, 2)
        }
        headers.push({
            title: '日期',
            dataIndex: 'date',
        }, {
            title: '上班时间',
            dataIndex: 'beginTime',
        }, {
            title: '下班时间',
            dataIndex: 'endTime',
        }, {
            title: '进入次数',
            dataIndex: 'inCount',
        }, {
            title: '离开次数',
            dataIndex: 'outCount',
        });
        exportCSV(headers, data, fileName);
    };

    toExport = () => {
        const { dispatch, faceKeyList } = this.props;
        const { formValues } = this.state;
        const params = {
            // current: pagination.current,
            // pageSize: pagination.pageSize,
            forExport: true,
            faceName: formValues.faceName,
            deviceRegion: formValues.deviceRegion,
        };
        if (formValues.date) {
            params.begin = moment(formValues.date[0]).format('YYYY-MM-DD');
            params.end = moment(formValues.date[1]).format('YYYY-MM-DD');
        } else {
            params.begin = begin;
            params.end = end;
        }
        params.profileQuery = {};
        // eslint-disable-next-line no-unused-expressions
        faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
            if (item.reportQuery) {
                params.profileQuery[item.key] = formValues[item.key];
            }
        });
        dispatch({
            type: 'report/fetchNoPage',
            payload: {
                ...params,
            },
        }).then(res => {
            if (res && res.res > 0 && res.data) {
                this.handleExport(res.data);
            }
        });
    };

    renderDeviceOption = () => {
        const { deviceList } = this.props;
        if (deviceList.length > 0) {
            // eslint-disable-next-line no-underscore-dangle
            return deviceList.map(item => <Option value={item._id} key={`option_${item._id}`}>{item.name}</Option>);
        }
        return null;
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    onChangeDate = date => {
        this.setState({ startDate: date && date[0] })
    };

    disabledDate = current => {
        const { startDate } = this.state;
        if (startDate) {
            const endDate = moment(startDate).add(1, 'months');
            return current && current > endDate;
        }
        return null;
    };

    initialDate = () => [moment().subtract(day - 1, 'days'), moment()];

    renderSimpleForm = hasExpand => {
        const { form, attendListLoading } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form layout="inline">
                <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="姓名">
                            {getFieldDecorator('faceName')(
                                <Input placeholder="请输入" />,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={10} sm={24}>
                        <FormItem label="考勤设备">
                            {getFieldDecorator('deviceRegion')(
                                <Select
                                    mode="multiple"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                    allowClear
                                >
                                    {this.renderDeviceOption()}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="时间">
                            {getFieldDecorator('date', {
                                initialValue: this.initialDate(),
                            })(
                                <RangePicker
                                    onCalendarChange={this.onChangeDate}
                                    disabledDate={this.disabledDate}
                                />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'left', marginBottom: 24 }}>
                        <Button type="primary" onClick={() => this.toExport()}>
                            导出
                        </Button>
                    </div>
                    <div style={{ float: 'right', marginBottom: 24 }}>
                        <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={attendListLoading}>
                            查询
                        </Button>
                        <Button
                            style={{ marginLeft: 8 }}
                            onClick={this.handleFormReset}
                        >
                            重置
                        </Button>
                        {
                            hasExpand ?
                                <a
                                    style={{ marginLeft: 8 }}
                                    onClick={this.toggleForm}
                                >
                                    展开 <Icon type="down" />
                                </a>
                                :
                                null
                        }
                    </div>
                </div>
            </Form>
        );
    };

    renderAdvancedForm = () => {
        const { form, attendListLoading, faceKeyList } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form layout="inline">
                <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem label="姓名">
                            {getFieldDecorator('faceName')(
                                <Input placeholder="请输入" />,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={10} sm={24}>
                        <FormItem label="考勤设备">
                            {getFieldDecorator('deviceRegion')(
                                <Select
                                    mode="multiple"
                                    placeholder="请选择"
                                    style={{
                                        width: '100%',
                                    }}
                                    allowClear
                                >
                                    {this.renderDeviceOption()}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="时间">
                            {getFieldDecorator('date', {
                                initialValue: this.initialDate(),
                            })(
                                <RangePicker
                                    onCalendarChange={this.onChangeDate}
                                    disabledDate={this.disabledDate}
                                />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
                    {faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
                        const type = item.componentInfo && item.componentInfo.type; // 文本框1，下拉框2
                        const options = item.componentInfo && item.componentInfo.data; // 下拉选项value，text的对象数组
                        if (item.reportQuery) {
                            return (
                                <Col md={8} sm={24} key={`col_${item.key}`}>
                                    <FormItem label={item.name}>
                                        {getFieldDecorator(item.key)(
                                            type === 1 ?
                                                <Input placeholder="请输入" />
                                                :
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    {options.length > 0 && options.map(option => (
                                                        <Option value={option.value} key={`option_${option.value}`}>{option.text}</Option>
                                                    ))}
                                                </Select>,
                                        )}
                                    </FormItem>
                                </Col>
                            );
                        }
                        return null
                    })}
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'left', marginBottom: 24 }}>
                        <Button type="primary" onClick={() => this.toExport()}>
                            导出
                        </Button>
                    </div>
                    <div style={{ float: 'right', marginBottom: 24 }}>
                        <Button onClick={this.handleSearch} type="primary" htmlType="submit" loading={attendListLoading}>
                            查询
                        </Button>
                        <Button
                            style={{ marginLeft: 8 }}
                            onClick={this.handleFormReset}
                        >
                            重置
                        </Button>
                        <a
                            style={{ marginLeft: 8 }}
                            onClick={this.toggleForm}
                        >
                            收起 <Icon type="up" />
                        </a>
                    </div>
                </div>
            </Form>
        );
    };

    renderForm = () => {
        const { expandForm } = this.state;
        const { faceKeyList } = this.props;
        let hasExpand = false; // 人脸属性列表里面是否有reportQuery为true的属性
        const index = faceKeyList.findIndex(item => item && item.reportQuery);
        console.log('index=====>', index);
        if (index > -1) {
            hasExpand = true;
        }
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm(hasExpand);
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    handleStandardTableChange = pagination => {
        const { dispatch, faceKeyList } = this.props;
        const { formValues } = this.state;
        const params = {
            current: pagination.current,
            pageSize: pagination.pageSize,
            faceName: formValues.faceName,
            deviceRegion: formValues.deviceRegion,
        };
        if (formValues.date) {
            params.begin = moment(formValues.date[0]).format('YYYY-MM-DD');
            params.end = moment(formValues.date[1]).format('YYYY-MM-DD');
        } else {
            params.begin = begin;
            params.end = end;
        }
        params.profileQuery = {};
        // eslint-disable-next-line no-unused-expressions
        faceKeyList && faceKeyList.length > 0 && faceKeyList.map(item => {
            if (item.reportQuery) {
                 params.profileQuery[item.key] = formValues[item.key];
            }
        });
        dispatch({
            type: 'report/fetch',
            payload: {
                ...params,
            },
        });
    };

    render() {
        const {
            attendList,
            attendListLoading,
            faceKeyList,
            perAttendList,
            perAttendListLoading,
        } = this.props;
        const { selectedRows, detailVisible, selectedBean } = this.state;
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <StandardTable
                            // eslint-disable-next-line no-underscore-dangle
                            rowKey={record => `${record._id && record._id.faceId}_${Math.random()}`}
                            needRowSelection={false}
                            selectedRows={selectedRows}
                            loading={attendListLoading}
                            data={attendList}
                            columns={this.columns()}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <DetailDrawer
                    visible={detailVisible}
                    selectedBean={selectedBean}
                    faceKeyList={faceKeyList}
                    data={perAttendList}
                    loading={perAttendListLoading}
                    onClose={this.closeDetailModal}
                />
            </PageHeaderWrapper>
        );
    }
}

export default Form.create()(AttendanceList);
