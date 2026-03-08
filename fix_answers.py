import json

# 直接重写有问题的答案
updates = {
    6: """【Java内存模型JMM】
JMM（Java Memory Model）是一种规范，定义了线程和主内存之间的交互关系。

1️⃣ 抽象结构
- 主内存：共享变量存储区域
- 工作内存：每个线程的独立内存空间
- 线程通过read/load从主内存读取，通过use/assign写回主内存

2️⃣ 八种操作
- lock/unlock：作用于主内存变量
- read/load：主内存→工作内存
- use/assign：工作内存→执行引擎
- store/write：工作内存→主内存

【volatile关键字作用】

1️⃣ 保证可见性
- 写操作立即刷新到主内存
- 读操作从主内存读取最新值

2️⃣ 禁止指令重排序
- volatile前后的代码不能重排

【volatile vs synchronized】
| 特性 | volatile | synchronized |
|------|---------|---------------|
| 原子性 | 不保证 | 保证 |
| 可见性 | 保证 | 保证 |
| 有序性 | 部分保证 | 保证 |

【使用场景】
- 状态标记量（如停止标志）
- 单例模式的double-check（配合synchronized）""",

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

| 算法 | 特点 |
|:---:|:---|
| 标记-清除 | 产生内存碎片 |
| 标记-整理 | 无碎片，移动耗时 |
| 复制算法 | 无碎片，浪费一半空间 |
| 分代收集 | 组合使用 |

【G1 vs CMS】
| 特性 | CMS | G1 |
|------|-----|-----|
| 目标 | 老年代 | 全堆 |
| 算法 | 标记-清除 | 标记-整理 |
| 碎片 | 有碎片 | 无碎片 |

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
- Region划分
- Remembered Set
- 可设置停顿时间""",

    13: """【类加载过程】

```mermaid
graph TD
    A[加载] --> B[验证]
    B --> C[准备]
    C --> D[解析]
    D --> E[初始化]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
    style E fill:#f3e5f5
```

1. 加载：获取类的二进制字节流
2. 验证：检查文件格式
3. 准备：分配内存、设置初始值
4. 解析：符号引用转直接引用
5. 初始化：执行<clinit>()方法

【双亲委派模型】

```mermaid
graph TD
    A[Application] --> B[Extension]
    B --> C[Bootstrap]
    C --> D{能否加载?}
    D -->|否| E[返回Extension]
    E --> F[返回Application]
    F --> G[Application自行加载]
    
    style A fill:#e1f5fe
    style B fill:#b3e5fc
    style C fill:#81d4fa
    style G fill:#4fc3f7
```

流程：Application → Extension → Bootstrap → 依次返回 → Application加载

【双亲委派优势】
1. 避免类重复加载
2. 安全性：防止核心API被篡改
3. 保证类的唯一性

【打破双亲委派】
1. 自定义类加载器，重写loadClass()
2. SPI机制（如JDBC驱动）
3. OSGi热部署""",

    15: """【浅拷贝 vs 深拷贝】

浅拷贝：只复制引用，深拷贝：复制全部内容

【实现方式】

1️⃣ 浅拷贝：clone()方法
```java
class Person implements Cloneable {
    @Override
    protected Person clone() {
        return (Person) super.clone();
    }
}
```

2️⃣ 深拷贝：手动拷贝
```java
class Person implements Cloneable {
    Address address;
    @Override
    protected Person clone() {
        Person p = (Person) super.clone();
        p.address = address.clone();
        return p;
    }
}
```

3️⃣ 深拷贝：序列化
```java
public static <T> T deepCopy(T obj) {
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(bos);
    oos.writeObject(obj);
    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
    ObjectInputStream ois = new ObjectInputStream(bis);
    return (T) ois.readObject();
}
```

【使用场景】
- 浅拷贝：对象结构简单
- 深拷贝：需要独立副本""",

    17: """【动态代理核心原理】
在运行时动态创建代理类，拦截方法调用，增强目标对象。

【JDK动态代理】
- 基于接口的代理
- 要求目标类实现接口
- 使用java.lang.reflect.Proxy

```java
UserService proxy = (UserService) Proxy.newProxyInstance(
    cl.getClassLoader(),
    interfaces,
    (obj, method, args) -> {
        // 前置增强
        Object result = method.invoke(target, args);
        // 后置增强
        return result;
    }
);
```

【CGLIB动态代理】
- 基于继承的代理
- 不需要接口
- 使用ASM字节码生成子类

【JDK代理 vs CGLIB】
| 特性 | JDK代理 | CGLIB |
|------|--------|-------|
| 实现 | 接口 | 继承 |
| 性能 | 反射调用 | 字节码 |
| 局限性 | 需接口 | 无法代理final |""",

    20: """【异常体系结构】

Throwable
├── Error（JVM错误，无法处理）
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception
    ├── RuntimeException（运行时异常）
    │   ├── NullPointerException
    │   └── ArrayIndexOutOfBoundsException
    └── CheckedException（受检异常）
        ├── IOException
        └── SQLException

【Error vs Exception】
| 特性 | Error | Exception |
|------|-------|----------|
| 性质 | JVM错误 | 程序错误 |
| 处理 | 无法处理 | 可以捕获 |
| 示例 | OOM | NPE |

【受检异常 vs 运行时异常】
| 类型 | 编译检查 | 处理要求 |
|------|---------|---------|
| 受检异常 | 必须 | 必须声明或捕获 |
| 运行时异常 | 不需要 | 不强制 |""",
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
