export default {
  '/api/auth_routes': {
    '/form/advanced-form': {
      authority: ['admin', 'user'],
    },
  },
  '/mock/getGlobalMenu': {
    code: 0,
    data: [
      {
        path: '/user',
        hideInMenu: true,
        children: [
          {
            name: '登录',
            path: '/user/login',
          },
        ],
      },
      {
        path: '/welcome',
        name: '欢迎',
      },
      {
        path: '/admin',
        name: '用户管理',
        icon: 'icon-cloudy-2-fill',
        children: [
          {
            path: '/admin/sub-page',
            icon: 'icon-cloudy-2-fill',
            name: '二级页面',
          },
          {
            name: '二级目录',
            path: '/admin-sub',
            icon: 'icon-cloudy-2-fill',
            children: [
              {
                path: '/admin/sub-page2',
                name: '三级页面',
              }
            ]
          },
          {
            name: '腾讯',
            path: '/iframe/http-www.qq.com?id=2'
          }
        ],
      },
      {
        name: '表格',
        path: '/list',
      },
      {
        name: '百度',
        path: '/iframe/http-www.baidu.com?id=1',
      },
      {
        name: '网易',
        path: 'http://www.163.com?id=1',
      },
    ],
    msg: 'success'
  },
};
