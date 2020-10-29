module.exports = {
    blogId: 3,
    blogTitle: 'nginx反向代理spring admin后，admin页面无法显示，静态资源加载不了',
    blogContent: '解决方法：\n' +
        '\n' +
        'spring boot admin设置配置：\n' +
        '\n' +
        '`spring.boot.admin.ui.public-url: http://xxx.xx.xxx.xxx:xxxx/`\n\n' +
        '这个地址就是你ngnix代理的ip和端口',
    blogDate: '2020-07-16 20:36:31'
}