import json

# 美化这些问题答案
updates = {
    17: """【动态代理核心原理】
在运行时动态创建代理类，拦截方法调用，增强目标对象。

【JDK动态代理】

1️⃣ 基于接口的代理
- 要求目标类必须实现接口
- 代理类实现相同接口
- 使用java.lang.reflect.Proxy

```java
UserService proxy = (UserService) Proxy.newProxyInstance(
    UserServiceImpl.class.getClassLoader(),
    UserServiceImpl.class.getInterfaces(),
    (obj, method, args) -> {
        // 前置增强
        System.out.println("方法执行前: " + method.getName());
        // 执行原方法
        Object result = method.invoke(new UserServiceImpl(), args);
        // 后置增强
        System.out.println("方法执行后");
        return result;
    }
);
```

【CGLIB动态代理】

1️⃣ 基于继承的代理
- 不需要接口，继承目标类
- 使用ASM字节码框架生成子类
- 方法被final或static修饰则无法代理

```java
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(UserServiceImpl.class);
enhancer.setCallback((MethodInterceptor) (obj, method, args, proxy) -> {
    // 前置增强
    System.out.println("方法执行前: " + method.getName());
    // 执行原方法
    Object result = proxy.invokeSuper(obj, args);
    // 后置增强
    System.out.println("方法执行后");
    return result;
});
UserServiceImpl proxy = (UserServiceImpl) enhancer.create();
```

【JDK代理 vs CGLIB】

| 特性 | JDK动态代理 | CGLIB |
|:---:|:---:|:---:|
| 实现方式 | 接口 | 继承 |
| 代理类 | Proxy.newProxyInstance | Enhancer.create |
| 性能 | 反射调用 | 字节码更快 |
| 目标类要求 | 实现接口 | 无要求 |
| 局限性 | 必须有接口 | 无法代理final/static |
| 依赖 | JDK自带 | 第三方库 |

【Spring AOP选择策略】
- 目标类实现了接口 → 默认JDK代理
- 目标类 CGLIB代理
-未实现接口 → 配置强制使用：@EnableAspectJAutoProxy(proxyTargetClass = true)""",

    12: """【四大基础算法】

```mermaid
graph TD
    A[GC算法] --> B[标记-清除]
    A --> C[标记-整理]
    A --> D[复制算法]
    A --> E[分代收集]
    
    B --> B1[产生内存碎片]
    C --> C1[无碎片<br/>移动耗时]
    D --> D1[无碎片<br/>浪费空间]
    E --> E1[新生代+老年代<br/>组合使用]
    
    style A fill:#e1f5fe
    style E fill:#fff3e0
```

| 算法 | 优点 | 缺点 |
|:---:|:---:|:---:|
| 标记-清除 | 简单 | 内存碎片 |
| 标记-整理 | 无碎片 | 移动耗时 |
| 复制算法 | 高效 | 浪费50%空间 |
| 分代收集 | 综合最优 | 实现复杂 |

【G1 vs CMS对比】

| 特性 | CMS | G1 |
|:---:|:---:|:---:|
| 目标 | 老年代 | 全堆 |
| 算法 | 标记-清除 | 标记-整理 |
| 碎片 | 有碎片 | 无碎片 |
| STW | 并发清除 | 可预测停顿 |
| 内存 | 连续 | Region划分 |

【CMS收集过程】
1. 初始标记（STW）：标记GC Roots
2. 并发标记：遍历对象图
3. 重新标记（STW）：修正变动
4. 并发清除：清除死亡对象

【G1收集过程】
1. 初始标记（STW）
2. 并发标记
3. 最终标记（STW）
4. 筛选回收（STW）

【G1核心优势】
- Region划分，内存分块
- Remembered Set记录引用
- 可设置停顿时间
- 适合大堆（6GB+）""",

    13: """【类加载过程】

```mermaid
graph TD
    A[加载 Loading] --> B[验证 Verification]
    B --> C[准备 Preparation]
    C --> D[解析 Resolution]
    D --> E[初始化 Initialization]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
    style E fill:#f3e5f5
```

| 阶段 | 说明 |
|:---:|:---|
| 加载 | 获取类的二进制字节流 |
| 验证 | 检查文件格式、元数据 |
| 准备 | 分配内存、设置初始值 |
| 解析 | 符号引用转直接引用 |
| 初始化 | 执行<clinit>()方法 |

【双亲委派模型】

```mermaid
graph TD
    A[Application<br/>ClassLoader] --> B[Extension<br/>ClassLoader]
    B --> C[Bootstrap<br/>ClassLoader]
    C --> D{能否加载?}
    D -->|否| E[返回给Extension]
    E --> F[返回给Application]
    F --> G[Application<br/>自行加载]
    
    style A fill:#e1f5fe
    style B fill:#b3e5fc
    style C fill:#81d4fa
    style G fill:#4fc3f7
```

**流程**：Application → Extension → Bootstrap → 依次返回 → Application加载

【双亲委派优势】
- 避免类重复加载
- 安全性：防止核心API被篡改
- 保证类的唯一性

【打破双亲委派】
1. 自定义类加载器，重写loadClass()
2. SPI机制（JDBC驱动加载）
3. OSGi热部署""",

    18: """【Java 8新特性】

```mermaid
graph LR
    A[Java 8新特性] --> B[Lambda]
    A --> C[Stream API]
    A --> D[Optional]
    A --> E[接口default]
    A --> F[方法引用]
    A --> G[Date Time API]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
```

【Lambda表达式】

语法：
```java
(x, y) -> x + y
x -> x * 2
() -> System.out.println("Hello")
```

【Stream API】

创建Stream：
```java
list.stream()           // 从集合
Arrays.stream(arr)      // 从数组
Stream.iterate(0, i->i+1)  // 无限流
Stream.generate(Math::random)  // 随机流
```

中间操作：
- filter()：过滤
- map()：转换
- distinct()：去重
- sorted()：排序

终端操作：
- collect()：收集
- forEach()：遍历
- count()：计数
- max/min()：最值

【Optional】

解决空指针问题：
```java
Optional<String> opt = Optional.ofNullable(str);
String result = opt.orElse("default");
opt.ifPresent(System.out::println);
```

【接口新特性】

default方法：
```java
interface Animal {
    default void sleep() {
        System.out.println("Animal sleeps");
    }
}
```

static方法：
```java
interface Calculator {
    static int add(int a, int b) {
        return a + b;
    }
}
```""",

    19: """【什么是NIO？】

NIO（New I/O）是一种同步非阻塞的I/O模型。

【BIO vs NIO vs AIO】

| 特性 | BIO | NIO | AIO |
|:---:|:---:|:---:|:---:|
| 编程模型 | 阻塞 | 非阻塞 | 异步 |
| 线程 | 每连接一线程 | 单线程多连接 | 回调通知 |
| 复杂度 | 简单 | 中等 | 复杂 |
| 吞吐量 | 低 | 高 | 高 |
| 适用场景 | 连接少 | 高并发 | 长连接 |

【NIO核心组件】

```mermaid
graph TD
    A[NIO] --> B[Channel通道]
    A --> C[Buffer缓冲区]
    A --> D[Selector选择器]
    
    B --> B1[可读可写]
    C --> C1[直接内存]
    D --> D1[多路复用]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
```

【Channel】
- 类似stream，可读可写
- 支持非阻塞
- 常见：FileChannel、SocketChannel、ServerSocketChannel

【Buffer】
- 缓冲区，直接读写数据
- 常见：ByteBuffer、CharBuffer

【Selector】
- 多路复用器
- 监控多个Channel事件
- 单线程处理多连接

【NIO示例】

```java
Selector selector = Selector.open();
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.configureBlocking(false);
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    selector.select();
    Set<SelectionKey> keys = selector.selectedKeys();
    for (SelectionKey key : keys) {
        if (key.isAcceptable()) { /* 处理连接 */ }
        else if (key.isReadable()) { /* 处理读 */ }
    }
}
```

【Netty】
- 基于NIO的异步框架
- 零拷贝、ByteBuf优化
- 广泛应用在RPC、MQ等""",

    20: """【Exception和Error的区别】

Throwable
├── Error
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── NoClassDefFoundError
└── Exception
    ├── RuntimeException
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   └── IllegalArgumentException
    └── CheckedException
        ├── IOException
        └── SQLException

【Error vs Exception】

| 特性 | Error | Exception |
|:---:|:---:|:---:|
| 父类 | Throwable | Throwable |
| 性质 | JVM错误 | 程序错误 |
| 处理 | 无法处理 | 可以捕获 |
| 示例 | OOM、SOF | NPE、IOE |
| 必须处理 | 否 | 受检异常是 |

【运行时异常 vs 受检异常】

| 特性 | 运行时异常 | 受检异常 |
|:---:|:---:|:---:|
| 父类 | RuntimeException | Exception |
| 编译检查 | 否 | 是 |
| 处理要求 | 不强制 | 必须 |
| 示例 | NPE | IOException |

【最佳实践】
1. 尽量捕获具体异常
2. 不要捕获Throwable/Error
3. 异常链保留原始信息
4. 业务异常使用运行时异常""",

    21: """【如何设计不可变类】

【核心原则】

1. 类用final修饰，不能被继承
2. 所有字段用final修饰
3. 字段类型如果是引用类型，需要注意
4. 不提供修改状态的方法
5. 构造函数中做防御性拷贝

【实现步骤】

1️⃣ 类的修饰
```java
public final class Person { }
```

2️⃣ 字段修饰
```java
private final String name;
private final int age;
private final Address address;      // 内部对象也要不可变
private final List<String> hobbies; // 集合需要防御性拷贝
```

3️⃣ 构造函数
```java
public Person(String name, int age, Address address, List<String> hobbies) {
    this.name = name;
    this.age = age;
    this.address = new Address(address.getCity());  // 防御性拷贝
    this.hobbies = new ArrayList<>(hobbies);       // 防御性拷贝
}
```

4️⃣ Getter返回副本
```java
public List<String> getHobbies() {
    return new ArrayList<>(hobbies);  // 返回副本
}
```

5️⃣ 静态工厂方法（推荐）
```java
public static Person of(String name, int age) {
    return new Person(name, age);
}

public Person withName(String name) {
    return new Person(name, this.age);  // 返回新对象
}
```

【JDK中的不可变类】
- String、Integer等包装类
- BigDecimal、BigInteger
- 枚举类
- Collections.unmodifiableXXX()""",

    22: """【SPI机制】

SPI（Service Provider Interface）是一种服务发现机制。

【SPI vs API】

| 特性 | API | SPI |
|:---:|:---:|:---:|
| 角色 | 我调用别人 | 我实现接口，别人调用我 |
| 方向 | 主动 | 被动 |
| 目的 | 使用服务 | 提供服务 |

【SPI原理】

1️⃣ 定义接口
```java
public interface DataStore {
    void save(String key, String value);
    String get(String key);
}
```

2️⃣ 实现接口
```java
public class MySqlDataStore implements DataStore {
    @Override
    public void save(String key, String value) { /* ... */ }
    @Override
    public String get(String key) { /* ... */ }
}
```

3️⃣ 注册实现
文件：META-INF/services/com.example.api.DataStore
内容：com.example.mysql.MySqlDataStore

4️⃣ 使用ServiceLoader加载
```java
ServiceLoader<DataStore> loader = ServiceLoader.load(DataStore.class);
for (DataStore store : loader) {
    store.save("key", "value");
}
```

【SPI应用场景】

| 场景 | 示例 |
|:---:|:---|
| JDBC驱动 | java.sql.Driver |
| 日志框架 | SLF4J |
| JSON序列化 | Jackson |
| Spring Boot | 自动装配 |

【SPI vs 反射+new】
- 解耦：接口与实现分离
- 扩展：新增实现无需修改代码
- 配置：配置文件声明""",

    23: """【红黑树特点】

【红黑树5大特性】

1. 节点非红即黑
2. 根节点是黑色
3. 叶子节点是黑色
4. 红节点的子节点必须是黑色
5. 任意节点到每个叶子路径的黑色节点数量相同

【红黑树 vs AVL】

| 特性 | 红黑树 | AVL |
|:---:|:---:|:---:|
| 平衡标准 | 黑高度平衡 | 高度平衡 |
| 查询复杂度 | O(log n) | O(log n) |
| 插入旋转 | 最多2次 | 最多1次 |
| 删除旋转 | 最多3次 | O(log n)次 |
| 适合场景 | 插入删除多 | 查询多 |

【为什么HashMap用红黑树不用AVL？】

| 原因 | 说明 |
|:---:|:---|
| 插入删除频繁 | HashMap链表转红黑树的阈值是8 |
| 旋转开销小 | 红黑树最多2-3次旋转，AVL更多 |
| 统计性能优 | 综合性能更好 |
| 查询足够快 | 两者都是O(log n) |

【红黑树旋转】

左旋：
```
    x           y
   / \\  ──▶   / \\
  a    y       x   c
       / \\   / \\
      b    c  a   b
```

【HashMap树化条件】
- 链表长度 > 8
- 且数组容量 >= 64
- 否则先扩容，不树化

【红黑树退化】
- 节点数 <= 6时，转换回链表""",

    24: """【什么是伪共享】

CPU缓存以64字节为单位（缓存行）读写。

```
┌─────────────────────────────────────┐
│         缓存行 (64字节)              │
│  ┌────┬────┬────┬────┬────┬────┐   │
│  │ v1 │ v2 │ v3 │ v4 │ v5 │ v6 │   │
│  └────┴────┴────┴────┴────┴────┘   │
└─────────────────────────────────────┘
```

【伪共享问题】

两个线程修改同一缓存行的不同变量：
- 线程1修改v1，整个缓存行失效
- 线程2修改v2，也需要重新加载
- 性能反而下降10-100倍

【解决方案】

1️⃣ 缓存行填充
```java
public class Counter {
    // 填充到不同缓存行
    private long p1, p2, p3, p4, p5, p6, p7;
    volatile long count1;
    // 填充
    private long p8, p9, p10, p11, p12, p13, p14;
    volatile long count2;
}
```

2️⃣ @Contended注解（Java 8+）
```java
public class Counter {
    @Contended("group1")
    volatile long count1;
    
    @Contended("group2")
    volatile long count2;
}
// 启动参数：-XX:-RestrictContended
```

3️⃣ 使用LongAdder（Java 8+）
- 高并发下代替AtomicLong
- 使用Cell数组分散写入

【JDK中的应用】
- ConcurrentLinkedQueue
- LongAdder
- Disruptor RingBuffer""",

    25: """【Java泛型擦除】

【泛型擦除原理】

编译时检查，运行时擦除：
```java
// 编译前
List<String> list = new ArrayList<>();
List<Integer> list2 = new ArrayList<>();

// 编译后（类型擦除）
List list = new ArrayList();
List list2 = new ArrayList();

// 运行时常量池中是同一个Class对象
```

【泛型限制】

| 限制 | 说明 |
|:---:|:---|
| 不能创建泛型实例 | new T() ❌ |
| 不能创建泛型数组 | new T[10] ❌ |
| 不能使用基本类型 | List<int> ❌ |
| 不能使用泛型异常 | class MyException<T> ❌ |

【通配符】

```mermaid
graph LR
    A[通配符] --> B[<?> 无限制]
    A --> C[<? extends T> 上界]
    A --> D[<? super T> 下界]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
```

【上界通配符 <? extends T>】

- 可以读取，不能写入
- PECS原则：生产者用extends

```java
List<? extends Number> list = new ArrayList<Integer>();
Number num = list.get(0);  // ✅
list.add(new Integer(1));  // ❌
```

【下界通配符 <? super T>】

- 可以写入，不能读取（除Object）
- PECS原则：消费者用super

```java
List<? super Integer> list = new ArrayList<Number>();
list.add(new Integer(1));  // ✅
Integer i = list.get(0);   // ❌
```

【PECS原则】
- Producer Extends, Consumer Super
- 只读数据 → extends
- 只写数据 → super""",
}

# 读取文件
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 更新答案
for item in data:
    if item['id'] in updates:
        item['answer'] = updates[item['id']]

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {len(updates)} questions")
