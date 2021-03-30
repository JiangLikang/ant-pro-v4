import { Result, Button } from 'antd';
import { Link } from 'umi'

export default (
  <Result
    status={403}
    title="403"
    subTitle="抱歉，您无权查看。"
    extra={
      <Button type="primary">
        <Link to="/user/login">去重新登录</Link>
      </Button>
    }
  />
);