module.exports = {
    blogId: 2,
    blogTitle: '我即将出生的儿子的爸爸是我即将出生的儿子？(记一次Security的无限递归错误)',
    blogContent: 'spring security的默认设置已经足够强大，可以完成绝大部分的需求了。但是仍有许多细微的地方无法使用默认设置或者是简单设置来修改。这次我就在自定义设置的时候遇到了一个比较有趣的问题。\n' +
        '\n' +
        '首先说我的需求，使用security做授权的时候，直接设置一个`UserDetailsService`到容器中就可以实现用户名/密码方式的授权了。但是有个问题，当用户不存在时，在`UserDetailsService#loadUserByUsername`中抛出`UsernameNotFoundException`的异常，但是返回的结果中却没有用户不存在的错误信息。这个原因就是`DaoAuthenticationProvider`的父类`AbstractUserDetailsAuthenticationProvider`中，会根据成员变量hideUserNotFoundExceptions的值将`UsernameNotFoundException`转换成`BadCredentialsException`。如果需要返回用户不存在的错误，则必须要把这个变量设置为`false`。\n' +
        '\n' +
        '然而用来授权用户名/密码方式的`DaoAuthenticationProvider`是在`InitializeUserDetailsBeanManagerConfigurer$InitializeUserDetailsManagerConfigurer#configure`中生成的，这个方法找到容器中唯一的`UserDetailsService`，然后生成了`DaoAuthenticationProvider`加入到了`AuthenticationManagerBuilder`中，最后在生成过滤器链时生成`ProviderManager`。这之间没有办法去得到这个`DaoAuthenticationProvider`并设置上`hideUserNotFoundExceptions=false`。\n' +
        '\n' +
        '于是，我只能不给我实现的`UserDetailsService`加上@Bean标签，不让框架自动生成`DaoAuthenticationProvider`，使用手动生成并配置的方式。\n' +
        '\n' +
        '于是我在之前写的`WebSecurityConfigurerAdapter`的子类的`configure(HttpSecurity http)`中，配置上了自己生成的`AuthenticationProvider`。\n' +
        '\n' +
        '```java\n' +
        '@Configuration\n' +
        '@EnableWebSecurity\n' +
        'public class SecurityConfig extends WebSecurityConfigurerAdapter {\n' +
        '\n' +
        '    @Bean\n' +
        '    public PasswordEncoder passwordEncoder() {\n' +
        '        return new BCryptPasswordEncoder();\n' +
        '    }\n' +
        '\n' +
        '    @Bean\n' +
        '    @Override\n' +
        '    public AuthenticationManager authenticationManagerBean() throws Exception {\n' +
        '        return super.authenticationManagerBean();\n' +
        '    }\n' +
        '    \n' +
        '    @Autowired\n' +
        '    private UserMapper userMapper;\n' +
        '\n' +
        '    private AuthenticationProvider daoAuthenticationProvider() {\n' +
        '        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();\n' +
        '        provider.setUserDetailsService(new UserServiceImpl(userMapper));\n' +
        '        provider.setPasswordEncoder(passwordEncoder());\n' +
        '        provider.setHideUserNotFoundExceptions(false);\n' +
        '        return provider;\n' +
        '    }\n' +
        '    \n' +
        '    @Override\n' +
        '    protected void configure(HttpSecurity http) throws Exception {\n' +
        '        http.authenticationProvider(daoAuthenticationProvider());\n' +
        '        http.csrf()\n' +
        '                .disable()\n' +
        '                .authorizeRequests()\n' +
        '                .antMatchers("/oauth/**", "/actuator/**")\n' +
        '                .permitAll()\n' +
        '                .anyRequest()\n' +
        '                .authenticated();\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '运行，调试发送请求，进入到了我写的`UserDetailsService`中，看来的确配置上去了。这时问题就出现了，放行之后，postman一直没有返回结果，我想应该不是数据库请求卡住了啊。重新加上断点，居然又停到了断点上，放行，又停到了断点上。坏了，这时一直在死循环调用了。\n' +
        '\n' +
        '强行停下项目防止OOM，重新调试，一步一步调试，看是哪里导致了死循环。最终定位到了`ProviderManager#authenticate`。\n' +
        '\n' +
        '```java\n' +
        '\tfor (AuthenticationProvider provider : getProviders()) {\n' +
        '\t\tif (!provider.supports(toTest)) {\n' +
        '\t\t\tcontinue;\n' +
        '\t\t}\n' +
        '\n' +
        '\t\ttry {\n' +
        '\t\t\tresult = provider.authenticate(authentication);\n' +
        '\t\t}\n' +
        '\t\tcatch (AccountStatusException | InternalAuthenticationServiceException e) {\n' +
        '\t\t\tthrow e;\n' +
        '\t\t} catch (AuthenticationException e) {\n' +
        '\t\t\t// UsernameNotFoundException在这里被catch住\n' +
        '\t\t\tlastException = e;\n' +
        '\t\t}\n' +
        '\t}\n' +
        '\n' +
        '\tif (result == null && parent != null) {\n' +
        '\t\t// 省略了try catch部分\n' +
        '\t\tresult = parentResult = parent.authenticate(authentication);\n' +
        '\t}\n' +
        '```\n' +
        '\n' +
        '在调用了所有的getProviders()的authenticate后，因为用户不存在的异常被catch住了，并没有继续抛下去，这时得到的结果`result`就为`null`，然后继续运行到192行，判断是否有`parent`，如果有就调用`parent`的`authenticate`尝试获取结果，但我调试进去发现，这个`parent`的`authenticate`就是当前`ProviderManager`的`authenticate`，原来这个parent指代的就是自己，然后就一直递归调用自己，自然就出不来了。\n' +
        '\n' +
        '找到原因了，接下来就要找为什么会出现自己的parent是自己的这种神奇现象。\n' +
        '\n' +
        '这里跳过源码的分析，定位到所有可能出现问题的地方。下面这些地方就是和生成`AuthenticationManager`有关的代码。\n' +
        '首先是`WebSecurityConfigurerAdapter#getHttp()`方法，这是获取配置类要生成的`HttpSecurity`的方法。在201行到203行，有如下代码：\n' +
        '\n' +
        '```java\n' +
        'AuthenticationManager authenticationManager = authenticationManager();\n' +
        'authenticationBuilder.parentAuthenticationManager(authenticationManager);\n' +
        'authenticationBuilder.authenticationEventPublisher(eventPublisher);\n' +
        '```\n' +
        '\n' +
        '可以看到，正是在这里设置上了即将由`authenticationBuilder`构建的`AuthenticationManager`的父亲。那么肯定就是这里出了问题，但是这是怎么设置上自己的父亲是自己的呢？\n' +
        '点进获取父亲的方法`authenticationManager()`中：\n' +
        '\n' +
        '```java\n' +
        'protected AuthenticationManager authenticationManager() throws Exception {\n' +
        '\tif (!authenticationManagerInitialized) {\n' +
        '\t\tconfigure(localConfigureAuthenticationBldr);\n' +
        '\t\tif (disableLocalConfigureAuthenticationBldr) {\n' +
        '\t\t\tauthenticationManager = authenticationConfiguration\n' +
        '\t\t\t\t\t.getAuthenticationManager();\n' +
        '\t\t}\n' +
        '\t\telse {\n' +
        '\t\t\tauthenticationManager = localConfigureAuthenticationBldr.build();\n' +
        '\t\t}\n' +
        '\t\tauthenticationManagerInitialized = true;\n' +
        '\t}\n' +
        '\treturn authenticationManager;\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '看到这里有两种获取父亲的方法，使用哪个取决于`disableLocalConfigureAuthenticationBldr`的值，我们使用调试的方式走到这里来。\n' +
        '\n' +
        '> 注意，如果要做为授权服务器使用，会使用`@EnableAuthorizationServer`，这样会导入一个`AuthorizationServerSecurityConfiguration`，这个类继承`WebSecurityConfigurerAdapter`，就是这个类里有`getHttp()`方法，同时还有一个我们自己写的继承`WebSecurityConfigurerAdapter`的类，所以一共会有执行两个`getHttp()`方法，需要调试的是我们自己继承的类的`getHttp()`方法。\n' +
        '\n' +
        '发现`configure(localConfigureAuthenticationBldr)`这个方法将disableLocalConfigureAuthenticationBldr 设置为true了：`this.disableLocalConfigureAuthenticationBldr = true;`\n' +
        '\n' +
        '于是必然进入的就是`authenticationConfiguration.getAuthenticationManager();`这个方法来获取父亲`AuthenticationManager`，点进这个方法：\n' +
        '\n' +
        '```java\n' +
        'public AuthenticationManager getAuthenticationManager() throws Exception {\n' +
        '\tif (this.authenticationManagerInitialized) {\n' +
        '\t\treturn this.authenticationManager;\n' +
        '\t}\n' +
        '\tAuthenticationManagerBuilder authBuilder = this.applicationContext.getBean(AuthenticationManagerBuilder.class);\n' +
        '\tif (this.buildingAuthenticationManager.getAndSet(true)) {\n' +
        '\t\treturn new AuthenticationManagerDelegator(authBuilder);\n' +
        '\t}\n' +
        '\n' +
        '\tfor (GlobalAuthenticationConfigurerAdapter config : globalAuthConfigurers) {\n' +
        '\t\tauthBuilder.apply(config);\n' +
        '\t}\n' +
        '\n' +
        '\tauthenticationManager = authBuilder.build();\n' +
        '\n' +
        '\tif (authenticationManager == null) {\n' +
        '\t\tauthenticationManager = getAuthenticationManagerBean();\n' +
        '\t}\n' +
        '\n' +
        '\tthis.authenticationManagerInitialized = true;\n' +
        '\treturn authenticationManager;\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '发现它首先从容器中拿出了一个`AuthenticationManagerBuilder`，然后用`GlobalAuthenticationConfigurerAdapter`给这个builder配置了些什么，最后调用`build()`方法构建出了需要的manager。而这些`GlobalAuthenticationConfigurerAdapter`一共有5个\n' +
        '- `EnableGlobalAuthenticationAutowiredConfigurer`\n' +
        '- `InitializeAuthenticationProviderBeanManagerConfigurer`\n' +
        '- `InitializeUserDetailsManagerConfigurer`\n' +
        '- `InitializeUserDetailsBeanManagerConfigurer`\n' +
        '- `InitializeUserDetailsManagerConfigurer`\n' +
        '\n' +
        '其中，第1个什么都没干，第2个的`init()`把第3个配置了进去，第4个的`init()`把第5个配置了进去，所以最后调用的就是第3个和第5个的`configure()`方法。\n' +
        '\n' +
        '第3个`InitializeUserDetailsManagerConfigurer`的`configure()`将在容器中只能唯一的`AuthenticationProvider `添加了进去：\n' +
        '\n' +
        '```java\n' +
        'public void configure(AuthenticationManagerBuilder auth) {\n' +
        '\tif (auth.isConfigured()) {\n' +
        '\t\treturn;\n' +
        '\t}\n' +
        '\tAuthenticationProvider authenticationProvider = getBeanOrNull(\n' +
        '\t\t\tAuthenticationProvider.class);\n' +
        '\tif (authenticationProvider == null) {\n' +
        '\t\treturn;\n' +
        '\t}\n' +
        '\n' +
        '\tauth.authenticationProvider(authenticationProvider);\n' +
        '}\n' +
        '\n' +
        'private <T> T getBeanOrNull(Class<T> type) {\n' +
        '\tString[] userDetailsBeanNames = InitializeAuthenticationProviderBeanManagerConfigurer.this.context\n' +
        '\t\t\t.getBeanNamesForType(type);\n' +
        '\tif (userDetailsBeanNames.length != 1) {\n' +
        '\t\treturn null;\n' +
        '\t}\n' +
        '\n' +
        '\treturn InitializeAuthenticationProviderBeanManagerConfigurer.this.context\n' +
        '\t\t\t.getBean(userDetailsBeanNames[0], type);\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '第5个`InitializeUserDetailsManagerConfigurer`的`configure()`获取了在容器中只能唯一的`UserDetailsService`创建了一个新的`DaoAuthenticationProvider`添加了进去：\n' +
        '\n' +
        '```java\n' +
        'public void configure(AuthenticationManagerBuilder auth) throws Exception {\n' +
        '\tif (auth.isConfigured()) {\n' +
        '\t\treturn;\n' +
        '\t}\n' +
        '\tUserDetailsService userDetailsService = getBeanOrNull(\n' +
        '\t\t\tUserDetailsService.class);\n' +
        '\tif (userDetailsService == null) {\n' +
        '\t\treturn;\n' +
        '\t}\n' +
        '\n' +
        '\tPasswordEncoder passwordEncoder = getBeanOrNull(PasswordEncoder.class);\n' +
        '\tUserDetailsPasswordService passwordManager = getBeanOrNull(UserDetailsPasswordService.class);\n' +
        '\n' +
        '\tDaoAuthenticationProvider provider = new DaoAuthenticationProvider();\n' +
        '\tprovider.setUserDetailsService(userDetailsService);\n' +
        '\tif (passwordEncoder != null) {\n' +
        '\t\tprovider.setPasswordEncoder(passwordEncoder);\n' +
        '\t}\n' +
        '\tif (passwordManager != null) {\n' +
        '\t\tprovider.setUserDetailsPasswordService(passwordManager);\n' +
        '\t}\n' +
        '\tprovider.afterPropertiesSet();\n' +
        '\n' +
        '\tauth.authenticationProvider(provider);\n' +
        '}\n' +
        '\n' +
        '/**\n' +
        ' * @return a bean of the requested class if there\'s just a single registered component, null otherwise.\n' +
        ' */\n' +
        'private <T> T getBeanOrNull(Class<T> type) {\n' +
        '\tString[] userDetailsBeanNames = InitializeUserDetailsBeanManagerConfigurer.this.context\n' +
        '\t\t\t.getBeanNamesForType(type);\n' +
        '\tif (userDetailsBeanNames.length != 1) {\n' +
        '\t\treturn null;\n' +
        '\t}\n' +
        '\n' +
        '\treturn InitializeUserDetailsBeanManagerConfigurer.this.context\n' +
        '\t\t\t.getBean(userDetailsBeanNames[0], type);\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '然而我并没有在容器中添加`AuthenticationProvider`和`UserDetailsService`，所以都不会添加任何`AuthenticationProvider`进去。\n' +
        '\n' +
        '于是`authBuilder.build()`会返回`null`，这就会调用`getAuthenticationManagerBean()`来做最后的获取了。\n' +
        '\n' +
        '点进这个方法（删掉了无关代码）：\n' +
        '\n' +
        '```java\n' +
        'private AuthenticationManager getAuthenticationManagerBean() {\n' +
        '\treturn lazyBean(AuthenticationManager.class);\n' +
        '}\n' +
        '\n' +
        'private <T> T lazyBean(Class<T> interfaceName) {\n' +
        '\tLazyInitTargetSource lazyTargetSource = new LazyInitTargetSource();\n' +
        '\tString[] beanNamesForType = BeanFactoryUtils.beanNamesForTypeIncludingAncestors(\n' +
        '\t\t\tapplicationContext, interfaceName);\n' +
        '\tif (beanNamesForType.length == 0) {\n' +
        '\t\treturn null;\n' +
        '\t}\n' +
        '\tString beanName;\n' +
        '\tif (beanNamesForType.length > 1) {\n' +
        '\t\tList<String> primaryBeanNames = getPrimaryBeanNames(beanNamesForType);\n' +
        '\n' +
        '\t\tbeanName = primaryBeanNames.get(0);\n' +
        '\t} else {\n' +
        '\t\tbeanName = beanNamesForType[0];\n' +
        '\t}\n' +
        '\n' +
        '\tlazyTargetSource.setTargetBeanName(beanName);\n' +
        '\tlazyTargetSource.setBeanFactory(applicationContext);\n' +
        '\tProxyFactoryBean proxyFactory = new ProxyFactoryBean();\n' +
        '\tproxyFactory = objectPostProcessor.postProcess(proxyFactory);\n' +
        '\tproxyFactory.setTargetSource(lazyTargetSource);\n' +
        '\treturn (T) proxyFactory.getObject();\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '发现是使用代理来实现了懒加载，在第一次调用方法的时候才会从容器中获取到`AuthenticationManager`的实例。\n' +
        '\n' +
        '好了，现在我知道这个父亲是谁了，就是最终在容器中的`AuthenticationManager`，那么它在哪了，它其实就在我继承的`WebSecurityConfigurerAdapter`中：\n' +
        '\n' +
        '```java\n' +
        '@Bean\n' +
        '@Override\n' +
        'public AuthenticationManager authenticationManagerBean() throws Exception {\n' +
        '    return super.authenticationManagerBean();\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '这个方法调用了父类的方法，点进父类的方法查看：\n' +
        '\n' +
        '```java\n' +
        'public AuthenticationManager authenticationManagerBean() throws Exception {\n' +
        '\treturn new AuthenticationManagerDelegator(authenticationBuilder, context);\n' +
        '}\n' +
        '\n' +
        'static final class AuthenticationManagerDelegator implements AuthenticationManager {\n' +
        '\tprivate AuthenticationManagerBuilder delegateBuilder;\n' +
        '\tprivate AuthenticationManager delegate;\n' +
        '\tprivate final Object delegateMonitor = new Object();\n' +
        '\tprivate Set<String> beanNames;\n' +
        '\n' +
        '\tAuthenticationManagerDelegator(AuthenticationManagerBuilder delegateBuilder,\n' +
        '\t\t\tApplicationContext context) {\n' +
        '\t\t...\n' +
        '\t\tthis.delegateBuilder = delegateBuilder;\n' +
        '\t}\n' +
        '\n' +
        '\tpublic Authentication authenticate(Authentication authentication)\n' +
        '\t\t\tthrows AuthenticationException {\n' +
        '\t\tif (delegate != null) {\n' +
        '\t\t\treturn delegate.authenticate(authentication);\n' +
        '\t\t}\n' +
        '\n' +
        '\t\tsynchronized (delegateMonitor) {\n' +
        '\t\t\tif (delegate == null) {\n' +
        '\t\t\t\tdelegate = this.delegateBuilder.getObject();\n' +
        '\t\t\t\tthis.delegateBuilder = null;\n' +
        '\t\t\t}\n' +
        '\t\t}\n' +
        '\n' +
        '\t\treturn delegate.authenticate(authentication);\n' +
        '\t}\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '这个类是个委托类，将`authenticate()`方法委托给了保存的`AuthenticationManagerBuilder`将来构建的`AuthenticationManager`，而这个`AuthenticationManagerBuilder`正是一开始的那个构建器，也就是说，我给这个构建器设置了个父亲，这个父亲是这个构建器将来要构建出来的管理器，简单点说，就是我给将来要出生的儿子找了个父亲，这个父亲就是我将来要出生的儿子，那着不就炸了，无限递归循环的原因也就找到了。\n' +
        '\n' +
        '既然找到了原因：就是这神奇的懒加载导致了这一出闹剧。那么要怎么阻止这种事情发生呢？可以有两种办法：\n' +
        '第一：我们让得到父亲的方法使用另外一个，也就是说让`disableLocalConfigureAuthenticationBldr`的值为`false`，这可以通过重写`configure(AuthenticationManagerBuilder auth)`方法实现，只要使用一个空方法就能使`disableLocalConfigureAuthenticationBldr`变成初始默认值`false`。\n' +
        '第二：也是重写`configure(AuthenticationManagerBuilder auth)`方法，这个方法也会传一个构造器，这个构造器就是在`disableLocalConfigureAuthenticationBldr`为`false`时生成父亲的，我们改成在这个方法上添加自建的`DaoAuthenticationProvider`，让它成为父亲即可，儿子就不存在了。\n' +
        '\n' +
        '最终，我选择使用第一种方案解决问题，重写了`configure(AuthenticationManagerBuilder auth)`，最终的继承类就如下：\n' +
        '\n' +
        '```java\n' +
        '@Configuration\n' +
        '@EnableWebSecurity\n' +
        'public class SecurityConfig extends WebSecurityConfigurerAdapter {\n' +
        '\n' +
        '    @Bean\n' +
        '    public PasswordEncoder passwordEncoder() {\n' +
        '        return new BCryptPasswordEncoder();\n' +
        '    }\n' +
        '\n' +
        '    @Bean\n' +
        '    @Override\n' +
        '    public AuthenticationManager authenticationManagerBean() throws Exception {\n' +
        '        return super.authenticationManagerBean();\n' +
        '    }\n' +
        '    \n' +
        '    @Autowired\n' +
        '    private UserMapper userMapper;\n' +
        '\n' +
        '    private AuthenticationProvider daoAuthenticationProvider() {\n' +
        '        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();\n' +
        '        provider.setUserDetailsService(new UserServiceImpl(userMapper));\n' +
        '        provider.setPasswordEncoder(passwordEncoder());\n' +
        '        provider.setHideUserNotFoundExceptions(false);\n' +
        '        return provider;\n' +
        '    }\n' +
        '    \n' +
        '\t@Override\n' +
        '    protected void configure(AuthenticationManagerBuilder auth) throws Exception {\n' +
        '        // 覆盖父类方法，使得this.disableLocalConfigureAuthenticationBldr = false\n' +
        '        // 否则，authenticationBuilder会设置parentAuthenticationManager为自己即将生成的AuthenticationManager\n' +
        '        // 一旦出现错误就会递归调用导致OOM\n' +
        '    }\n' +
        '    \n' +
        '    @Override\n' +
        '    protected void configure(HttpSecurity http) throws Exception {\n' +
        '        http.authenticationProvider(daoAuthenticationProvider());\n' +
        '        http.csrf()\n' +
        '                .disable()\n' +
        '                .authorizeRequests()\n' +
        '                .antMatchers("/oauth/**", "/actuator/**")\n' +
        '                .permitAll()\n' +
        '                .anyRequest()\n' +
        '                .authenticated();\n' +
        '    }\n' +
        '}\n' +
        '```\n' +
        '\n' +
        '再次调试，成功的返回了用户不存在的错误信息了。\n' +
        '\n' +
        '```json\n' +
        '{\n' +
        '    "error": "unauthorized",\n' +
        '    "error_description": "用户名或密码错误"\n' +
        '}\n' +
        '```',
    blogDate: '2020-07-23 02:49:48'
}