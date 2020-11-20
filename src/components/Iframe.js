// iframe组件

import React from 'react';

let style = {
  padding: 0,
  border: 0,
  height: 'calc(100% - 16px)',
  background: '#fff',
  margin: '8px',
  width: 'calc(100% - 16px)'
}

export default (props) => {
  return (
    <div style={{height: '100%', overflow:'hidden'}}>
      <iframe
        style={style}
        {...props}
      />
    </div>
  )
}
