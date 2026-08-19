import ReactDOM from 'react-dom/client'
import type { Root } from 'react-dom/client'
import App from './App'

import {
    renderWithQiankun,
    qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'
import { MicroAppStateActions } from 'qiankun'
import { generateId } from '@repo/utils'

import 'uno.css'
import 'antd/dist/reset.css'

let root: Root | null = null
const id = generateId()

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
    root.render(<App id={id} />)
}

renderWithQiankun({
    bootstrap() {},
    mount(props) {
        render(props)
    },
    unmount() {
        root?.unmount()
        root = null
    },
    update() {},
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render()
}
