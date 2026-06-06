import defineConfig from '@repo/vite-config'
import type { PluginOption, Plugin } from 'vite'

// vite-plugin-qiankun 未转换 head 内 type=module 脚本，qiankun 会按普通脚本执行并报错
function qiankunDevHtmlFix(): Plugin {
    return {
        name: 'qiankun-dev-html-fix',
        transformIndexHtml: {
            order: 'post',
            handler(html) {
                return html.replace(
                    /<script\s+type="module">[\s\S]*?@react-refresh[\s\S]*?<\/script>\s*/gi,
                    '',
                )
            },
        },
    }
}

export default defineConfig({
    qiankun: (
        set: (name: string, options: { useDevMode: boolean }) => PluginOption,
    ) => {
        return set('sc-cloud-platform', { useDevMode: true })
    },

    plugins: [qiankunDevHtmlFix()],

    envDirAuto: true,

    server: {
        port: 3002,
        // 开启 CORS，允许主应用跨域请求
        cors: true,
        // 设置来源，确保主应用能正确加载资源
        origin: 'http://localhost:3002',
        // 显式允许所有跨域请求
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // 子应用在 qiankun 沙箱内不需要 HMR，且 /@vite/client 与主应用冲突
        hmr: false,
    },
})
