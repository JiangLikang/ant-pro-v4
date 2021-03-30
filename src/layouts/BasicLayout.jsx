/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl, connect, history } from 'umi';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.svg';
import defaultSettings from '../../config/defaultSettings';
import LocalMenuConfig from '../../config/routes'
import IconFont from '@/components/MyIcon';

import noMatch from './403'
import NoFoundPage from './404'

const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return localItem;
  });

const getOpenKeys = (key, menus=[]) => {
  let menuArr = [];
  let roots = menus.map(v => {
    return { path: v.path };
  });
  function trval(data, parent = []) {
    data.forEach(v => {
      if (roots.includes({ path: v.path })) {
        parent = [];
      }
      let cloneParent = [...parent];
      cloneParent.push({ path: v.path });

      if (v.children && v.children.length > 0) {
        trval(v.children, cloneParent);
      } else {
          menuArr.push(cloneParent.map(v => v.path));
      }
    });
  }
  trval(menus)
  return menuArr.find(v => v.includes(key))
}

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
  const [menuProps, setMenuProps] = useState({})
  const [pathArr, setPathArr] = useState(getOpenKeys('/iframe/'+window.location.href.split('/iframe/')[1], menu)||[])
  
  useEffect(() => {
    let pathname = window.location.href.split('#')[1].split('?')[0]
    if (pathname.indexOf('/iframe/')>-1) {
      setMenuProps(
        pathArr.length > 1 ? {
          selectedKeys: [pathname],
          openKeys: pathArr,
          onOpenChange: keys => {
            setPathArr(keys)
            setMenuProps(menuProps => (
              {
                ...menuProps,
                openKeys: keys
              }
            ))
          }
        }:{ selectedKeys: [pathname] }
      )
    } else {
      setMenuProps({})
    }
    setIsAuth(matchMenu(pathname||'/'))
  }, [location.pathname]);

  const matchMenu = path => {
    let isMatchLocal = false
    let isMatchRemote = false
    function matchLocal(tree,path) {
      if (path.indexOf('/iframe/')>-1) {
        isMatchLocal=true
        return
      }
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
      if (path.indexOf('/iframe/')>-1) {
        isMatchRemote=true
        return
      }
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
  }; 
  
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
          if (menuItemProps.path.indexOf('/iframe/') > -1) {
            return (
              <a
                className="my-menu-item-link"
                onClick={e => {
                  e.preventDefault()
                  history.push(menuItemProps.path)
                }}
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
      menuProps={menuProps}
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
      { !defaultSettings?.menu?.remote ? children : isAuth === 200 ? children : isAuth === 403 ? noMatch : NoFoundPage}
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
  menu: global.menu,
}))(BasicLayout);
