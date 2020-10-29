module.exports = {
    chainWebpack: config => {
        config.plugins.delete("prefetch") //取消预加载
    }
}