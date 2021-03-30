import { Result, Button } from 'antd';
import { history } from 'umi'

export default (
  <Result
    status="404"
    title="404"
    subTitle="抱歉，未找到相关内容。"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
) 