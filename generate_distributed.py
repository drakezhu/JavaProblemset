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
        "category": "分布式系统与微服务",
        "question": "CAP理论和BASE理论？实际应用取舍？",
        "answer": """【CAP理论】

```mermaid
graph TD
    A[CAP] --> B[Consistency]
    A --> C[Availability]
    A --> D[Partition Tolerance]
    
    B -->|只能选两个| E
    C --> E
    D --> E
    
    style A fill:#e1f5fe
```

【CAP定义】

| 特性 | 说明 |
|:---:|:---|
| C 一致性 | 所有节点数据一致 |
| A 可用性 | 每次请求都有响应 |
| P 分区容错 | 网络异常时仍可用 |

【CAP取含】

| 组合 | 说明 | 系统 |
|:---:|:---|:---|
| CA | 无分区容错 | 单机数据库 |
| CP | 牺牲可用性 | ZooKeeper、HBase |
| AP | 牺牲一致性 | Cassandra、Eureka |

【BASE理论】

```mermaid
graph LR
    A[BASE] --> B[Basically Available]
    A --> C[Soft State]
    A --> D[Eventually Consistent]
    
    style A fill:#e1f5fe
```

| 特性 | 说明 |
|:---:|:---|
| Basically Available | 基本可用 |
| Soft State | 软状态 |
| Eventually Consistent | 最终一致 |

【实际应用】

| 场景 | 选择 |
|:---:|:---|
| 金融 | CP + 强一致 |
| 电商 | AP + 最终一致 |
| 注册中心 | AP |""",
        "difficulty": 3
    },
    {
        "id": max_id + 2,
        "category": "分布式系统与微服务",
        "question": "分布式事务解决方案？2PC/3PC/TCC/Saga/本地消息表？",
        "answer": """【分布式事务方案】

```mermaid
graph TD
    A[分布式事务] --> B[2PC]
    A --> C[3PC]
    A --> D[TCC]
    A --> E[Saga]
    A --> F[本地消息表]
    
    style A fill:#e1f5fe
```

【方案对比】

| 方案 | 原理 | 优点 | 缺点 |
|:---:|:---|:---|:---|
| 2PC | 两阶段提交 | 简单 | 同步阻塞 |
| 3PC | 三阶段提交 | 优化阻塞 | 数据不一致 |
| TCC | 补偿机制 | 性能好 | 侵入性强 |
| Saga | 链式补偿 | 异步 | 复杂 |
| 消息表 | 最终一致 | 简单 | 延迟 |

【2PC两阶段】

```mermaid
sequenceDiagram
    participant C as Coordinator
    participant P as Participant
    
    C->>P: Prepare
    P-->>C: OK/FAIL
    C->>P: Commit/Rollback
```

【TCC模式】

```
Try: 预留资源
Confirm: 确认执行
Cancel: 取消预留
```

【Saga模式】

```
T1: 库存服务 -1
T2: 订单服务 创建
T3: 积分服务 +100

某步失败 → 逆向补偿
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 3,
        "category": "分布式系统与微服务",
        "question": "Seata的AT模式原理？undo_log作用？",
        "answer": """【Seata AT模式】

```mermaid
graph TD
    A[Seata AT] --> B[TC]
    A --> C[TM]
    A --> D[RM]
    
    B -->|全局事务管理| B1
    C -->|开启事务| C1
    D -->|执行SQL+记录undo| D1
    
    style A fill:#e1f5fe
```

【角色说明】

| 角色 | 说明 |
|:---:|:---|
| TC | Transaction Coordinator 事务协调器 |
| TM | Transaction Manager 事务管理器 |
| RM | Resource Manager 资源管理器 |

【AT原理】

1. TM开启全局事务
2. RM执行SQL
3. 自动记录undo_log
4. 提交/回滚

【undo_log表结构】

```sql
CREATE TABLE undo_log (
    id bigint NOT NULL,
    branch_id bigint NOT NULL,
    xid varchar(100) NOT NULL,
    context varchar(128) NOT NULL,
    rollback_info longblob NOT NULL,
    log_status int NOT NULL,
    log_created datetime NOT NULL,
    log_modified datetime NOT NULL
);
```

【回滚流程】

```
1. 解析undo_log
2. 反向SQL
3. 删除undo_log
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 4,
        "category": "分布式系统与微服务",
        "question": "分布式ID生成方案？雪花算法？",
        "answer": """【分布式ID方案】

```mermaid
graph TD
    A[分布式ID] --> B[UUID]
    A --> C[雪花算法]
    A --> D[数据库号段]
    A --> E[Redis]
    
    style A fill:#e1f5fe
```

【方案对比】

| 方案 | 优点 | 缺点 | 适用 |
|:---:|:---|:---|:---|
| UUID | 简单 | 无序、占用大 | 测试 |
| 雪花算法 | 有序、高效 | 依赖时钟 | 生产 |
| 数据库号段 | 简单 | 单点 | 小规模 |
| Redis | 高性能 | 可能重复 | 通用 |

【雪花算法原理】

```
1位符号 + 41位时间戳 + 10位机器ID + 12位序列号
= 64位long
```

```
      [1][----------41----------][----10----][------12------]
       ↓     时间戳(毫秒)        机器ID     序列号
       
时间戳: (2024-01-01) - 基准时间
机器ID: 5位数据中心 + 5位机器ID
序列号: 每毫秒从0开始
```

【代码实现】

```java
public class SnowflakeIdWorker {
    // 41位时间戳
    private final long twepoch = 1609459200000L;
    // 10位机器ID
    private final long workerIdBits = 5L;
    private final long datacenterIdBits = 5L;
    // 12位序列号
    private final long sequenceBits = 12L;
    
    public synchronized long nextId() {
        long timestamp = timeGen();
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("");
        }
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & maxSequence;
        } else {
            sequence = 0L;
        }
        lastTimestamp = timestamp;
        return ((timestamp - twepoch) << timestampShift)
            | (workerId << workerIdShift)
            | sequence;
    }
}
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 5,
        "category": "分布式系统与微服务",
        "question": "限流算法？计数器、滑动窗口、令牌桶、漏桶？",
        "answer": """【限流算法】

```mermaid
graph TD
    A[限流算法] --> B[计数器]
    A --> C[滑动窗口]
    A --> D[令牌桶]
    A --> E[漏桶]
    
    style A fill:#e1f5fe
```

【四种算法对比】

| 算法 | 原理 | 优点 | 缺点 |
|:---:|:---|:---|:---|
| 计数器 | 固定窗口 | 简单 | 突发流量 |
| 滑动窗口 | 滚动窗口 | 精确 | 复杂 |
| 令牌桶 | 匀速生成 | 允许突发 | 实现复杂 |
| 漏桶 | 匀速消费 | 流量平滑 | 不允许突发 |

【计数器算法】

```
固定时间窗口：1秒100请求
0.9秒: 100请求
1.0秒: 新窗口，重置计数
1.1秒: 100请求
```

【滑动窗口】

```
将时间窗口分成多个小窗口
滑动计算总请求数
```

【令牌桶算法】

```java
// Guava RateLimiter
RateLimiter limiter = RateLimiter.create(100); // 每秒100令牌

// 获取令牌
limiter.acquire(); // 阻塞获取
limiter.tryAcquire(); // 非阻塞
```

【漏桶算法】

```
请求 → 队列 → 匀速消费 → 处理
超过队列 → 拒绝
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 6,
        "category": "分布式系统与微服务",
        "question": "熔断降级原理？Sentinel vs Hystrix？",
        "answer": """【熔断降级原理】

```mermaid
graph TD
    A[熔断器] --> B[关闭]
    B -->|失败率过高| C[打开]
    C -->|半开| D[尝试请求]
    D -->|成功| B
    D -->|失败| C
    
    style A fill:#e1f5fe
```

【熔断器状态】

| 状态 | 说明 |
|:---:|:---|
| Closed | 正常，请求通过 |
| Open | 熔断，快速失败 |
| Half-Open | 尝试，允许部分请求 |

【熔断策略】

| 策略 | 说明 |
|:---:|:---|
| 慢调用比例 | 响应时间过长 |
| 异常比例 | 异常占比高 |
| 异常数 | 异常数量多 |

【Sentinel vs Hystrix】

| 特性 | Sentinel | Hystrix |
|:---:|:---:|:---:|
| 限流 | 丰富 | 简单 |
| 熔断 | 多策略 | 异常比例 |
| 规则 | 动态配置 | 静态配置 |
| 状态 | 维护中 | 停止维护 |
| 社区 | 阿里 | Netflix |

【Sentinel使用】

```java
@SentinelResource(value = "test", 
    fallback = "fallbackHandler",
    blockHandler = "blockHandler")
public Result test() {
    return Result.ok();
}

public Result fallbackHandler() {
    return Result.fail("降级响应");
}
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 7,
        "category": "分布式系统与微服务",
        "question": "负载均衡算法？轮询、随机、加权、一致性哈希？",
        "answer": """【负载均衡算法】

```mermaid
graph TD
    A[负载均衡] --> B[轮询]
    A --> C[随机]
    A --> D[加权]
    A --> E[一致性哈希]
    A --> F[最少连接]
    
    style A fill:#e1f5fe
```

【算法对比】

| 算法 | 原理 | 优点 | 缺点 |
|:---:|:---|:---|:---|
| 轮询 | 依次分配 | 简单 | 不考虑差异 |
| 随机 | 随机选择 | 简单 | 不确定 |
| 加权 | 权重分配 | 灵活 | 需配置 |
| 一致性哈希 | 哈希环 | 缓存友好 | 实现复杂 |
| 最少连接 | 连接数少 | 动态 | 开销大 |

【加权轮询】

```
Server A(权重3): 请求:请求:请求
Server B(权重1): 请求
```

【一致性哈希】

```mermaid
graph TD
    A[哈希环] --> B[Server A]
    A --> C[Server B]
    A --> D[Server C]
    A --> E[Key1]
    E -->|顺时针| B
    
    style A fill:#e1f5fe
```

【实现示例】

```java
// Nginx加权轮询
upstream backend {
    server a weight=3;
    server b weight=1;
}

// Ribbon随机
Rule=RandomRule

// Ribbon一致性哈希
Rule=ConsistentHashRule
```""",
        "difficulty": 2
    },
    {
        "id": max_id + 8,
        "category": "分布式系统与微服务",
        "question": "服务注册发现的原理？健康检查机制？",
        "answer": """【服务注册发现原理】

```mermaid
sequenceDiagram
    participant P as Provider
    participant R as Registry
    participant C as Consumer
    
    P->>R: 注册服务
    R-->>P: 确认
    C->>R: 发现服务
    R-->>C: 服务列表
    C->>P: 调用
```

【注册中心功能】

| 功能 | 说明 |
|:---:|:---|
| 服务注册 | 提供者注册地址 |
| 服务发现 | 消费者获取列表 |
|  健康检查 | 检测服务状态 |
|  路由管理 | 权重、隔离 |

【健康检查机制】

| 方式 | 说明 |
|:---:|:---|
| 心跳 | 定时发送ping |
| 客户端上报 | 客户端主动上报 |
| 探针 | 注册中心主动探测 |

【Eureka自我保护】

```
15分钟内心跳失败比例 > 85%
→ 开启保护模式
→ 不剔除服务
→ 防止网络分区
```

【Nacos健康检查】

| 模式 | 说明 |
|:---:|:---|
| HTTP | 探测健康接口 |
| TCP | 端口探测 |
| MySQL | 数据库探测 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 9,
        "category": "分布式系统与微服务",
        "question": "网关的作用？统一认证、路由、限流、日志？",
        "answer": """【网关核心功能】

```mermaid
graph TD
    A[网关] --> B[路由]
    A --> C[认证]
    A --> D[限流]
    A --> E[日志]
    A --> F[协议转换]
    
    style A fill:#e1f5fe
```

【网关职责】

| 功能 | 说明 |
|:---:|:---|
| 路由 | 转发请求到后端 |
| 认证 | 权限校验 |
| 限流 | 流量控制 |
| 日志 | 访问记录 |
| 协议转换 | HTTP/Dubbo |

【认证流程】

```mermaid
sequenceDiagram
    participant U as 用户
    participant G as 网关
    participant A as 认证服务
    participant B as 业务
    
    U->>G: 请求
    G->>A: 验证Token
    A-->>G: 验证结果
    G->>B: 转发请求
    B-->>U: 响应
```

【限流实现】

```java
// Sentinel限流
@SentinelResource(value = "api", 
    blockHandler = "blocked")
public String api() {
    return "OK";
}
```

【常见网关】

| 网关 | 特点 |
|:---:|:---|
| Spring Cloud Gateway | 响应式 |
| Zuul | 阻塞 |
| Nginx | 性能高 |
| Kong | 插件丰富 |""",
        "difficulty": 2
    },
    {
        "id": max_id + 10,
        "category": "分布式系统与微服务",
        "question": "配置中心Apollo/Nacos原理？热更新实现？",
        "answer": """【配置中心原理】

```mermaid
graph TD
    A[配置中心] --> B[客户端拉取]
    A --> C[长轮询]
    A --> D[推送通知]
    
    style A fill:#e1f5fe
```

【Apollo原理】

| 组件 | 说明 |
|:---:|:---|
| Portal | 管理界面 |
| Admin Service | 管理后端 |
| Config Service | 配置读取 |
| Client | SDK |

【Nacos配置管理】

| 功能 | 说明 |
|:---:|:---|
| 配置管理 | 增删改查 |
| 版本管理 | 历史版本 |
| 监听 | 配置变更通知 |
| 权限 | 命名空间隔离 |

【热更新实现】

```java
// Spring Boot动态刷新
@RefreshScope
@Configuration
public class Config {
    @Value("${config.name}")
    private String name;
}

// 配置变化后
// 1. 监听变化通知
// 2. 重新绑定属性
// 3. 刷新Bean
```

【长轮询机制】

```
1. 客户端请求配置
2. 服务端hold请求(30秒)
3. 配置变更或超时返回
4. 客户端立即再次请求
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 11,
        "category": "分布式系统与微服务",
        "question": "链路追踪SkyWalking/Pinpoint原理？",
        "answer": """【链路追踪原理】

```mermaid
graph TD
    A[Trace] --> B[Span1]
    A --> C[Span2]
    A --> D[Span3]
    
    B -->|调用| C
    C -->|调用| D
    
    style A fill:#e1f5fe
```

【核心概念】

| 概念 | 说明 |
|:---:|:---|
| Trace | 一次完整请求 |
| Span | 单个服务调用 |
| SpanId | 调用层级 |
| TraceId | 全局唯一ID |

【数据传输】

```mermaid
sequenceDiagram
    participant A as App
    participant A as Agent
    participant C as Collector
    participant S as Storage
    
    A->>A: 埋点
    A->>C: 上报数据
    C->>S: 存储分析
```

【SkyWalking组成】

| 组件 | 说明 |
|:---:|:---|
| Agent | 字节码增强 |
| OAP Server | 收集分析 |
| Storage | 存储后端 |
| UI | 可视化 |

【Pinpoint特点】

- 无侵入埋点
- 字节码增强
- 分布式拓扑
- 详细调用信息""",
        "difficulty": 3
    },
    {
        "id": max_id + 12,
        "category": "分布式系统与微服务",
        "question": "容器化Docker核心概念？Namespace/Cgroup？",
        "answer": """【Docker核心概念】

```mermaid
graph TD
    A[Docker] --> B[镜像]
    A --> C[容器]
    A --> D[仓库]
    
    style A fill:#e1f5fe
```

【三大概念】

| 概念 | 说明 |
|:---:|:---|
| Image | 模板，只读 |
| Container | 镜像运行实例 |
| Registry | 镜像仓库 |

【Namespace隔离】

| 资源 | 说明 |
|:---:|:---|
| PID | 进程隔离 |
| Network | 网络隔离 |
| Mount | 文件系统隔离 |
| User | 用户隔离 |
| UTS | 主机名隔离 |
| IPC | 信号量/共享内存 |

【Cgroup资源限制】

| 资源 | 说明 |
|:---:|:---|
| CPU | 限制CPU使用 |
| Memory | 限制内存 |
| IO | 限制磁盘IO |
| PIDs | 限制进程数 |

【Docker命令】

```bash
# 运行容器
docker run -d -p 8080:80 --name web nginx

# 查看容器
docker ps

# 进入容器
docker exec -it web bash
```""",
        "difficulty": 2
    },
    {
        "id": max_id + 13,
        "category": "分布式系统与微服务",
        "question": "Kubernetes核心资源对象？Pod/Deployment/Service？",
        "answer": """【Kubernetes核心资源】

```mermaid
graph TD
    A[K8s] --> B[Pod]
    A --> C[Deployment]
    A --> D[Service]
    A --> E[ConfigMap]
    A --> F[Secret]
    
    style A fill:#e1f5fe
```

【核心对象】

| 对象 | 说明 |
|:---:|:---|
| Pod | 最小调度单位 |
| Deployment | 部署管理 |
| Service | 服务发现 |
| ConfigMap | 配置 |
| Secret | 敏感配置 |

【Pod概念】

- 最小部署单元
- 包含一个或多个容器
- 共享网络和存储

【Deployment】

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:1.0
        ports:
        - containerPort: 8080
```

【Service类型】

| 类型 | 说明 |
|:---:|:---|
| ClusterIP | 集群内部访问 |
| NodePort | 节点端口访问 |
| LoadBalancer | 负载均衡 |
| ExternalName | DNS别名 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 14,
        "category": "分布式系统与微服务",
        "question": "gRPC与RESTful对比？Protobuf序列化？",
        "answer": """【gRPC vs RESTful】

```mermaid
graph LR
    A[通信方式] --> B[gRPC]
    A --> C[REST]
    
    B -->|HTTP/2| B1[双向流]
    C -->|HTTP/1.1| C1[请求响应]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【对比表】

| 特性 | gRPC | REST |
|:---:|:---:|:---:|
| 协议 | HTTP/2 | HTTP/1.1 |
| 序列化 | Protobuf | JSON |
| 传输 | 二进制 | 文本 |
| 流 | 支持 | 需轮询 |
| 性能 | 高 | 中 |

【HTTP/2优势】

| 特性 | 说明 |
|:---:|:---|
| 多路复用 | 单一连接多流 |
| 头部压缩 | HPACK |
| 服务器推送 | Server Push |

【Protobuf使用】

```protobuf
// 定义消息
syntax = "proto3";

message User {
    int32 id = 1;
    string name = 2;
    string email = 3;
}

// 定义服务
service UserService {
    rpc GetUser (UserRequest) returns (User);
    rpc ListUsers (ListRequest) returns (stream User);
}
```

【gRPC服务】

```java
// 定义服务
service UserService {
    rpc GetUser (UserRequest) returns (User);
}

// 服务实现
public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {
    @Override
    public void getUser(UserRequest request, 
                       StreamObserver<User> responseObserver) {
        User user = findUser(request.getId());
        responseObserver.onNext(user);
        responseObserver.onCompleted();
    }
}
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 15,
        "category": "分布式系统与微服务",
        "question": "领域驱动设计DDD？聚合、实体、值对象、领域事件？",
        "answer": """【DDD核心概念】

```mermaid
graph TD
    A[DDD] --> B[聚合]
    A --> C[实体]
    A --> D[值对象]
    A --> E[领域事件]
    
    style A fill:#e1f5fe
```

【核心概念】

| 概念 | 说明 |
|:---:|:---|
| 聚合 | 业务边界 |
| 实体 | 有唯一标识 |
| 值对象 | 无标识，不变 |
| 领域事件 | 事件驱动 |

【聚合根】

```
Order(聚合根)
  ├── OrderId(实体)
  ├── OrderLine(实体)
  └── Money(值对象)
```

【实体 vs 值对象】

| 特性 | 实体 | 值对象 |
|:---:|:---:|:---|
| 标识 | 有 | 无 |
| 可变 | 可变 | 不可变 |
| 相等 | ID相等 | 属性相等 |

【领域事件】

```java
// 订单创建事件
public class OrderCreatedEvent {
    private String orderId;
    private BigDecimal amount;
    private LocalDateTime createdAt;
}

// 发布
domainEventPublisher.publish(new OrderCreatedEvent(...));
```

【DDD分层】

| 层 | 说明 |
|:---:|:---|
| 接入层 | API/Controller |
| 应用层 | Service |
| 领域层 | Domain |
| 基础设施层 | DAO/Repository |""",
        "difficulty": 3
    },
    {
        "id": max_id + 16,
        "category": "JVM、性能与架构",
        "question": "JVM内存结构？堆、栈、方法区、直接内存？",
        "answer": """【JVM内存结构】

```mermaid
graph TD
    A[JVM] --> B[堆]
    A --> C[栈]
    A --> D[方法区]
    A --> E[本地方法栈]
    A --> F[程序计数器]
    
    B --> B1[Eden]
    B --> B2[Survivor]
    B --> B3[Old]
    
    style B fill:#e1f5fe
```

【内存区域】

| 区域 | 说明 |
|:---:|:---|
| 堆 | 对象实例，GC主要区域 |
| 栈 | 线程私有，方法调用 |
| 方法区 | 类信息、静态变量 |
| 本地方法栈 | Native方法 |
| 程序计数器 | 当前线程行号 |

【堆内存结构】

| 区域 | 比例 | 说明 |
|:---:|:---:|:---|
| Eden | 1 | 新对象分配 |
| Survivor | 1 | 存活对象 |
| Old | 2 | 长生命周期对象 |

【栈帧结构】

```
┌─────────────┐
│  局部变量表  │
├─────────────┤
│  操作数栈   │
├─────────────┤
│  动态链接   │
├─────────────┤
│  返回地址   │
└─────────────┘
```

【OOM场景】

| 区域 | OOM类型 |
|:---:|:---|
| 堆 | OutOfMemoryError: Java heap space |
| 栈 | StackOverflowError / OOM |
| 方法区 | OutOfMemoryError: Metaspace |
| 直接内存 | OutOfMemoryError |""",
        "difficulty": 3
    },
    {
        "id": max_id + 17,
        "category": "JVM、性能与架构",
        "question": "线上CPU100%或内存溢出如何排查？",
        "answer": """【CPU100%排查】

```mermaid
graph TD
    A[CPU100%] --> B[top命令]
    B --> C[jstack]
    C --> D[定位线程]
    D --> E[代码分析]
    
    style A fill:#ffcdd2
```

【排查步骤】

```bash
# 1. 找到Java进程
top -c
# 显示Java进程CPU排序

# 2. 找到占用CPU的线程
top -Hp <pid>

# 3. 线程ID转16进制
printf "%x" <tid>

# 4. 导出线程堆栈
jstack <pid> > stack.txt

# 5. 查找线程
grep "nid=0x<tid>" stack.txt
```

【内存溢出排查】

```bash
# 1. 导出堆转储
jmap -dump:format=b,file=heap.hprof <pid>

# 2. 使用MAT分析
# https://memory.analyzer
```

【Arthas使用】

```bash
# 启动Arthas
java -jar arthas-boot.jar

# 查看dashboard
dashboard

# 线程分析
thread -n 10

# 堆内存分析
heapdump /tmp/heap.hprof

# 方法耗时
trace class method
```

【常见原因】

| 问题 | 原因 |
|:---:|:---|
| CPU高 | 死循环、GC频繁 |
| 内存高 | 内存泄漏、大对象 |
| 线程多 | 线程池配置不当 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 18,
        "category": "JVM、性能与架构",
        "question": "高并发系统的设计原则？",
        "answer": """【高并发设计原则】

```mermaid
graph TD
    A[高并发设计] --> B[无状态]
    A --> C[缓存]
    A --> D[异步]
    A --> E[降级]
    A --> F[限流]
    A --> G[扩容]
    
    style A fill:#c8e6c9
```

【设计原则】

| 原则 | 说明 |
|:---:|:---|
| 无状态 | 可水平扩展 |
| 缓存 | 减少数据库压力 |
| 异步 | 削峰填谷 |
| 降级 | 核心功能优先 |
| 限流 | 保护系统 |
| 扩容 | 应对流量 |

【分层架构】

```mermaid
graph TD
    A[接入层] --> B[网关层]
    B --> C[业务服务]
    C --> D[数据访问]
    
    C --> E[缓存]
    C --> F[消息队列]
    
    style C fill:#e1f5fe
```

【优化手段】

| 手段 | 说明 |
|:---:|:---|
| CDN | 静态资源加速 |
| 页面缓存 | 减少请求 |
| 连接池 | 数据库复用 |
| 异步 | 消息队列 |
| 读写分离 | 分散压力 |

【技术选型】

| 场景 | 技术 |
|:---:|:---|
| 缓存 | Redis |
| 消息队列 | Kafka/RocketMQ |
| 搜索引擎 | Elasticsearch |
| 存储 | MySQL分库分表 |""",
        "difficulty": 2
    },
    {
        "id": max_id + 19,
        "category": "JVM、性能与架构",
        "question": "秒杀系统如何设计？防超卖、高性能、高可用？",
        "answer": """【秒杀系统架构】

```mermaid
graph TD
    A[秒杀系统] --> B[限流]
    B --> C[缓存]
    C --> D[消息队列]
    D --> E[数据库]
    
    style A fill:#e1_f5fe
```

【核心挑战】

| 挑战 | 解决方案 |
|:---:|:---|
| 高并发 | 限流+缓存 |
| 超卖 | 库存扣减 |
| 热点数据 | Redis缓存 |
| 机器人 | 验证码/限IP |

【架构设计】

```mermaid
graph LR
    A[用户] --> B[CDN]
    B --> C[网关限流]
    C --> D[Redis预减库存]
    D -->|库存不足| E[返回失败]
    D -->|有库存| F[下单请求]
    F --> G[MQ异步下单]
    G --> H[数据库扣减]
    H --> I[返回成功]
```

【防超卖方案】

```java
// Redis原子扣减
Long stock = redisTemplate.opsForValue().decrement("stock:skuId");
if (stock < 0) {
    // 库存不足
    return false;
}

// 数据库乐观锁
UPDATE stock SET count = count - 1 
WHERE sku_id = ? AND count > 0;
```

【限流策略】

| 限流点 | 方案 |
|:---:|:---|
| 入口 | Nginx限流 |
| 网关 | Sentinel |
| 业务 | Redis计数器 |

【高可用保障】

| 保障 | 说明 |
|:---:|:---|
| 隔离 | 独立服务 |
| 熔断 | 异常降级 |
| 幂等 | 防止重复 |
| 限流 | 保护后端 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 20,
        "category": "JVM、性能与架构",
        "question": "设计一个短链系统？存储、跳转、统计？",
        "answer": """【短链系统设计】

```mermaid
graph TD
    A[短链系统] --> B[生成]
    A --> C[存储]
    A --> D[跳转]
    A --> E[统计]
    
    style A fill:#e1f5fe
```

【短链原理】

```
原链: https://example.com/article/123456789
短链: https://t.cn/Rt7gKx
```

【生成算法】

| 方案 | 原理 |
|:---:|:---|
| 自增ID | 数据库自增 |
| 哈希 | MD5+Base62 |
| 雪花 | 分布式ID |

【Base62编码】

```java
// 62字符: 0-9 a-z A-Z
private static final String CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

public String encode(long id) {
    StringBuilder sb = new StringBuilder();
    while (id > 0) {
        sb.append(CHARS.charAt((int)(id % 62)));
        id /= 62;
    }
    return sb.reverse().toString();
}
```

【存储设计】

```sql
-- 短链表
CREATE TABLE short_url (
    id BIGINT PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE,
    original_url VARCHAR(2048),
    expire_time DATETIME,
    created_at DATETIME
);
```

【跳转流程】

```mermaid
sequenceDiagram
    participant U as 用户
    participant S as 短链服务
    participant D as DB
    
    U->>S: 访问短链
    S->>D: 查询长链
    D-->>S: 返回长链
    S->>U: 302重定向
```

【跳转优化】

| 优化 | 说明 |
|:---:|:---|
| 缓存 | Redis缓存映射 |
| 布隆 | 快速判断不存在 |
| 预生成 | 批量生成 |

【统计功能】

| 统计 | 说明 |
|:---:|:---|
| PV | 访问量 |
| UV | 独立访客 |
| Referer | 来源分析 |
| 时间段 | 分时统计 |""",
        "difficulty": 3
    }
]

# 添加新题目
data.extend(new_questions)

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {len(new_questions)} new questions")
