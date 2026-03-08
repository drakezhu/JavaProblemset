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
        "category": "数据库与缓存",
        "question": "MySQL索引底层数据结构？B+树的优势？",
        "answer": """【MySQL索引数据结构】

```mermaid
graph TD
    A[索引] --> B[Hash]
    A --> C[B+树]
    A --> D[二叉树]
    A --> E[红黑树]
    
    C --> C1[所有数据在叶子]
    C --> C2[叶子链表相连]
    
    style C fill:#e1f5fe
```

【B+树 vs B树】

| 特性 | B+树 | B树 |
|:---:|:---:|:---:|
| 数据存储 | 只在叶子 | 全部节点 |
| 叶子连接 | 链表 | 无 |
| 范围查询 | 高效 | 效率低 |
| 查询稳定 | O(log n) | O(log n) |

【B+树优势】

| 优势 | 说明 |
|:---:|:---|
| 磁盘IO少 | 树高固定，IO次数少 |
| 范围查询快 | 叶子节点链表相连 |
| 查询稳定 | 每次都是叶子 |
| 更适合索引 | Innodb默认索引 |

【B+树结构】

```
                    [根节点]
                   /   |   \\
            [内节点1] [内节点2] [内节点3]
              /  \\      |       /   \\
         [叶子1] [叶子2] ...   [叶子N]
         /  \\
       ...  ...
       
       ↓ 叶子节点链表相连
       
       [1] → [2] → [3] → [4] → [5]
```

【InnoDB索引特点】
- 聚簇索引：数据和索引在一起
- 主键索引：叶子节点存完整数据
- 二级索引：叶子节点存主键值""",
        "difficulty": 3
    },
    {
        "id": max_id + 2,
        "category": "数据库与缓存",
        "question": "聚簇索引和非聚簇索引的区别？回表查询？",
        "answer": """【聚簇索引 vs 非聚簇索引】

```mermaid
graph LR
    A[数据存储] --> B[聚簇索引]
    A --> C[非聚簇索引]
    
    B -->|数据在索引中| B1[主键顺序存储]
    C -->|索引+数据分离| C1[指针指向]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【核心区别】

| 特性 | 聚簇索引 | 非聚簇索引 |
|:---:|:---:|:---:|
| 数据存储 | 索引叶子节点 | 索引叶子节点存指针 |
| 数量 | 一个表一个 | 一个表多个 |
| 顺序 | 数据按索引顺序 | 索引独立 |
| 查询速度 | 主键查询快 | 索引覆盖快 |

【聚簇索引特点】

| 说明 | 内容 |
|:---:|:---|
| InnoDB | 主键是聚簇索引 |
| 数据顺序 | 按主键顺序物理存储 |
| 查询效率 | 主键查询最快 |
| 插入效率 | 可能导致页分裂 |

【非聚簇索引特点】

| 说明 | 内容 |
|:---:|:---|
| 二级索引 | 除主键外的索引 |
| 叶子节点 | 存储主键值 |
| 覆盖索引 | 索引包含查询字段 |

【回表查询】

```mermaid
graph TD
    A[SELECT * FROM user WHERE name='Tom'] --> B[查二级索引]
    B --> C{索引覆盖?}
    C -->|是| D[直接返回]
    C -->|否| E[回表查主键]
    E --> F[查聚簇索引]
    F --> D
    
    style E fill:#ffcdd2
```

【避免回表】
- 使用覆盖索引
- 只查询索引列
- 索引包含所有字段""",
        "difficulty": 3
    },
    {
        "id": max_id + 3,
        "category": "数据库与缓存",
        "question": "索引失效的常见场景？",
        "answer": """【索引失效场景】

```mermaid
graph TD
    A[索引失效] --> B[函数操作]
    A --> C[类型转换]
    A --> D[模糊查询]
    A --> E[or条件]
    A --> F[NOT操作]
    A --> G[统计函数]
    
    style A fill:#ffcdd2
```

【失效场景汇总】

| 场景 | 示例 | 原因 |
|:---:|:---|:---|
| 函数操作 | WHERE LEFT(name,3)='Tom' | 索引列被函数处理 |
| 类型转换 | WHERE name=123 | 类型不匹配 |
| 模糊查询 | WHERE name LIKE '%om' | 以%开头 |
| or条件 | WHERE name='A' OR age=20 | OR导致全表 |
| NOT操作 | WHERE age != 20 | 索引失效 |
| 全表扫描 | WHERE 1=1 | 避免使用 |
| 最左前缀 | WHERE b=1 AND c=1 | 跳过a |

【详细说明】

1️⃣ 函数操作
```sql
-- 失效
SELECT * FROM user WHERE LEFT(name,3)='Tom'

-- 生效
SELECT * FROM user WHERE name LIKE 'Tom%'
```

2️⃣ 类型转换
```sql
-- 失效（name是varchar）
SELECT * FROM user WHERE name=123

-- 生效
SELECT * FROM user WHERE name='123'
```

3️⃣ 模糊查询
```sql
-- 失效
SELECT * FROM user WHERE name LIKE '%om'

-- 生效
SELECT * FROM user WHERE name LIKE 'Tom%'
```

4️⃣ OR条件
```sql
-- 失效
SELECT * FROM user WHERE name='Tom' OR age=20

-- 生效（改为UNION）
SELECT * FROM user WHERE name='Tom'
UNION ALL
SELECT * FROM user WHERE age=20
```

【优化建议】
- 避免在索引列上使用函数
- 使用覆盖索引
- 遵循最左前缀原则""",
        "difficulty": 3
    },
    {
        "id": max_id + 4,
        "category": "数据库与缓存",
        "question": "事务的ACID特性？隔离级别及解决的问题？",
        "answer": """【事务ACID特性】

```mermaid
graph TD
    A[事务] --> A1[Atomic原子性]
    A --> A2[Consistency一致性]
    A --> A3[Isolation隔离性]
    A --> A4[Durability持久性]
    
    style A fill:#e1f5fe
```

| 特性 | 说明 |
|:---:|:---|
| Atomic | 全部成功或全部失败 |
| Consistency | 状态转换前后一致 |
| Isolation | 并发事务互不干扰 |
| Durability | 提交后永久保存 |

【隔离级别】

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|:---:|:---:|:---:|:---:|
| READ_UNCOMMITTED | ✅ | ✅ | ✅ |
| READ_COMMITTED | ❌ | ✅ | ✅ |
| REPEATABLE_READ | ❌ | ❌ | ✅ |
| SERIALIZABLE | ❌ | ❌ | ❌ |

【问题说明】

| 问题 | 说明 |
|:---:|:---|
| 脏读 | 读取到未提交的数据 |
| 不可重复读 | 两次读取结果不同 |
| 幻读 | 读取到新插入的行 |

【MySQL默认隔离级别】

```sql
-- MySQL默认REPEATABLE_READ
SELECT @@transaction_isolation;

-- 设置隔离级别
SET transaction isolation level READ_COMMITTED;
```

【InnoDB隔离级别实现】

| 隔离级别 | 实现方式 |
|:---:|:---|
| READ_COMMITTED | MVCC |
| REPEATABLE_READ | MVCC + Next-Key Lock |
| SERIALIZABLE | 锁 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 5,
        "category": "数据库与缓存",
        "question": "MVCC多版本并发控制原理？Read View机制？",
        "answer": """【MVCC原理】

```mermaid
graph TD
    A[MVCC] --> B[隐藏字段]
    A --> C[undo log]
    A --> D[Read View]
    
    B --> B1[trx_id]
    B --> B2[roll_pointer]
    B --> B3[row_id]
    
    style A fill:#e1f5fe
```

【隐藏字段】

| 字段 | 说明 |
|:---:|:---|
| trx_id | 事务ID |
| roll_pointer | 回滚指针 |
| row_id | 行ID（无主键时） |

【undo log】

- 记录数据变更前的版本
- 链式存储，形成版本链
- 用于回滚和快照读

【Read View】

```mermaid
graph TD
    A[Read View] --> B[m_ids]
    A --> C[min_trx_id]
    A --> D[max_trx_id]
    A --> E[creator_trx_id]
    
    B -->|活跃事务ID列表| B1
    C -->|最小活跃事务ID| C1
    D -->|创建视图时最大ID| D1
    E -->|创建者事务ID| E1
```

【快照读 vs 当前读】

| 类型 | 说明 | SQL |
|:---:|:---|:---|
| 快照读 | 读取历史版本 | SELECT |
| 当前读 | 读取最新版本 | SELECT ... FOR UPDATE |

【可见性判断】

```
1. trx_id < min_trx_id → 可见
2. trx_id > max_trx_id → 不可见
3. trx_id ∈ m_ids → 不可见
4. 其他 → 可见
```

【RR vs RC区别】

| 特性 | REPEATABLE_READ | READ_COMMITTED |
|:---:|:---:|:---:|
| 快照时机 | 事务开始时 | SQL开始时 |
| 每次SELECT | 同一快照 | 新快照 |
| 幻读 | 较少 | 较多 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 6,
        "category": "数据库与缓存",
        "question": "MySQL锁的类型？行锁、表锁、间隙锁、临键锁？",
        "answer": """【MySQL锁类型】

```mermaid
graph TD
    A[MySQL锁] --> B[行锁]
    A --> C[表锁]
    A --> D[意向锁]
    A --> E[Gap锁]
    
    B --> B1[Record Lock]
    B --> B2[Next-Key Lock]
    C --> C1[IS/IX]
    E --> E1[Gap Lock]
```

【锁粒度对比】

| 锁类型 | 粒度 | 开销 | 冲突 |
|:---:|:---:|:---:|:---:|
| 行锁 | 行 | 大 | 少 |
| 表锁 | 表 | 小 | 多 |
| 间隙锁 | 区间 | 中 | 中 |

【InnoDB行锁】

| 锁类型 | 说明 |
|:---:|:---|
| Record Lock | 单行记录锁 |
| Gap Lock | 间隙锁，锁定范围 |
| Next-Key Lock | Record Lock + Gap Lock |

【意向锁】

| 锁类型 | 说明 |
|:---:|:---|
| IS | 意图获取行共享锁 |
| IX | 意图获取行排他锁 |

【锁兼容矩阵】

|  | S | X | IS | IX |
|:---:|:---:|:---:|:---:|:---:|
| S | ✅ | ❌ | ✅ | ❌ |
| X | ❌ | ❌ | ❌ | ❌ |
| IS | ✅ | ❌ | ✅ | ✅ |
| IX | ❌ | ❌ | ✅ | ✅ |

【死锁产生】

```mermaid
graph TD
    A[事务A] --> B[UPDATE user SET age=20 WHERE id=1]
    B --> C[获取id=1锁]
    C --> D[UPDATE user SET age=21 WHERE id=2]
    D --> E[等待id=2锁]
    
    F[事务B] --> G[UPDATE user SET age=21 WHERE id=2]
    G --> H[获取id=2锁]
    H --> I[UPDATE user SET age=20 WHERE id=1]
    I --> J[等待id=1锁]
    
    style E fill:#ffcdd2
    style J fill:#ffcdd2
```

【避免死锁】
- 统一访问顺序
- 尽量小事务
- 降低隔离级别""",
        "difficulty": 3
    },
    {
        "id": max_id + 7,
        "category": "数据库与缓存",
        "question": "SQL优化的一般步骤？Explain分析哪些字段？",
        "answer": """【SQL优化步骤】

```mermaid
graph TD
    A[SQL优化] --> B[确定慢SQL]
    B --> C[Explain分析]
    C --> D[执行计划]
    D --> E[索引优化]
    E --> F[SQL改写]
    F --> G[架构优化]
    
    style A fill:#e1f5fe
```

【Explain关键字段】

| 字段 | 说明 | 关注点 |
|:---:|:---|:---|
| type | 连接类型 | 最好到ref/range |
| key | 使用索引 | 是否有索引 |
| rows | 扫描行数 | 越少越好 |
| Extra | 额外信息 | Using filesort/temporary |

【type类型（从好到差）】

| type | 说明 |
|:---:|:---|
| const | 主键/唯一索引等值查询 |
| eq_ref | 关联查询，主键/唯一 |
| ref | 非唯一索引等值查询 |
| range | 索引范围查询 |
| index | 全索引扫描 |
| ALL | 全表扫描 |

【Extra说明】

| 值 | 含义 |
|:---:|:---|
| Using filesort | 需要额外排序 |
| Using temporary | 使用临时表 |
| Using index | 覆盖索引 |
| Using where | 使用where过滤 |

【优化手段】

| 手段 | 说明 |
|:---:|:---|
| 覆盖索引 | SELECT只查索引列 |
| 索引下推 | ICP减少回表 |
| 强制索引 | FORCE INDEX |
| 改写SQL | 避免子查询 |

【优化示例】

```sql
-- 优化前
SELECT * FROM user WHERE YEAR(birthday) = 1990

-- 优化后（使用范围）
SELECT * FROM user WHERE birthday >= '1990-01-01' 
  AND birthday < '1991-01-01'
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 8,
        "category": "数据库与缓存",
        "question": "分库分表策略？垂直拆分vs水平拆分？",
        "answer": """【分库分表策略】

```mermaid
graph TD
    A[分库分表] --> B[垂直拆分]
    A --> C[水平拆分]
    
    B --> B1[按业务]
    B --> B2[按字段]
    
    C --> C1[按数据量]
    C --> C2[按时间]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【垂直拆分】

| 拆分方式 | 说明 |
|:---:|:---|
| 垂直分库 | 按业务拆分到不同库 |
| 垂直分表 | 按字段拆分到不同表 |

示例：
```
用户库 → 用户基本信息表 + 用户详情表
```

【水平拆分】

| 拆分方式 | 说明 |
|:---:|:---|
| 哈希分片 | 按ID % n |
| 范围分片 | 按ID范围/时间 |
| 一致性哈希 | 减少扩容影响 |

【分片键选择】

| 场景 | 分片键 |
|:---:|:---|
| 订单查询 | order_id / user_id |
| 用户查询 | user_id |
| 时间查询 | create_time |

【全局ID生成】

| 方案 | 优点 | 缺点 |
|:---:|:---|:---|
| UUID | 简单 | 无序 |
| 雪花算法 | 有序 | 依赖时钟 |
| 数据库号段 | 高性能 | 依赖DB |
| Redis | 高性能 | 可能重复 |

【ShardingSphere】

```yaml
spring:
  shardingsphere:
    rules:
      sharding:
        tables:
          order:
            actual-data-nodes: ds$->{0..1}.order_$->{0..3}
            database-strategy:
              standard:
                sharding-column: user_id
                sharding-algorithm-name: database_mod
            table-strategy:
              standard:
                sharding-column: order_id
                sharding-algorithm-name: table_mod
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 9,
        "category": "数据库与缓存",
        "question": "主从复制原理？binlog格式？延迟问题？",
        "answer": """【MySQL主从复制】

```mermaid
sequenceDiagram
    participant Master as Master
    participant Binlog as Binlog
    participant Slave as Slave
    participant Relay as RelayLog
    
    Master->>Master: 事务写入
    Master->>Binlog: 写入binlog
    Binlog->>Slave: IO线程拉取
    Slave->>Relay: 写入relay log
    Relay->>Slave: SQL线程执行
```

【复制原理】

| 步骤 | 说明 |
|:---:|:---|
| 1. 主库写入 | 事务写入binlog |
| 2. IO线程 | 主库拉取binlog |
| 3. relay log | 从库写入中继日志 |
| 4. SQL执行 | 从库重放SQL |

【binlog格式】

| 格式 | 说明 | 优点 |
|:---:|:---|:---|
| Statement | 记录SQL | 文件小 |
| Row | 记录行数据 | 准确 |
| Mixed | 混合模式 | 自动选择 |

【复制类型】

| 类型 | 说明 |
|:---:|:---|
| 异步复制 | 主从独立，延迟高 |
| 半同步复制 | 至少一个从库确认 |
| 全同步复制 | 所有从库确认 |

【延迟原因】

| 原因 | 解决方案 |
|:---:|:---|
| 网络延迟 | 优化网络 |
| 从库性能 | 提升硬件 |
| 大事务 | 拆分事务 |
| 并行复制 | 开启并行复制 |

【并行复制配置】

```sql
-- 开启并行复制
SET GLOBAL slave_parallel_type = 'LOGICAL_CLOCK';
SET GLOBAL slave_parallel_workers = 4;
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 10,
        "category": "数据库与缓存",
        "question": "Redis为什么快？单线程还是多线程？",
        "answer": """【Redis为什么快】

```mermaid
graph TD
    A[Redis快] --> B[内存操作]
    A --> C[IO多路复用]
    A --> D[单线程]
    A --> E[高效数据结构]
    
    B --> B1[内存访问ns级]
    C --> C1[Epoll模型]
    D --> D1[无锁竞争]
    E --> E1[Hash/跳表]
    
    style A fill:#c8e6c9
```

【Redis为什么快】

| 原因 | 说明 |
|:---:|:---|
| 内存操作 | 内存访问纳秒级 |
| IO多路复用 | 单线程处理高并发 |
| 无锁竞争 | 避免上下文切换 |
| 高效数据结构 | O(1)操作 |

【单线程 vs 多线程】

| 版本 | 模型 |
|:---:|:---|
| Redis 6之前 | 单线程（主命令处理） |
| Redis 6+ | 多线程（IO处理） |

【Redis 6多线程】

```
主线程：命令执行
IO线程：网络IO读写（可选）
```

【IO多路复用】

```mermaid
graph LR
    A[Client1] --> R[Redis]
    A2[Client2] --> R
    A3[Client3] --> R
    
    R -->|select/epoll| E[事件循环]
    E -->|处理事件| R
```

【高性能原因详解】

1. **内存存储**：内存操作比磁盘快10000倍
2. **单线程**：无锁开销，CPU不是瓶颈
3. **IO多路复用**：单线程处理大量连接
4. **非阻塞IO**：读写不等待
5. **数据结构优化**：SDS/ziplist/quicklist""",
        "difficulty": 2
    },
    {
        "id": max_id + 11,
        "category": "数据库与缓存",
        "question": "Redis数据类型及使用场景？ZSet底层？",
        "answer": """【Redis数据类型】

```mermaid
graph TD
    A[Redis数据类型] --> B[String]
    A --> C[Hash]
    A --> D[List]
    A --> E[Set]
    A --> F[ZSet]
    A --> G[Bitmap]
    A --> H[HyperLogLog]
    A --> I[Stream]
    
    style B fill:#e1f5fe
```

【数据类型与场景】

| 类型 | 特点 | 场景 |
|:---:|:---|:---|
| String | 简单值 | 缓存、计数器、分布式锁 |
| Hash | 字段值对 | 对象缓存 |
| List | 有序列表 | 消息队列、列表 |
| Set | 无序去重 | 标签、好友 |
| ZSet | 有序去重 | 排行榜、延迟队列 |

【String使用场景】

```bash
# 缓存
SET user:1:name "Tom"
GET user:1:name

# 计数器
INCR views:article:1
GET views:article:1

# 分布式锁
SETNX lock "1"
EXPIRE lock 10
```

【ZSet底层结构】

```mermaid
graph TD
    A[ZSet] --> B[ziplist]
    A --> C[skiplist + dict]
    
    C --> C1[跳表]
    C --> C2[字典]
    
    C1 -->|有序| C11[O(logN)查询]
    C2 -->|快速| C21[O(1)查找]
```

【ZSet存储选择】

| 条件 | 使用结构 |
|:---:|:---|
| 元素<128 && 字节<64 | ziplist |
| 其他 | skiplist + dict |

【ZSet使用场景】

```bash
# 排行榜
ZADD leaderboard 100 user:1
ZADD leaderboard 90 user:2
ZREVRANGE leaderboard 0 9 WITHSCORES

# 延迟队列
ZADD delay:queue 1700000000 "task:1"
ZRANGEBYSCORE delay:queue 0 $NOW
```""",
        "difficulty": 2
    },
    {
        "id": max_id + 12,
        "category": "数据库与缓存",
        "question": "Redis持久化RDB和AOF的区别？混合持久化？",
        "answer": """【Redis持久化方式】

```mermaid
graph LR
    A[Redis持久化] --> B[RDB]
    A --> C[AOF]
    A --> D[混合持久化]
    
    B -->|快照| B1[定期生成]
    C -->|日志| C1[追加保存]
    D --> B2[RDB+AOF]
    
    style B fill:#e1f5fe
    style C fill:#fff3e0
```

【RDB vs AOF对比】

| 特性 | RDB | AOF |
|:---:|:---:|:---|
| 方式 | 快照 | 追加日志 |
| 文件体积 | 小 | 大 |
| 恢复速度 | 快 | 慢 |
| 数据安全 | 丢数据 | 可配置 |
| 性能影响 | fork阻塞 | 持续IO |

【RDB原理】

```mermaid
graph TD
    A[fork子进程] --> B[遍历内存]
    B --> C[RDB文件]
    C --> D[替换旧文件]
    
    style A fill:#ffcdd2
```

- bgsave：后台异步保存
- fork：复制页表，不复制内存
- COW：写时复制技术

【AOF原理】

| 写回策略 | 说明 |
|:---:|:---|
| always | 每条命令同步 |
| everysec | 每秒同步 |
| no | 操作系统决定 |

```bash
# 配置
appendonly yes
appendfsync everysec
```

【混合持久化】

```bash
# 开启
aof-use-rdb-preamble yes
```

混合模式：
1. 重写时用RDB格式
2. 新增命令用AOF格式
3. 加载时自动识别""",
        "difficulty": 2
    },
    {
        "id": max_id + 13,
        "category": "数据库与缓存",
        "question": "Redis缓存穿透、击穿、雪崩的解决方案？",
        "answer": """【缓存问题】

```mermaid
graph TD
    A[缓存问题] --> B[穿透]
    A --> C[击穿]
    A --> D[雪崩]
    
    B -->|查询不存在| B1[大量请求到DB]
    C -->|热点key过期| C1[并发请求DB]
    D -->|大量key过期| D1[DB压力过大]
    
    style B fill:#ffcdd2
    style C fill:#ffcdd2
    style D fill:#ffcdd2
```

【缓存穿透】

| 问题 | 解决方案 |
|:---:|:---|
| 查询不存在的数据 | 布隆过滤器 |
| | 空值缓存 |
| | 接口校验 |

```java
// 布隆过滤器
BloomFilter<String> filter = BloomFilter.create(...);
if (!filter.mightContain(key)) {
    return null; // 直接返回
}
```

【缓存击穿】

| 问题 | 解决方案 |
|:---:|:---|
| 热点key过期 | 互斥锁 |
| 并发请求 | 永不过期 |
| | 双检锁 |

```java
// 双检锁
String value = redis.get(key);
if (value == null) {
    synchronized (this) {
        value = redis.get(key);
        if (value == null) {
            value = db.get(key);
            redis.set(key, value);
        }
    }
}
```

【缓存雪崩】

| 问题 | 解决方案 |
|:---:|:---|
| 大量key过期 | 随机过期时间 |
| | 永不过期 |
| | 集群部署 |
| | 限流降级 |

```yaml
# 随机过期时间
- SET key value EX $((RANDOM % 9000) + 1000)
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 14,
        "category": "数据库与缓存",
        "question": "Redis分布式锁的实现？Redisson原理？",
        "answer": """【分布式锁实现】

```mermaid
graph TD
    A[分布式锁] --> B[SETNX]
    A --> C[SET NX EX]
    A --> D[Redisson]
    
    B -->|基础版| B1[原子性]
    C -->|完善版| C1[过期/重试]
    D -->|高级版| D1[看门狗/自动续期]
```

【SET命令实现】

```bash
# 基础版
SET lock value NX EX 30

# 返回OK获取锁
# 返回nil获取失败
```

【问题与解决方案】

| 问题 | 解决 |
|:---:|:---|
| 锁过期 | 看门狗自动续期 |
| 不可重入 | 计数+Lua脚本 |
| 误删锁 | value=UUID |
| 主从脑裂 | RedLock |

【Redisson原理】

```mermaid
graph TD
    A[获取锁] --> B[SET lock uuid NX EX]
    B --> C{成功?}
    C -->|是| D[开启看门狗]
    C -->|否| E[订阅解锁消息]
    E --> F[重试]
    F --> B
    
    D --> G[每10秒续期]
    G --> H{仍持有锁?}
    H -->|是| G
    H -->|否| I[自动解锁]
```

【看门狗机制】

```java
// 自动续期
watchdog.scheduleExpirationRenewal(threadId);

// 续期逻辑
if (ttl > 0) {
    redis.expire(lockKey, ttl);
}
```

【RedLock算法】

```bash
# 多个Redis实例
1. 获取当前时间
2. 依次获取锁
3. 超过半数成功
4. 计算持有时间
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 15,
        "category": "数据库与缓存",
        "question": "Redis集群模式？哨兵vsCluster？哈希槽？",
        "answer": """【Redis集群模式】

```mermaid
graph TD
    A[Redis集群] --> B[主从复制]
    A --> C[哨兵模式]
    A --> C[Cluster模式]
    
    B -->|一主多从| B1
    C -->|高可用| C1[自动故障转移]
    C -->|数据分片| C2[16384槽]
```

【三种模式对比】

| 模式 | 数据分片 | 高可用 | 客户端 |
|:---:|:---:|:---:|:---:|
| 主从 | ❌ | ❌ | 需手动 |
| 哨兵 | ❌ | ✅ | 需适配 |
| Cluster | ✅ | ✅ | 需迁移 |

【哨兵模式】

```
Master1 ──→ Slave1
    ↑          ↑
  哨兵监控   故障转移
```

| 职责 | 说明 |
|:---:|:---|
| 监控 | 检查主从状态 |
| 通知 | 推送故障 |
| 选主 | 选择新主库 |

【Cluster模式】

```mermaid
graph TD
    A[16384个槽] --> B[Node1:0-5460]
    A --> C[Node2:5461-10922]
    A --> D[Node3:10923-16383]
    
    B --> E[主从]
    C --> F[主从]
    D --> G[主从]
```

【哈希槽计算】

```bash
# CRC16算法
slot = CRC16(key) % 16384

# 示例
key = "user:1"
slot = CRC16("user:1") % 16384
```

【集群操作】

```bash
# 扩容
redis-cli --cluster add-node new_host:new_port

# 迁移槽
redis-cli --cluster reshard host:port
```""",
        "difficulty": 3
    },
    {
        "id": max_id + 16,
        "category": "数据库与缓存",
        "question": "Redis大Key和热Key问题？如何发现和处理？",
        "answer": """【大Key与热Key】

```mermaid
graph TD
    A[Redis问题] --> B[大Key]
    A --> C[热Key]
    
    B -->|内存过大| B1[阻塞/内存不足]
    C -->|请求过多| C1[CPU过高/崩溃]
    
    style B fill:#ffcdd2
    style C fill:#ffcdd2
```

【大Key问题】

| 问题 | 影响 |
|:---:|:---|
| 内存倾斜 | 单节点内存高 |
| 阻塞 | del/expire阻塞 |
| 传输 | 网络带宽高 |

【热Key问题】

| 问题 | 影响 |
|:---:|:---|
| CPU高 | 单节点压力大 |
| 崩溃 | 雪崩效应 |

【发现方法】

```bash
# 大Key
redis-cli --bigkeys

# 热Key
redis-cli --hotkeys

# 内存分析
MEMORY USAGE key
```

【处理方案】

| 问题 | 方案 |
|:---:|:---|
| 大Key拆分 | String→Hash |
| 大Key压缩 | 压缩算法 |
| 大Key删除 | UNLINK（非阻塞） |
| 热Key本地缓存 | 多级缓存 |
| 热Key分散 | 读写分离 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 17,
        "category": "数据库与缓存",
        "question": "MySQL和Redis一致性如何保证？",
        "answer": """【缓存一致性】

```mermaid
graph LR
    A[更新策略] --> B[Cache Aside]
    A --> C[Read Through]
    A --> D[Write Through]
    A --> E[Write Behind]
    
    style A fill:#e1f5fe
```

【Cache Aside模式】

| 策略 | 说明 |
|:---:|:---|
| 读 | 缓存→miss→DB→缓存 |
| 写 | DB→删除缓存 |

【延迟双删】

```java
// 更新数据库
db.update(user);

// 删除缓存
redis.delete(key);

// 延迟删除（防并发）
Thread.sleep(100);
redis.delete(key);
```

【方案对比】

| 方案 | 优点 | 缺点 |
|:---:|:---|:---|
| 先删缓存 | 简单 | 可能不一致 |
| 先更新DB | 简单 | 可能不一致 |
| 延迟双删 | 减少不一致 | 有延迟 |
| 订阅binlog | 实时 | 复杂度高 |
| MQ解耦 | 解耦 | 引入MQ |

【最佳实践】

| 场景 | 方案 |
|:---:|:---|
| 低一致性 | TTL缓存 |
| 高一致性 | 双检+延迟 |
| 实时一致 | binlog订阅 |""",
        "difficulty": 3
    },
    {
        "id": max_id + 18,
        "category": "数据库与缓存",
        "question": "Elasticsearch倒排索引原理？与MySQL对比？",
        "answer": """【倒排索引原理】

```mermaid
graph TD
    A[文档] --> B[分词]
    B --> C[倒排表]
    C --> D[Term:DocID列表]
    
    style C fill:#e1f5fe
```

【正排 vs 倒排】

| 类型 | 说明 |
|:---:|:---|
| 正排 | DocID → 文档内容 |
| 倒排 | Term → DocID列表 |

【倒排表示例】

```
文档1: "Tom loves Java"
文档2: "Java is great"
文档3: "Tom works"

倒排索引:
Tom    → [1, 3]
loves  → [1]
Java   → [1, 2]
is     → [2]
great  → [2]
works  → [3]
```

【ES vs MySQL对比】

| 特性 | Elasticsearch | MySQL |
|:---:|:---:|:---:|
| 索引类型 | 倒排 | B+树 |
| 查询能力 | 全文搜索 | 精确匹配 |
| 性能 | 聚合/搜索快 | 事务支持 |
| 数据量 | PB级 | TB级 |

【使用场景】

| 场景 | 选择 |
|:---:|:---|
| 精确查询 | MySQL |
| 全文搜索 | ES |
| 日志分析 | ES |
| 业务数据 | MySQL |""",
        "difficulty": 3
    },
    {
        "id": max_id + 19,
        "category": "数据库与缓存",
        "question": "MongoDB适用场景？文档模型设计？",
        "answer": """【MongoDB特点】

```mermaid
graph TD
    A[MongoDB] --> B[文档数据库]
    A --> C[JSON存储]
    A --> D[高扩展]
    A --> E[高并发]
    
    style A fill:#e1f5fe
```

【适用场景】

| 场景 | 说明 |
|:---:|:---|
| 日志系统 | 写入量大 |
| 社交数据 | 灵活结构 |
| 物联网 | 时序数据 |
| 内容管理 | 文档存储 |

【文档模型设计】

```json
{
  "_id": "user:1",
  "name": "Tom",
  "address": {
    "city": "Beijing",
    "street": "Chaoyang"
  },
  "tags": ["vip", "active"],
  "orders": [
    {"id": 1, "amount": 100},
    {"id": 2, "amount": 200}
  ]
}
```

【设计原则】

| 原则 | 说明 |
|:---:|:---|
| 内嵌 | 一对一/子文档 |
| 引用 | 一对多/关联 |
| 范式 | 按查询设计 |""",
        "difficulty": 2
    },
    {
        "id": max_id + 20,
        "category": "数据库与缓存",
        "question": "HBase的LSM树结构？RowKey设计原则？",
        "answer": """【HBase LSM树】

```mermaid
graph TD
    A[写入] --> B[MemStore]
    B --> C[SSTable]
    C --> D[合并]
    C --> E[Compaction]
    
    style A fill:#e1f5fe
```

【LSM树特点】

| 特点 | 说明 |
|:---:|:---|
| 顺序写 | 写性能高 |
| 内存缓冲 | MemStore |
| 磁盘合并 | Compaction |
| 多层结构 | L0→Ln |

【RowKey设计】

| 原则 | 说明 |
|:---:|:---|
| 散列 | MD5/hash |
| 长度 | 越短越好 |
| 唯一 | 唯一标识 |
| 排序 | 按查询顺序 |

【盐值设计】

```bash
# 加盐
salt = id % 3
rowkey = salt + "_" + id

# 预分区
create 'table', 'cf', {SPLITS => ['1', '2', '3']}
```""",
        "difficulty": 3
    }
]

# 添加新题目
data.extend(new_questions)

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {len(new_questions)} new questions")
