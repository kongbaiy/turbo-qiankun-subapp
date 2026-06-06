import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'

import { lightTheme } from '@repo/antd-theme'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider, App as Antd } from 'antd'
import { initAntdGlobal } from '@repo/utils'
import { MicroAppStateActions } from 'qiankun'
import { AliveScope } from 'react-activation'

function InnerApp() {
    const instance = Antd.useApp()
    const basicActions = window.basicActions as MicroAppStateActions | undefined

    useEffect(() => {
        basicActions?.setGlobalState({
            menu: router.routes,
        })
    }, [])
    useEffect(() => {
        initAntdGlobal(instance)
    }, [instance])

    return <RouterProvider router={router} />
}

export default function App() {
    return (
        <AliveScope>
            <StyleProvider hashPriority='high'>
                <ConfigProvider theme={lightTheme}>
                    <Antd>
                        <InnerApp />
                    </Antd>
                </ConfigProvider>
            </StyleProvider>
        </AliveScope>
    )
}
