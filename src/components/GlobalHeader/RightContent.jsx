import { Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = (props) => {
  const { theme, layout, menu } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const options = []

  function flatMenu(menu) {
    menu.map(item => {
      if (item.name&&item.path&&item.name!="登录") {
        options.push({
          label: <a href={item.path}>{item.name}</a>,
          value: item.name+'@@'+item.path,
        })
      }
      if (item.children) {
        flatMenu(item.children)
      }
    })
  }
  flatMenu(menu)

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="菜单搜索"
        options={options} 
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      {/* <Tooltip title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip> */}
      <Avatar />
      {/* {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} /> */}
    </div>
  );
};

export default connect(({ settings, global }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  menu: global.menu
}))(GlobalHeaderRight);
