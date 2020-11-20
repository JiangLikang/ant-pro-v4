import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="哎呀，资源找不到了."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default NoFoundPage;
