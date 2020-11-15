module.exports =
    [{
        id: 1,
        title: '求两两和不被k整除的子序列',
        date: '2020-08-23 14:22:56',
        preview: {
            image: '',
            content: '已知一个长度为N，值为整数的随机序列a1,a2,...,aNa_1,a_2,...,a_Na1​,a2​,...,aN​，求出两两和不被k整除的子序列的个数，子序列长度可以为0，即空序列。解：考虑递归，递归求解前n个数的序列(a1,a2,...ana_1,a_2,...a_na1​,a2​,...an​) (0&lt;n≤N)的解和中间数据。设G(n)G(n)G(n)为长度为n的序列满足条件的所有...'
        }
    }, {
        id: 2,
        title: '我即将出生的儿子的爸爸是我即将出生的儿子？(记一次Security的无限递归错误)',
        date: '2020-07-23 02:49:48',
        preview: {
            image: '',
            content: 'spring security的默认设置已经足够强大，可以完成绝大部分的需求了。但是仍有许多细微的地方无法使用默认设置或者是简单设置来修改。这次我就在自定义设置的时候遇到了一个比较有趣的问题。首先说我的需求，使用security做授权的时候，直接设置一个UserDetailsService到容器中就可以实现用户名/密码...'
        }
    }, {
        id: 3,
        title: 'nginx反向代理spring admin后，admin页面无法显示，静态资源加载不了',
        date: '2020-07-16 20:36:31',
        preview: {
            image: '',
            content: '解决方法：springboot admin设置配置：spring.boot.admin.ui.public-url: http://xxx.xx.xxx.xxx:xxxx/这个地址就是你ngnix代理的ip和端口'
        }
    }, {
        id: 4,
        title: 'nginx配置https，浏览器访问报错ERR_SSL_PROTOCOL_ERROR',
        date: '2020-07-15 00:52:46',
        preview: {
            image: '',
            content: 'ip请求没有问题，域名请求死活一直报错，找了一晚上的解决方案，nginx的配置实在没有问题。直到最后，我用http访问了一下，淦，域名没有备案，不能访问网页。准确点说是不能访问任何资源，后端接口也访问不了。md为什么https访问就不给一个提示没有备案的静态页面啊，直接断了连接这让人怎么找问...'
        }
    }, {
        id: 5,
        title: 'postgresql 锁机制中的fastpath锁',
        date: '',
        preview: {
            image: '',
            content: '2020-04-05 21:21:37'
        }
    }, {
        id: 6,
        title: '[自学分享]Postgres数据库锁机制(部分)',
        date: '2020-01-08 17:35:52',
        preview: {
            image: '',
            content: '这是我数据库系统机构课的结课作业，研究Postgres的行级锁/表级锁。如有不准确，望指正。 Postgres行级锁/会话锁分析报告 Postgress使用4种进程间的锁，分别是自旋锁、轻量级锁、重量级锁、谓词锁。.自旋锁(Spinlock)专为短期锁设计的，根据编译环境由硬件实现。轻量级锁(Lightweight Lock, ...'
        }
    }, {
        id: 7,
        title: '记录我在初学使用Retrofit中遇到的坑以及一些小知识',
        date: '2019-08-09 15:14:48',
        preview: {
            image: '',
            content: '1.Call&lt;?&gt;这个需要模板化的?的含义就是最终返回的数据的类型，它“可能”会经过你设置的转换器(.addConverterFactory)生成，要使用就是请求返回的Call&lt;?&gt; call的call.body()，这个?对应的类型必须是根据你所设置的转换器所需要的bean类，就是得加上各种@xxx来描述数据格式的那种类。至于为什...'
        }
    }, {
        id: 8,
        title: 'IBM Rational software Architect 9.0安装包百度网盘',
        date: '2019-07-18 22:12:55',
        preview: {
            image: '',
            content: '链接：https://pan.baidu.com/s/1CyiOkMzkrJV_t1DtIQeecg提取码：y27c'
        }
    }, {
        id: 9,
        title: 'Oracle安装',
        date: '2019-02-22 22:18:05',
        preview: {
            image: '',
            content: '官网下载了最新的Oracle 18c，安装过程差不多就是下一步下一步，没有什么要填的选的，和网上的11g的安装过程中比较少了典型安装这一步，就只选择了安装目录就过了。然后再安装了PLSQL，登录时遇到报错ORA-12154: TNS: 无法解析指定的连接标识符，好，百度一下，发现是网络服务没有配置，配置...'
        }
    }, {
        id: 10,
        title: 'OpenFeign学习笔记',
        date: '2020-06-12 17:34:00',
        preview: {
            image: '',
            content: 'Feign是一个声明式Web Service客户端，它使得客户端调用服务端的服务更加的方便简单：只需要定义一个接口，然后在上面添加注解指明调用的服务就行了；OpenFeign是Feign的增强。'
        }
    }]