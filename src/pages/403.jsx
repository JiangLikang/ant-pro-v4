
import React from 'react';
import { Result } from 'antd';
// import { getAppInfo } from '@/services/global'

export default class NoPermition extends React.Component {
  state = {
    noPermitionText: '抱歉，您无权访问该页面，请联系管理员。'
  }

  componentDidMount() {
    // getAppInfo().then(res => {
    //   this.setState({
    //     noPermitionText: res?.data?.warnContent
    //   })
    // })
  }

  render() {
    return <Result
      status="403"
      title="403"
      subTitle={this.state.noPermitionText}
    />
  }
}
