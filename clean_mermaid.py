import json
import re

with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_and_add_mermaid(answer):
    # 1. 类加载过程 - 完整替换
    if '【类加载过程】' in answer:
        mermaid = '''【类加载过程】

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

**流程说明：**
1. 加载：通过类的全限定名获取类的二进制字节流
2. 验证：检查文件格式、元数据、字节码
3. 准备：为类变量分配内存、设置初始值
4. 解析：将符号引用转为直接引用
5. 初始化：执行<clinit>()方法'''
        # 删除旧的ASCII格式
        answer = re.sub(r'【类加载过程】.*?(【|$)', r'【类加载过程】', answer, flags=re.DOTALL)
        answer = mermaid + '\n\n' + answer

    # 2. 双亲委派模型 - 完整替换
    if '【双亲委派模型】' in answer:
        mermaid = '''【双亲委派模型】

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

**流程：** Application → Extension → Bootstrap → 依次返回 → Application加载'''
        # 删除旧的
        answer = re.sub(r'【双亲委派模型】.*?(【|$)', r'【双亲委派模型】', answer, flags=re.DOTALL)
        answer = mermaid + '\n\n' + answer

    # 3. 线程池执行流程 - 完整替换
    if '【执行流程】' in answer and '线程池' in answer:
        mermaid = '''【执行流程】

```mermaid
flowchart TD
    A[提交任务] --> B{线程数 < corePoolSize?}
    B -->|是| C[创建新线程执行]
    B -->|否| D[加入工作队列]
    D --> E{队列满?}
    E -->|是| F{线程数 < max?}
    E -->|否| G[等待执行]
    F -->|是| H[创建新线程]
    F -->|否| I[执行拒绝策略]
    C --> J[任务完成]
    G --> J
    H --> J
    
    style A fill:#e1f5fe
    style C fill:#c8e6c9
    style I fill:#ffcdd2
    style J fill:#fff9c4
```'''
        # 删除旧的
        old_pattern = r'【执行流程】.*?```\s*```'
        answer = re.sub(old_pattern, mermaid, answer, flags=re.DOTALL)

    # 4. AQS获取锁流程 - 完整替换
    if '【AQS获取锁流程】' in answer:
        mermaid = '''【AQS获取锁流程】

```mermaid
flowchart TD
    A[tryAcquire] --> B{成功?}
    B -->|是| C[设置state<br/>返回true]
    B -->|否| D[addWaiter<br/>加入等待队列]
    D --> E[acquireQueued<br/>自旋尝试]
    E --> F{获取成功?}
    F -->|是| G[线程执行]
    F -->|否| H[阻塞等待]
    H --> I[前驱唤醒]
    I --> E
    
    style C fill:#c8e6c9
    style G fill:#fff9c4
    style H fill:#ffcdd2
```'''
        old_pattern = r'【AQS获取锁流程】.*?```\s*```'
        answer = re.sub(old_pattern, mermaid, answer, flags=re.DOTALL)

    # 5. Java内存模型 - 完整替换
    if '【Java内存模型' in answer and '抽象结构' in answer:
        mermaid = '''1️⃣ 抽象结构

```mermaid
graph LR
    subgraph MainMemory["主内存（堆）"]
        M[共享变量]
    end
    
    subgraph ThreadA["线程A 工作内存"]
        WA[变量副本]
    end
    
    subgraph ThreadB["线程B 工作内存"]
        WB[变量副本]
    end
    
    WA -->|read/load| M
    WB -->|read/load| M
    M -->|use/assign| WA
    M -->|use/assign| WB
    
    style MainMemory fill:#fff3e0
    style ThreadA fill:#e1f5fe
    style ThreadB fill:#e1f5fe
```'''
        old_pattern = r'1️⃣ 抽象结构.*?```\s*```'
        answer = re.sub(old_pattern, mermaid, answer, flags=re.DOTALL)

    # 6. I/O模型概述 - 完整替换
    if '【I/O模型概述】' in answer:
        mermaid = '''【I/O模型概述】

```mermaid
graph TD
    A[I/O模型] --> B[BIO<br/>同步阻塞]
    A --> C[NIO<br/>同步非阻塞]
    A --> D[AIO<br/>异步非阻塞]
    
    B --> E[一连接一线程]
    C --> F[Selector多路复用]
    D --> G[回调通知]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
```'''
        old_pattern = r'【I/O模型概述】.*?```\s*```'
        answer = re.sub(old_pattern, mermaid, answer, flags=re.DOTALL)

    # 7. GC四大基础算法 - 完整替换
    if '【四大基础算法】' in answer:
        mermaid = '''【四大基础算法】

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
```'''
        old_pattern = r'【四大基础算法】.*?```\s*```'
        answer = re.sub(old_pattern, mermaid, answer, flags=re.DOTALL)

    return answer

# 处理每个问题
for item in data:
    if 'answer' in item:
        item['answer'] = clean_and_add_mermaid(item['answer'])

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Processed {len(data)} questions")
