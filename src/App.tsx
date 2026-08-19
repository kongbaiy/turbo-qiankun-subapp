import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'

import { lightTheme } from '@repo/antd-theme'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider, App as Antd } from 'antd'
import { initAntdGlobal } from '@repo/utils'
import { MicroAppStateActions } from 'qiankun'
import { AliveScope } from 'react-activation'

interface Props {
    id: string
}

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

export default function App(props: Props) {
    const root = document.querySelector('#root')
    const styleContainer = document.createElement('div')

    root?.appendChild(styleContainer)

    return (
        <StyleProvider container={styleContainer} hashPriority='high'>
            <ConfigProvider prefixCls={`subapp-${props.id}`} theme={lightTheme}>
                <Antd>
                    <AliveScope>
                        <InnerApp />
                    </AliveScope>
                </Antd>
            </ConfigProvider>
        </StyleProvider>
    )
}
