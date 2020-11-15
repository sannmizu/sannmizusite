// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 本地环境是否需要使用cdn
const devNeedCdn = true
// cdn链接
const cdn = {
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        'ant-design-vue': 'antd'
    },
    // cdn的css链接
    css: [
        'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.1/dist/antd.min.css'
    ],
    // cdn的js链接
    js: [
        'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
        'https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
        'https://cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js',
        'https://cdn.jsdelivr.net/npm/ant-design-vue@1.7.1/dist/antd.min.js'
    ]
}

module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        // ============注入cdn start============
        config.plugin('html').tap(args => {
            // 生产环境或本地需要cdn时，才注入cdn
            if (isProduction || devNeedCdn) args[0].cdn = cdn
            return args
        })
        // ============注入cdn end==============
    },
    configureWebpack: config => {
        // 用cdn方式引入，则构建时要忽略相关资源
        if (isProduction || devNeedCdn) config.externals = cdn.externals

        // 生产环境相关配置
        if (isProduction) {
            //gzip压缩
            const productionGzipExtensions = ['html', 'js', 'css']
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' + productionGzipExtensions.join('|') + ')$'
                    ),
                    threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: false // 删除原文件
                })
            )
        }
    }
}