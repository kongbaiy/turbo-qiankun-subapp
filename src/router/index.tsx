import { createBrowserRouter } from 'react-router-dom'
import { KeepAlive } from 'react-activation'

import { asyncComponent } from './async-component'
import Auth from './auth'

const routers = createBrowserRouter(
    [
        {
            path: '/application-components',
            handle: {
                icon: 'AppstoreFilled',
                name: '应用组件管理',
            },
            children: [
                {
                    path: 'platforms-manage',
                    handle: {
                        name: '平台管理',
                    },
                    element: (
                        <KeepAlive>
                            <Auth>
                                {asyncComponent(
                                    () =>
                                        import('@/pages/application-components/platform-manage'),
                                )}
                            </Auth>
                        </KeepAlive>
                    ),
                },
                {
                    path: 'application',
                    handle: {
                        name: '应用管理',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/application-components/application-manage'),
                            )}
                        </Auth>
                    ),
                },
                {
                    path: 'component',
                    handle: {
                        name: '组件管理',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/application-components/component-manage'),
                            )}
                        </Auth>
                    ),
                },
                {
                    path: 'api',
                    handle: {
                        name: '接口管理',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/application-components/api-manage'),
                            )}
                        </Auth>
                    ),
                },
            ],
        },
        {
            path: '/global-data-standard',
            handle: {
                icon: 'DatabaseFilled',
                name: '全局数据标准',
            },
            children: [
                {
                    path: 'dict',
                    handle: {
                        name: '数据字典',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/global-data-standard/dict-manage'),
                            )}
                        </Auth>
                    ),
                },
                {
                    path: 'dimension',
                    handle: {
                        name: '维度管理',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/global-data-standard/dimension-manage'),
                            )}
                        </Auth>
                    ),
                },
                {
                    path: 'serial',
                    handle: {
                        name: '流水号管理',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/global-data-standard/serial-manage'),
                            )}
                        </Auth>
                    ),
                },
            ],
        },
        {
            path: '/business-standard',
            handle: {
                icon: 'ToolFilled',
                name: '业务标准定义',
            },
            children: [
                {
                    path: 'control',
                    handle: {
                        name: '控件管理',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/business-standard/control-manage'),
                            )}
                        </Auth>
                    ),
                },
                {
                    path: 'form',
                    handle: {
                        name: '表单定义',
                    },
                    element: (
                        <Auth>
                            {asyncComponent(
                                () =>
                                    import('@/pages/business-standard/form-manage'),
                            )}
                        </Auth>
                    ),
                },
            ],
        },
    ],
    {
        basename: '/platforms',
    },
)

export default routers
