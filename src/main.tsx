import ReactDOM from 'react-dom/client'
import type { Root } from 'react-dom/client'
import App from './App'

import {
    renderWithQiankun,
    qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'

import 'uno.css'
import 'antd/dist/reset.css'

import { MicroAppStateActions } from 'qiankun'

let root: Root | null = null

function render(
    props: {
        container?: HTMLElement
        basicActions?: MicroAppStateActions
    } = {},
) {
    const mountElement =
        props.container?.querySelector('#root') ??
        document.getElementById('root')

    if (!mountElement) return
    if (props.basicActions) window.basicActions = props.basicActions

    root = ReactDOM.createRoot(mountElement)
    root.render(<App />)
}

renderWithQiankun({
    bootstrap() {},
    mount(props) {
        render(props)
    },
    unmount() {
        // qiankun 采用 dom loadMicroApp + 隐藏显示实现多标签缓存，子项目的重点的是qiankun子应用离开卸载时不销毁DOM实例
        // root?.unmount()
        // root = null
    },
    update() {},
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render()
}
