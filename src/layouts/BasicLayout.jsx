/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useIntl, connect, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';
import defaultSettings from '../../config/defaultSettings';
import LocalMenuConfig from '../../config/routes'
import IconFont from '@/components/MyIcon';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

const NoFoundPage = (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
) 

const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return localItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 蚂蚁集团体验技术部出品`}
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    menu,
  } = props;
  const menuDataRef = useRef([]);
  const [isAuth, setIsAuth] = useState(404)

  useEffect(() => {
    setIsAuth(matchMenu(location.pathname||'/'))
  }, [location.pathname]);
  
  const matchMenu = path => {
    let isMatchLocal = false
    let isMatchRemote = false
    function matchLocal(tree,path) {
      tree.map(item => {
        if (item?.path?.indexOf(path)>-1) {
          isMatchLocal = true
        }
        if (item.routes) {
          matchLocal(item.routes, path)
        }
      })
    }
    function matchRemote(tree,path) {
      tree.map(item => {
        if (item?.path?.indexOf(path)>-1) {
          isMatchRemote = true
        }
        if (item.children) {
          matchRemote(item.children, path)
        }
      })
    }
    let localMenu = LocalMenuConfig[0].routes[0].routes
    matchLocal(localMenu, path)
    matchRemote(menu, path)
    
    if (isMatchLocal) {
      if (isMatchRemote) {
        return 200
      } else {
        return 403
      }
    } else {
      return 404
    }
  } 

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const {} = useIntl();
  return (
    <ProLayout
      logo={logo}
      {...props}
      {...settings}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        // if (menuItemProps.isUrl || !menuItemProps.path) {
        //   console.log(menuItemProps)
        //   return defaultDom;
        // }

        // return <Link to={menuItemProps.path}>{defaultDom}</Link>;

        // 外链
        if (menuItemProps.path.indexOf('http') > -1) {
          // 内嵌外链
          if (menuItemProps.path.indexOf('target') > -1) {
            return (
              <a
                className="my-menu-item-link"
                onClick={() => history.push(menuItemProps.path)}
              >
                {menuItemProps.icon ? <IconFont type={menuItemProps.icon} /> : null}
                <span>{menuItemProps.name}</span>
              </a>
            );
          }
          // 新开浏览器页面外链
          return (
            <a
              className="my-menu-item-link"
              href={menuItemProps.path}
              target="_blank"
            >
              {menuItemProps.icon ? <IconFont type={menuItemProps.icon} /> : null}
              <span>{menuItemProps.name}</span>
            </a>
          );
        }

        return (
          <a
            className="my-menu-item-link"
            onClick={() => history.push(menuItemProps.path)}
          >
            {menuItemProps.icon ? <IconFont type={menuItemProps.icon} /> : null}
            <span>{menuItemProps.name}</span>
          </a>
        );
      }}
      // breadcrumbRender={(routers = []) => [
      //   {
      //     path: '/',
      //     breadcrumbName: '首页',
      //   },
      //   ...routers,
      // ]}
      // itemRender={(route, params, routes, paths) => {
      //   const first = routes.indexOf(route) === 0;
      //   return first ? (
      //     <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
      //   ) : (
      //     <span>{route.breadcrumbName}</span>
      //   );
      // }}
      // footerRender={() => defaultFooterDom}
      menuDataRender={
        defaultSettings?.menu?.remote ? menuDataRender.bind(this, menu) : menuDataRender
      }
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        //用useRef缓存菜单数据
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
    >
      {/* <Authorized authority={authorized.authority} noMatch={noMatch}> */}
        { !defaultSettings?.menu?.remote ? children : isAuth === 200 ? children : isAuth === 403 ? noMatch : NoFoundPage}
      {/* </Authorized> */}
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
  menu: global.menu,
}))(BasicLayout);
