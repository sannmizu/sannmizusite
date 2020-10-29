module.exports = {
    blogId: 10,
    blogTitle: 'OpenFeign学习笔记',
    blogContent: '# OpenFeign\n' +
        '\n' +
        '[TOC]\n' +
        '\n' +
        '## 简介\n' +
        '\n' +
        'Feign是一个声明式Web Service客户端，它使得客户端调用服务端的服务更加的方便简单：只需要定义一个接口，然后在上面添加注解指明调用的服务就行了；OpenFeign是Feign的增强。\n' +
        'Feign也可以和Eureka还有Ribbon组合使用来做到负载均衡。\n' +
        '\n' +
        '[中文文档网站]: https://www.bookstack.cn/read/spring-cloud-docs/docs-user-guide-feign.md\n' +
        '[英文文档网站]:  https://cloud.spring.io/spring-cloud-static/spring-cloud-openfeign/2.2.1.RELEASE/reference/html/\n' +
        '\n' +
        '[项目地址]:https://github.com/spring-cloud/spring-cloud-openfeign\n' +
        '\n' +
        '\n' +
        '\n' +
        '## 快速起步\n' +
        '\n' +
        '**通过下面的步骤，来实现一个带有负载均衡的Feign微服务客户端。**\n' +
        '\n' +
        '### 1、修改POM文件\n' +
        '\n' +
        '```xml\n' +
        '<!-- 使用openfeign要加入的依赖包 -->\n' +
        '<dependency>\n' +
        '    <groupId>org.springframework.cloud</groupId>\n' +
        '    <artifactId>spring-cloud-starter-openfeign</artifactId>\n' +
        '</dependency>\n' +
        '<!-- 如果要实现微服务和负载均衡，要加入eureka client包 -->\n' +
        '<dependency>\n' +
        '    <groupId>org.springframework.cloud</groupId>\n' +
        '    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>\n' +
        '</dependency>\n' +
        '```\n' +
        '\n' +
        '### 2、修改配置文件\n' +
        '\n' +
        '```yml\n' +
        '#这些都是eureka的配置\n' +
        'server:\n' +
        '  port: 80\n' +
        '\n' +
        'eureka:\n' +
        '  client:\n' +
        '    register-with-eureka: false\n' +
        '    service-url:\n' +
        '      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/\n' +
        '```\n' +
        '\n' +
        '### 3、修改启动类\n' +
        '\n' +
        '启动类上使用注解`@EnableFeignClients`开启Feign\n' +
        '\n' +
        '```java\n' +
        '@SpringBootApplication\n' +
        '@EnableFeignClients\t// 启动类上面加入注解@EnableFeignClients开启Feign\n' +
        'public class OrderFeignMain80 {\n' +
        '    public static void main(String[] args) {\n' +
        '        SpringApplication.run(OrderFeignMain80.class, args);\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '### 4、创建服务调用接口\n' +
        '\n' +
        '为每一个服务端定义一个调用服务的接口，用注解`@FeignClient`指明这个Feign根据这个接口实现调用的方法，`value`值设置微服务的名称，不使用微服务也可用`url`值设置服务地址。\n' +
        '\n' +
        '```java\n' +
        '@Component\n' +
        '@FeignClient(value = "CLOUD-PAYMENT-SERVICE") // value值为Eureka中的微服务名\n' +
        '// @FeignClient(url = "www.baidu.com") // 或者用url属性指明服务的url\n' +
        'public interface IPaymentFeignService {\n' +
        '    @GetMapping(value = "/payment/get/{id}") // 和服务端的GetMapping一样一样的\n' +
        '    CommonResult<Payment> getPaymentById(@PathVariable("id") Long id);\n' +
        '\n' +
        '    @GetMapping(value = "/payment/feign/timeout")\n' +
        '    String paymentFeignTimeout();\n' +
        '}\n' +
        '```\n' +
        '\n' +
        'Feign会创建一个接口的实现放在容器中。\n' +
        '\n' +
        '### 5、使用Feign生成的实例\n' +
        '\n' +
        '```java\n' +
        '@RestController\n' +
        'public class OrderFeignController {\n' +
        '    @Resource\n' +
        '    private IPaymentFeignService paymentFeignService;\n' +
        '\n' +
        '    @GetMapping(value = "/consumer/payment/get/{id}")\n' +
        '    public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id) {\n' +
        '        /* 事务处理逻辑代码 */\n' +
        '        return paymentFeignService.getPaymentById(id);\n' +
        '    }\n' +
        '\n' +
        '    @GetMapping(value = "/consumer/payment/feign/timeout")\n' +
        '    public String paymentFeignTimeout() {\n' +
        '        /* 事务处理逻辑代码 */\n' +
        '        return paymentFeignService.paymentFeignTimeout();\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '从容器中获得实例后就可以直接调用方法了，这就可以直接去调用服务端的接口，而且还实现了负载均衡。\n' +
        '\n' +
        '-----\n' +
        '\n' +
        '## 更多内容\n' +
        '\n' +
        '### 超时控制\n' +
        '\n' +
        '直接在配置文件中设置即可\n' +
        '\n' +
        '```yaml\n' +
        '#设置feign客户端超时时间(OpenFeign默认支持ribbon)\n' +
        'ribbon:\n' +
        '  #指的是建立连接所用的时间，适用于网络状况正常的情况下,两端连接所用的时间\n' +
        '  ReadTimeout: 5000\n' +
        '  #指的是建立连接后从服务器读取到可用资源所用的时间\n' +
        '  ConnectTimeout: 5000\n' +
        '```\n' +
        '\n' +
        '### 覆盖Feign的默认配置\n' +
        '\n' +
        '默认情况下，Feign使用`FeignClientsConfiguration`对所有`@FeignClient`进行配置。\n' +
        '可以通过通过`configuration`属性来完全控制Feign的配置信息，这些配置比`FeignClientsConfiguration`优先级要高：\n' +
        '\n' +
        '```java\n' +
        '@FeignClient(name = "stores", configuration = FooConfiguration.class)\n' +
        'public interface StoreClient {\n' +
        '    //..\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '在这个例子中，`FooConfiguration`中的配置信息会覆盖掉`FeignClientsConfiguration`中对应的配置。\n' +
        '\n' +
        '> 注意：`FooConfiguration`虽然是个配置类，但是它不应该被主上下文(`ApplicationContext`)扫描到，否则该类中的配置信息就会被应用于所有的`@FeignClient`客户端(本例中`FooConfiguration`中的配置应该只对`StoreClient`起作用)。\n' +
        '>\n' +
        '> 注意：`serviceId`属性已经被弃用了，取而代之的是`name`属性。\n' +
        '>\n' +
        '> 在先前的版本中在指定了`url`属性时`name`是可选属性，现在无论什么时候`name`都是必填属性。\n' +
        '\n' +
        '`name`和`url`属性也支持占位符：\n' +
        '\n' +
        '```java\n' +
        '@FeignClient(name = "${feign.name}", url = "${feign.url}")\n' +
        'public interface StoreClient {\n' +
        '    //..\n' +
        '}\n' +
        '```\n' +
        '\n' +
        'Spring Cloud Netflix为Feign提供了以下默认的配置Bean：(下面最左侧是Bean的类型，中间是Bean的name, 右侧是类名)\n' +
        '\n' +
        '- `Decoder` feignDecoder: `ResponseEntityDecoder`(这是对`SpringDecoder`的封装)\n' +
        '- `Encoder` feignEncoder: `SpringEncoder`\n' +
        '- `Logger` feignLogger: `Slf4jLogger`\n' +
        '- `Contract` feignContract: `SpringMvcContract`\n' +
        '- `Feign.Builder` feignBuilder: `HystrixFeign.Builder`\n' +
        '\n' +
        '下列Bean默认情况下Spring Cloud Netflix并没有提供，但是在应用启动时依然会从上下文中查找这些Bean来构造客户端对象：\n' +
        '\n' +
        '- `Logger.Level`\n' +
        '- `Retryer`\n' +
        '- `ErrorDecoder`\n' +
        '- `Request.Options`\n' +
        '- `Collection`\n' +
        '\n' +
        '如果想要覆盖Spring Cloud Netflix提供的默认配置Bean, 需要在`@FeignClient`的`configuration`属性中指定一个配置类，并提供想要覆盖的Bean即可：\n' +
        '\n' +
        '```java\n' +
        '@Configuration\n' +
        'public class FooConfiguration {\n' +
        '    @Bean\n' +
        '    public Contract feignContract() {\n' +
        '        return new feign.Contract.Default();\n' +
        '    }\n' +
        '    @Bean\n' +
        '    public BasicAuthRequestInterceptor basicAuthRequestInterceptor() {\n' +
        '        return new BasicAuthRequestInterceptor("user", "password");\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '本例子中，我们用`feign.Contract.Default`代替了`SpringMvcContract`, 并添加了一个`RequestInterceptor`。以这种方式做的配置会在所有的`@FeignClient`中生效。\n' +
        '\n' +
        '### Feign的日志\n' +
        '\n' +
        '​\t每一个`@FeignClient`都会创建一个`Logger`, `Logger`的名字就是接口的全限定名。Feign的日志配置参数仅支持`DEBUG`：(配置文件中设置每个接口的是否使用日志)\n' +
        '\n' +
        '```yaml\n' +
        'logging:\n' +
        '  level:\n' +
        '    # feign日志以什么级别监控哪个接口：接口的全限定类名\n' +
        '    com.atguigu.springcloud.service.IPaymentFeignService: debug\n' +
        '```\n' +
        '\n' +
        '然后可以配置`Logger.Level`来指定日志级别：\n' +
        '\n' +
        '- `NONE`, 不记录任何信息，默认值。\n' +
        '- `BASIC`, 记录请求方法、请求URL、状态码和用时。\n' +
        '- `HEADERS`, 在`BASIC`的基础上再记录一些常用信息。\n' +
        '- `FULL`: 记录请求和响应报文的全部内容。\n' +
        '\n' +
        '```java\n' +
        '// 可以通过配置类的方式配置\n' +
        '@Configuration\n' +
        'public class FeignConfig\n' +
        '{\n' +
        '    @Bean\n' +
        '    Logger.Level feignLoggerLevel() {\n' +
        '        return Logger.Level.FULL;\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '### Feign对Hystrix的支持\n' +
        '\n' +
        '​\tpom文件中首先要加入Hystrix的依赖包：\n' +
        '\n' +
        '```xml\n' +
        '<!--hystrix-->\n' +
        '<dependency>\n' +
        '  <groupId>org.springframework.cloud</groupId>\n' +
        '  <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>\n' +
        '</dependency>\n' +
        '```\n' +
        '\n' +
        '​\tHystrix是用来实现服务熔断，服务降级，服务限流的。\n' +
        '​\t如果Hystrix在classpath中，Feign会默认将所有方法都封装到断路器中。\n' +
        '​\t~~将`feign.hystrix.enabled=false`参数设为`false`可以关闭对Hystrix的支持。~~\n' +
        '\n' +
        '最新的openfeign默认值为false了，需要打开才能支持\n' +
        '\n' +
        '```yml\n' +
        'feign:\n' +
        '  hystrix:\n' +
        '    enabled: true\n' +
        '```\n' +
        '\n' +
        '### Feign对Hystrix Fallback的支持\n' +
        '\n' +
        '​\t通过设置`@FeignClient`的`fallback`属性，可以实现发生熔断或者错误时执行默认的返回方法，从而实现服务降级：\n' +
        '\n' +
        '***IPaymentHystrixService.java***\n' +
        '\n' +
        '```java\n' +
        '@Component\n' +
        '@FeignClient(value = "CLOUD-PROVIDER-HYSTRIX-PAYMENT", fallback = PaymentFallbackServiceImpl.class)\n' +
        'public interface IPaymentHystrixService {\n' +
        '    @GetMapping("/payment/hystrix/ok/{id}")\n' +
        '    public String paymentInfo_OK(@PathVariable("id") Integer id);\n' +
        '\n' +
        '    @GetMapping("/payment/hystrix/timeout/{id}")\n' +
        '    public String paymentInfo_TimeOut(@PathVariable("id") Integer id);\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '***PaymentFallbackServiceImpl.java***\n' +
        '\n' +
        '```java\n' +
        '@Component\n' +
        'public class PaymentFallbackServiceImpl implements IPaymentHystrixService {\n' +
        '    @Override\n' +
        '    public String paymentInfo_OK(Integer id) {\n' +
        '        /* 服务降级逻辑代码 */\n' +
        '        return "---PaymentFallbackServiceImpl fallback paymentInfo_OK";\n' +
        '    }\n' +
        '\n' +
        '    @Override\n' +
        '    public String paymentInfo_TimeOut(Integer id) {\n' +
        '        /* 服务降级逻辑代码 */\n' +
        '        return "---PaymentFallbackServiceImpl fallback paymentInfo_TimeOut";\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '> 注意：Feign对Hystrix Fallback的支持有一个限制：对于返回`com.netflix.hystrix.HystrixCommand`或`rx.Observable`对象的方法，fallback不起作用。\n' +
        '\n' +
        '### Feign对继承的支持\n' +
        '\n' +
        'Feign可以通过Java的接口支持继承。你可以把一些公共的操作放到父接口中，然后定义子接口继承之：\n' +
        '\n' +
        '***UserService.java***\n' +
        '\n' +
        '```java\n' +
        'public interface UserService {\n' +
        '    @RequestMapping(method = RequestMethod.GET, value ="/users/{id}")\n' +
        '    User getUser(@PathVariable("id") long id);\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '***UserResource.java***\n' +
        '\n' +
        '```java\n' +
        '@RestControllerpublic class UserResource implements UserService {\n' +
        '\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '***UserClient.java***\n' +
        '\n' +
        '```java\n' +
        'package project.user;\n' +
        '@FeignClient("users")\n' +
        'public interface UserClient extends UserService {\n' +
        '    \n' +
        '}\n' +
        '```\n' +
        '\n' +
        '> 注意: 在服务的调用端和提供端共用同一个接口定义是不明智的，这会将调用端和提供端的代码紧紧耦合在一起。同时在SpringMVC中会有问题，因为请求参数映射是不能被继承的。\n' +
        '\n' +
        '###　Feign对压缩的支持\n' +
        '\n' +
        '你可能会想要对请求/响应数据进行Gzip压缩，指定以下参数即可：\n' +
        '\n' +
        '```properties\n' +
        'feign.compression.request.enabled=true\n' +
        'feign.compression.response.enabled=true\n' +
        '```\n' +
        '\n' +
        '也可以添加一些更细粒度的配置：\n' +
        '\n' +
        '```properties\n' +
        'feign.compression.request.enabled=true\n' +
        'feign.compression.request.mimetypes=text/xml,application/xml,application/json\n' +
        'feign.compression.request.min-request-size=2048\n' +
        '```\n' +
        '\n' +
        '上面的3个参数可以让你选择对哪种请求进行压缩，并设置一个最小请求大小的阀值。\n' +
        '\n' +
        '-----\n' +
        '\n' +
        '## 功能演示\n' +
        '\n' +
        '### 配置好eureka注册中心和两个服务端微服务\n' +
        '\n' +
        '**==过程略==**\n' +
        '\n' +
        '- 注册中心模块`cloud-eureka-server7001`，端口是**7001**\n' +
        '\n' +
        '- 服务端模块`cloud-provider-payment8001`，端口分别设置为**8001**和**8002**\n' +
        '\n' +
        '**启动成功结果：**\n' +
        '\n' +
        '![运行](images/start.png)\n' +
        '\n' +
        '![](images/配置中心.png)\n' +
        '\n' +
        '**可以看到两个服务端微服务已经注册到注册中心中了。**\n' +
        '\n' +
        '### 启动客户端微服务并调用\n' +
        '\n' +
        '**启动完成后，尝试调用客户端的服务：**\n' +
        '\n' +
        '- 客户端模块`cloud-consumer-feign-order80`，端口是**80**\n' +
        '\n' +
        '```java\n' +
        '@GetMapping(value = "/consumer/payment/get/{id}")\n' +
        'public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id) {\n' +
        '    return paymentFeignService.getPaymentById(id);\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '![](images/调用结果.png)\n' +
        '\n' +
        '**可以看到调用成功了，调用的是8001端口的服务，然后多次调用。**\n' +
        '\n' +
        '![](images/负载均衡.png)\n' +
        '\n' +
        '**8001端口和8002端口轮替使用，负载均衡实现了。**\n' +
        '\n' +
        '### 配置Hystrix实现服务降级\n' +
        '\n' +
        '略\n' +
        '\n' +
        '- Hystrix服务端模块`cloud-provider-hystrix-payment8001`\n' +
        '\n' +
        '- 客户端模块`cloud-consumer-feign-hystrix-order80`\n' +
        '\n',
    blogDate: '2020-06-12 17:34:00'
}