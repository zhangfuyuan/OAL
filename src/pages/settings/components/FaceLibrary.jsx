import React, { Component } from 'react';
import { Button, Form, InputNumber, Typography, Divider } from 'antd';
import { validateNum } from '@/utils/utils';
import styles from './baseView.less';

const { Title } = Typography;
const FormItem = Form.Item;

class FaceLibrary extends Component {
    handlerSubmit = () => {
        const { form, toEdit } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            toEdit(fieldsValue);
        });
    };

    checkNum = (rule, value, callback) => {
        if (value !== '' && !validateNum(value)) {
            callback('请输入正整数');
        }
        callback();
    };

    render() {
        const {
            form: { getFieldDecorator },
            data,
        } = this.props;
        const faceSizeBean = data.find(item => item.key === 'faceSize');
        const maxFaceCountBean = data.find(item => item.key === 'maxFaceCount');
        console.log('faceSize=======>', data, faceSizeBean);
        return (
            <div className={styles.baseView} ref={this.getViewDom}>
                <div style={{ width: '100%' }}>
                    <Form layout="inline">
                        <Divider style={{ marginTop: 0 }}/>
                        <Title level={3}>图片尺寸(KB)</Title>
                        <Form.Item
                            label="最小值"
                            name="minSize"
                        >
                            {getFieldDecorator('minSize', {
                                rules: [{
                                    validator: this.checkNum,
                                }],
                                initialValue: faceSizeBean && faceSizeBean.value && faceSizeBean.value.min,
                            })(<InputNumber />)}
                        </Form.Item>
                        <Form.Item
                            label="最大值"
                            name="maxSize"
                        >
                            {getFieldDecorator('maxSize', {
                                rules: [{
                                    validator: this.checkNum,
                                }],
                                initialValue: faceSizeBean && faceSizeBean.value && faceSizeBean.value.max,
                            })(<InputNumber />)}
                        </Form.Item>

                        <Divider/>
                        <Title level={3}>底库数量</Title>
                        <FormItem
                            label="最大值"
                        >
                            {getFieldDecorator('maxFaceCount', {
                                rules: [{
                                    validator: this.checkNum,
                                }],
                                initialValue: maxFaceCountBean && maxFaceCountBean.value,
                            })(
                                <InputNumber />,
                            )}
                        </FormItem>
                        <Divider/>
                        <Button type="primary" onClick={this.handlerSubmit}>
                            保存
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Form.create()(FaceLibrary);
