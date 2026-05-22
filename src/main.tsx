import React from 'react'
import ReactDOM from 'react-dom/client'
import type { Root } from 'react-dom/client'
import App from './App'
import {
    renderWithQiankun,
    qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'

import 'uno.css'
import './index.css'

let root: Root | null = null

function render(props: { container?: HTMLElement } = {}) {
    const mountElement =
        props.container?.querySelector('#root') ??
        document.getElementById('root')

    if (!mountElement) return

    root = ReactDOM.createRoot(mountElement)
    root.render(
        <React.StrictMode>
            <RepoErrorBoundary>
                <App />
            </RepoErrorBoundary>
        </React.StrictMode>,
    )
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
