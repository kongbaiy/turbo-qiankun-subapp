import defineConfig from '@repo/vite-config'
import type { PluginOption } from 'vite'
import { qiankunDevHtmlFix } from '@repo/plugin-config'

export default defineConfig({
    qiankun: (
        set: (name: string, options: { useDevMode: boolean }) => PluginOption,
    ) => {
        return set('turbo-qiankun-subapp', { useDevMode: true })
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

    // css: {
    //     postcss: {
    //         plugins: [
    //             prefixer({
    //                 prefix: '[data-qiankun="test"]',
    //                 transform(prefix: string, selector: string) {
    //                     // 不处理 html/body/:root，避免破坏全局样式
    //                     if (selector.match(/^(html|body|:root)/))
    //                         return selector
    //                     return prefix + ' ' + selector
    //                 },
    //             }),
    //         ],
    //     },
    //     preprocessorOptions: {
    //         less: {
    //             modifyVars: {
    //                 // antd 前缀修改，避免全局冲突
    //                 '@ant-prefix': `test-ant`,
    //             },
    //             javascriptEnabled: true,
    //         },
    //     },
    // }
})
