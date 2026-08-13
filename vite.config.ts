import defineConfig from '@repo/vite-config'
import type { PluginOption, Plugin } from 'vite'

// vite-plugin-qiankun 未转换 head 内 type=module 内联脚本，qiankun 会按普通脚本执行 import 语句并报错
// 将 @react-refresh preamble 替换为普通脚本：先设置空函数避免组件 $RefreshReg$ 未定义报错，
// 再通过动态 import 异步加载 RefreshRuntime 并注入全局 hooks，实现 qiankun 沙箱内的 React Fast Refresh
function qiankunDevHtmlFix(): Plugin {
    return {
        name: 'qiankun-dev-html-fix',
        transformIndexHtml: {
            order: 'post',
            handler(html) {
                const refreshInit = [
                    'window.$RefreshReg$ = function() {};',
                    'window.$RefreshSig$ = function() { return function(type) { return type; }; };',
                    'window.__vite_plugin_react_preamble_installed__ = true;',
                    // qiankun 沙箱内绝对路径会解析到主应用，需用 __INJECTED_PUBLIC_PATH_BY_QIANKUN__ 修正到子应用
                    'var refreshBase = window.proxy ? (window.proxy.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + "..") : "";',
                    'import(refreshBase + "/@react-refresh").then(function(m) {',
                    '  m.default.injectIntoGlobalHook(window);',
                    '});',
                ].join('')
                return html.replace(
                    /<script\s+type="module">[\s\S]*?@react-refresh[\s\S]*?<\/script>\s*/gi,
                    `<script>${refreshInit}</script>`,
                )
            },
        },
    }
}

export default defineConfig({
    base: (env) => {
        console.log('当前环境变量 env.VITE_BASE_PATH：', env.VITE_BASE_PATH)
        return env.VITE_BASE_PATH || '/'
    },
    qiankun: (
        set: (name: string, options: { useDevMode: boolean }) => PluginOption,
    ) => {
        return set('sc-cloud-mdm', { useDevMode: true })
    },

    plugins: [qiankunDevHtmlFix()],

    envDirAuto: true,

    server: {
        port: 3010,
        strictPort: true,
        cors: true,
        origin: 'http://localhost:3010',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // 启用 HMR，WebSocket 连接到子应用端口（非主应用端口）
        hmr: {
            host: 'localhost',
            port: 3010,
            protocol: 'ws',
            overlay: false,
        },
    },
})
