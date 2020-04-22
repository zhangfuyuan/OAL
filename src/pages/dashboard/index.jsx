import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styles from './index.less';
import { Card } from 'antd';

export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(id);
  }, []);
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Spin spinning={loading} size="large" />
      </Card>
    </PageHeaderWrapper>
  );
};
