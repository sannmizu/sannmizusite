module.exports = {
    blogId: 4,
    blogTitle: 'nginx配置https，浏览器访问报错ERR_SSL_PROTOCOL_ERROR',
    blogContent: 'ip请求没有问题，域名请求死活一直报错，找了一晚上的解决方案，nginx的配置实在没有问题。直到最后，我用http访问了一下，淦，域名没有备案，不能访问网页。准确点说是不能访问任何资源，后端接口也访问不了。\n' +
        '\n' +
        'md为什么https访问就不给一个提示没有备案的静态页面啊，直接断了连接这让人怎么找问题。',
    blogDate: '2020-07-15 00:52:46'
}