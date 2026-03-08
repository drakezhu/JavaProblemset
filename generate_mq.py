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
        "category": "消息队列与中间件",
        "question": "消息队列的使用场景？解耦、异步、削峰？",
        "answer": """【消息队列核心场景】

```mermaid
graph TD
    A[MQ使用场景] --> B[解耦]
    A --> C[异步]
    A --> D[削峰]
    
    B -->|松耦合| B1[系统间无依赖]
    C -->|非阻塞| C1[提升响应速度]
    D -->|限流| D1[保护后端系统]
    
    style A fill:#e1f5fe
```

【三大核心场景】

| 场景 | 说明 | 优势 |
|:---:|:---|:---|
| 解耦 | 系统间通过MQ通信 | 降低耦合度 |
| 异步 | 非立即响应 | 提高吞吐量 |
| 削峰 | 流量高峰期缓冲 | 保护系统 |

【解耦示例】

```mermaid
graph LR
    A[订单系统] --> MQ[消息队列]
    MQ --> B[库存系统]
    MQ --> C[物流系统]
    MQ --> D[通知系统]
    
    style A fill:#e1f5fe
    style MQ fill:#fff3e0
```

- 订单系统只需发消息
- 不关心下游系统
- 下游系统独立处理

【异步示例】

```
同步：订单创建 → 3秒
异步：订单创建(10ms) → 消息(后台处理)
```

【削峰示例】

```
高峰：10000 QPS → MQ缓冲 → 系统处理：1000 QPS
```""",
        "difficulty": 2
    },
    {
        "id": max_id + 2,
        "category": "消息队列与中间件",
        "question": "Kafka的架构？Broker、Topic、Partition、Consumer Group？",
        "answer": """【Kafka架构】

```mermaid
graph TD
    A[Kafka集群] --> B[Broker1]
    A --> C[Broker2]
    A --> D[Broker3]
    
    B --> E[Topic]
    E --> F[Partition1]
    E --> G[Partition2]
    
    F --> H[Replica1]
    F --> I[Replica2]
    
    style E fill:#e1f5fe
    style F fill:#fff3e0
```

【核心概念】

| 概念 | 说明 |
|:---:|:---|
| Broker | Kafka服务节点 |
| Topic | 消息主题 |
| Partition | 分区，物理存储 |
| Replica | 分区副本 |
| Consumer Group | 消费组 |

【Partition存储】

```
Topic: order-topic
  Partition 0: [0, 1000]
  Partition 1: [1001, 2000]
  Partition 2: [2001, 3000]
```

【Consumer Group】

- 同一消费组内消息不重复
- 不同消费组消费全部消息
- 负责分区分配

【消息顺序】

- 分区内有序
- 全局有序需单分区""",
        "difficulty": 3
    },
    {
        "id": max_id + 3,
        "category": "消息队列与中间件",
        "question": "Kafka为什么高吞吐？零拷贝技术？",
        "answer": """【Kafka高吞吐原因】

```mermaid
graph TD
    A[Kafka高吞吐] --> B[顺序写磁盘]
    A --> C[页缓存]
    A --> D[零拷贝]
    A --> E[批量处理]
    
    style A fill:#c8e6c9
```

【高性能原因】

| 技术 | 说明 |
|:---:|:---|
| 顺序写 | 磁盘顺序写，接近内存 |
| 页缓存 | OS页缓存，减少IO |
| 零拷贝 | sendfile减少拷贝 |
| 批量处理 | 批量压缩/发送 |
| 稀疏索引 | 高效定位消息 |

【零拷贝技术】

```mermaid
graph LR
    A[磁盘文件] --> B[内核缓冲区]
    B --> C[用户缓冲区]
    C --> D[Socket缓冲区]
    D --> E[网卡]
    
    传统: A→B→C→B→D→E
    零拷贝: A→B→D→E
```

| 方式 | 拷贝次数 | 上下文切换 |
|:---:|:---:|:---:|
| 传统 | 4次 | 4次 |
| 零拷贝 | 2次 | 2次 |

【sendfile系统调用】

```c
// 内核态直接传输
sendfile(socket, file, size);
```

【顺序写原理】

```
传统随机写: 磁盘寻址 → 写入
Kafka顺序写: 直接追加 → 速度接近内存
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 4,
        "category": "消息队列与中间件",
        "question": "Kafka的ISR机制？ACK设置？消息可靠性？",
        "answer": """【ISR机制】

```mermaid
graph TD
    A[Leader] --> B[ISR列表]
    B --> C[同步中的Follower]
    B --> D[同步中的Follower]
    C --> E{落后太多?}
    D --> E
    E -->|是| F[移出ISR]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
```

【ISR定义】

| 概念 | 说明 |
|:---:|:---|
| ISR | In-Sync Replicas |
| Leader | 主分区 |
| Follower | 从分区 |

【ISR同步条件】

- follower.fetch.min.bytes
- replica.lag.time.max.ms

【ACK设置】

| ACK值 | 说明 | 可靠性 |
|:---:|:---|:---|
| 0 | 不等待确认 | 低 |
| 1 | Leader确认 | 中 |
| -1/all | ISR全部确认 | 高 |

【可靠性配置】

```properties
# 生产者配置
acks=all
retries=3
enable.idempotence=true
```

【消息不丢条件】

1. 生产者：acks=all + 重试
2. Broker：副本数>=2
3. 消费者：手动提交""",
        "difficulty": 3
    },
    {
        "id": max_id + 5,
        "category": "消息队列与中间件",
        "question": "Kafka消息丢失和重复消费如何解决？",
        "answer": """【消息丢失场景】

```mermaid
graph TD
    A[消息丢失] --> B[生产者丢失]
    A --> C[Broker丢失]
    A --> D[消费者丢失]
    
    style A fill:#ffcdd2
```

【消息丢失解决】

| 场景 | 解决方案 |
|:---:|:---|
| 生产者 | acks=all + 重试 |
| Broker | 副本数>=2 |
| 消费者 | 手动提交 |

【消息重复原因】

| 原因 | 说明 |
|:---:|:---|
| 生产者重试 | 网络抖动导致重试 |
| 消费者重复消费 | 未及时提交offset |
| Rebalance | 消费者组变更 |

【幂等性实现】

```java
// 生产者幂等
props.put("enable.idempotence", true);

// 幂等条件
// 1. Producer ID (PID)
// 2. Sequence Number
// 3. 分区内唯一
```

【消费者幂等】

```java
// 业务层面幂等
// 1. 唯一ID
// 2. 状态机
// 3. 数据库去重
```

【最佳实践】

| 场景 | 方案 |
|:---:|:---|
| 金融级 | 幂等+事务 |
| 普通业务 | 幂等即可 |
| 允许延迟 | 消息去重 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 6,
        "category": "消息队列与中间件",
        "question": "Kafka分区分配策略？Rebalance过程？",
        "answer": """【分区分配策略】

| 策略 | 说明 | 特点 |
|:---:|:---|:---|
| Range | 按主题逐个分配 | 可能不均 |
| RoundRobin | 轮询 | 均匀 |
| Sticky | 粘性 | 减少移动 |

【Range策略】

```bash
# 示例：3消费者 5分区
C1: P0, P1
C2: P2, P3  
C3: P4
```

【RoundRobin策略】

```bash
# 所有主题一起分配
C1: P0, P3
C2: P1, P4
C3: P2
```

【Rebalance触发】

| 触发条件 | 说明 |
|:---:|:---|
| 消费者加入 | 新消费者 |
| 消费者离开 | 主动/异常 |
| 消费者数量变化 | 订阅变化 |

【Rebalance过程】

```mermaid
sequenceDiagram
    participant C as Consumer
    participant G as GroupCoordinator
    participant K as Kafka
    
    C->>G: JoinGroup
    G-->>C: JoinGroup响应
    C->>G: SyncGroup
    G-->>C: 分区分配结果
```

【避免Rebalance】

```properties
# 配置
session.timeout.ms=45s
heartbeat.interval.ms=10s
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 7,
        "category": "消息队列与中间件",
        "question": "RabbitMQ的交换机类型？消息路由模式？",
        "answer": """【RabbitMQ交换机类型】

```mermaid
graph TD
    A[Exchange] --> B[Direct]
    A --> C[Topic]
    A --> D[Fanout]
    A --> E[Headers]
    
    style A fill:#e1f5fe
```

【四种交换机】

| 类型 | 路由规则 | 示例 |
|:---:|:---|:---|
| Direct | 完全匹配 | rountingKey=key |
| Topic | 模糊匹配 | *.orange.# |
| Fanout | 广播 | 所有队列 |
| Headers | 属性匹配 | x-match=all |

【Direct路由】

```
Routing Key: order.created
Queue1: order.*      # 不匹配
Queue2: order.created # 匹配 ✓
```

【Topic路由】

| 符号 | 含义 |
|:---:|:---|
| * | 任意一个词 |
| # | 零或多个词 |

【Fanout】

```
exchange → 所有绑定的queue
```

【消息流程】

```mermaid
sequenceDiagram
    participant P as Producer
    participant E as Exchange
    participant Q as Queue
    participant C as Consumer
    
    P->>E: 发送消息(routingKey)
    E->>Q: 路由到匹配队列
    Q->>C: 推送消息
```""",
        "difficulty": 2
    },
    {
        "id": max_id + 8,
        "category": "消息队列与中间件",
        "question": "RabbitMQ如何保证消息不丢失？",
        "answer": """【消息丢失环节】

```mermaid
graph TD
    A[消息流程] --> B[生产者]
    A --> C[Broker]
    A --> D[消费者]
    
    B -->|1.生产丢失| B1
    C -->|2.存储丢失| C1
    C -->|3.消费丢失| D1
    
    style A fill:#ffcdd2
```

【生产者保证】

| 方案 | 说明 |
|:---:|:---|
| 事务 | 同步，性能差 |
| 确认机制 | 异步，推荐 |

```java
// 确认模式
channel.confirmSelect();
channel.addConfirmListener((ack, tag) -> {
    // 成功
}, (ack, tag) -> {
    // 失败，重试
});
```

【Broker保证】

| 方案 | 说明 |
|:---:|:---|
| 持久化 | 消息落盘 |
| 镜像队列 | 主从同步 |

```java
// 消息持久化
AMQP.BasicProperties properties = new AMQP.BasicProperties.Builder()
    .deliveryMode(2)  // 持久化
    .build();
```

【消费者保证】

| 方案 | 说明 |
|:---:|:---|
| 手动ACK | 处理后确认 |
| 关闭自动ACK | autoAck=false |

```java
// 手动确认
channel.basicConsume("queue", false, (tag, delivery) -> {
    try {
        // 业务处理
        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
    } catch (Exception e) {
        channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, true);
    }
});
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 9,
        "category": "消息队列与中间件",
        "question": "RocketMQ的架构？NameServer、Broker、Producer、Consumer？",
        "answer": """【RocketMQ架构】

```mermaid
graph TD
    A[RocketMQ] --> B[NameServer]
    A --> C[Broker]
    A --> D[Producer]
    A --> E[Consumer]
    
    B -->|路由发现| B1[无状态]
    C -->|消息存储| C1[Master/Slave]
    D -->|消息发送| D1[负载均衡]
    E -->|消息消费| E1[拉取/推送]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【核心组件】

| 组件 | 职责 |
|:---:|:---|
| NameServer | 路由注册中心，无状态 |
| Broker | 消息存储转发 |
| Producer | 消息生产者 |
| Consumer | 消息消费者 |

【Broker角色】

| 角色 | 说明 |
|:---:|:---|
| Master | 主节点，可写可读 |
| Slave | 从节点，只读 |

【消息存储结构】

```
CommitLog: 顺序存储所有消息
ConsumeQueue: 消息队列索引
IndexFile: 消息索引
```

【Producer发送模式】

| 模式 | 说明 |
|:---:|:---|
| 同步 | 等待发送结果 |
| 异步 | 回调通知 |
| 单向 | 不等待 |

【消费模式】

| 模式 | 说明 |
|:---:|:---|
| 集群消费 | 消息均分 |
| 广播消费 | 每个消费者全量 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 10,
        "category": "消息队列与中间件",
        "question": "RocketMQ的事务消息实现原理？",
        "answer": """【事务消息原理】

```mermaid
sequenceDiagram
    participant P as Producer
    participant B as Broker
    participant C as Consumer
    
    P->>B: 发送半消息
    B-->>P: 成功
    P->>B: 执行本地事务
    P->>B: 提交/回滚
    B-->>C: 投递消息
```

【事务消息流程】

| 步骤 | 说明 |
|:---:|:---|
| 1. 发送半消息 | 暂不投递 |
| 2. 执行本地事务 | 业务处理 |
| 3. 提交事务 | 消息可投递 |
| 4. 回滚 | 消息丢弃 |

【半消息】

- 暂不可见的消息
- 存储在RocketMQ内部
- 提交前对消费者不可见

【事务状态】

| 状态 | 说明 |
|:---:|:---|
| COMMIT | 提交，消息可投递 |
| ROLLBACK | 回滚，消息丢弃 |
| UNKNOWN | 未知，需回查 |

【事务回查】

```
本地事务执行超时 → Broker回查
  → Producer查询本地事务状态
  → 根据状态提交/回滚
```

【代码示例】

```java
// 事务生产者
TransactionListener listener = new TransactionListener() {
    @Override
    public LocalTransactionState executeLocalTransaction(Message msg, Object arg) {
        // 执行本地事务
        return LocalTransactionState.COMMIT;
    }
    
    @Override
    public LocalTransactionState checkLocalTransaction(MessageExt msg) {
        // 回查本地事务状态
        return LocalTransactionState.COMMIT;
    }
};

TransactionProducer producer = builder.createTransactionListener(listener);
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 11,
        "category": "消息队列与中间件",
        "question": "消息顺序性如何保证？全局有序vs分区有序？",
        "answer": """【消息顺序性】

```mermaid
graph LR
    A[消息顺序] --> B[全局有序]
    A --> C[分区有序]
    
    B -->|单分区| B1[性能低]
    C -->|同分区| C1[性能高]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【两种顺序】

| 类型 | 说明 |
|:---:|:---|
| 全局有序 | 所有消息严格有序 |
| 分区内有序 | 同分区消息有序 |

【分区有序实现】

```java
// 相同业务ID发送到同一分区
Integer orderId = order.getId();
int partition = orderId % partitionNum;
producer.send(message, new MessageQueueSelector() {
    @Override
    public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {
        int partition = (int) arg;
        return mqs.get(partition % mqs.size());
    }
}, orderId);
```

【消费有序】

```java
// 串行消费
consumer.registerMessageListener(new MessageListenerOrderly() {
    @Override
    public ConsumeOrderlyStatus consumeMessage(List<MessageExt> msgs, ConsumeOrderlyContext context) {
        context.setAutoCommit(false);
        for (MessageExt msg : msgs) {
            // 串行处理
        }
        return ConsumeOrderlyStatus.SUCCESS;
    }
});
```

【注意事项】

| 场景 | 方案 |
|:---:|:---|
| 全局有序 | 单分区 |
| 分区内有序 | 相同key |
| 避免乱序 | 串行消费 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 12,
        "category": "消息队列与中间件",
        "question": "消息积压如何处理？",
        "answer": """【消息积压处理】

```mermaid
graph TD
    A[消息积压] --> B[消费者扩容]
    A --> C[跳过消息]
    A --> D[清理积压]
    A --> E[优化消费]
    
    style A fill:#ffcdd2
```

【处理方案】

| 方案 | 说明 |
|:---:|:---|
| 消费者扩容 | 增加消费实例 |
| 跳过消息 | 跳过非关键消息 |
| 清理积压 | 删除/转移到DLQ |
| 优化消费 | 提高消费速度 |

【消费者扩容】

```bash
# Kafka扩容消费者
# 增加消费组实例数
```

【跳过消息】

```java
// 跳过积压消息
consumer.seekToEnd(topic, partition);
// 或指定位置
consumer.seek(topic, partition, timestamp);
```

【死信队列】

```java
// 消息进入死信队列
// 3次消费失败后进入DLQ
```

【优化消费逻辑】

| 优化点 | 说明 |
|:---:|:---|
| 批量消费 | 减少IO |
| 并行消费 | 多线程 |
| 减少日志 | 提升性能 |
| 异步处理 | 非阻塞 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 13,
        "category": "消息队列与中间件",
        "question": "消息队列选型？Kafka/RabbitMQ/RocketMQ对比？",
        "answer": """【MQ对比选型】

```mermaid
graph TD
    A[MQ选型] --> B[Kafka]
    A --> C[RabbitMQ]
    A --> D[RocketMQ]
    
    B -->|日志/大数据| B1
    C -->|中小规模| C1
    D -->|金融/电商| D1
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#c8e6c9
```

【对比表】

| 特性 | Kafka | RabbitMQ | RocketMQ |
|:---:|:---:|:---:|:---:|
| 吞吐量 | 百万级 | 万级 | 十万级 |
| 延迟 | 毫秒 | 微秒 | 毫秒 |
| 持久化 | 文件 | 内存+文件 | 文件 |
| 集群 | zk/kraft | 支持 | nameserver |
| 顺序消息 | 分区顺序 | 支持 | 支持 |
| 事务消息 | 弱 | 支持 | 完整支持 |

【Kafka适用场景】

| 场景 | 原因 |
|:---:|:---|
| 日志处理 | 高吞吐 |
| 大数据 | 生态完善 |
| 实时计算 | 消息堆积 |

【RabbitMQ适用场景】

| 场景 | 原因 |
|:---:|:---|
| 中小规模 | 简单易用 |
| 灵活路由 | 交换机丰富 |
| 低延迟 | Erlang实现 |

【RocketMQ适用场景】

| 场景 | 原因 |
|:---:|:---|
| 电商订单 | 事务消息 |
| 金融系统 | 可靠性高 |
| 削峰填谷 | 堆积能力强 |""",
        "difficulty": 2
    },
    {
        "id": max_id + 14,
        "category": "消息队列与中间件",
        "question": "Pulsar与Kafka的架构差异？分层存储？",
        "answer": """【Pulsar vs Kafka架构】

```mermaid
graph LR
    A[Pulsar] --> B[存算分离]
    A --> C[BookKeeper]
    A --> D[分层存储]
    
    style A fill:#e1f5fe
```

【核心差异】

| 特性 | Pulsar | Kafka |
|:---:|:---:|:---:|
| 架构 | 存算分离 | 耦合 |
| 存储 | BookKeeper | 自研 |
| 扩展 | 易扩展 | 难扩展 |
| 多租户 | 原生支持 | 需配置 |

【Pulsar架构】

```
Producer → Broker → BookKeeper
                ↓
           Topic分层
           (Tiered Storage)
```

【分层存储】

```bash
# Pulsar支持将旧消息存储到S3/HDFS
# 释放内存和磁盘
```

【BookKeeper特点】

| 特点 | 说明 |
|:---:|:---|
| 分布式 | 多节点存储 |
| 持久化 | 3副本确认 |
| 低延迟 | 毫秒级 |

【Pulsar优势】

| 优势 | 说明 |
|:---:|:---|
| 分层存储 | 降低成本 |
| 多租户 | 隔离性好 |
| 跨地域复制 | Geo-replication |""",
        "difficulty": 3
    },
    {
        "id": max_id + 15,
        "category": "消息队列与中间件",
        "question": "MQTT协议特点？物联网场景应用？",
        "answer": """【MQTT协议特点】

```mermaid
graph TD
    A[MQTT] --> B[发布订阅]
    A --> C[轻量级]
    A --> D[低带宽]
    A --> E[QoS等级]
    
    style A fill:#e1f5fe
```

【MQTT特点】

| 特点 | 说明 |
|:---:|:---|
| 轻量级 | 最小2字节头 |
| 发布订阅 | 解耦生产消费 |
| QoS | 3个等级 |
| 持久化 | 会话保持 |

【QoS等级】

| 等级 | 说明 | 可靠性 |
|:---:|:---|:---|
| QoS 0 | 最多一次 | 低 |
| QoS 1 | 至少一次 | 中 |
| QoS 2 | 正好一次 | 高 |

【MQTT协议示例】

```bash
# 连接
CONNECT clientId, username, password

# 订阅
SUBSCRIBE topic/home/temperature

# 发布
PUBLISH topic/home/temperature payload
```

【物联网场景】

| 场景 | 使用 |
|:---:|:---|
| 智能家居 | 设备状态同步 |
| 车联网 | 车辆实时数据 |
| 工业互联网 | 传感器采集 |
| 可穿戴设备 | 健康数据 |

【MQTT vs 其他MQ】

| 特性 | MQTT | Kafka/RocketMQ |
|:---:|:---:|:---:|
| 协议 | MQTT | 自有协议 |
| 设备 | 移动端友好 | 服务端为主 |
| 规模 | 亿级设备 | 百万级主题 |
| 延迟 | 低 | 中 |""",
        "difficulty": 2
    }
]

# 添加新题目
data.extend(new_questions)

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {len(new_questions)} new questions")
