import json

# 读取现有数据
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 获取当前最大ID
max_id = max(item['id'] for item in data)

# 添加新题目
new_questions = [
    {
        "id": max_id + 1,
        "category": "Spring生态",
        "question": "Spring IOC容器的初始化流程？",
        "answer": """【Spring IOC容器初始化流程】

```mermaid
graph TD
    A[Resource定位] --> B[BeanDefinition解析]
    B --> C[BeanDefinition注册]
    C --> D[BeanFactory后置处理]
    D --> E[Bean实例化]
    E --> F[属性填充]
    F --> G[BeanPostProcessor]
    G --> H[初始化方法]
    H --> I[销毁]
    
    style A fill:#e1f5fe
    style E fill:#fff3e0
    style H fill:#c8e6c9
```

【核心流程】

| 阶段 | 说明 |
|:---:|:---|
| Resource定位 | 定位配置文件（XML/注解） |
| BeanDefinition解析 | 解析bean定义 |
| BeanDefinition注册 | 注册到BeanFactory |
| BeanFactory后置处理 | BeanFactoryPostProcessor |
| Bean实例化 | 通过构造器/工厂创建 |
| 属性填充 | 依赖注入 |
| BeanPostProcessor | 后置处理 |
| 初始化方法 | init-method |
| 销毁 | destroy-method |

【BeanFactory vs ApplicationContext】

| 特性 | BeanFactory | ApplicationContext |
|:---:|:---:|:---:|
| 类型 | 基础容器 | 高级容器 |
| 加载时机 | 懒加载 | 预加载 |
| 功能 | 基础功能 | 国际化、事件等 |
| BeanPostProcessor | 手动注册 | 自动注册 |

【ApplicationContext实现类】
- ClassPathXmlApplicationContext
- FileSystemXmlApplicationContext
- AnnotationConfigApplicationContext
- WebApplicationContext""",
        "difficulty": 3
    },
    {
        "id": max_id + 2,
        "category": "Spring生态",
        "question": "Spring Bean的生命周期？",
        "answer": """【Spring Bean生命周期】

```mermaid
graph TD
    A[实例化] --> B[属性填充]
    B --> C[BeanNameAware]
    C --> D[BeanFactoryAware]
    D --> E[ApplicationContextAware]
    E --> F[BeanPostProcessor前置]
    F --> G[初始化方法]
    G --> H[BeanPostProcessor后置]
    H --> I[使用中]
    I --> J[销毁方法]
    
    style A fill:#e1f5fe
    style G fill:#fff3e0
    style J fill:#ffcdd2
```

【生命周期详解】

| 阶段 | 接口/注解 | 说明 |
|:---:|:---:|:---|
| 实例化 | 构造器 | 创建Bean实例 |
| 属性填充 | @Autowired | 依赖注入 |
| Aware注入 | Aware接口 | 注入容器资源 |
| 初始化 | init-method/@PostConstruct | 初始化操作 |
| 销毁 | destroy-method/@PreDestroy | 资源释放 |

【Aware接口】

| 接口 | 注入内容 |
|:---:|:---:|
| BeanNameAware | Bean名称 |
| BeanFactoryAware | BeanFactory |
| ApplicationContextAware | ApplicationContext |
| EnvironmentAware | 环境变量 |
| ResourceLoaderAware | 资源加载器 |

【初始化方法执行顺序】
1. @PostConstruct注解方法
2. InitializingBean接口的afterPropertiesSet()
3. init-method配置的方法

【销毁方法执行顺序】
1. @PreDestroy注解方法
2. DisposableBean接口的destroy()
3. destroy-method配置的方法""",
        "difficulty": 3
    },
    {
        "id": max_id + 3,
        "category": "Spring生态",
        "question": "循环依赖如何解决？三级缓存原理？",
        "answer": """【循环依赖解决机制】

```mermaid
graph TD
    A[A创建Bean] --> B{需要B?}
    B -->|是| C[B创建Bean]
    C --> D{需要A?}
    D -->|是| E[从三级缓存获取A]
    E --> F[提前暴露]
    F --> C
    C --> G[B创建完成]
    G --> A
    A --> H[完成]
    
    style E fill:#fff3e0
    style F fill:#c8e6c9
```

【三级缓存】

| 缓存 | 名称 | 阶段 | 内容 |
|:---:|:---:|:---:|:---|
| 一级 | singletonObjects | 完全创建 | 成品Bean |
| 二级 | earlySingletonObjects | 创建中 | 提前暴露的Bean |
| 三级 | singletonFactories | 创建中 | BeanFactory |

【解决流程】

1. A创建时需要B，暂停A
2. 创建B，需要A
3. 从三级缓存获取A，放到二级缓存
4. B创建完成
5. A继续创建，拿到B
6. A创建完成，放入一级缓存

【循环依赖类型】

| 类型 | 能否解决 | 说明 |
|:---:|:---:|:---|
| 构造器循环依赖 | ❌ | 无法解决 |
| setter循环依赖（单例） | ✅ | 三级缓存解决 |
| prototype循环依赖 | ❌ | 无法解决 |

【解决条件】
- setter注入（非构造器）
- 单例Bean
- 不存在构造器循环依赖""",
        "difficulty": 3
    },
    {
        "id": max_id + 4,
        "category": "Spring生态",
        "question": "Spring AOP的实现原理？JDK动态代理vsCGLIB？",
        "answer": """【Spring AOP核心概念】

```mermaid
graph LR
    A[目标对象] --> B[代理对象]
    B --> C[切面]
    
    C --> C1[前置通知]
    C --> C2[后置通知]
    C --> C3[返回通知]
    C --> C4[异常通知]
    C --> C5[环绕通知]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

| 概念 | 说明 |
|:---:|:---|
| Aspect | 切面类 |
| Join Point | 连接点（方法） |
| Pointcut | 切入点 |
| Advice | 通知（增强逻辑） |
| Weaving | 织入 |

【AOP代理选择】

| 目标类 | 代理方式 |
|:---:|:---:|
| 实现接口 | JDK动态代理 |
| 未实现接口 | CGLIB代理 |
| 配置proxyTargetClass=true | 强制CGLIB |

【JDK vs CGLIB】

| 特性 | JDK动态代理 | CGLIB |
|:---:|:---:|:---:|
| 实现方式 | 实现接口 | 继承类 |
| 性能 | 反射调用 | 字节码生成 |
| 优点 | 无需额外依赖 | 无接口限制 |
| 缺点 | 必须有接口 | 无法代理final |

【注解驱动AOP】

```java
@Aspect
@Component
public class LogAspect {
    
    @Before("execution(* com.example.*.*(..))")
    public void before(JoinPoint jp) {
        System.out.println("方法执行前");
    }
    
    @After("execution(* com.example.*.*(..))")
    public void after(JoinPoint jp) {
        System.out.println("方法执行后");
    }
    
    @Around("execution(* com.example.*.*(..))")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        // 前置
        Object result = pjp.proceed();
        // 后置
        return result;
    }
}
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 5,
        "category": "Spring生态",
        "question": "Spring事务的传播行为？隔离级别？失效场景？",
        "answer": """【事务传播行为】

```mermaid
graph TD
    A[外层事务] --> B{传播行为}
    
    B --> C[REQUIRED]
    B --> D[REQUIRES_NEW]
    B --> E[SUPPORTS]
    B --> F[NOT_SUPPORTED]
    B --> G[MANDATORY]
    B --> H[NEVER]
    B --> I[NESTED]
    
    C -->|有则加入| C1[加入外层事务]
    D -->|有则挂起| D1[创建新事务]
    E -->|有则加入| E1[作为外层事务]
    E -->|无则非事务| E2[非事务执行]
    F -->|有则挂起| F1[非事务执行]
    G --> G1[必须在外层事务中]
    H --> H1[必须不在事务中]
    I --> I1[_savepoint保存点]
    
    style C fill:#e1f5fe
    style D fill:#fff3e0
    style I fill:#c8e6c9
```

【7种传播行为】

| 行为 | 说明 |
|:---:|:---|
| REQUIRED | 有则加入，无则创建（默认） |
| REQUIRES_NEW | 总是创建新事务 |
| SUPPORTS | 有则加入，无则非事务 |
| NOT_SUPPORTED | 有则挂起，非事务执行 |
| MANDATORY | 必须在事务中，否则异常 |
| NEVER | 必须不在事务中，否则异常 |
| NESTED | 嵌套事务，savepoint |

【隔离级别】

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|:---:|:---:|:---:|:---:|
| DEFAULT | - | - | - |
| READ_UNCOMMITTED | ✅ | ✅ | ✅ |
| READ_COMMITTED | ❌ | ✅ | ✅ |
| REPEATABLE_READ | ❌ | ❌ | ✅ |
| SERIALIZABLE | ❌ | ❌ | ❌ |

【事务失效场景】

| 场景 | 说明 |
|:---:|:---|
| 自调用 | this.xxx()不经过代理 |
| 异常被catch | 异常被捕获未抛出 |
| 非public方法 | protected/private不生效 |
| 传播行为不对 | NOT_SUPPORTED等 |
| 父子事务 | 嵌套vs独立 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 6,
        "category": "Spring生态",
        "question": "Spring Boot自动配置原理？@SpringBootApplication？",
        "answer": """【Spring Boot自动配置原理】

```mermaid
graph TD
    A[@SpringBootApplication] --> B[@EnableAutoConfiguration]
    B --> C[spring.factories]
    C --> D[自动配置类]
    D --> E[@Conditional条件]
    E --> F[按需配置]
    
    style A fill:#e1f5fe
    style D fill:#fff3e0
    style F fill:#c8e6c9
```

【@SpringBootApplication】

```java
@SpringBootConfiguration  // @Configuration
@EnableAutoConfiguration  // 启用自动配置
@ComponentScan  // 组件扫描
public @interface SpringBootApplication { }
```

【自动配置流程】

1. @EnableAutoConfiguration启动
2. 读取META-INF/spring.factories
3. 加载AutoConfiguration类
4. @Conditional条件匹配
5. 按需配置Bean

【spring.factories格式】

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\\
org.springframework.boot.autoconfigure.AutoConfiguration,\\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

【@Conditional条件】

| 注解 | 条件 |
|:---:|:---|
| @ConditionalOnClass | 类存在 |
| @ConditionalOnMissingClass | 类不存在 |
| @ConditionalOnBean | Bean存在 |
| @ConditionalOnMissingBean | Bean不存在 |
| @ConditionalOnProperty | 配置属性满足 |
| @ConditionalOnResource | 资源存在 |

【自定义Starter】
1. 创建autoconfigure模块
2. 定义自动配置类
3. 创建spring.factories
4. 打包为starter""",
        "difficulty": 3
    },
    {
        "id": max_id + 7,
        "category": "Spring生态",
        "question": "Spring Boot Starter自定义开发步骤？",
        "answer": """【Spring Boot Starter开发】

```mermaid
graph LR
    A[定义功能] --> B[创建autoconfigure]
    B --> C[创建starter]
    C --> D[spring.factories]
    D --> E[使用者引入]
    
    style A fill:#e1f5fe
    style E fill:#c8e6c9
```

【Starter分类】

| 类型 | 命名 | 示例 |
|:---:|:---:|:---:|
| 官方 | spring-boot-starter-* | spring-boot-starter-web |
| 第三方 | *-spring-boot-starter | mybatis-spring-boot-starter |
| 自定义 | 自定义名称 | custom-spring-boot-starter |

【开发步骤】

1️⃣ 创建autoconfigure模块

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-autoconfigure</artifactId>
    <version>3.2.0</version>
</dependency>
```

2️⃣ 编写自动配置类

```java
@Configuration
@ConditionalOnClass(HelloService.class)
@EnableConfigurationProperties(HelloProperties.class)
public class HelloAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public HelloService helloService() {
        return new HelloService();
    }
}
```

3️⃣ 配置属性类

```java
@ConfigurationProperties(prefix = "hello")
public class HelloProperties {
    private String prefix = "Hello";
    private String suffix = "!";
    // getters/setters
}
```

4️⃣ 注册自动配置

文件：src/main/resources/META-INF/spring.factories
```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\\
com.example.HelloAutoConfiguration
```

5️⃣ 创建starter模块

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>hello-spring-boot-autoconfigure</artifactId>
    </dependency>
</dependencies>
```

【使用方式】

```yaml
hello:
  prefix: Hi
  suffix: ~
```

```java
@Autowired
HelloService helloService;
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 8,
        "category": "Spring生态",
        "question": "Spring MVC的请求处理流程？",
        "answer": """【Spring MVC请求处理流程】

```mermaid
sequenceDiagram
    participant Client as 浏览器
    participant DS as DispatcherServlet
    participant HM as HandlerMapping
    participant HC as HandlerController
    participant MV as ModelAndView
    participant VR as ViewResolver
    
    Client->>DS: 发送请求
    DS->>HM: 查找Handler
    HM-->>DS: 返回Handler
    DS->>HC: 执行Handler
    HC-->>DS: 返回ModelAndView
    DS->>VR: 解析视图
    VR-->>DS: 返回View
    View->>Client: 渲染响应
```

【DispatcherServlet核心组件】

| 组件 | 职责 |
|:---:|:---|
| HandlerMapping | 映射请求到Handler |
| HandlerAdapter | 执行Handler |
| Handler | Controller方法 |
| ViewResolver | 解析视图 |
| MultipartResolver | 文件上传 |
| LocaleResolver | 国际化 |
| ThemeResolver | 主题切换 |

【请求处理流程】

1. DispatcherServlet接收请求
2. HandlerMapping查找Handler
3. HandlerAdapter执行Handler
4. 返回ModelAndView
5. ViewResolver解析视图
6. View渲染视图
7. 响应客户端

【注解驱动】

```java
@Controller
@RequestMapping("/user")
public class UserController {
    
    @GetMapping("/list")
    public String list(Model model) {
        model.addAttribute("users", userService.list());
        return "user/list";
    }
    
    @PostMapping("/save")
    @ResponseBody
    public Result save(@RequestBody User user) {
        userService.save(user);
        return Result.success();
    }
}
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 9,
        "category": "Spring生态",
        "question": "Spring Security的认证和授权流程？",
        "answer": """【Spring Security认证授权流程】

```mermaid
graph TD
    A[请求] --> B[FilterChain]
    B --> C{已认证?}
    C -->|否| D[AuthenticationFilter]
    D --> E[AuthenticationManager]
    E --> F[AuthenticationProvider]
    F --> G[UserDetailsService]
    G --> H[数据库验证]
    H --> I[认证成功]
    I --> J[SecurityContext]
    J --> K[授权检查]
    K --> L[资源访问]
    
    style D fill:#e1f5fe
    style G fill:#fff3e0
    style K fill:#c8e6c9
```

【核心概念】

| 概念 | 说明 |
|:---:|:---|
| Authentication | 认证信息 |
| Authorization | 授权 |
| Principal | 主体（用户） |
| Credential | 凭证（密码） |
| GrantedAuthority | 权限 |

【认证流程】

1. 用户提交用户名密码
2. UsernamePasswordAuthenticationFilter创建Authentication
3. AuthenticationManager调用AuthenticationProvider
4. UserDetailsService加载用户信息
5. 密码比对
6. 设置SecurityContext

【授权流程】

1. FilterSecurityInterceptor拦截
2. 获取认证信息
3. ConfigAttribute获取资源所需权限
4. AccessDecisionManager决策
5. 允许或拒绝

【权限控制】

```java
// 方法级权限
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { }

// 页面级权限
@Secured("ROLE_USER")
public class UserController { }

// 基于表达式
@PreAuthorize("#id == authentication.principal.id")
public User getUser(Long id) { }
```

【OAuth2流程】

```mermaid
graph LR
    A[用户] --> B[授权服务器]
    B --> C[获取授权码]
    C --> D[客户端]
    D --> E[授权服务器]
    E --> F[返回Token]
    F --> D
    D --> G[资源服务器]
    G --> A
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 10,
        "category": "Spring生态",
        "question": "Spring Cloud核心组件？",
        "answer": """【Spring Cloud核心组件】

```mermaid
graph TD
    A[Spring Cloud] --> B[服务注册发现]
    A --> C[负载均衡]
    A --> D[熔断降级]
    A --> E[网关]
    A --> F[配置中心]
    A --> G[服务调用]
    
    B --> B1[Eureka/Nacos]
    C --> C1[Ribbon/LoadBalancer]
    D --> D1[Hystrix/Sentinel]
    E --> E1[Zuul/Gateway]
    F --> F1[Config/Nacos]
    G --> G1[Feign/OpenFeign]
    
    style A fill:#e1f5fe
    style B1 fill:#fff3e0
    style C1 fill:#fff3e0
    style D1 fill:#fff3e0
```

【组件对比】

| 功能 | 组件 | 说明 |
|:---:|:---:|:---|
| 注册发现 | Eureka | AP模式 |
| | Nacos | AP+CP |
| 负载均衡 | Ribbon | 客户端负载 |
| | LoadBalancer | Spring官方 |
| 熔断降级 | Hystrix | 停止维护 |
| | Sentinel | 阿里巴巴 |
| 网关 | Zuul | 阻塞IO |
| | Gateway | 响应式 |
| 配置中心 | Config | Git配置 |
| | Nacos | 配置+发现 |
| 服务调用 | Feign | 声明式HTTP |
| | OpenFeign | Feign升级版 |

【服务调用流程】

```java
// Feign声明式调用
@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping("/user/{id}")
    User getUser(@PathVariable("id") Long id);
}

// 调用
User user = userClient.getUser(1L);
```

【Hystrix降级】

```java
@HystrixCommand(fallbackMethod = "fallback")
public String call() {
    return restTemplate.getForObject(url, String.class);
}

public String fallback() {
    return "降级响应";
}
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 11,
        "category": "Spring生态",
        "question": "Spring Cloud Alibaba Nacos原理？与Eureka对比？",
        "answer": """【Nacos架构】

```mermaid
graph TD
    A[Nacos Client] --> B[Nacos Server]
    B --> C[注册中心]
    B --> D[配置中心]
    
    C --> E[心跳检测]
    C --> F[服务注册]
    C --> G[服务发现]
    
    D --> H[长轮询]
    D --> I[配置推送]
    D --> J[配置版本]
    
    style C fill:#e1f5fe
    style D fill:#fff3e0
```

【Nacos vs Eureka对比】

| 特性 | Nacos | Eureka |
|:---:|:---:|:---:|
| CAP支持 | AP+CP | AP |
| 配置中心 | ✅ | ❌ |
| 模式切换 | 支持 | 不支持 |
| 部署 | 单机/集群 | 集群 |
| 心跳 | 5秒 | 30秒 |
| 保护机制 | ✅ | ✅ |

【Nacos两种模式】

| 模式 | 说明 | 场景 |
|:---:|:---|:---|
| AP模式 | 最终一致性 | 注册中心 |
| CP模式 | 强一致性 | 配置管理 |

【服务注册发现】

```java
// 服务注册
@EnableDiscoveryClient
@SpringBootApplication
public class ProviderApplication { }

// 服务发现
@LoadBalancer
@Configuration
public class LoadBalancerConfig {
    @Bean
    public ServiceInstanceListSupplier supplier() {
        return ServiceInstanceListSupplier.builder()
            .withDiscoveryClient()
            .build();
    }
}
```

【配置中心】

```java
// 动态刷新
@RefreshScope
@Configuration
public class Config {
    @Value("${config.name}")
    private String name;
}
```

【长轮询机制】

1. 客户端发送请求
2. 服务端hold请求
3. 配置变更或超时返回
4. 客户端立即再次请求
5. 推送变更通知""",
        "difficulty": 3
    },
    {
        "id": max_id + 12,
        "category": "Spring生态",
        "question": "Spring Gateway与Zuul的区别？路由断言和过滤器？",
        "answer": """【Gateway vs Zuul对比】

```mermaid
graph LR
    A[请求] --> B[Zuul 1.x]
    A --> C[Gateway]
    
    B -->|阻塞IO| B1[Servlet]
    C -->|响应式| C1[WebFlux]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

| 特性 | Zuul | Gateway |
|:---:|:---:|:---:|
| 线程模型 | 阻塞 | 非阻塞 |
| 底层 | Servlet | WebFlux |
| 性能 | 较低 | 较高 |
| 维护 | 停止维护 | 活跃 |
| 过滤器 | ZuulFilter | GlobalFilter |
| 动态路由 | 较差 | 支持 |

【Gateway三大核心】

| 概念 | 说明 |
|:---:|:---|
| Route | 路由规则 |
| Predicate | 断言匹配 |
| Filter | 过滤器 |

【路由配置】

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/user/**
          filters:
            - StripPrefix=1
```

【Predicate断言】

```java
// 内置断言
- Path=/user/**
- Method=GET
- Header=X-Request-Id, \\d+
- Query=page, [1-9]+
- After=2024-01-01T00:00:00Z
```

【过滤器类型】

| 类型 | 作用 |
|:---:|:---|
| PRE | 请求前执行 |
| POST | 响应后执行 |
| GLOBAL | 全局过滤器 |

【自定义过滤器】

```java
@Component
public class LogFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, 
                             GatewayFilterChain chain) {
        // 前置逻辑
        System.out.println("请求: " + exchange.getRequest().getURI());
        return chain.filter(exchange)
            .then(Mono.fromRunnable(() -> {
                // 后置逻辑
                System.out.println("响应: " + exchange.getResponse().getStatusCode());
            }));
    }
}
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 13,
        "category": "Spring生态",
        "question": "Spring Bean的作用域？singleton和prototype区别？",
        "answer": """【Spring Bean作用域】

```mermaid
graph TD
    A[Bean作用域] --> B[单例]
    A --> C[原型]
    A --> D[请求]
    A --> E[会话]
    A --> F[应用]
    A --> G[WebSocket]
    
    B --> B1[整个容器一个]
    C --> C1[每次请求创建]
    D --> D2[HTTP请求一个]
    E --> E1[HTTP会话一个]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【5种作用域】

| 作用域 | 说明 | Web环境 |
|:---:|:---|:---:|
| singleton | 单例（默认） | ✅ |
| prototype | 原型 | ✅ |
| request | HTTP请求 | ✅ |
| session | HTTP会话 | ✅ |
| application | ServletContext | ✅ |
| websocket | WebSocket | ✅ |

【singleton vs prototype】

| 特性 | singleton | prototype |
|:---:|:---:|:---:|
| 创建时机 | 容器启动时 | 每次获取时 |
| 销毁 | 容器关闭时 | GC回收 |
| 内存 | 占用少 | 占用多 |
| 线程安全 | 否 | 否 |
| 适用场景 | 无状态Bean | 有状态Bean |

【配置方式】

```java
// 注解方式
@Scope("singleton")
@Component
public class UserService { }

// 原型
@Scope("prototype")
@Component
public class UserService { }

// Web环境
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Component
public class RequestService { }
```

```xml
<!-- XML配置 -->
<bean id="userService" class="com.example.UserService" scope="singleton" />
```

【注意事项】
- prototype Bean不会自动销毁
- 需要手动管理生命周期
- 尽量使用无状态Bean""",
        "difficulty": 2
    },
    {
        "id": max_id + 14,
        "category": "Spring生态",
        "question": "@Autowired和@Resource的区别？",
        "answer": """【@Autowired vs @Resource对比】

```mermaid
graph LR
    A[依赖注入] --> B[@Autowired]
    A --> C[@Resource]
    
    B -->|byType| B1[类型匹配]
    B -->|@Qualifier| B2[名称匹配]
    C -->|byName| C1[名称优先]
    C -->|@Qualifier| C2[类型匹配]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【主要区别】

| 特性 | @Autowired | @Resource |
|:---:|:---:|:---:|
| 来源 | Spring框架 | JSR-250 |
| 匹配方式 | 类型优先 | 名称优先 |
| required属性 | 支持 | 支持 |
| 构造函数 | 支持 | 不支持 |
| 位置 | 字段/方法/构造器 | 字段/方法 |

【匹配流程】

@Autowired:
1. 按类型查找
2. 多个类型 → @Qualifier按名称
3. 找不到 → 报错（默认required=true）

@Resource:
1. 按名称查找（name属性）
2. 找不到 → 按类型查找
3. 多个类型 → @Qualifier

【使用示例】

```java
// @Autowired - 按类型注入
@Autowired
private UserService userService;

// @Autowired + @Qualifier - 按名称注入
@Autowired
@Qualifier("userServiceImpl")
private UserService userService;

// @Resource - 按名称注入
@Resource
private UserService userService;

// @Resource - 指定名称
@Resource(name = "userServiceImpl")
private UserService userService;

// @Autowired - 构造函数
@Autowired
public UserController(UserService userService) {
    this.userService = userService;
}
```

【最佳实践】
- 默认使用@Autowired
- 明确指定Bean使用@Qualifier
- 第三方框架兼容使用@Resource""",
        "difficulty": 2
    },
    {
        "id": max_id + 15,
        "category": "Spring生态",
        "question": "Spring中用到哪些设计模式？",
        "answer": """【Spring设计模式】

```mermaid
graph TD
    A[Spring设计模式] --> B[创建型]
    A --> C[结构型]
    A --> D[行为型]
    
    B --> B1[单例]
    B --> B2[工厂]
    B --> B3[建造者]
    
    C --> C1[代理]
    C --> C2[适配器]
    C --> C3[装饰器]
    
    D --> D1[模板方法]
    D --> D2[观察者]
    D --> D3[策略]
    
    style A fill:#e1f5fe
```

【创建型模式】

| 模式 | Spring应用 |
|:---:|:---|
| 单例模式 | Bean默认单例 |
| 工厂模式 | BeanFactory、ApplicationContext |
| 建造者模式 | BeanDefinitionBuilder |

【结构型模式】

| 模式 | Spring应用 |
|:---:|:---|
| 代理模式 | AOP动态代理 |
| 适配器模式 | HandlerAdapter |
| 装饰器模式 | BufferedInputStream |
| 门面模式 | ApplicationContext |

【行为型模式】

| 模式 | Spring应用 |
|:---:|:---|
| 模板方法 | JdbcTemplate |
| 观察者模式 | 事件机制ApplicationEvent |
| 策略模式 | Resource不同实现 |
| 责任链模式 | FilterChain |

【代码示例】

```java
// 单例 - Bean默认
@Scope("singleton")
@Component
public class UserService { }

// 工厂 - BeanFactory
User user = beanFactory.getBean(User.class);

// 代理 - AOP
UserService proxy = (UserService) 
    Proxy.newProxyInstance(...);

// 模板方法 - JdbcTemplate
jdbcTemplate.query(sql, (rs) -> {
    // 模板方法，子类实现
});

// 观察者 - 事件
applicationContext.publishEvent(new MyEvent());
```""",
        "difficulty": 2
    },
    {
        "id": max_id + 16,
        "category": "Spring生态",
        "question": "Spring事件监听机制？ApplicationEvent？",
        "answer": """【Spring事件机制】

```mermaid
sequenceDiagram
    participant P as 发布者
    participant A as ApplicationEventPublisher
    participant E as ApplicationEventMulticaster
    participant L as Listener
    
    P->>A: 发布事件
    A->>E: 广播事件
    E->>L: 匹配Listener
    L->>L: 处理事件
    L-->>P: 异步回调
```

【事件三要素】

| 要素 | 说明 |
|:---:|:---|
| ApplicationEvent | 事件对象 |
| ApplicationListener | 事件监听器 |
| ApplicationEventPublisher | 事件发布器 |

【自定义事件】

```java
// 1. 定义事件
public class UserRegisterEvent extends ApplicationEvent {
    private String username;
    
    public UserRegisterEvent(Object source, String username) {
        super(source);
        this.username = username;
    }
}

// 2. 定义监听器
@Component
public class UserRegisterListener implements ApplicationListener<UserRegisterEvent> {
    @Override
    public void onApplicationEvent(UserRegisterEvent event) {
        System.out.println("用户注册: " + event.getUsername());
        // 发送邮件、短信等
    }
}

// 3. 发布事件
@Service
public class UserService {
    @Autowired
    private ApplicationEventPublisher publisher;
    
    public void register(String username) {
        // 业务逻辑
        publisher.publishEvent(new UserRegisterEvent(this, username));
    }
}
```

【监听器注册方式】

| 方式 | 说明 |
|:---:|:---|
| @EventListener | 注解方式 |
| ApplicationListener | 接口方式 |
| @Async | 异步处理 |

【@EventListener使用】

```java
@Async  // 异步执行
@EventListener(classes = UserRegisterEvent.class)
public void handleUserRegister(UserRegisterEvent event) {
    // 异步处理
}
```

【事件传播机制】
1. 同步传播：顺序执行所有监听器
2. 异步传播：@Async注解，异步执行""",
        "difficulty": 2
    },
    {
        "id": max_id + 17,
        "category": "Spring生态",
        "question": "Spring Data JPA和MyBatis的区别？",
        "answer": """【JPA vs MyBatis对比】

```mermaid
graph LR
    A[数据访问] --> B[JPA]
    A --> C[MyBatis]
    
    B -->|全自动| B1[ORM映射]
    C -->|半自动| C1[SQL编写]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【核心区别】

| 特性 | JPA | MyBatis |
|:---:|:---:|:---:|
| 模式 | 全自动ORM | 半自动SQL |
| SQL控制 | 不可控 | 完全可控 |
| 学习成本 | 较低 | 较高 |
| 缓存 | 一级/二级 | 一级/二级/自定义 |
| 适用场景 | 简单CRUD | 复杂查询 |

【JPA使用】

```java
// 实体
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    @Column(name = "username")
    private String username;
}

// Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUsername(String username);
    
    @Query("SELECT u FROM User u WHERE u.username = ?1")
    User findByUsernameQuery(String username);
}

// Service
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User save(User user) {
        return userRepository.save(user);
    }
}
```

【MyBatis使用】

```xml
<!-- Mapper.xml -->
<mapper namespace="com.example.UserMapper">
    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

```java
// Mapper接口
@Mapper
public interface UserMapper {
    User selectById(Long id);
    
    @Select("SELECT * FROM user WHERE username = #{username}")
    User selectByUsername(String username);
}

// 使用
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;
    
    public User getById(Long id) {
        return userMapper.selectById(id);
    }
}
```

【缓存对比】

| 缓存 | JPA | MyBatis |
|:---:|:---:|:---:|
| 一级 | 自动 | 手动配置 |
| 二级 | 自动 | 手动配置 |
| 查询缓存 | ❌ | ✅ |
| 自定义 | 困难 | 灵活 |""",
        "difficulty": 2
    },
    {
        "id": max_id + 18,
        "category": "Spring生态",
        "question": "Spring Batch批处理框架的核心概念？",
        "answer": """【Spring Batch核心概念】

```mermaid
graph TD
    A[Job] --> B[Step1]
    A --> C[Step2]
    
    B --> B1[Tasklet]
    B --> B2[Chunk]
    B2 --> B3[ItemReader]
    B2 --> B4[ItemProcessor]
    B2 --> B5[ItemWriter]
    
    style A fill:#e1f5fe
    style B2 fill:#fff3e0
```

【核心组件】

| 组件 | 说明 |
|:---:|:---|
| Job | 作业，一个批处理任务 |
| Step | 作业步，Job的子任务 |
| Tasklet | 单个任务 |
| Chunk | 块处理（读-处理-写） |
| Item | 数据项 |

【Job结构】

```java
@Configuration
public class BatchConfig {
    
    @Bean
    public Job batchJob(JobBuilderFactory jobs, Step step) {
        return jobs.get("batchJob")
            .start(step)
            .build();
    }
    
    @Bean
    public Step step(StepBuilderFactory steps,
                     ItemReader<Input> reader,
                     ItemProcessor<Input, Output> processor,
                     ItemWriter<Output> writer) {
        return steps.get("step")
            .<Input, Output>chunk(10)  // 提交间隔
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .build();
    }
}
```

【Item处理流程】

```mermaid
graph LR
    A[ItemReader] --> B[ItemProcessor]
    B --> C[ItemWriter]
    
    A -->|读取1条| A1
    B -->|处理1条| B1
    B1 -->|累积10条| C
```

【Reader/Processor/Writer】

```java
// ItemReader
@Bean
public FlatFileItemReader<Input> reader() {
    return new FlatFileItemReaderBuilder<Input>()
        .resource(new ClassPathResource("input.csv"))
        .delimited()
        .names("field1", "field2")
        .targetType(Input.class)
        .build();
}

// ItemProcessor
@Bean
public ItemProcessor<Input, Output> processor() {
    return item -> {
        // 数据转换/过滤
        return output;
    };
}

// ItemWriter
@Bean
public JdbcBatchItemWriter<Output> writer(DataSource dataSource) {
    return new JdbcBatchItemWriterBuilder<Output>()
        .dataSource(dataSource)
        .sql("INSERT INTO output VALUES(?, ?)")
        .itemPreparedStatementSetter((item, ps) -> {
            ps.setString(1, item.getField1());
            ps.setString(2, item.getField2());
        })
        .build();
}
```

【Job启动器】

| 启动方式 | 说明 |
|:---:|:---|
| CommandLineJobRunner | 命令行 |
| JobOperator | Java API |
| Scheduler | 定时任务 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 19,
        "category": "Spring生态",
        "question": "Spring WebFlux与Spring MVC的区别？",
        "answer": """【WebFlux vs MVC对比】

```mermaid
graph LR
    A[请求处理] --> B[Spring MVC]
    A --> C[WebFlux]
    
    B -->|阻塞| B1[Servlet容器]
    C -->|非阻塞| C1[Netty/Reactor]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【核心区别】

| 特性 | Spring MVC | Spring WebFlux |
|:---:|:---:|:---:|
| 编程模型 | 命令式 | 响应式 |
| 线程模型 | 阻塞 | 非阻塞 |
| 容器 | Tomcat/Jetty | Netty |
| 适用场景 | CPU密集型 | I/O密集型 |
| 学习成本 | 较低 | 较高 |

【WebFlux优势】

| 优势 | 说明 |
|:---:|:---|
| 非阻塞 | 少量线程处理高并发 |
| 背压 | 支持背压处理 |
| 响应式 | 响应式数据流 |
| 微服务 | 高并发微服务 |

【响应式类型】

```java
// Mono - 0或1个元素
Mono<String> mono = Mono.just("hello");
Mono<Object> empty = Mono.empty();

// Flux - 0或N个元素
Flux<String> flux = Flux.just("a", "b", "c");
Flux<Integer> range = Flux.range(1, 10);

// 操作符
flux.map(String::toUpperCase)
    .filter(s -> s.length() > 3)
    .collectList();
```

【WebFlux示例】

```java
// 响应式Controller
@RestController
public class UserController {
    
    @GetMapping("/users")
    public Flux<User> getUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/user/{id}")
    public Mono<User> getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}

// 响应式Service
@Service
public class UserService {
    
    public Flux<User> findAll() {
        return userRepository.findAll()
            .delayElements(Duration.ofMillis(100));
    }
    
    public Mono<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
```

【选择建议】

| 场景 | 选择 |
|:---:|:---|
| 简单CRUD | MVC |
| 响应式需求 | WebFlux |
| 同步调用多 | MVC |
| 高并发I/O | WebFlux |
| 团队响应式经验少 | MVC |""",
        "difficulty": 3
    },
    {
        "id": max_id + 20,
        "category": "Spring生态",
        "question": "Spring Native和GraalVM编译？",
        "answer": """【Spring Native原理】

```mermaid
graph TD
    A[Java源码] --> B[Javac编译]
    B --> C[GraalVM native-image]
    C --> D[Native可执行文件]
    
    style C fill:#e1f5fe
    style D fill:#c8e6c9
```

【GraalVM编译】

| 特性 | JVM | GraalVM Native |
|:---:|:---:|:---:|
| 启动时间 | 秒级 | 毫秒级 |
| 内存占用 | MB级 | KB级 |
| 预热 | 需要 | 不需要 |
| 打包体积 | JAR | 二进制 |
| 动态特性 | 支持 | 限制 |

【Spring Native支持】

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <executable>true</executable>
            </configuration>
        </plugin>
    </plugins>
</build>
```

【编译命令】

```bash
# 安装GraalVM后
./mvnw native:build -Pnative

# 或使用Docker
./mvnw spring-boot:build-image
```

【限制事项】

| 特性 | 支持情况 |
|:---:|:---|
| 反射 | 需要配置 |
| 动态类加载 | 不支持 |
| 动态代理 | 有限支持 |
| 字节码生成 | 有限支持 |
| JNI | 不支持 |

【配置文件】

```json
// reflect-config.json
[
    {
        "name": "com.example.User",
        "fields": [
            {"name": "id", "allowWrite": true}
        ]
    }
]
```

【适用场景】

| 场景 | 推荐 |
|:---:|:---|
| Serverless | ✅ Native |
| 容器化 | ✅ Native |
| 传统应用 | ❌ JVM |
| 长期运行 | ❌ JVM |

【Spring Boot 3特性】
- AOT编译原生支持
- 更好的GraalVM集成
- 减少反射使用""",
        "difficulty": 3
    }
]

# 添加新题目
data.extend(new_questions)

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {len(new_questions)} new questions")
