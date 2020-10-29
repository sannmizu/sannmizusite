module.exports = {
    blogId: 7,
    blogTitle: '记录我在初学使用Retrofit中遇到的坑以及一些小知识',
    blogContent: '1.Call<?> 这个需要模板化的?的含义就是最终返回的数据的类型，它“可能”会经过你设置的转换器(.addConverterFactory)生成，要使用就是请求返回的Call<?> call的call.body()，这个?对应的类型必须是根据你所设置的转换器所需要的bean类，就是得加上各种@xxx来描述数据格式的那种类。至于为什么是“可能”，因为这个?可以是ResponseBody，而且不需要设置转换器的也只有它一个，String什么的是不行的。\n' +
        '\n' +
        '所以，如果要直接以String形式得到返回数据，只有两种方法，一是利用ResponseBody的string()方法（注意不是toString()）,二是使用转换器“Scalars”，参见Retrofit请求数据返回String\n' +
        '\n' +
        '2.使用@Body这个标签，数据传输在http里的体现就是类似一个在body里的未加工数据，它在http头部里的Content-Type的值是row，不是传统的http请求的x-www-form-urlencode，key-value的方式传值才是x-www-form-urlencode。所以如果要在服务器端获得@Body标签对应的值，得百度“怎么获取Content-Type类型为row的值”，我用的是php，php的获取方式是使用file_get_content("php://input")，而不是去用$_POST。\n' +
        '\n' +
        '3.retrofit和使用的转换器的版本需要一致\n' +
        '\n' +
        '4.retrofit的同步请求方式需要自己开子线程，还是得在子线程中运行，不然报错。异步不需要，而且异步返回在主线程中，不需要runOnUiThread();\n' +
        '\n' +
        '5.对于xml，貌似转换器simpleXml不支持这样的节点<key iv="123">123</key>，所用只能变换一下成\n' +
        '\n' +
        '<aes>\n' +
        '\n' +
        '    <key>123</key>\n' +
        '\n' +
        '    <iv>123</iv>\n' +
        '\n' +
        '</aes>\n' +
        '\n' +
        '如果有大佬知道怎么解决，可以告诉我吗？（吐槽，写php时，用simpleXml真他妈爽，结果在java里用，跟吃了屎一般）\n' +
        '\n' +
        '6.xml对应的类，每个类必须要有一个空的构造函数，或者不写构造函数用默认的，否则反序列化（也就是获得第1点里的那个?）会报错，找不到构造函数。',
    blogDate: '2019-08-09 15:14:48'
}