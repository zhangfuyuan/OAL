import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Form,
  Divider,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { findIndex } from 'lodash';
import moment from 'moment';
import styles from './style.less';

const FormItem = Form.Item;

@connect(({ workAttendanceRuleAdd, loading }) => ({
  workAttendanceRuleAdd,
  addLoading: loading.effects['workAttendanceRuleAdd/add'],
}))
class Demo extends Component {

  // constructor(props) {
  //   super(props);
  // }

  state = {
    formValues: {},
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const {
      addLoading,
    } = this.props;

    return (
      <PageHeaderWrapper title=" " className={styles.myPageHeaderWrapper} >
        <Card bordered={false}>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Demo);
