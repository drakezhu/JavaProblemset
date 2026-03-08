import json
import re

with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 替换函数
def replace_ascii_diagrams(answer):
    # 替换锁升级过程
    answer = re.sub(
        r'【锁升级过程】.*?┌─────────────┐\s*│  重量级锁.*?└─────────────┘\s*```',
        '''【锁升级过程】

| 阶段 | 名称 | 说明 |
|:---:|:---:|:---|
| ① | 无锁 | 初始状态 |
| ② | 偏向锁 | 首次竞争，CAS写入ThreadID |
| ③ | 轻量级锁 | 自旋等待，CAS修改对象头 |
| ④ | 重量级锁 | 线程阻塞，系统Mutex |''',
        answer,
        flags=re.DOTALL
    )

    # 替换对象头结构
    answer = re.sub(
        r'【对象头结构】.*?└──────────────┴───────────────────────────────┘\s*```',
        '''【对象头结构】（64位）

| 偏向锁(2bit) | 锁状态 |
|:---:|:---|
| 01 | 无锁/偏向锁 |
| 00 | 轻量级锁 |
| 10 | 重量级锁 |
| 11 | GC标记 |''',
        answer,
        flags=re.DOTALL
    )

    # 替换执行流程
    answer = re.sub(
        r'【执行流程】\s*```\s*┌─.*?└─.*?```',
        '''【执行流程】

1. 提交任务
2. 判断线程数 < corePoolSize？
   - 是：创建新线程执行
   - 否：加入工作队列
3. 队列满且线程数 < maximumPoolSize？
   - 是：创建新线程
   - 否：执行拒绝策略''',
        answer,
        flags=re.DOTALL
    )

    # 替换AQS获取锁流程
    answer = re.sub(
        r'【AQS获取锁流程】\s*```\s*1\..*?```',
        '''【AQS获取锁流程】

1. `tryAcquire(arg)` - 尝试获取锁，成功则设置state
2. `addWaiter(Node.EXCLUSIVE)` - 加入等待队列
3. `acquireQueued(node, arg)` - 自旋尝试获取，失败则阻塞''',
        answer,
        flags=re.DOTALL
    )

    # 替换四种引用类型
    answer = re.sub(
        r'【四种引用类型】\s*```java\s*┌─.*?└─.*?```',
        '''【四种引用类型】

| 类型 | 说明 | 回收时机 |
|:---:|:---|:---|
| 强引用 | `Object obj = new Object()` | 永不回收 |
| 软引用 | `SoftReference<T>` | 内存不足时 |
| 弱引用 | `WeakReference<T>` | GC时立即 |
| 虚引用 | `PhantomReference<T>` | 随时可能被回收 |''',
        answer,
        flags=re.DOTALL
    )

    return answer

# 处理每个问题
for item in data:
    if 'answer' in item:
        item['answer'] = replace_ascii_diagrams(item['answer'])

# 保存
with open('d:/traeProjects/InterviewPrep/src/main/resources/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Processed {len(data)} questions")
