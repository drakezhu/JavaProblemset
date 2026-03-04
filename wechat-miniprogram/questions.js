// questions.js - 面试题数据
const questionsData = [
  {
    id: 1,
    category: "Java基础与核心",
    question: "HashMap的底层实现原理？JDK 1.8做了哪些优化？",
    answer: "【核心原理】\nHashMap底层采用数组+链表+红黑树的数据结构实现。\n\n1️⃣ 基本结构\n- 数组称为\"桶\"（Bucket），每个桶存储一个链表或红黑树的头节点\n- 通过key的hashCode()计算哈希值，再通过扰动函数处理后确定元素在数组中的位置\n\n2️⃣ 寻址方式\n```\nindex = hash(key) & (length - 1)\n```\n使用位运算代替取模，提高计算效率\n\n3️⃣ 哈希冲突处理\n- 当多个key映射到同一位置时，使用链表存储冲突元素\n- JDK 8优化：当链表长度>8且数组容量>=64时，链表转为红黑树\n- 红黑树查询时间复杂度从O(n)优化为O(log n)\n\n【JDK 1.8优化】\n1. 数据结构优化：引入红黑树，解决链表过长导致的查询效率问题\n2. 哈希算法优化：使用扰动函数（hash = h ^ (h >>> 16)），减少哈希碰撞\n3. 扩容优化：扩容时只需要重新计算索引位置，无需重新哈希\n4. 插入顺序优化：JDK 7使用头插法，JDK 8改为尾插法，避免死循环（但仍非线程安全）\n5. 取消Segment：JDK 7使用Segment分段锁，JDK 8改为CAS+synchronized\n\n【关键参数】\n- 默认容量：16（必须是2的幂次）\n- 负载因子：0.75（扩容阈值 = 容量 × 0.75）\n- 树化阈值：8\n- 链表化阈值：6",
    difficulty: 3
  },
  {
    id: 2,
    category: "Java基础与核心",
    question: "ConcurrentHashMap如何保证线程安全？1.7和1.8的区别？",
    answer: "【线程安全保证】\nConcurrentHashMap通过以下机制保证线程安全：\n\n1️⃣ JDK 7：Segment分段锁\n- 底层数组分为多个Segment，每个Segment继承ReentrantLock\n- 每个Segment相当于一个小的HashMap，锁的粒度是Segment\n- 理论上支持Segment数量个线程并发操作\n\n2️⃣ JDK 8：CAS + Synchronized\n- 放弃Segment，使用Node数组+链表+红黑树\n- 使用CAS（Compare-And-Swap）无锁操作进行初始化\n- 使用synchronized锁定头节点，进行写操作\n- 读操作完全无锁，支持高并发读\n\n【JDK 7 vs JDK 8区别】\n\n| 特性 | JDK 7 | JDK 8 |\n|------|-------|-------|\n| 数据结构 | Segment数组 + HashEntry数组 + 链表 | Node数组 + 链表 + 红黑树 |\n| 锁粒度 | Segment（分段锁） | 桶节点（synchronized） |\n| 并发度 | 16（默认） | 数组长度 |\n| 扩容 | 只扩容Segment | 只扩容单个桶 |\n| 初始化 | 复杂 | 简化 |\n| 查询复杂度 | O(n) | O(log n)（树化后）|\n\n【核心源码逻辑】\n```java\n// JDK 8 put操作\nfinal V putVal(K key, V value, boolean onlyIfAbsent) {\n    if (key == null || value == null) throw new NullPointerException();\n    int hash = spread(key.hashCode());\n    for (Node<K,V>[] tab = table; ...) {\n        int n; Node<K,V> f;\n        // CAS初始化数组\n        if ((tab = table) == null || (n = tab.length) == 0)\n            n = (tab = initTable()).length;\n        // 无锁查询\n        if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {\n            // CAS无锁插入\n            if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null)))\n                break;\n        }\n        // synchronized锁定头节点进行插入\n        synchronized (f) {\n            // 链表/红黑树插入逻辑\n        }\n    }\n    addCount(1L, binCount);\n    return null;\n}\n```",
    difficulty: 3
  },
  {
    id: 3,
    category: "Java基础与核心",
    question: "ArrayList和LinkedList的区别？使用场景？",
    answer: "【底层数据结构】\n- ArrayList：Object[]数组\n- LinkedList：双向链表（Node节点包含prev、item、next）\n\n【核心区别】\n\n| 操作 | ArrayList | LinkedList |\n|------|-----------|------------|\n| 随机访问 | O(1)，直接通过索引计算内存地址 | O(n)，需要遍历链表 |\n| 头部插入/删除 | O(n)，需要移动所有元素 | O(1)，只需修改指针 |\n| 尾部插入/删除 | 均摊O(1)， amortized O(1) | O(1) |\n| 指定位置插入 | O(n) | O(n)，但查找位置O(n) |\n| 内存占用 | 紧凑，只需存储元素 | 每个节点额外存储前后指针 |\n| 缓存友好 | ✅ 数组元素连续，CPU缓存命中率高 | ❌ 节点分散，缓存命中率低 |\n\n【使用场景】\n\n✅ ArrayList适用场景：\n- 需要频繁随机访问元素\n- 主要是遍历操作，较少进行插入删除\n- 需要更好的内存效率和CPU缓存性能\n\n✅ LinkedList适用场景：\n- 频繁在头部或中间进行插入删除操作\n- 不需要随机访问，主要通过迭代器遍历\n- 作为栈、队列使用时\n\n【源码要点】\nArrayList扩容机制：\n- 默认容量：10\n- 扩容方式：Arrays.copyOf()创建新数组\n- 扩容因子：1.5倍（newCapacity = oldCapacity + (oldCapacity >> 1)）\n\nLinkedList特点：\n- 实现了List和Deque接口\n- 既可以作为列表，也可以作为双端队列使用\n- 无容量限制，按需增长",
    difficulty: 2
  },
  {
    id: 4,
    category: "Java基础与核心",
    question: "String、StringBuilder、StringBuffer的区别？",
    answer: "【三者对比】\n\n| 特性 | String | StringBuilder | StringBuffer |\n|------|--------|---------------|--------------|\n| 底层实现 | char[] (JDK 9+ byte[]) | char[] | char[] |\n| 线程安全 | ✅ 安全（不可变） | ❌ 不安全 | ✅ 安全（同步方法） |\n| 性能 | 创建新对象开销大 | 最快 | 有同步开销 |\n| 用途 | 字符串常量 | 单线程字符串拼接 | 多线程字符串拼接 |\n\n【String不可变性】\n1. String类声明为final，不能被继承\n2. char[] value声明为private final，不可修改\n3. 没有任何暴露内部数组的修改方法\n4. 每次\"+\"拼接都会创建新对象\n\n【性能分析】\n```java\n// String拼接 - 每次创建新对象\nString s = \"a\";\ns = s + \"b\";  // 创建3个对象：StringBuilder + \"ab\" + String\n\n// StringBuilder - 推荐单线程\nStringBuilder sb = new StringBuilder();\nsb.append(\"a\").append(\"b\");  // 只创建一个对象\n\n// StringBuffer - 多线程安全\nStringBuffer sb = new StringBuffer();\nsb.append(\"a\").append(\"b\");  // synchronized方法，有锁开销\n```\n\n【使用建议】\n1. 字符串常量优先使用String\n2. 单线程字符串拼接使用StringBuilder\n3. 多线程字符串拼接使用StringBuffer\n4. 循环内拼接必须使用StringBuilder，避免创建过多中间对象\n\n【JDK 9优化】\n- String底层从char[]改为byte[] + coder标记\n- Latin-1字符用一个字节存储，节省内存",
    difficulty: 2
  },
  {
    id: 5,
    category: "Java基础与核心",
    question: "==和equals()的区别？hashCode()和equals()的关系？",
    answer: "【== 操作符】\n- 比较的是引用地址（内存地址）\n- 作用于基本类型时比较值，作用于对象时比较引用\n- 编译时确定，无法重写\n\n```java\nString s1 = new String(\"hello\");\nString s2 = new String(\"hello\");\ns1 == s2  // false，不同对象，地址不同\n\"hello\" == \"hello\"  // true，字符串常量池复用\n```\n\n【equals()方法】\n- Object类的默认实现就是==\n- 可以被重写，定义对象的\"相等\"逻辑\n- String、Integer等类都重写了equals()\n\n```java\n// String重写的equals\npublic boolean equals(Object anObject) {\n    if (this == anObject) return true;\n    if (anObject instanceof String) {\n        String anotherString = (String)anObject;\n        int n = value.length;\n        if (n == anotherString.value.length) {\n            // 逐字符比较\n            for (int i = 0; i < n; i++)\n                if (value[i] != anotherString.value[i]) return false;\n            return true;\n        }\n    }\n    return false;\n}\n```\n\n【hashCode()方法】\n- 返回对象的哈希码（int类型）\n- 用于HashMap、HashSet等哈希结构快速定位\n- Object默认实现：将对象内存地址转换为哈希值\n\n【equals()与hashCode()契约】\n> 如果两个对象equals()返回true，则hashCode()必须相同\n> 如果两个对象hashCode()相同，equals()不一定返回true（哈希冲突）\n\n【在HashMap中使用】\n```java\n// put操作流程\nint hash = hash(key);  // 计算哈希值\nint index = hash & (length - 1);  // 定位桶\n// 遍历链表/红黑树\nfor (int i = 0; i < size; i++) {\n    if (hash == node.hash && \n        (key == node.key || key.equals(node.key))) {\n        // 找到相同key，替换value\n    }\n}\n```\n\n【常见面试题】\n1. 为什么重写equals()必须重写hashCode()？\n   - 保证相等的对象在哈希表中能正确存储和查找\n   - 违反契约会导致HashMap、HashSet行为异常\n\n2. String为什么不直接用==比较？\n   - ==比较引用，new创建的对象地址不同\n   - equals()比较内容，更符合字符串相等的语义",
    difficulty: 2
  },
  {
    id: 6,
    category: "Java基础与核心",
    question: "什么是Java内存模型(JMM)？volatile关键字的作用？",
    answer: "【Java内存模型JMM】\nJMM（Java Memory Model）是一种规范，定义了线程和主内存之间的交互关系。\n\n1️⃣ 抽象结构\n- 主内存：共享变量存储区域\n- 工作内存：每个线程的独立内存空间\n- 线程通过read/load从主内存读取，通过use/assign写回主内存\n\n2️⃣ 八种操作\n- lock/unlock：作用于主内存变量\n- read/load：主内存→工作内存\n- use/assign：工作内存→执行引擎\n- store/write：工作内存→主内存\n\n【volatile关键字作用】\n\n1️⃣ 保证可见性\n- 写操作立即刷新到主内存\n- 读操作从主内存读取最新值\n\n2️⃣ 禁止指令重排序\n- volatile前后的代码不能重排\n\n【volatile vs synchronized】\n| 特性 | volatile | synchronized |\n|------|---------|---------------|\n| 原子性 | 不保证 | 保证 |\n| 可见性 | 保证 | 保证 |\n| 有序性 | 部分保证 | 保证 |\n\n【使用场景】\n- 状态标记量（如停止标志）\n- 单例模式的double-check（配合synchronized）",
    difficulty: 3
  },
  {
    id: 7,
    category: "Java基础与核心",
    question: "synchronized的底层实现？锁升级过程？",
    answer: "【synchronized核心原理】\n基于Monitor（监视器锁）实现，每个对象都关联一个Monitor。\n\n1️⃣ 同步方法\n- 方法ACC_SYNCHRONIZED标志\n- 执行前获取monitor，执行后释放\n\n2️⃣ 同步代码块\n- monitorenter指令获取锁\n- monitorexit指令释放锁\n\n【Monitor结构】\n```c\n// 简化结构\nstruct ObjectMonitor {\n    _owner;        // 持有锁的线程\n    _WaitSet;      // 等待队列（调用wait()）\n    _EntryList;    // 阻塞队列（竞争锁失败）\n    _count;        // 计数器（重入次数）\n};\n```\n\n【锁升级过程】\n\n| 阶段 | 名称 | 说明 |\n|:---:|:---:|:---|\n| ① | 无锁 | 初始状态 |\n| ② | 偏向锁 | 首次竞争，CAS写入ThreadID |\n| ③ | 轻量级锁 | 自旋等待，CAS修改对象头 |\n| ④ | 重量级锁 | 线程阻塞，系统Mutex |\n\n【对象头结构】（64位）\n\n| 偏向锁(2bit) | 锁状态 |\n|:---:|:---|\n| 01 | 无锁/偏向锁 |\n| 00 | 轻量级锁 |\n| 10 | 重量级锁 |\n| 11 | GC标记 |\n\n【各锁特点】\n\n1️⃣ 偏向锁\n- 第一次CAS将线程ID写入Mark Word\n- 后续该线程进入同步块无需任何同步操作\n- 适用于无竞争场景\n\n2️⃣ 轻量级锁\n- 在线程栈帧中创建锁记录（Lock Record）\n- CAS将对象头中的Mark Word复制到锁记录\n- 失败则自旋重试\n- 适用于短时间竞争\n\n3️⃣ 重量级锁\n- 未获取到锁的线程进入阻塞状态\n- 不消耗CPU，但有用户态到内核态切换开销\n- 适用于长时间竞争\n\n【锁消除】\nJIT编译器分析发现锁对象不会逃逸，直接消除同步锁。\n\n【锁粗化】\nJIT编译器发现一系列零散加锁操作，自动合并为一次加锁。",
    difficulty: 3
  },
  {
    id: 8,
    category: "Java基础与核心",
    question: "ReentrantLock与synchronized的区别？AQS原理？",
    answer: "【synchronized vs ReentrantLock】\n\n| 特性 | synchronized | ReentrantLock |\n|------|-------------|----------------|\n| 语法层面 | 关键字 | API（Java类） |\n| 锁释放 | 自动释放 | 必须手动unlock() |\n| 锁类型 | 非公平锁 | 公平/非公平可选 |\n| 尝试获取锁 | ❌ | ✅ tryLock() |\n| 超时获取 | ❌ | ✅ tryLock(timeout) |\n| 中断获取 | ❌ | ✅ lockInterruptibly() |\n| 条件变量 | ❌ | ✅ newCondition() |\n| 性能 | JDK 6+优化后接近 | 稍好，但差别不大 |\n\n【ReentrantLock核心方法】\n```java\nReentrantLock lock = new ReentrantLock(true); // true=公平锁\n\nlock.lock();\ntry {\n    // 业务逻辑\n} finally {\n    lock.unlock();  // 必须放在finally\n}\n\n// 尝试获取锁\nif (lock.tryLock()) {\n    try { ... } finally { lock.unlock(); }\n}\n\n// 带超时的获取\nif (lock.tryLock(5, TimeUnit.SECONDS)) {\n    try { ... } finally { lock.unlock(); }\n}\n\n// 条件变量\nCondition condition = lock.newCondition();\ncondition.await();  // 等待\ncondition.signal(); // 唤醒\n```\n\n【AQS原理】（AbstractQueuedSynchronizer）\nAQS是JUC包的核心，为同步器提供基础框架。\n\n1️⃣ 核心结构\n```java\npublic abstract class AbstractQueuedSynchronizer {\n    // 双向链表，FIFO队列\n    private transient volatile Node head;\n    private transient volatile Node tail;\n    \n    // 状态字段\n    private volatile int state;\n    \n    // Node节点\n    static final class Node {\n        volatile int waitStatus;      // 等待状态\n        volatile Node prev;           // 前驱节点\n        volatile Node next;           // 后继节点\n        volatile Thread thread;       // 等待线程\n    }\n}\n```\n\n2️⃣ 两种资源共享方式\n- Exclusive（独占）：如ReentrantLock\n- Share（共享）：如Semaphore、CountDownLatch\n\n3️⃣ 核心方法\n- acquire(int arg)：独占获取\n- release(int arg)：独占释放\n- acquireShared(int arg)：共享获取\n- releaseShared(int arg)：共享释放\n\n【AQS获取锁流程】\n\n1. `tryAcquire(arg)` - 尝试获取锁，成功则设置state\n2. `addWaiter(Node.EXCLUSIVE)` - 加入等待队列\n3. `acquireQueued(node, arg)` - 自旋尝试获取，失败则阻塞\n\n【为什么ReentrantLock可重入？】\n- state记录重入次数\n- 获取锁时：state + 1\n- 释放锁时：state - 1\n- state为0时真正释放锁",
    difficulty: 3
  },
  {
    id: 9,
    category: "Java基础与核心",
    question: "ThreadLocal原理？内存泄漏问题如何解决？",
    answer: "【ThreadLocal核心原理】\n每个Thread对象内部都有一个ThreadLocalMap，用于存储ThreadLocal变量。\n\n1️⃣ 结构\n```java\npublic class Thread {\n    ThreadLocal.ThreadLocalMap threadLocals;  // 内部类\n    ThreadLocal.ThreadLocalMap inheritableThreadLocals;\n}\n\npublic class ThreadLocal<T> {\n    public T get() {\n        Thread t = Thread.currentThread();\n        ThreadLocalMap map = t.threadLocals;\n        if (map != null) {\n            ThreadLocalMap.Entry e = map.getEntry(this);\n            if (e != null) return e.value;\n        }\n        return setInitialValue();  // 首次调用初始化\n    }\n}\n```\n\n2️⃣ ThreadLocalMap\n- Entry数组，类似HashMap的桶\n- Entry继承WeakReference<ThreadLocal<?>>\n- key（ThreadLocal）是弱引用，value是强引用\n\n```java\nstatic class ThreadLocalMap {\n    static class Entry extends WeakReference<ThreadLocal<?>> {\n        Object value;\n        Entry(ThreadLocal<?> k, Object v) {\n            super(k);\n            value = v;\n        }\n    }\n    private Entry[] table;\n}\n```\n\n【内存泄漏原因】\n\n1️⃣ 弱引用机制\n- ThreadLocal使用弱引用作为key\n- 当ThreadLocal变量失去强引用时，只剩弱引用，可被GC回收\n- 但value仍是强引用，如果ThreadLocal被回收，key=null，value无法访问\n- 形成\"key为null，value不为null\"的脏Entry\n\n2️⃣ 线程池场景\n- 线程复用，ThreadLocalMap不会清理\n- 脏Entry累积，导致内存泄漏\n\n【解决内存泄漏】\n\n1️⃣ 手动remove()【推荐】\n```java\nThreadLocal<String> tl = new ThreadLocal<>();\ntry {\n    tl.set(\"value\");\n    // 业务逻辑\n} finally {\n    tl.remove();  // 必须调用\n}\n```\n\n2️⃣ 使用try-with-resources（推荐）\n```java\ntry (ThreadLocalAutoCloseable tl = new ThreadLocalAutoCloseable()) {\n    tl.set(\"value\");\n}\n\nclass ThreadLocalAutoCloseable implements AutoCloseable {\n    private static final ThreadLocal<String> TL = new ThreadLocal<>();\n    \n    public void set(String value) { TL.set(value); }\n    public void close() { TL.remove(); }\n}\n```\n\n3️⃣ 定期清理\n- 可以在Filter中统一清理\n- set()和get()时也会清理key=null的Entry（懒清理）\n\n【最佳实践】\n1. 永远在finally中调用remove()\n2. 避免使用static ThreadLocal（延长生命周期）\n3. 线程结束时确保清理\n4. 使用线程池时特别注意",
    difficulty: 3
  },
  {
    id: 10,
    category: "Java基础与核心",
    question: "线程池的核心参数？执行流程？拒绝策略？",
    answer: "【七大核心参数】\n\n```java\npublic ThreadPoolExecutor(\n    int corePoolSize,              // 1. 核心线程数\n    int maximumPoolSize,           // 2. 最大线程数\n    long keepAliveTime,            // 3. 空闲线程存活时间\n    TimeUnit unit,                 // 4. 时间单位\n    BlockingQueue<Runnable> workQueue,  // 5. 工作队列\n    ThreadFactory threadFactory,   // 6. 线程工厂\n    RejectedExecutionHandler handler     // 7. 拒绝策略\n) { ... }\n```\n\n【参数详解】\n\n1. corePoolSize（核心线程数）\n   - 线程池长期维持的最小线程数\n   - 即使空闲也不会被销毁（除非allowCoreThreadTimeOut=true）\n\n2. maximumPoolSize（最大线程数）\n   - 线程池允许创建的最大线程数\n   - 用于应对突发流量\n\n3. keepAliveTime（空闲存活时间）\n   - 超过corePoolSize的空闲线程存活时间\n   - 4种TimeUnit：DAYS、HOURS、MINUTES、MILLISECONDS\n\n4. workQueue（工作队列）\n   - 存储待执行任务的阻塞队列\n   - 常用队列：LinkedBlockingQueue、ArrayBlockingQueue、SynchronousQueue\n\n5. threadFactory（线程工厂）\n   - 自定义线程创建逻辑\n   - 可设置线程名、优先级、守护线程等\n\n6. handler（拒绝策略）\n   - 队列满且线程数达max时的处理策略\n\n【执行流程】\n\n1. 提交任务\n2. 判断线程数 < corePoolSize？\n   - 是：创建新线程执行\n   - 否：加入工作队列\n3. 队列满且线程数 < maximumPoolSize？\n   - 是：创建新线程\n   - 否：执行拒绝策略\n\n【四种拒绝策略】\n\n| 策略 | 实现类 | 行为 |\n|------|--------|------|\n| AbortPolicy（默认） | AbortedPolicy | 抛出RejectedExecutionException |\n| CallerRunsPolicy | CallerRunsPolicy | 由调用线程执行任务 |\n| DiscardPolicy | DiscardPolicy | 静默丢弃任务 |\n| DiscardOldestPolicy | DiscardOldestPolicy | 丢弃最老的任务 |\n\n【常见线程池】\n```java\n// 固定线程数\nExecutors.newFixedThreadPool(n);\n// 适用：长期任务、CPU密集型\n\n// 单线程\nExecutors.newSingleThreadExecutor();\n// 适用：串行执行、保证顺序\n\n// 缓存线程池\nExecutors.newCachedThreadPool();\n// 适用：短时间异步任务、突发流量\n\n// 定时任务\nExecutors.newScheduledThreadPool(n);\n// 适用：定时任务、周期任务\n```",
    difficulty: 3
  },
  {
    id: 11,
    category: "Java基础与核心",
    question: "Java中的四种引用类型？使用场景？",
    answer: "【四种引用类型】\n\n| 类型 | 说明 | 回收时机 |\n|:---:|:---|:---|\n| 强引用 | `Object obj = new Object()` | 永不回收 |\n| 软引用 | `SoftReference<T>` | 内存不足时 |\n| 弱引用 | `WeakReference<T>` | GC时立即 |\n| 虚引用 | `PhantomReference<T>` | 随时可能被回收 |\n\n【强引用】\n- 最普通的引用方式\n- Object obj = new Object();\n- 即使OOM也不会回收，通常导致内存泄漏\n\n【软引用】\n- 描述一些有用但非必需的对象\n- 内存不足时回收，用于缓存场景\n\n```java\n// 软引用缓存\nSoftReference<Bitmap> cache = new SoftReference<>(bitmap);\nBitmap b = cache.get();\nif (b == null) {\n    // 已被回收，重新加载\n    b = loadBitmap();\n}\n```\n\n适用场景：\n- 图片缓存（内存不足时自动清理）\n- 浏览器前进/后退缓存\n\n【弱引用】\n- 只能存活到下一次GC之前\n- 适合\"临时\"引用\n\n```java\n// WeakHashMap - key为弱引用\nWeakHashMap<String, Object> map = new WeakHashMap<>();\nString key = new String(\"key\");  // 非String常量\nmap.put(key, \"value\");\nkey = null;  // 去除强引用\nSystem.gc(); // 触发GC，entry会被回收\n```\n\n适用场景：\n- ThreadLocalMap的Entry（防止内存泄漏）\n- 缓存、注册表等\n- 防止内存泄漏的容器\n\n【虚引用】\n- 随时可能被回收\n- 无法通过get()获取对象\n- 必须配合ReferenceQueue使用\n\n```java\nReferenceQueue<Obj> queue = new ReferenceQueue<>();\nPhantomReference<Obj> pr = new PhantomReference<>(obj, queue);\n\n// 监控回收\nnew Thread(() -> {\n    while (true) {\n        Reference<?> ref = queue.poll();\n        if (ref != null) {\n            // 对象被回收，做清理工作\n        }\n    }\n}).start();\n```\n\n适用场景：\n- 对象回收监听\n- 资源清理（堆外内存、文件句柄）\n- NIO DirectByteBuffer Cleaner",
    difficulty: 2
  },
  {
    id: 12,
    category: "Java基础与核心",
    question: "GC垃圾回收算法有哪些？G1和CMS的区别？",
    answer: "【四大基础算法】\n\n```mermaid\ngraph TD\n    A[GC算法] --> B[标记-清除]\n    A --> C[标记-整理]\n    A --> D[复制算法]\n    A --> E[分代收集]\n    \n    B --> B1[产生内存碎片]\n    C --> C1[无碎片<br/>移动耗时]\n    D --> D1[无碎片<br/>浪费空间]\n    E --> E1[新生代+老年代<br/>组合使用]\n    \n    style A fill:#e1f5fe\n    style E fill:#fff3e0\n```\n\n| 算法 | 优点 | 缺点 |\n|:---:|:---:|:---:|\n| 标记-清除 | 简单 | 内存碎片 |\n| 标记-整理 | 无碎片 | 移动耗时 |\n| 复制算法 | 高效 | 浪费50%空间 |\n| 分代收集 | 综合最优 | 实现复杂 |\n\n【G1 vs CMS对比】\n\n| 特性 | CMS | G1 |\n|:---:|:---:|:---:|\n| 目标 | 老年代 | 全堆 |\n| 算法 | 标记-清除 | 标记-整理 |\n| 碎片 | 有碎片 | 无碎片 |\n| STW | 并发清除 | 可预测停顿 |\n| 内存 | 连续 | Region划分 |\n\n【CMS收集过程】\n1. 初始标记（STW）：标记GC Roots\n2. 并发标记：遍历对象图\n3. 重新标记（STW）：修正变动\n4. 并发清除：清除死亡对象\n\n【G1收集过程】\n1. 初始标记（STW）\n2. 并发标记\n3. 最终标记（STW）\n4. 筛选回收（STW）\n\n【G1核心优势】\n- Region划分，内存分块\n- Remembered Set记录引用\n- 可设置停顿时间\n- 适合大堆（6GB+）",
    difficulty: 3
  },
  {
    id: 13,
    category: "Java基础与核心",
    question: "类加载机制？双亲委派模型？如何打破？",
    answer: "【类加载过程】\n\n```mermaid\ngraph TD\n    A[加载 Loading] --> B[验证 Verification]\n    B --> C[准备 Preparation]\n    C --> D[解析 Resolution]\n    D --> E[初始化 Initialization]\n    \n    style A fill:#e1f5fe\n    style B fill:#fff3e0\n    style C fill:#e8f5e9\n    style D fill:#fce4ec\n    style E fill:#f3e5f5\n```\n\n| 阶段 | 说明 |\n|:---:|:---|\n| 加载 | 获取类的二进制字节流 |\n| 验证 | 检查文件格式、元数据 |\n| 准备 | 分配内存、设置初始值 |\n| 解析 | 符号引用转直接引用 |\n| 初始化 | 执行<clinit>()方法 |\n\n【双亲委派模型】\n\n```mermaid\ngraph TD\n    A[Application<br/>ClassLoader] --> B[Extension<br/>ClassLoader]\n    B --> C[Bootstrap<br/>ClassLoader]\n    C --> D{能否加载?}\n    D -->|否| E[返回给Extension]\n    E --> F[返回给Application]\n    F --> G[Application<br/>自行加载]\n    \n    style A fill:#e1f5fe\n    style B fill:#b3e5fc\n    style C fill:#81d4fa\n    style G fill:#4fc3f7\n```\n\n**流程**：Application → Extension → Bootstrap → 依次返回 → Application加载\n\n【双亲委派优势】\n- 避免类重复加载\n- 安全性：防止核心API被篡改\n- 保证类的唯一性\n\n【打破双亲委派】\n1. 自定义类加载器，重写loadClass()\n2. SPI机制（JDBC驱动加载）\n3. OSGi热部署",
    difficulty: 3
  },
  {
    id: 14,
    category: "Java基础与核心",
    question: "接口和抽象类的区别？Java 8+接口的新特性？",
    answer: "【抽象类 vs 接口】\n\n| 特性 | 抽象类 | 接口 |\n|------|--------|------|\n| 关键字 | abstract class | interface |\n| 继承 | 单继承 | 多实现 |\n| 方法 | 抽象方法+具体方法 | 只有抽象方法（Java 8前） |\n| 变量 | 任意类型 | 只能是public static final |\n| 构造器 | ✅ 有 | ❌ 没有 |\n| 初始化块 | ✅ 有 | ❌ 没有 |\n| 访问修饰符 | 任意 | 方法默认public |\n| 设计目的 | 代码复用 | 行为规范 |\n| 关系 | is-a | like-a/can-do |\n\n【抽象类使用场景】\n- 需要共享代码：多个子类共用的实现逻辑\n- 需要非public成员：protected、private成员\n- 需要构造器：初始化资源\n- 追求\"是...\"的关系\n\n【接口使用场景】\n- 定义行为规范：\"能做什么\"\n- 多实现：类需要多个能力\n- 追求\"像...\"的关系\n\n【Java 8+接口新特性】\n\n1️⃣ default方法（默认实现）\n```java\ninterface Animal {\n    void eat();\n    \n    // default方法\n    default void sleep() {\n        System.out.println(\"Animal sleeps\");\n    }\n}\n\nclass Dog implements Animal {\n    public void eat() { ... }\n    // 不需要实现sleep()，使用默认实现\n}\n```\n\n2️⃣ static方法（静态方法）\n```java\ninterface Calculator {\n    static int add(int a, int b) {\n        return a + b;\n    }\n}\n\n// 调用\nint result = Calculator.add(1, 2);\n```\n\n3️⃣ private方法（Java 9+）\n```java\ninterface Database {\n    default void connect() {\n        // 调用私有方法复用逻辑\n        validateConfig();\n        establishConnection();\n    }\n    \n    private void validateConfig() { ... }\n    private void establishConnection() { ... }\n}\n```\n\n【default方法冲突解决】\n\n1️⃣ 类优先：类的方法优先于接口的默认方法\n```java\ninterface A { default void test() { } }\nclass B implements A { public void test() { } }  // 使用B的实现\n```\n\n2️⃣ 接口冲突：必须显式指定\n```java\ninterface A { default void test() { } }\ninterface B { default void test() { } }\nclass C implements A, B {\n    public void test() { \n        A.super.test();  // 选择A的实现\n    }\n}\n```\n\n【函数式接口】\n- 只有一个抽象方法的接口\n- @FunctionalInterface注解\n- Lambda表达式的基础\n```java\n@FunctionalInterface\ninterface Predicate<T> {\n    boolean test(T t);\n    \n    default Predicate<T> and(Predicate<? super T> other) { ... }\n    static <T> Predicate<T> isEqual(Object targetRef) { ... }\n}\n```",
    difficulty: 2
  },
  {
    id: 15,
    category: "Java基础与核心",
    question: "深拷贝和浅拷贝的区别？如何实现？",
    answer: "【浅拷贝 vs 深拷贝】\n\n浅拷贝：只复制引用，深拷贝：复制全部内容\n\n【实现方式】\n\n1️⃣ 浅拷贝：clone()方法\n```java\nclass Person implements Cloneable {\n    @Override\n    protected Person clone() {\n        return (Person) super.clone();\n    }\n}\n```\n\n2️⃣ 深拷贝：手动拷贝\n```java\nclass Person implements Cloneable {\n    Address address;\n    @Override\n    protected Person clone() {\n        Person p = (Person) super.clone();\n        p.address = address.clone();\n        return p;\n    }\n}\n```\n\n3️⃣ 深拷贝：序列化\n```java\npublic static <T> T deepCopy(T obj) {\n    ByteArrayOutputStream bos = new ByteArrayOutputStream();\n    ObjectOutputStream oos = new ObjectOutputStream(bos);\n    oos.writeObject(obj);\n    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());\n    ObjectInputStream ois = new ObjectInputStream(bis);\n    return (T) ois.readObject();\n}\n```\n\n【使用场景】\n- 浅拷贝：对象结构简单\n- 深拷贝：需要独立副本",
    difficulty: 2
  },
  {
    id: 16,
    category: "Java基础与核心",
    question: "反射的原理？优缺点？使用场景？",
    answer: "【反射核心原理】\n反射允许在运行时动态获取类的信息并操作对象。\n\n1️⃣ Class对象\n- 每个类在JVM中只有一个Class对象\n- 类加载时由类加载器创建\n- 存储类的元信息（方法、字段、构造函数等）\n\n```java\n// 获取Class对象三种方式\nClass<?> clazz1 = Class.forName(\"com.example.Person\");\nClass<?> clazz2 = Person.class;\nClass<?> clazz3 = person.getClass();\n```\n\n2️⃣ 反射API\n```java\n// 获取类信息\nClass<?> clazz = Person.class;\n\n// 获取构造函数\nConstructor<?>[] constructors = clazz.getDeclaredConstructors();\n\n// 获取方法\nMethod[] methods = clazz.getDeclaredMethods();\n\n// 获取字段\nField[] fields = clazz.getDeclaredFields();\n\n// 创建实例\nObject obj = clazz.newInstance();  // 已过时\nObject obj = clazz.getDeclaredConstructor().newInstance();\n\n// 调用方法\nMethod method = clazz.getMethod(\"setName\", String.class);\nmethod.invoke(obj, \"Tom\");\n\n// 访问字段\nField field = clazz.getDeclaredField(\"name\");\nfield.setAccessible(true);  // 绕过访问控制\nfield.set(obj, \"Tom\");\n```\n\n【反射优缺点】\n\n✅ 优点：\n- 动态性：运行时决定加载哪个类、调用哪个方法\n- 通用性：一个框架可以处理各种类型的对象\n- 框架基础：Spring、Hibernate等框架的核心\n\n❌ 缺点：\n1. 性能开销：涉及动态解析，比直接调用慢数十倍\n2. 安全限制：绕过访问控制（setAccessible）\n3. 可维护性差：代码复杂，难以调试\n4. 类型检查：运行时才检查，错误延迟到运行时\n\n【性能优化方案】\n\n1️⃣ 缓存Method/Constructor\n```java\nprivate static final Map<Class<?>, Constructor<?>> CACHE = new ConcurrentHashMap<>();\n\npublic static <T> T newInstance(Class<T> clazz) {\n    return clazz.cast(CACHE.computeIfAbsent(clazz, \n        c -> c.getDeclaredConstructor()).newInstance());\n}\n```\n\n2️⃣ MethodHandle（Java 7+）\n```java\nMethodHandles.Lookup lookup = MethodHandles.lookup();\nMethodHandle handle = lookup.findVirtual(Person.class, \"getName\", String.class);\nString name = (String) handle.invoke(obj);  // 比反射快\n```\n\n3️⃣ 避免setAccessible(true)\n- 在安全策略允许的情况下使用\n- 可使用Java 9+的--add-opens参数\n\n【使用场景】\n\n1️⃣ 框架开发\n- Spring：Bean的创建、依赖注入\n- MyBatis：ORM映射\n- Jackson：JSON序列化\n\n2️⃣ 动态代理\n- JDK动态代理基于反射\n- AOP拦截\n\n3️⃣ 通用框架\n- 序列化/反序列化\n- 依赖注入容器\n- 插件系统\n\n4️⃣ 调试和测试\n- JUnit反射调用私有方法\n- 工具类封装",
    difficulty: 3
  },
  {
    id: 17,
    category: "Java基础与核心",
    question: "动态代理的两种方式？JDK代理和CGLIB区别？",
    answer: "【动态代理核心原理】\n在运行时动态创建代理类，拦截方法调用，增强目标对象。\n\n【JDK动态代理】\n\n1️⃣ 基于接口的代理\n- 要求目标类必须实现接口\n- 代理类实现相同接口\n- 使用java.lang.reflect.Proxy\n\n```java\nUserService proxy = (UserService) Proxy.newProxyInstance(\n    UserServiceImpl.class.getClassLoader(),\n    UserServiceImpl.class.getInterfaces(),\n    (obj, method, args) -> {\n        // 前置增强\n        System.out.println(\"方法执行前: \" + method.getName());\n        // 执行原方法\n        Object result = method.invoke(new UserServiceImpl(), args);\n        // 后置增强\n        System.out.println(\"方法执行后\");\n        return result;\n    }\n);\n```\n\n【CGLIB动态代理】\n\n1️⃣ 基于继承的代理\n- 不需要接口，继承目标类\n- 使用ASM字节码框架生成子类\n- 方法被final或static修饰则无法代理\n\n```java\nEnhancer enhancer = new Enhancer();\nenhancer.setSuperclass(UserServiceImpl.class);\nenhancer.setCallback((MethodInterceptor) (obj, method, args, proxy) -> {\n    // 前置增强\n    System.out.println(\"方法执行前: \" + method.getName());\n    // 执行原方法\n    Object result = proxy.invokeSuper(obj, args);\n    // 后置增强\n    System.out.println(\"方法执行后\");\n    return result;\n});\nUserServiceImpl proxy = (UserServiceImpl) enhancer.create();\n```\n\n【JDK代理 vs CGLIB】\n\n| 特性 | JDK动态代理 | CGLIB |\n|:---:|:---:|:---:|\n| 实现方式 | 接口 | 继承 |\n| 代理类 | Proxy.newProxyInstance | Enhancer.create |\n| 性能 | 反射调用 | 字节码更快 |\n| 目标类要求 | 实现接口 | 无要求 |\n| 局限性 | 必须有接口 | 无法代理final/static |\n| 依赖 | JDK自带 | 第三方库 |\n\n【Spring AOP选择策略】\n- 目标类实现了接口 → 默认JDK代理\n- 目标类 CGLIB代理\n-未实现接口 → 配置强制使用：@EnableAspectJAutoProxy(proxyTargetClass = true)",
    difficulty: 3
  },
  {
    id: 18,
    category: "Java基础与核心",
    question: "Java 8新特性？Stream API、Lambda、Optional？",
    answer: "【Java 8新特性】\n\n```mermaid\ngraph LR\n    A[Java 8新特性] --> B[Lambda]\n    A --> C[Stream API]\n    A --> D[Optional]\n    A --> E[接口default]\n    A --> F[方法引用]\n    A --> G[Date Time API]\n    \n    style A fill:#e1f5fe\n    style B fill:#fff3e0\n    style C fill:#e8f5e9\n    style D fill:#fce4ec\n```\n\n【Lambda表达式】\n\n语法：\n```java\n(x, y) -> x + y\nx -> x * 2\n() -> System.out.println(\"Hello\")\n```\n\n【Stream API】\n\n创建Stream：\n```java\nlist.stream()           // 从集合\nArrays.stream(arr)      // 从数组\nStream.iterate(0, i->i+1)  // 无限流\nStream.generate(Math::random)  // 随机流\n```\n\n中间操作：\n- filter()：过滤\n- map()：转换\n- distinct()：去重\n- sorted()：排序\n\n终端操作：\n- collect()：收集\n- forEach()：遍历\n- count()：计数\n- max/min()：最值\n\n【Optional】\n\n解决空指针问题：\n```java\nOptional<String> opt = Optional.ofNullable(str);\nString result = opt.orElse(\"default\");\nopt.ifPresent(System.out::println);\n```\n\n【接口新特性】\n\ndefault方法：\n```java\ninterface Animal {\n    default void sleep() {\n        System.out.println(\"Animal sleeps\");\n    }\n}\n```\n\nstatic方法：\n```java\ninterface Calculator {\n    static int add(int a, int b) {\n        return a + b;\n    }\n}\n```",
    difficulty: 2
  },
  {
    id: 19,
    category: "Java基础与核心",
    question: "什么是NIO？与BIO、AIO的区别？",
    answer: "【什么是NIO？】\n\nNIO（New I/O）是一种同步非阻塞的I/O模型。\n\n【BIO vs NIO vs AIO】\n\n| 特性 | BIO | NIO | AIO |\n|:---:|:---:|:---:|:---:|\n| 编程模型 | 阻塞 | 非阻塞 | 异步 |\n| 线程 | 每连接一线程 | 单线程多连接 | 回调通知 |\n| 复杂度 | 简单 | 中等 | 复杂 |\n| 吞吐量 | 低 | 高 | 高 |\n| 适用场景 | 连接少 | 高并发 | 长连接 |\n\n【NIO核心组件】\n\n```mermaid\ngraph TD\n    A[NIO] --> B[Channel通道]\n    A --> C[Buffer缓冲区]\n    A --> D[Selector选择器]\n    \n    B --> B1[可读可写]\n    C --> C1[直接内存]\n    D --> D1[多路复用]\n    \n    style A fill:#e1f5fe\n    style B fill:#fff3e0\n    style C fill:#e8f5e9\n    style D fill:#fce4ec\n```\n\n【Channel】\n- 类似stream，可读可写\n- 支持非阻塞\n- 常见：FileChannel、SocketChannel、ServerSocketChannel\n\n【Buffer】\n- 缓冲区，直接读写数据\n- 常见：ByteBuffer、CharBuffer\n\n【Selector】\n- 多路复用器\n- 监控多个Channel事件\n- 单线程处理多连接\n\n【NIO示例】\n\n```java\nSelector selector = Selector.open();\nServerSocketChannel serverChannel = ServerSocketChannel.open();\nserverChannel.configureBlocking(false);\nserverChannel.register(selector, SelectionKey.OP_ACCEPT);\n\nwhile (true) {\n    selector.select();\n    Set<SelectionKey> keys = selector.selectedKeys();\n    for (SelectionKey key : keys) {\n        if (key.isAcceptable()) { /* 处理连接 */ }\n        else if (key.isReadable()) { /* 处理读 */ }\n    }\n}\n```\n\n【Netty】\n- 基于NIO的异步框架\n- 零拷贝、ByteBuf优化\n- 广泛应用在RPC、MQ等",
    difficulty: 3
  },
  {
    id: 20,
    category: "Java基础与核心",
    question: "Exception和Error的区别？运行时异常和受检异常？",
    answer: "【Exception和Error的区别】\n\nThrowable\n├── Error\n│   ├── OutOfMemoryError\n│   ├── StackOverflowError\n│   └── NoClassDefFoundError\n└── Exception\n    ├── RuntimeException\n    │   ├── NullPointerException\n    │   ├── ArrayIndexOutOfBoundsException\n    │   └── IllegalArgumentException\n    └── CheckedException\n        ├── IOException\n        └── SQLException\n\n【Error vs Exception】\n\n| 特性 | Error | Exception |\n|:---:|:---:|:---:|\n| 父类 | Throwable | Throwable |\n| 性质 | JVM错误 | 程序错误 |\n| 处理 | 无法处理 | 可以捕获 |\n| 示例 | OOM、SOF | NPE、IOE |\n| 必须处理 | 否 | 受检异常是 |\n\n【运行时异常 vs 受检异常】\n\n| 特性 | 运行时异常 | 受检异常 |\n|:---:|:---:|:---:|\n| 父类 | RuntimeException | Exception |\n| 编译检查 | 否 | 是 |\n| 处理要求 | 不强制 | 必须 |\n| 示例 | NPE | IOException |\n\n【最佳实践】\n1. 尽量捕获具体异常\n2. 不要捕获Throwable/Error\n3. 异常链保留原始信息\n4. 业务异常使用运行时异常",
    difficulty: 2
  },
  {
    id: 21,
    category: "Java基础与核心",
    question: "如何设计一个不可变类？",
    answer: "【如何设计不可变类】\n\n【核心原则】\n\n1. 类用final修饰，不能被继承\n2. 所有字段用final修饰\n3. 字段类型如果是引用类型，需要注意\n4. 不提供修改状态的方法\n5. 构造函数中做防御性拷贝\n\n【实现步骤】\n\n1️⃣ 类的修饰\n```java\npublic final class Person { }\n```\n\n2️⃣ 字段修饰\n```java\nprivate final String name;\nprivate final int age;\nprivate final Address address;      // 内部对象也要不可变\nprivate final List<String> hobbies; // 集合需要防御性拷贝\n```\n\n3️⃣ 构造函数\n```java\npublic Person(String name, int age, Address address, List<String> hobbies) {\n    this.name = name;\n    this.age = age;\n    this.address = new Address(address.getCity());  // 防御性拷贝\n    this.hobbies = new ArrayList<>(hobbies);       // 防御性拷贝\n}\n```\n\n4️⃣ Getter返回副本\n```java\npublic List<String> getHobbies() {\n    return new ArrayList<>(hobbies);  // 返回副本\n}\n```\n\n5️⃣ 静态工厂方法（推荐）\n```java\npublic static Person of(String name, int age) {\n    return new Person(name, age);\n}\n\npublic Person withName(String name) {\n    return new Person(name, this.age);  // 返回新对象\n}\n```\n\n【JDK中的不可变类】\n- String、Integer等包装类\n- BigDecimal、BigInteger\n- 枚举类\n- Collections.unmodifiableXXX()",
    difficulty: 2
  },
  {
    id: 22,
    category: "Java基础与核心",
    question: "什么是SPI机制？与API的区别？",
    answer: "【SPI机制】\n\nSPI（Service Provider Interface）是一种服务发现机制。\n\n【SPI vs API】\n\n| 特性 | API | SPI |\n|:---:|:---:|:---:|\n| 角色 | 我调用别人 | 我实现接口，别人调用我 |\n| 方向 | 主动 | 被动 |\n| 目的 | 使用服务 | 提供服务 |\n\n【SPI原理】\n\n1️⃣ 定义接口\n```java\npublic interface DataStore {\n    void save(String key, String value);\n    String get(String key);\n}\n```\n\n2️⃣ 实现接口\n```java\npublic class MySqlDataStore implements DataStore {\n    @Override\n    public void save(String key, String value) { /* ... */ }\n    @Override\n    public String get(String key) { /* ... */ }\n}\n```\n\n3️⃣ 注册实现\n文件：META-INF/services/com.example.api.DataStore\n内容：com.example.mysql.MySqlDataStore\n\n4️⃣ 使用ServiceLoader加载\n```java\nServiceLoader<DataStore> loader = ServiceLoader.load(DataStore.class);\nfor (DataStore store : loader) {\n    store.save(\"key\", \"value\");\n}\n```\n\n【SPI应用场景】\n\n| 场景 | 示例 |\n|:---:|:---|\n| JDBC驱动 | java.sql.Driver |\n| 日志框架 | SLF4J |\n| JSON序列化 | Jackson |\n| Spring Boot | 自动装配 |\n\n【SPI vs 反射+new】\n- 解耦：接口与实现分离\n- 扩展：新增实现无需修改代码\n- 配置：配置文件声明",
    difficulty: 2
  },
  {
    id: 23,
    category: "Java基础与核心",
    question: "红黑树的特点？为什么HashMap用红黑树不用AVL？",
    answer: "【红黑树特点】\n\n【红黑树5大特性】\n\n1. 节点非红即黑\n2. 根节点是黑色\n3. 叶子节点是黑色\n4. 红节点的子节点必须是黑色\n5. 任意节点到每个叶子路径的黑色节点数量相同\n\n【红黑树 vs AVL】\n\n| 特性 | 红黑树 | AVL |\n|:---:|:---:|:---:|\n| 平衡标准 | 黑高度平衡 | 高度平衡 |\n| 查询复杂度 | O(log n) | O(log n) |\n| 插入旋转 | 最多2次 | 最多1次 |\n| 删除旋转 | 最多3次 | O(log n)次 |\n| 适合场景 | 插入删除多 | 查询多 |\n\n【为什么HashMap用红黑树不用AVL？】\n\n| 原因 | 说明 |\n|:---:|:---|\n| 插入删除频繁 | HashMap链表转红黑树的阈值是8 |\n| 旋转开销小 | 红黑树最多2-3次旋转，AVL更多 |\n| 统计性能优 | 综合性能更好 |\n| 查询足够快 | 两者都是O(log n) |\n\n【红黑树旋转】\n\n左旋：\n```\n    x           y\n   / \\  ──▶   / \\\n  a    y       x   c\n       / \\   / \\\n      b    c  a   b\n```\n\n【HashMap树化条件】\n- 链表长度 > 8\n- 且数组容量 >= 64\n- 否则先扩容，不树化\n\n【红黑树退化】\n- 节点数 <= 6时，转换回链表",
    difficulty: 3
  },
  {
    id: 24,
    category: "Java基础与核心",
    question: "什么是伪共享？如何解决？",
    answer: "【什么是伪共享】\n\nCPU缓存以64字节为单位（缓存行）读写。\n\n```\n┌─────────────────────────────────────┐\n│         缓存行 (64字节)              │\n│  ┌────┬────┬────┬────┬────┬────┐   │\n│  │ v1 │ v2 │ v3 │ v4 │ v5 │ v6 │   │\n│  └────┴────┴────┴────┴────┴────┘   │\n└─────────────────────────────────────┘\n```\n\n【伪共享问题】\n\n两个线程修改同一缓存行的不同变量：\n- 线程1修改v1，整个缓存行失效\n- 线程2修改v2，也需要重新加载\n- 性能反而下降10-100倍\n\n【解决方案】\n\n1️⃣ 缓存行填充\n```java\npublic class Counter {\n    // 填充到不同缓存行\n    private long p1, p2, p3, p4, p5, p6, p7;\n    volatile long count1;\n    // 填充\n    private long p8, p9, p10, p11, p12, p13, p14;\n    volatile long count2;\n}\n```\n\n2️⃣ @Contended注解（Java 8+）\n```java\npublic class Counter {\n    @Contended(\"group1\")\n    volatile long count1;\n    \n    @Contended(\"group2\")\n    volatile long count2;\n}\n// 启动参数：-XX:-RestrictContended\n```\n\n3️⃣ 使用LongAdder（Java 8+）\n- 高并发下代替AtomicLong\n- 使用Cell数组分散写入\n\n【JDK中的应用】\n- ConcurrentLinkedQueue\n- LongAdder\n- Disruptor RingBuffer",
    difficulty: 3
  },
  {
    id: 25,
    category: "Java基础与核心",
    question: "Java中的泛型擦除？通配符上界和下界？",
    answer: "【Java泛型擦除】\n\n【泛型擦除原理】\n\n编译时检查，运行时擦除：\n```java\n// 编译前\nList<String> list = new ArrayList<>();\nList<Integer> list2 = new ArrayList<>();\n\n// 编译后（类型擦除）\nList list = new ArrayList();\nList list2 = new ArrayList();\n\n// 运行时常量池中是同一个Class对象\n```\n\n【泛型限制】\n\n| 限制 | 说明 |\n|:---:|:---|\n| 不能创建泛型实例 | new T() ❌ |\n| 不能创建泛型数组 | new T[10] ❌ |\n| 不能使用基本类型 | List<int> ❌ |\n| 不能使用泛型异常 | class MyException<T> ❌ |\n\n【通配符】\n\n```mermaid\ngraph LR\n    A[通配符] --> B[<?> 无限制]\n    A --> C[<? extends T> 上界]\n    A --> D[<? super T> 下界]\n    \n    style A fill:#e1f5fe\n    style B fill:#fff3e0\n    style C fill:#e8f5e9\n    style D fill:#fce4ec\n```\n\n【上界通配符 <? extends T>】\n\n- 可以读取，不能写入\n- PECS原则：生产者用extends\n\n```java\nList<? extends Number> list = new ArrayList<Integer>();\nNumber num = list.get(0);  // ✅\nlist.add(new Integer(1));  // ❌\n```\n\n【下界通配符 <? super T>】\n\n- 可以写入，不能读取（除Object）\n- PECS原则：消费者用super\n\n```java\nList<? super Integer> list = new ArrayList<Number>();\nlist.add(new Integer(1));  // ✅\nInteger i = list.get(0);   // ❌\n```\n\n【PECS原则】\n- Producer Extends, Consumer Super\n- 只读数据 → extends\n- 只写数据 → super",
    difficulty: 2
  },
  {
    id: 26,
    category: "Spring生态",
    question: "Spring IOC容器的初始化流程？",
    answer: "【Spring IOC容器初始化流程】\n\n```mermaid\ngraph TD\n    A[Resource定位] --> B[BeanDefinition解析]\n    B --> C[BeanDefinition注册]\n    C --> D[BeanFactory后置处理]\n    D --> E[Bean实例化]\n    E --> F[属性填充]\n    F --> G[BeanPostProcessor]\n    G --> H[初始化方法]\n    H --> I[销毁]\n    \n    style A fill:#e1f5fe\n    style E fill:#fff3e0\n    style H fill:#c8e6c9\n```\n\n【核心流程】\n\n| 阶段 | 说明 |\n|:---:|:---|\n| Resource定位 | 定位配置文件（XML/注解） |\n| BeanDefinition解析 | 解析bean定义 |\n| BeanDefinition注册 | 注册到BeanFactory |\n| BeanFactory后置处理 | BeanFactoryPostProcessor |\n| Bean实例化 | 通过构造器/工厂创建 |\n| 属性填充 | 依赖注入 |\n| BeanPostProcessor | 后置处理 |\n| 初始化方法 | init-method |\n| 销毁 | destroy-method |\n\n【BeanFactory vs ApplicationContext】\n\n| 特性 | BeanFactory | ApplicationContext |\n|:---:|:---:|:---:|\n| 类型 | 基础容器 | 高级容器 |\n| 加载时机 | 懒加载 | 预加载 |\n| 功能 | 基础功能 | 国际化、事件等 |\n| BeanPostProcessor | 手动注册 | 自动注册 |\n\n【ApplicationContext实现类】\n- ClassPathXmlApplicationContext\n- FileSystemXmlApplicationContext\n- AnnotationConfigApplicationContext\n- WebApplicationContext",
    difficulty: 3
  },
  {
    id: 27,
    category: "Spring生态",
    question: "Spring Bean的生命周期？",
    answer: "【Spring Bean生命周期】\n\n```mermaid\ngraph TD\n    A[实例化] --> B[属性填充]\n    B --> C[BeanNameAware]\n    C --> D[BeanFactoryAware]\n    D --> E[ApplicationContextAware]\n    E --> F[BeanPostProcessor前置]\n    F --> G[初始化方法]\n    G --> H[BeanPostProcessor后置]\n    H --> I[使用中]\n    I --> J[销毁方法]\n    \n    style A fill:#e1f5fe\n    style G fill:#fff3e0\n    style J fill:#ffcdd2\n```\n\n【生命周期详解】\n\n| 阶段 | 接口/注解 | 说明 |\n|:---:|:---:|:---|\n| 实例化 | 构造器 | 创建Bean实例 |\n| 属性填充 | @Autowired | 依赖注入 |\n| Aware注入 | Aware接口 | 注入容器资源 |\n| 初始化 | init-method/@PostConstruct | 初始化操作 |\n| 销毁 | destroy-method/@PreDestroy | 资源释放 |\n\n【Aware接口】\n\n| 接口 | 注入内容 |\n|:---:|:---:|\n| BeanNameAware | Bean名称 |\n| BeanFactoryAware | BeanFactory |\n| ApplicationContextAware | ApplicationContext |\n| EnvironmentAware | 环境变量 |\n| ResourceLoaderAware | 资源加载器 |\n\n【初始化方法执行顺序】\n1. @PostConstruct注解方法\n2. InitializingBean接口的afterPropertiesSet()\n3. init-method配置的方法\n\n【销毁方法执行顺序】\n1. @PreDestroy注解方法\n2. DisposableBean接口的destroy()\n3. destroy-method配置的方法",
    difficulty: 3
  },
  {
    id: 28,
    category: "Spring生态",
    question: "循环依赖如何解决？三级缓存原理？",
    answer: "【循环依赖解决机制】\n\n```mermaid\ngraph TD\n    A[A创建Bean] --> B{需要B?}\n    B -->|是| C[B创建Bean]\n    C --> D{需要A?}\n    D -->|是| E[从三级缓存获取A]\n    E --> F[提前暴露]\n    F --> C\n    C --> G[B创建完成]\n    G --> A\n    A --> H[完成]\n    \n    style E fill:#fff3e0\n    style F fill:#c8e6c9\n```\n\n【三级缓存】\n\n| 缓存 | 名称 | 阶段 | 内容 |\n|:---:|:---:|:---:|:---|\n| 一级 | singletonObjects | 完全创建 | 成品Bean |\n| 二级 | earlySingletonObjects | 创建中 | 提前暴露的Bean |\n| 三级 | singletonFactories | 创建中 | BeanFactory |\n\n【解决流程】\n\n1. A创建时需要B，暂停A\n2. 创建B，需要A\n3. 从三级缓存获取A，放到二级缓存\n4. B创建完成\n5. A继续创建，拿到B\n6. A创建完成，放入一级缓存\n\n【循环依赖类型】\n\n| 类型 | 能否解决 | 说明 |\n|:---:|:---:|:---|\n| 构造器循环依赖 | ❌ | 无法解决 |\n| setter循环依赖（单例） | ✅ | 三级缓存解决 |\n| prototype循环依赖 | ❌ | 无法解决 |\n\n【解决条件】\n- setter注入（非构造器）\n- 单例Bean\n- 不存在构造器循环依赖",
    difficulty: 3
  },
  {
    id: 29,
    category: "Spring生态",
    question: "Spring AOP的实现原理？JDK动态代理vsCGLIB？",
    answer: "【Spring AOP核心概念】\n\n```mermaid\ngraph LR\n    A[目标对象] --> B[代理对象]\n    B --> C[切面]\n    \n    C --> C1[前置通知]\n    C --> C2[后置通知]\n    C --> C3[返回通知]\n    C --> C4[异常通知]\n    C --> C5[环绕通知]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n| 概念 | 说明 |\n|:---:|:---|\n| Aspect | 切面类 |\n| Join Point | 连接点（方法） |\n| Pointcut | 切入点 |\n| Advice | 通知（增强逻辑） |\n| Weaving | 织入 |\n\n【AOP代理选择】\n\n| 目标类 | 代理方式 |\n|:---:|:---:|\n| 实现接口 | JDK动态代理 |\n| 未实现接口 | CGLIB代理 |\n| 配置proxyTargetClass=true | 强制CGLIB |\n\n【JDK vs CGLIB】\n\n| 特性 | JDK动态代理 | CGLIB |\n|:---:|:---:|:---:|\n| 实现方式 | 实现接口 | 继承类 |\n| 性能 | 反射调用 | 字节码生成 |\n| 优点 | 无需额外依赖 | 无接口限制 |\n| 缺点 | 必须有接口 | 无法代理final |\n\n【注解驱动AOP】\n\n```java\n@Aspect\n@Component\npublic class LogAspect {\n    \n    @Before(\"execution(* com.example.*.*(..))\")\n    public void before(JoinPoint jp) {\n        System.out.println(\"方法执行前\");\n    }\n    \n    @After(\"execution(* com.example.*.*(..))\")\n    public void after(JoinPoint jp) {\n        System.out.println(\"方法执行后\");\n    }\n    \n    @Around(\"execution(* com.example.*.*(..))\")\n    public Object around(ProceedingJoinPoint pjp) throws Throwable {\n        // 前置\n        Object result = pjp.proceed();\n        // 后置\n        return result;\n    }\n}\n```",
    difficulty: 3
  },
  {
    id: 30,
    category: "Spring生态",
    question: "Spring事务的传播行为？隔离级别？失效场景？",
    answer: "【事务传播行为】\n\n```mermaid\ngraph TD\n    A[外层事务] --> B{传播行为}\n    \n    B --> C[REQUIRED]\n    B --> D[REQUIRES_NEW]\n    B --> E[SUPPORTS]\n    B --> F[NOT_SUPPORTED]\n    B --> G[MANDATORY]\n    B --> H[NEVER]\n    B --> I[NESTED]\n    \n    C -->|有则加入| C1[加入外层事务]\n    D -->|有则挂起| D1[创建新事务]\n    E -->|有则加入| E1[作为外层事务]\n    E -->|无则非事务| E2[非事务执行]\n    F -->|有则挂起| F1[非事务执行]\n    G --> G1[必须在外层事务中]\n    H --> H1[必须不在事务中]\n    I --> I1[_savepoint保存点]\n    \n    style C fill:#e1f5fe\n    style D fill:#fff3e0\n    style I fill:#c8e6c9\n```\n\n【7种传播行为】\n\n| 行为 | 说明 |\n|:---:|:---|\n| REQUIRED | 有则加入，无则创建（默认） |\n| REQUIRES_NEW | 总是创建新事务 |\n| SUPPORTS | 有则加入，无则非事务 |\n| NOT_SUPPORTED | 有则挂起，非事务执行 |\n| MANDATORY | 必须在事务中，否则异常 |\n| NEVER | 必须不在事务中，否则异常 |\n| NESTED | 嵌套事务，savepoint |\n\n【隔离级别】\n\n| 隔离级别 | 脏读 | 不可重复读 | 幻读 |\n|:---:|:---:|:---:|:---:|\n| DEFAULT | - | - | - |\n| READ_UNCOMMITTED | ✅ | ✅ | ✅ |\n| READ_COMMITTED | ❌ | ✅ | ✅ |\n| REPEATABLE_READ | ❌ | ❌ | ✅ |\n| SERIALIZABLE | ❌ | ❌ | ❌ |\n\n【事务失效场景】\n\n| 场景 | 说明 |\n|:---:|:---|\n| 自调用 | this.xxx()不经过代理 |\n| 异常被catch | 异常被捕获未抛出 |\n| 非public方法 | protected/private不生效 |\n| 传播行为不对 | NOT_SUPPORTED等 |\n| 父子事务 | 嵌套vs独立 |",
    difficulty: 3
  },
  {
    id: 31,
    category: "Spring生态",
    question: "Spring Boot自动配置原理？@SpringBootApplication？",
    answer: "【Spring Boot自动配置原理】\n\n```mermaid\ngraph TD\n    A[@SpringBootApplication] --> B[@EnableAutoConfiguration]\n    B --> C[spring.factories]\n    C --> D[自动配置类]\n    D --> E[@Conditional条件]\n    E --> F[按需配置]\n    \n    style A fill:#e1f5fe\n    style D fill:#fff3e0\n    style F fill:#c8e6c9\n```\n\n【@SpringBootApplication】\n\n```java\n@SpringBootConfiguration  // @Configuration\n@EnableAutoConfiguration  // 启用自动配置\n@ComponentScan  // 组件扫描\npublic @interface SpringBootApplication { }\n```\n\n【自动配置流程】\n\n1. @EnableAutoConfiguration启动\n2. 读取META-INF/spring.factories\n3. 加载AutoConfiguration类\n4. @Conditional条件匹配\n5. 按需配置Bean\n\n【spring.factories格式】\n\n```properties\norg.springframework.boot.autoconfigure.EnableAutoConfiguration=\\\norg.springframework.boot.autoconfigure.AutoConfiguration,\\\norg.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration\n```\n\n【@Conditional条件】\n\n| 注解 | 条件 |\n|:---:|:---|\n| @ConditionalOnClass | 类存在 |\n| @ConditionalOnMissingClass | 类不存在 |\n| @ConditionalOnBean | Bean存在 |\n| @ConditionalOnMissingBean | Bean不存在 |\n| @ConditionalOnProperty | 配置属性满足 |\n| @ConditionalOnResource | 资源存在 |\n\n【自定义Starter】\n1. 创建autoconfigure模块\n2. 定义自动配置类\n3. 创建spring.factories\n4. 打包为starter",
    difficulty: 3
  },
  {
    id: 32,
    category: "Spring生态",
    question: "Spring Boot Starter自定义开发步骤？",
    answer: "【Spring Boot Starter开发】\n\n```mermaid\ngraph LR\n    A[定义功能] --> B[创建autoconfigure]\n    B --> C[创建starter]\n    C --> D[spring.factories]\n    D --> E[使用者引入]\n    \n    style A fill:#e1f5fe\n    style E fill:#c8e6c9\n```\n\n【Starter分类】\n\n| 类型 | 命名 | 示例 |\n|:---:|:---:|:---:|\n| 官方 | spring-boot-starter-* | spring-boot-starter-web |\n| 第三方 | *-spring-boot-starter | mybatis-spring-boot-starter |\n| 自定义 | 自定义名称 | custom-spring-boot-starter |\n\n【开发步骤】\n\n1️⃣ 创建autoconfigure模块\n\n```xml\n<!-- pom.xml -->\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-autoconfigure</artifactId>\n    <version>3.2.0</version>\n</dependency>\n```\n\n2️⃣ 编写自动配置类\n\n```java\n@Configuration\n@ConditionalOnClass(HelloService.class)\n@EnableConfigurationProperties(HelloProperties.class)\npublic class HelloAutoConfiguration {\n    \n    @Bean\n    @ConditionalOnMissingBean\n    public HelloService helloService() {\n        return new HelloService();\n    }\n}\n```\n\n3️⃣ 配置属性类\n\n```java\n@ConfigurationProperties(prefix = \"hello\")\npublic class HelloProperties {\n    private String prefix = \"Hello\";\n    private String suffix = \"!\";\n    // getters/setters\n}\n```\n\n4️⃣ 注册自动配置\n\n文件：src/main/resources/META-INF/spring.factories\n```properties\norg.springframework.boot.autoconfigure.EnableAutoConfiguration=\\\ncom.example.HelloAutoConfiguration\n```\n\n5️⃣ 创建starter模块\n\n```xml\n<!-- pom.xml -->\n<dependencies>\n    <dependency>\n        <groupId>com.example</groupId>\n        <artifactId>hello-spring-boot-autoconfigure</artifactId>\n    </dependency>\n</dependencies>\n```\n\n【使用方式】\n\n```yaml\nhello:\n  prefix: Hi\n  suffix: ~\n```\n\n```java\n@Autowired\nHelloService helloService;\n```",
    difficulty: 3
  },
  {
    id: 33,
    category: "Spring生态",
    question: "Spring MVC的请求处理流程？",
    answer: "【Spring MVC请求处理流程】\n\n```mermaid\nsequenceDiagram\n    participant Client as 浏览器\n    participant DS as DispatcherServlet\n    participant HM as HandlerMapping\n    participant HC as HandlerController\n    participant MV as ModelAndView\n    participant VR as ViewResolver\n    \n    Client->>DS: 发送请求\n    DS->>HM: 查找Handler\n    HM-->>DS: 返回Handler\n    DS->>HC: 执行Handler\n    HC-->>DS: 返回ModelAndView\n    DS->>VR: 解析视图\n    VR-->>DS: 返回View\n    View->>Client: 渲染响应\n```\n\n【DispatcherServlet核心组件】\n\n| 组件 | 职责 |\n|:---:|:---|\n| HandlerMapping | 映射请求到Handler |\n| HandlerAdapter | 执行Handler |\n| Handler | Controller方法 |\n| ViewResolver | 解析视图 |\n| MultipartResolver | 文件上传 |\n| LocaleResolver | 国际化 |\n| ThemeResolver | 主题切换 |\n\n【请求处理流程】\n\n1. DispatcherServlet接收请求\n2. HandlerMapping查找Handler\n3. HandlerAdapter执行Handler\n4. 返回ModelAndView\n5. ViewResolver解析视图\n6. View渲染视图\n7. 响应客户端\n\n【注解驱动】\n\n```java\n@Controller\n@RequestMapping(\"/user\")\npublic class UserController {\n    \n    @GetMapping(\"/list\")\n    public String list(Model model) {\n        model.addAttribute(\"users\", userService.list());\n        return \"user/list\";\n    }\n    \n    @PostMapping(\"/save\")\n    @ResponseBody\n    public Result save(@RequestBody User user) {\n        userService.save(user);\n        return Result.success();\n    }\n}\n```",
    difficulty: 3
  },
  {
    id: 34,
    category: "Spring生态",
    question: "Spring Security的认证和授权流程？",
    answer: "【Spring Security认证授权流程】\n\n```mermaid\ngraph TD\n    A[请求] --> B[FilterChain]\n    B --> C{已认证?}\n    C -->|否| D[AuthenticationFilter]\n    D --> E[AuthenticationManager]\n    E --> F[AuthenticationProvider]\n    F --> G[UserDetailsService]\n    G --> H[数据库验证]\n    H --> I[认证成功]\n    I --> J[SecurityContext]\n    J --> K[授权检查]\n    K --> L[资源访问]\n    \n    style D fill:#e1f5fe\n    style G fill:#fff3e0\n    style K fill:#c8e6c9\n```\n\n【核心概念】\n\n| 概念 | 说明 |\n|:---:|:---|\n| Authentication | 认证信息 |\n| Authorization | 授权 |\n| Principal | 主体（用户） |\n| Credential | 凭证（密码） |\n| GrantedAuthority | 权限 |\n\n【认证流程】\n\n1. 用户提交用户名密码\n2. UsernamePasswordAuthenticationFilter创建Authentication\n3. AuthenticationManager调用AuthenticationProvider\n4. UserDetailsService加载用户信息\n5. 密码比对\n6. 设置SecurityContext\n\n【授权流程】\n\n1. FilterSecurityInterceptor拦截\n2. 获取认证信息\n3. ConfigAttribute获取资源所需权限\n4. AccessDecisionManager决策\n5. 允许或拒绝\n\n【权限控制】\n\n```java\n// 方法级权限\n@PreAuthorize(\"hasRole('ADMIN')\")\npublic void deleteUser(Long id) { }\n\n// 页面级权限\n@Secured(\"ROLE_USER\")\npublic class UserController { }\n\n// 基于表达式\n@PreAuthorize(\"#id == authentication.principal.id\")\npublic User getUser(Long id) { }\n```\n\n【OAuth2流程】\n\n```mermaid\ngraph LR\n    A[用户] --> B[授权服务器]\n    B --> C[获取授权码]\n    C --> D[客户端]\n    D --> E[授权服务器]\n    E --> F[返回Token]\n    F --> D\n    D --> G[资源服务器]\n    G --> A\n```",
    difficulty: 3
  },
  {
    id: 35,
    category: "Spring生态",
    question: "Spring Cloud核心组件？",
    answer: "【Spring Cloud核心组件】\n\n```mermaid\ngraph TD\n    A[Spring Cloud] --> B[服务注册发现]\n    A --> C[负载均衡]\n    A --> D[熔断降级]\n    A --> E[网关]\n    A --> F[配置中心]\n    A --> G[服务调用]\n    \n    B --> B1[Eureka/Nacos]\n    C --> C1[Ribbon/LoadBalancer]\n    D --> D1[Hystrix/Sentinel]\n    E --> E1[Zuul/Gateway]\n    F --> F1[Config/Nacos]\n    G --> G1[Feign/OpenFeign]\n    \n    style A fill:#e1f5fe\n    style B1 fill:#fff3e0\n    style C1 fill:#fff3e0\n    style D1 fill:#fff3e0\n```\n\n【组件对比】\n\n| 功能 | 组件 | 说明 |\n|:---:|:---:|:---|\n| 注册发现 | Eureka | AP模式 |\n| | Nacos | AP+CP |\n| 负载均衡 | Ribbon | 客户端负载 |\n| | LoadBalancer | Spring官方 |\n| 熔断降级 | Hystrix | 停止维护 |\n| | Sentinel | 阿里巴巴 |\n| 网关 | Zuul | 阻塞IO |\n| | Gateway | 响应式 |\n| 配置中心 | Config | Git配置 |\n| | Nacos | 配置+发现 |\n| 服务调用 | Feign | 声明式HTTP |\n| | OpenFeign | Feign升级版 |\n\n【服务调用流程】\n\n```java\n// Feign声明式调用\n@FeignClient(name = \"user-service\")\npublic interface UserClient {\n    @GetMapping(\"/user/{id}\")\n    User getUser(@PathVariable(\"id\") Long id);\n}\n\n// 调用\nUser user = userClient.getUser(1L);\n```\n\n【Hystrix降级】\n\n```java\n@HystrixCommand(fallbackMethod = \"fallback\")\npublic String call() {\n    return restTemplate.getForObject(url, String.class);\n}\n\npublic String fallback() {\n    return \"降级响应\";\n}\n```",
    difficulty: 3
  },
  {
    id: 36,
    category: "Spring生态",
    question: "Spring Cloud Alibaba Nacos原理？与Eureka对比？",
    answer: "【Nacos架构】\n\n```mermaid\ngraph TD\n    A[Nacos Client] --> B[Nacos Server]\n    B --> C[注册中心]\n    B --> D[配置中心]\n    \n    C --> E[心跳检测]\n    C --> F[服务注册]\n    C --> G[服务发现]\n    \n    D --> H[长轮询]\n    D --> I[配置推送]\n    D --> J[配置版本]\n    \n    style C fill:#e1f5fe\n    style D fill:#fff3e0\n```\n\n【Nacos vs Eureka对比】\n\n| 特性 | Nacos | Eureka |\n|:---:|:---:|:---:|\n| CAP支持 | AP+CP | AP |\n| 配置中心 | ✅ | ❌ |\n| 模式切换 | 支持 | 不支持 |\n| 部署 | 单机/集群 | 集群 |\n| 心跳 | 5秒 | 30秒 |\n| 保护机制 | ✅ | ✅ |\n\n【Nacos两种模式】\n\n| 模式 | 说明 | 场景 |\n|:---:|:---|:---|\n| AP模式 | 最终一致性 | 注册中心 |\n| CP模式 | 强一致性 | 配置管理 |\n\n【服务注册发现】\n\n```java\n// 服务注册\n@EnableDiscoveryClient\n@SpringBootApplication\npublic class ProviderApplication { }\n\n// 服务发现\n@LoadBalancer\n@Configuration\npublic class LoadBalancerConfig {\n    @Bean\n    public ServiceInstanceListSupplier supplier() {\n        return ServiceInstanceListSupplier.builder()\n            .withDiscoveryClient()\n            .build();\n    }\n}\n```\n\n【配置中心】\n\n```java\n// 动态刷新\n@RefreshScope\n@Configuration\npublic class Config {\n    @Value(\"${config.name}\")\n    private String name;\n}\n```\n\n【长轮询机制】\n\n1. 客户端发送请求\n2. 服务端hold请求\n3. 配置变更或超时返回\n4. 客户端立即再次请求\n5. 推送变更通知",
    difficulty: 3
  },
  {
    id: 37,
    category: "Spring生态",
    question: "Spring Gateway与Zuul的区别？路由断言和过滤器？",
    answer: "【Gateway vs Zuul对比】\n\n```mermaid\ngraph LR\n    A[请求] --> B[Zuul 1.x]\n    A --> C[Gateway]\n    \n    B -->|阻塞IO| B1[Servlet]\n    C -->|响应式| C1[WebFlux]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n| 特性 | Zuul | Gateway |\n|:---:|:---:|:---:|\n| 线程模型 | 阻塞 | 非阻塞 |\n| 底层 | Servlet | WebFlux |\n| 性能 | 较低 | 较高 |\n| 维护 | 停止维护 | 活跃 |\n| 过滤器 | ZuulFilter | GlobalFilter |\n| 动态路由 | 较差 | 支持 |\n\n【Gateway三大核心】\n\n| 概念 | 说明 |\n|:---:|:---|\n| Route | 路由规则 |\n| Predicate | 断言匹配 |\n| Filter | 过滤器 |\n\n【路由配置】\n\n```yaml\nspring:\n  cloud:\n    gateway:\n      routes:\n        - id: user-service\n          uri: lb://user-service\n          predicates:\n            - Path=/user/**\n          filters:\n            - StripPrefix=1\n```\n\n【Predicate断言】\n\n```java\n// 内置断言\n- Path=/user/**\n- Method=GET\n- Header=X-Request-Id, \\d+\n- Query=page, [1-9]+\n- After=2024-01-01T00:00:00Z\n```\n\n【过滤器类型】\n\n| 类型 | 作用 |\n|:---:|:---|\n| PRE | 请求前执行 |\n| POST | 响应后执行 |\n| GLOBAL | 全局过滤器 |\n\n【自定义过滤器】\n\n```java\n@Component\npublic class LogFilter implements GlobalFilter {\n    @Override\n    public Mono<Void> filter(ServerWebExchange exchange, \n                             GatewayFilterChain chain) {\n        // 前置逻辑\n        System.out.println(\"请求: \" + exchange.getRequest().getURI());\n        return chain.filter(exchange)\n            .then(Mono.fromRunnable(() -> {\n                // 后置逻辑\n                System.out.println(\"响应: \" + exchange.getResponse().getStatusCode());\n            }));\n    }\n}\n```",
    difficulty: 3
  },
  {
    id: 38,
    category: "Spring生态",
    question: "Spring Bean的作用域？singleton和prototype区别？",
    answer: "【Spring Bean作用域】\n\n```mermaid\ngraph TD\n    A[Bean作用域] --> B[单例]\n    A --> C[原型]\n    A --> D[请求]\n    A --> E[会话]\n    A --> F[应用]\n    A --> G[WebSocket]\n    \n    B --> B1[整个容器一个]\n    C --> C1[每次请求创建]\n    D --> D2[HTTP请求一个]\n    E --> E1[HTTP会话一个]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【5种作用域】\n\n| 作用域 | 说明 | Web环境 |\n|:---:|:---|:---:|\n| singleton | 单例（默认） | ✅ |\n| prototype | 原型 | ✅ |\n| request | HTTP请求 | ✅ |\n| session | HTTP会话 | ✅ |\n| application | ServletContext | ✅ |\n| websocket | WebSocket | ✅ |\n\n【singleton vs prototype】\n\n| 特性 | singleton | prototype |\n|:---:|:---:|:---:|\n| 创建时机 | 容器启动时 | 每次获取时 |\n| 销毁 | 容器关闭时 | GC回收 |\n| 内存 | 占用少 | 占用多 |\n| 线程安全 | 否 | 否 |\n| 适用场景 | 无状态Bean | 有状态Bean |\n\n【配置方式】\n\n```java\n// 注解方式\n@Scope(\"singleton\")\n@Component\npublic class UserService { }\n\n// 原型\n@Scope(\"prototype\")\n@Component\npublic class UserService { }\n\n// Web环境\n@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)\n@Component\npublic class RequestService { }\n```\n\n```xml\n<!-- XML配置 -->\n<bean id=\"userService\" class=\"com.example.UserService\" scope=\"singleton\" />\n```\n\n【注意事项】\n- prototype Bean不会自动销毁\n- 需要手动管理生命周期\n- 尽量使用无状态Bean",
    difficulty: 2
  },
  {
    id: 39,
    category: "Spring生态",
    question: "@Autowired和@Resource的区别？",
    answer: "【@Autowired vs @Resource对比】\n\n```mermaid\ngraph LR\n    A[依赖注入] --> B[@Autowired]\n    A --> C[@Resource]\n    \n    B -->|byType| B1[类型匹配]\n    B -->|@Qualifier| B2[名称匹配]\n    C -->|byName| C1[名称优先]\n    C -->|@Qualifier| C2[类型匹配]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【主要区别】\n\n| 特性 | @Autowired | @Resource |\n|:---:|:---:|:---:|\n| 来源 | Spring框架 | JSR-250 |\n| 匹配方式 | 类型优先 | 名称优先 |\n| required属性 | 支持 | 支持 |\n| 构造函数 | 支持 | 不支持 |\n| 位置 | 字段/方法/构造器 | 字段/方法 |\n\n【匹配流程】\n\n@Autowired:\n1. 按类型查找\n2. 多个类型 → @Qualifier按名称\n3. 找不到 → 报错（默认required=true）\n\n@Resource:\n1. 按名称查找（name属性）\n2. 找不到 → 按类型查找\n3. 多个类型 → @Qualifier\n\n【使用示例】\n\n```java\n// @Autowired - 按类型注入\n@Autowired\nprivate UserService userService;\n\n// @Autowired + @Qualifier - 按名称注入\n@Autowired\n@Qualifier(\"userServiceImpl\")\nprivate UserService userService;\n\n// @Resource - 按名称注入\n@Resource\nprivate UserService userService;\n\n// @Resource - 指定名称\n@Resource(name = \"userServiceImpl\")\nprivate UserService userService;\n\n// @Autowired - 构造函数\n@Autowired\npublic UserController(UserService userService) {\n    this.userService = userService;\n}\n```\n\n【最佳实践】\n- 默认使用@Autowired\n- 明确指定Bean使用@Qualifier\n- 第三方框架兼容使用@Resource",
    difficulty: 2
  },
  {
    id: 40,
    category: "Spring生态",
    question: "Spring中用到哪些设计模式？",
    answer: "【Spring设计模式】\n\n```mermaid\ngraph TD\n    A[Spring设计模式] --> B[创建型]\n    A --> C[结构型]\n    A --> D[行为型]\n    \n    B --> B1[单例]\n    B --> B2[工厂]\n    B --> B3[建造者]\n    \n    C --> C1[代理]\n    C --> C2[适配器]\n    C --> C3[装饰器]\n    \n    D --> D1[模板方法]\n    D --> D2[观察者]\n    D --> D3[策略]\n    \n    style A fill:#e1f5fe\n```\n\n【创建型模式】\n\n| 模式 | Spring应用 |\n|:---:|:---|\n| 单例模式 | Bean默认单例 |\n| 工厂模式 | BeanFactory、ApplicationContext |\n| 建造者模式 | BeanDefinitionBuilder |\n\n【结构型模式】\n\n| 模式 | Spring应用 |\n|:---:|:---|\n| 代理模式 | AOP动态代理 |\n| 适配器模式 | HandlerAdapter |\n| 装饰器模式 | BufferedInputStream |\n| 门面模式 | ApplicationContext |\n\n【行为型模式】\n\n| 模式 | Spring应用 |\n|:---:|:---|\n| 模板方法 | JdbcTemplate |\n| 观察者模式 | 事件机制ApplicationEvent |\n| 策略模式 | Resource不同实现 |\n| 责任链模式 | FilterChain |\n\n【代码示例】\n\n```java\n// 单例 - Bean默认\n@Scope(\"singleton\")\n@Component\npublic class UserService { }\n\n// 工厂 - BeanFactory\nUser user = beanFactory.getBean(User.class);\n\n// 代理 - AOP\nUserService proxy = (UserService) \n    Proxy.newProxyInstance(...);\n\n// 模板方法 - JdbcTemplate\njdbcTemplate.query(sql, (rs) -> {\n    // 模板方法，子类实现\n});\n\n// 观察者 - 事件\napplicationContext.publishEvent(new MyEvent());\n```",
    difficulty: 2
  },
  {
    id: 41,
    category: "Spring生态",
    question: "Spring事件监听机制？ApplicationEvent？",
    answer: "【Spring事件机制】\n\n```mermaid\nsequenceDiagram\n    participant P as 发布者\n    participant A as ApplicationEventPublisher\n    participant E as ApplicationEventMulticaster\n    participant L as Listener\n    \n    P->>A: 发布事件\n    A->>E: 广播事件\n    E->>L: 匹配Listener\n    L->>L: 处理事件\n    L-->>P: 异步回调\n```\n\n【事件三要素】\n\n| 要素 | 说明 |\n|:---:|:---|\n| ApplicationEvent | 事件对象 |\n| ApplicationListener | 事件监听器 |\n| ApplicationEventPublisher | 事件发布器 |\n\n【自定义事件】\n\n```java\n// 1. 定义事件\npublic class UserRegisterEvent extends ApplicationEvent {\n    private String username;\n    \n    public UserRegisterEvent(Object source, String username) {\n        super(source);\n        this.username = username;\n    }\n}\n\n// 2. 定义监听器\n@Component\npublic class UserRegisterListener implements ApplicationListener<UserRegisterEvent> {\n    @Override\n    public void onApplicationEvent(UserRegisterEvent event) {\n        System.out.println(\"用户注册: \" + event.getUsername());\n        // 发送邮件、短信等\n    }\n}\n\n// 3. 发布事件\n@Service\npublic class UserService {\n    @Autowired\n    private ApplicationEventPublisher publisher;\n    \n    public void register(String username) {\n        // 业务逻辑\n        publisher.publishEvent(new UserRegisterEvent(this, username));\n    }\n}\n```\n\n【监听器注册方式】\n\n| 方式 | 说明 |\n|:---:|:---|\n| @EventListener | 注解方式 |\n| ApplicationListener | 接口方式 |\n| @Async | 异步处理 |\n\n【@EventListener使用】\n\n```java\n@Async  // 异步执行\n@EventListener(classes = UserRegisterEvent.class)\npublic void handleUserRegister(UserRegisterEvent event) {\n    // 异步处理\n}\n```\n\n【事件传播机制】\n1. 同步传播：顺序执行所有监听器\n2. 异步传播：@Async注解，异步执行",
    difficulty: 2
  },
  {
    id: 42,
    category: "Spring生态",
    question: "Spring Data JPA和MyBatis的区别？",
    answer: "【JPA vs MyBatis对比】\n\n```mermaid\ngraph LR\n    A[数据访问] --> B[JPA]\n    A --> C[MyBatis]\n    \n    B -->|全自动| B1[ORM映射]\n    C -->|半自动| C1[SQL编写]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【核心区别】\n\n| 特性 | JPA | MyBatis |\n|:---:|:---:|:---:|\n| 模式 | 全自动ORM | 半自动SQL |\n| SQL控制 | 不可控 | 完全可控 |\n| 学习成本 | 较低 | 较高 |\n| 缓存 | 一级/二级 | 一级/二级/自定义 |\n| 适用场景 | 简单CRUD | 复杂查询 |\n\n【JPA使用】\n\n```java\n// 实体\n@Entity\n@Table(name = \"user\")\npublic class User {\n    @Id\n    @GeneratedValue\n    private Long id;\n    \n    @Column(name = \"username\")\n    private String username;\n}\n\n// Repository\npublic interface UserRepository extends JpaRepository<User, Long> {\n    List<User> findByUsername(String username);\n    \n    @Query(\"SELECT u FROM User u WHERE u.username = ?1\")\n    User findByUsernameQuery(String username);\n}\n\n// Service\n@Service\npublic class UserService {\n    @Autowired\n    private UserRepository userRepository;\n    \n    public User save(User user) {\n        return userRepository.save(user);\n    }\n}\n```\n\n【MyBatis使用】\n\n```xml\n<!-- Mapper.xml -->\n<mapper namespace=\"com.example.UserMapper\">\n    <select id=\"selectById\" resultType=\"User\">\n        SELECT * FROM user WHERE id = #{id}\n    </select>\n</mapper>\n```\n\n```java\n// Mapper接口\n@Mapper\npublic interface UserMapper {\n    User selectById(Long id);\n    \n    @Select(\"SELECT * FROM user WHERE username = #{username}\")\n    User selectByUsername(String username);\n}\n\n// 使用\n@Service\npublic class UserService {\n    @Autowired\n    private UserMapper userMapper;\n    \n    public User getById(Long id) {\n        return userMapper.selectById(id);\n    }\n}\n```\n\n【缓存对比】\n\n| 缓存 | JPA | MyBatis |\n|:---:|:---:|:---:|\n| 一级 | 自动 | 手动配置 |\n| 二级 | 自动 | 手动配置 |\n| 查询缓存 | ❌ | ✅ |\n| 自定义 | 困难 | 灵活 |",
    difficulty: 2
  },
  {
    id: 43,
    category: "Spring生态",
    question: "Spring Batch批处理框架的核心概念？",
    answer: "【Spring Batch核心概念】\n\n```mermaid\ngraph TD\n    A[Job] --> B[Step1]\n    A --> C[Step2]\n    \n    B --> B1[Tasklet]\n    B --> B2[Chunk]\n    B2 --> B3[ItemReader]\n    B2 --> B4[ItemProcessor]\n    B2 --> B5[ItemWriter]\n    \n    style A fill:#e1f5fe\n    style B2 fill:#fff3e0\n```\n\n【核心组件】\n\n| 组件 | 说明 |\n|:---:|:---|\n| Job | 作业，一个批处理任务 |\n| Step | 作业步，Job的子任务 |\n| Tasklet | 单个任务 |\n| Chunk | 块处理（读-处理-写） |\n| Item | 数据项 |\n\n【Job结构】\n\n```java\n@Configuration\npublic class BatchConfig {\n    \n    @Bean\n    public Job batchJob(JobBuilderFactory jobs, Step step) {\n        return jobs.get(\"batchJob\")\n            .start(step)\n            .build();\n    }\n    \n    @Bean\n    public Step step(StepBuilderFactory steps,\n                     ItemReader<Input> reader,\n                     ItemProcessor<Input, Output> processor,\n                     ItemWriter<Output> writer) {\n        return steps.get(\"step\")\n            .<Input, Output>chunk(10)  // 提交间隔\n            .reader(reader)\n            .processor(processor)\n            .writer(writer)\n            .build();\n    }\n}\n```\n\n【Item处理流程】\n\n```mermaid\ngraph LR\n    A[ItemReader] --> B[ItemProcessor]\n    B --> C[ItemWriter]\n    \n    A -->|读取1条| A1\n    B -->|处理1条| B1\n    B1 -->|累积10条| C\n```\n\n【Reader/Processor/Writer】\n\n```java\n// ItemReader\n@Bean\npublic FlatFileItemReader<Input> reader() {\n    return new FlatFileItemReaderBuilder<Input>()\n        .resource(new ClassPathResource(\"input.csv\"))\n        .delimited()\n        .names(\"field1\", \"field2\")\n        .targetType(Input.class)\n        .build();\n}\n\n// ItemProcessor\n@Bean\npublic ItemProcessor<Input, Output> processor() {\n    return item -> {\n        // 数据转换/过滤\n        return output;\n    };\n}\n\n// ItemWriter\n@Bean\npublic JdbcBatchItemWriter<Output> writer(DataSource dataSource) {\n    return new JdbcBatchItemWriterBuilder<Output>()\n        .dataSource(dataSource)\n        .sql(\"INSERT INTO output VALUES(?, ?)\")\n        .itemPreparedStatementSetter((item, ps) -> {\n            ps.setString(1, item.getField1());\n            ps.setString(2, item.getField2());\n        })\n        .build();\n}\n```\n\n【Job启动器】\n\n| 启动方式 | 说明 |\n|:---:|:---|\n| CommandLineJobRunner | 命令行 |\n| JobOperator | Java API |\n| Scheduler | 定时任务 |",
    difficulty: 3
  },
  {
    id: 44,
    category: "Spring生态",
    question: "Spring WebFlux与Spring MVC的区别？",
    answer: "【WebFlux vs MVC对比】\n\n```mermaid\ngraph LR\n    A[请求处理] --> B[Spring MVC]\n    A --> C[WebFlux]\n    \n    B -->|阻塞| B1[Servlet容器]\n    C -->|非阻塞| C1[Netty/Reactor]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【核心区别】\n\n| 特性 | Spring MVC | Spring WebFlux |\n|:---:|:---:|:---:|\n| 编程模型 | 命令式 | 响应式 |\n| 线程模型 | 阻塞 | 非阻塞 |\n| 容器 | Tomcat/Jetty | Netty |\n| 适用场景 | CPU密集型 | I/O密集型 |\n| 学习成本 | 较低 | 较高 |\n\n【WebFlux优势】\n\n| 优势 | 说明 |\n|:---:|:---|\n| 非阻塞 | 少量线程处理高并发 |\n| 背压 | 支持背压处理 |\n| 响应式 | 响应式数据流 |\n| 微服务 | 高并发微服务 |\n\n【响应式类型】\n\n```java\n// Mono - 0或1个元素\nMono<String> mono = Mono.just(\"hello\");\nMono<Object> empty = Mono.empty();\n\n// Flux - 0或N个元素\nFlux<String> flux = Flux.just(\"a\", \"b\", \"c\");\nFlux<Integer> range = Flux.range(1, 10);\n\n// 操作符\nflux.map(String::toUpperCase)\n    .filter(s -> s.length() > 3)\n    .collectList();\n```\n\n【WebFlux示例】\n\n```java\n// 响应式Controller\n@RestController\npublic class UserController {\n    \n    @GetMapping(\"/users\")\n    public Flux<User> getUsers() {\n        return userService.findAll();\n    }\n    \n    @GetMapping(\"/user/{id}\")\n    public Mono<User> getUser(@PathVariable Long id) {\n        return userService.findById(id);\n    }\n}\n\n// 响应式Service\n@Service\npublic class UserService {\n    \n    public Flux<User> findAll() {\n        return userRepository.findAll()\n            .delayElements(Duration.ofMillis(100));\n    }\n    \n    public Mono<User> findById(Long id) {\n        return userRepository.findById(id);\n    }\n}\n```\n\n【选择建议】\n\n| 场景 | 选择 |\n|:---:|:---|\n| 简单CRUD | MVC |\n| 响应式需求 | WebFlux |\n| 同步调用多 | MVC |\n| 高并发I/O | WebFlux |\n| 团队响应式经验少 | MVC |",
    difficulty: 3
  },
  {
    id: 45,
    category: "Spring生态",
    question: "Spring Native和GraalVM编译？",
    answer: "【Spring Native原理】\n\n```mermaid\ngraph TD\n    A[Java源码] --> B[Javac编译]\n    B --> C[GraalVM native-image]\n    C --> D[Native可执行文件]\n    \n    style C fill:#e1f5fe\n    style D fill:#c8e6c9\n```\n\n【GraalVM编译】\n\n| 特性 | JVM | GraalVM Native |\n|:---:|:---:|:---:|\n| 启动时间 | 秒级 | 毫秒级 |\n| 内存占用 | MB级 | KB级 |\n| 预热 | 需要 | 不需要 |\n| 打包体积 | JAR | 二进制 |\n| 动态特性 | 支持 | 限制 |\n\n【Spring Native支持】\n\n```xml\n<!-- pom.xml -->\n<dependencies>\n    <dependency>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter</artifactId>\n    </dependency>\n</dependencies>\n\n<build>\n    <plugins>\n        <plugin>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-maven-plugin</artifactId>\n            <configuration>\n                <executable>true</executable>\n            </configuration>\n        </plugin>\n    </plugins>\n</build>\n```\n\n【编译命令】\n\n```bash\n# 安装GraalVM后\n./mvnw native:build -Pnative\n\n# 或使用Docker\n./mvnw spring-boot:build-image\n```\n\n【限制事项】\n\n| 特性 | 支持情况 |\n|:---:|:---|\n| 反射 | 需要配置 |\n| 动态类加载 | 不支持 |\n| 动态代理 | 有限支持 |\n| 字节码生成 | 有限支持 |\n| JNI | 不支持 |\n\n【配置文件】\n\n```json\n// reflect-config.json\n[\n    {\n        \"name\": \"com.example.User\",\n        \"fields\": [\n            {\"name\": \"id\", \"allowWrite\": true}\n        ]\n    }\n]\n```\n\n【适用场景】\n\n| 场景 | 推荐 |\n|:---:|:---|\n| Serverless | ✅ Native |\n| 容器化 | ✅ Native |\n| 传统应用 | ❌ JVM |\n| 长期运行 | ❌ JVM |\n\n【Spring Boot 3特性】\n- AOT编译原生支持\n- 更好的GraalVM集成\n- 减少反射使用",
    difficulty: 3
  },
  {
    id: 46,
    category: "数据库与缓存",
    question: "MySQL索引底层数据结构？B+树的优势？",
    answer: "【MySQL索引数据结构】\n\n```mermaid\ngraph TD\n    A[索引] --> B[Hash]\n    A --> C[B+树]\n    A --> D[二叉树]\n    A --> E[红黑树]\n    \n    C --> C1[所有数据在叶子]\n    C --> C2[叶子链表相连]\n    \n    style C fill:#e1f5fe\n```\n\n【B+树 vs B树】\n\n| 特性 | B+树 | B树 |\n|:---:|:---:|:---:|\n| 数据存储 | 只在叶子 | 全部节点 |\n| 叶子连接 | 链表 | 无 |\n| 范围查询 | 高效 | 效率低 |\n| 查询稳定 | O(log n) | O(log n) |\n\n【B+树优势】\n\n| 优势 | 说明 |\n|:---:|:---|\n| 磁盘IO少 | 树高固定，IO次数少 |\n| 范围查询快 | 叶子节点链表相连 |\n| 查询稳定 | 每次都是叶子 |\n| 更适合索引 | Innodb默认索引 |\n\n【B+树结构】\n\n```\n                    [根节点]\n                   /   |   \\\n            [内节点1] [内节点2] [内节点3]\n              /  \\      |       /   \\\n         [叶子1] [叶子2] ...   [叶子N]\n         /  \\\n       ...  ...\n       \n       ↓ 叶子节点链表相连\n       \n       [1] → [2] → [3] → [4] → [5]\n```\n\n【InnoDB索引特点】\n- 聚簇索引：数据和索引在一起\n- 主键索引：叶子节点存完整数据\n- 二级索引：叶子节点存主键值",
    difficulty: 3
  },
  {
    id: 47,
    category: "数据库与缓存",
    question: "聚簇索引和非聚簇索引的区别？回表查询？",
    answer: "【聚簇索引 vs 非聚簇索引】\n\n```mermaid\ngraph LR\n    A[数据存储] --> B[聚簇索引]\n    A --> C[非聚簇索引]\n    \n    B -->|数据在索引中| B1[主键顺序存储]\n    C -->|索引+数据分离| C1[指针指向]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【核心区别】\n\n| 特性 | 聚簇索引 | 非聚簇索引 |\n|:---:|:---:|:---:|\n| 数据存储 | 索引叶子节点 | 索引叶子节点存指针 |\n| 数量 | 一个表一个 | 一个表多个 |\n| 顺序 | 数据按索引顺序 | 索引独立 |\n| 查询速度 | 主键查询快 | 索引覆盖快 |\n\n【聚簇索引特点】\n\n| 说明 | 内容 |\n|:---:|:---|\n| InnoDB | 主键是聚簇索引 |\n| 数据顺序 | 按主键顺序物理存储 |\n| 查询效率 | 主键查询最快 |\n| 插入效率 | 可能导致页分裂 |\n\n【非聚簇索引特点】\n\n| 说明 | 内容 |\n|:---:|:---|\n| 二级索引 | 除主键外的索引 |\n| 叶子节点 | 存储主键值 |\n| 覆盖索引 | 索引包含查询字段 |\n\n【回表查询】\n\n```mermaid\ngraph TD\n    A[SELECT * FROM user WHERE name='Tom'] --> B[查二级索引]\n    B --> C{索引覆盖?}\n    C -->|是| D[直接返回]\n    C -->|否| E[回表查主键]\n    E --> F[查聚簇索引]\n    F --> D\n    \n    style E fill:#ffcdd2\n```\n\n【避免回表】\n- 使用覆盖索引\n- 只查询索引列\n- 索引包含所有字段",
    difficulty: 3
  },
  {
    id: 48,
    category: "数据库与缓存",
    question: "索引失效的常见场景？",
    answer: "【索引失效场景】\n\n```mermaid\ngraph TD\n    A[索引失效] --> B[函数操作]\n    A --> C[类型转换]\n    A --> D[模糊查询]\n    A --> E[or条件]\n    A --> F[NOT操作]\n    A --> G[统计函数]\n    \n    style A fill:#ffcdd2\n```\n\n【失效场景汇总】\n\n| 场景 | 示例 | 原因 |\n|:---:|:---|:---|\n| 函数操作 | WHERE LEFT(name,3)='Tom' | 索引列被函数处理 |\n| 类型转换 | WHERE name=123 | 类型不匹配 |\n| 模糊查询 | WHERE name LIKE '%om' | 以%开头 |\n| or条件 | WHERE name='A' OR age=20 | OR导致全表 |\n| NOT操作 | WHERE age != 20 | 索引失效 |\n| 全表扫描 | WHERE 1=1 | 避免使用 |\n| 最左前缀 | WHERE b=1 AND c=1 | 跳过a |\n\n【详细说明】\n\n1️⃣ 函数操作\n```sql\n-- 失效\nSELECT * FROM user WHERE LEFT(name,3)='Tom'\n\n-- 生效\nSELECT * FROM user WHERE name LIKE 'Tom%'\n```\n\n2️⃣ 类型转换\n```sql\n-- 失效（name是varchar）\nSELECT * FROM user WHERE name=123\n\n-- 生效\nSELECT * FROM user WHERE name='123'\n```\n\n3️⃣ 模糊查询\n```sql\n-- 失效\nSELECT * FROM user WHERE name LIKE '%om'\n\n-- 生效\nSELECT * FROM user WHERE name LIKE 'Tom%'\n```\n\n4️⃣ OR条件\n```sql\n-- 失效\nSELECT * FROM user WHERE name='Tom' OR age=20\n\n-- 生效（改为UNION）\nSELECT * FROM user WHERE name='Tom'\nUNION ALL\nSELECT * FROM user WHERE age=20\n```\n\n【优化建议】\n- 避免在索引列上使用函数\n- 使用覆盖索引\n- 遵循最左前缀原则",
    difficulty: 3
  },
  {
    id: 49,
    category: "数据库与缓存",
    question: "事务的ACID特性？隔离级别及解决的问题？",
    answer: "【事务ACID特性】\n\n```mermaid\ngraph TD\n    A[事务] --> A1[Atomic原子性]\n    A --> A2[Consistency一致性]\n    A --> A3[Isolation隔离性]\n    A --> A4[Durability持久性]\n    \n    style A fill:#e1f5fe\n```\n\n| 特性 | 说明 |\n|:---:|:---|\n| Atomic | 全部成功或全部失败 |\n| Consistency | 状态转换前后一致 |\n| Isolation | 并发事务互不干扰 |\n| Durability | 提交后永久保存 |\n\n【隔离级别】\n\n| 隔离级别 | 脏读 | 不可重复读 | 幻读 |\n|:---:|:---:|:---:|:---:|\n| READ_UNCOMMITTED | ✅ | ✅ | ✅ |\n| READ_COMMITTED | ❌ | ✅ | ✅ |\n| REPEATABLE_READ | ❌ | ❌ | ✅ |\n| SERIALIZABLE | ❌ | ❌ | ❌ |\n\n【问题说明】\n\n| 问题 | 说明 |\n|:---:|:---|\n| 脏读 | 读取到未提交的数据 |\n| 不可重复读 | 两次读取结果不同 |\n| 幻读 | 读取到新插入的行 |\n\n【MySQL默认隔离级别】\n\n```sql\n-- MySQL默认REPEATABLE_READ\nSELECT @@transaction_isolation;\n\n-- 设置隔离级别\nSET transaction isolation level READ_COMMITTED;\n```\n\n【InnoDB隔离级别实现】\n\n| 隔离级别 | 实现方式 |\n|:---:|:---|\n| READ_COMMITTED | MVCC |\n| REPEATABLE_READ | MVCC + Next-Key Lock |\n| SERIALIZABLE | 锁 |",
    difficulty: 3
  },
  {
    id: 50,
    category: "数据库与缓存",
    question: "MVCC多版本并发控制原理？Read View机制？",
    answer: "【MVCC原理】\n\n```mermaid\ngraph TD\n    A[MVCC] --> B[隐藏字段]\n    A --> C[undo log]\n    A --> D[Read View]\n    \n    B --> B1[trx_id]\n    B --> B2[roll_pointer]\n    B --> B3[row_id]\n    \n    style A fill:#e1f5fe\n```\n\n【隐藏字段】\n\n| 字段 | 说明 |\n|:---:|:---|\n| trx_id | 事务ID |\n| roll_pointer | 回滚指针 |\n| row_id | 行ID（无主键时） |\n\n【undo log】\n\n- 记录数据变更前的版本\n- 链式存储，形成版本链\n- 用于回滚和快照读\n\n【Read View】\n\n```mermaid\ngraph TD\n    A[Read View] --> B[m_ids]\n    A --> C[min_trx_id]\n    A --> D[max_trx_id]\n    A --> E[creator_trx_id]\n    \n    B -->|活跃事务ID列表| B1\n    C -->|最小活跃事务ID| C1\n    D -->|创建视图时最大ID| D1\n    E -->|创建者事务ID| E1\n```\n\n【快照读 vs 当前读】\n\n| 类型 | 说明 | SQL |\n|:---:|:---|:---|\n| 快照读 | 读取历史版本 | SELECT |\n| 当前读 | 读取最新版本 | SELECT ... FOR UPDATE |\n\n【可见性判断】\n\n```\n1. trx_id < min_trx_id → 可见\n2. trx_id > max_trx_id → 不可见\n3. trx_id ∈ m_ids → 不可见\n4. 其他 → 可见\n```\n\n【RR vs RC区别】\n\n| 特性 | REPEATABLE_READ | READ_COMMITTED |\n|:---:|:---:|:---:|\n| 快照时机 | 事务开始时 | SQL开始时 |\n| 每次SELECT | 同一快照 | 新快照 |\n| 幻读 | 较少 | 较多 |",
    difficulty: 3
  },
  {
    id: 51,
    category: "数据库与缓存",
    question: "MySQL锁的类型？行锁、表锁、间隙锁、临键锁？",
    answer: "【MySQL锁类型】\n\n```mermaid\ngraph TD\n    A[MySQL锁] --> B[行锁]\n    A --> C[表锁]\n    A --> D[意向锁]\n    A --> E[Gap锁]\n    \n    B --> B1[Record Lock]\n    B --> B2[Next-Key Lock]\n    C --> C1[IS/IX]\n    E --> E1[Gap Lock]\n```\n\n【锁粒度对比】\n\n| 锁类型 | 粒度 | 开销 | 冲突 |\n|:---:|:---:|:---:|:---:|\n| 行锁 | 行 | 大 | 少 |\n| 表锁 | 表 | 小 | 多 |\n| 间隙锁 | 区间 | 中 | 中 |\n\n【InnoDB行锁】\n\n| 锁类型 | 说明 |\n|:---:|:---|\n| Record Lock | 单行记录锁 |\n| Gap Lock | 间隙锁，锁定范围 |\n| Next-Key Lock | Record Lock + Gap Lock |\n\n【意向锁】\n\n| 锁类型 | 说明 |\n|:---:|:---|\n| IS | 意图获取行共享锁 |\n| IX | 意图获取行排他锁 |\n\n【锁兼容矩阵】\n\n|  | S | X | IS | IX |\n|:---:|:---:|:---:|:---:|:---:|\n| S | ✅ | ❌ | ✅ | ❌ |\n| X | ❌ | ❌ | ❌ | ❌ |\n| IS | ✅ | ❌ | ✅ | ✅ |\n| IX | ❌ | ❌ | ✅ | ✅ |\n\n【死锁产生】\n\n```mermaid\ngraph TD\n    A[事务A] --> B[UPDATE user SET age=20 WHERE id=1]\n    B --> C[获取id=1锁]\n    C --> D[UPDATE user SET age=21 WHERE id=2]\n    D --> E[等待id=2锁]\n    \n    F[事务B] --> G[UPDATE user SET age=21 WHERE id=2]\n    G --> H[获取id=2锁]\n    H --> I[UPDATE user SET age=20 WHERE id=1]\n    I --> J[等待id=1锁]\n    \n    style E fill:#ffcdd2\n    style J fill:#ffcdd2\n```\n\n【避免死锁】\n- 统一访问顺序\n- 尽量小事务\n- 降低隔离级别",
    difficulty: 3
  },
  {
    id: 52,
    category: "数据库与缓存",
    question: "SQL优化的一般步骤？Explain分析哪些字段？",
    answer: "【SQL优化步骤】\n\n```mermaid\ngraph TD\n    A[SQL优化] --> B[确定慢SQL]\n    B --> C[Explain分析]\n    C --> D[执行计划]\n    D --> E[索引优化]\n    E --> F[SQL改写]\n    F --> G[架构优化]\n    \n    style A fill:#e1f5fe\n```\n\n【Explain关键字段】\n\n| 字段 | 说明 | 关注点 |\n|:---:|:---|:---|\n| type | 连接类型 | 最好到ref/range |\n| key | 使用索引 | 是否有索引 |\n| rows | 扫描行数 | 越少越好 |\n| Extra | 额外信息 | Using filesort/temporary |\n\n【type类型（从好到差）】\n\n| type | 说明 |\n|:---:|:---|\n| const | 主键/唯一索引等值查询 |\n| eq_ref | 关联查询，主键/唯一 |\n| ref | 非唯一索引等值查询 |\n| range | 索引范围查询 |\n| index | 全索引扫描 |\n| ALL | 全表扫描 |\n\n【Extra说明】\n\n| 值 | 含义 |\n|:---:|:---|\n| Using filesort | 需要额外排序 |\n| Using temporary | 使用临时表 |\n| Using index | 覆盖索引 |\n| Using where | 使用where过滤 |\n\n【优化手段】\n\n| 手段 | 说明 |\n|:---:|:---|\n| 覆盖索引 | SELECT只查索引列 |\n| 索引下推 | ICP减少回表 |\n| 强制索引 | FORCE INDEX |\n| 改写SQL | 避免子查询 |\n\n【优化示例】\n\n```sql\n-- 优化前\nSELECT * FROM user WHERE YEAR(birthday) = 1990\n\n-- 优化后（使用范围）\nSELECT * FROM user WHERE birthday >= '1990-01-01' \n  AND birthday < '1991-01-01'\n```",
    difficulty: 3
  },
  {
    id: 53,
    category: "数据库与缓存",
    question: "分库分表策略？垂直拆分vs水平拆分？",
    answer: "【分库分表策略】\n\n```mermaid\ngraph TD\n    A[分库分表] --> B[垂直拆分]\n    A --> C[水平拆分]\n    \n    B --> B1[按业务]\n    B --> B2[按字段]\n    \n    C --> C1[按数据量]\n    C --> C2[按时间]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【垂直拆分】\n\n| 拆分方式 | 说明 |\n|:---:|:---|\n| 垂直分库 | 按业务拆分到不同库 |\n| 垂直分表 | 按字段拆分到不同表 |\n\n示例：\n```\n用户库 → 用户基本信息表 + 用户详情表\n```\n\n【水平拆分】\n\n| 拆分方式 | 说明 |\n|:---:|:---|\n| 哈希分片 | 按ID % n |\n| 范围分片 | 按ID范围/时间 |\n| 一致性哈希 | 减少扩容影响 |\n\n【分片键选择】\n\n| 场景 | 分片键 |\n|:---:|:---|\n| 订单查询 | order_id / user_id |\n| 用户查询 | user_id |\n| 时间查询 | create_time |\n\n【全局ID生成】\n\n| 方案 | 优点 | 缺点 |\n|:---:|:---|:---|\n| UUID | 简单 | 无序 |\n| 雪花算法 | 有序 | 依赖时钟 |\n| 数据库号段 | 高性能 | 依赖DB |\n| Redis | 高性能 | 可能重复 |\n\n【ShardingSphere】\n\n```yaml\nspring:\n  shardingsphere:\n    rules:\n      sharding:\n        tables:\n          order:\n            actual-data-nodes: ds$->{0..1}.order_$->{0..3}\n            database-strategy:\n              standard:\n                sharding-column: user_id\n                sharding-algorithm-name: database_mod\n            table-strategy:\n              standard:\n                sharding-column: order_id\n                sharding-algorithm-name: table_mod\n```",
    difficulty: 3
  },
  {
    id: 54,
    category: "数据库与缓存",
    question: "主从复制原理？binlog格式？延迟问题？",
    answer: "【MySQL主从复制】\n\n```mermaid\nsequenceDiagram\n    participant Master as Master\n    participant Binlog as Binlog\n    participant Slave as Slave\n    participant Relay as RelayLog\n    \n    Master->>Master: 事务写入\n    Master->>Binlog: 写入binlog\n    Binlog->>Slave: IO线程拉取\n    Slave->>Relay: 写入relay log\n    Relay->>Slave: SQL线程执行\n```\n\n【复制原理】\n\n| 步骤 | 说明 |\n|:---:|:---|\n| 1. 主库写入 | 事务写入binlog |\n| 2. IO线程 | 主库拉取binlog |\n| 3. relay log | 从库写入中继日志 |\n| 4. SQL执行 | 从库重放SQL |\n\n【binlog格式】\n\n| 格式 | 说明 | 优点 |\n|:---:|:---|:---|\n| Statement | 记录SQL | 文件小 |\n| Row | 记录行数据 | 准确 |\n| Mixed | 混合模式 | 自动选择 |\n\n【复制类型】\n\n| 类型 | 说明 |\n|:---:|:---|\n| 异步复制 | 主从独立，延迟高 |\n| 半同步复制 | 至少一个从库确认 |\n| 全同步复制 | 所有从库确认 |\n\n【延迟原因】\n\n| 原因 | 解决方案 |\n|:---:|:---|\n| 网络延迟 | 优化网络 |\n| 从库性能 | 提升硬件 |\n| 大事务 | 拆分事务 |\n| 并行复制 | 开启并行复制 |\n\n【并行复制配置】\n\n```sql\n-- 开启并行复制\nSET GLOBAL slave_parallel_type = 'LOGICAL_CLOCK';\nSET GLOBAL slave_parallel_workers = 4;\n```",
    difficulty: 3
  },
  {
    id: 55,
    category: "数据库与缓存",
    question: "Redis为什么快？单线程还是多线程？",
    answer: "【Redis为什么快】\n\n```mermaid\ngraph TD\n    A[Redis快] --> B[内存操作]\n    A --> C[IO多路复用]\n    A --> D[单线程]\n    A --> E[高效数据结构]\n    \n    B --> B1[内存访问ns级]\n    C --> C1[Epoll模型]\n    D --> D1[无锁竞争]\n    E --> E1[Hash/跳表]\n    \n    style A fill:#c8e6c9\n```\n\n【Redis为什么快】\n\n| 原因 | 说明 |\n|:---:|:---|\n| 内存操作 | 内存访问纳秒级 |\n| IO多路复用 | 单线程处理高并发 |\n| 无锁竞争 | 避免上下文切换 |\n| 高效数据结构 | O(1)操作 |\n\n【单线程 vs 多线程】\n\n| 版本 | 模型 |\n|:---:|:---|\n| Redis 6之前 | 单线程（主命令处理） |\n| Redis 6+ | 多线程（IO处理） |\n\n【Redis 6多线程】\n\n```\n主线程：命令执行\nIO线程：网络IO读写（可选）\n```\n\n【IO多路复用】\n\n```mermaid\ngraph LR\n    A[Client1] --> R[Redis]\n    A2[Client2] --> R\n    A3[Client3] --> R\n    \n    R -->|select/epoll| E[事件循环]\n    E -->|处理事件| R\n```\n\n【高性能原因详解】\n\n1. **内存存储**：内存操作比磁盘快10000倍\n2. **单线程**：无锁开销，CPU不是瓶颈\n3. **IO多路复用**：单线程处理大量连接\n4. **非阻塞IO**：读写不等待\n5. **数据结构优化**：SDS/ziplist/quicklist",
    difficulty: 2
  },
  {
    id: 56,
    category: "数据库与缓存",
    question: "Redis数据类型及使用场景？ZSet底层？",
    answer: "【Redis数据类型】\n\n```mermaid\ngraph TD\n    A[Redis数据类型] --> B[String]\n    A --> C[Hash]\n    A --> D[List]\n    A --> E[Set]\n    A --> F[ZSet]\n    A --> G[Bitmap]\n    A --> H[HyperLogLog]\n    A --> I[Stream]\n    \n    style B fill:#e1f5fe\n```\n\n【数据类型与场景】\n\n| 类型 | 特点 | 场景 |\n|:---:|:---|:---|\n| String | 简单值 | 缓存、计数器、分布式锁 |\n| Hash | 字段值对 | 对象缓存 |\n| List | 有序列表 | 消息队列、列表 |\n| Set | 无序去重 | 标签、好友 |\n| ZSet | 有序去重 | 排行榜、延迟队列 |\n\n【String使用场景】\n\n```bash\n# 缓存\nSET user:1:name \"Tom\"\nGET user:1:name\n\n# 计数器\nINCR views:article:1\nGET views:article:1\n\n# 分布式锁\nSETNX lock \"1\"\nEXPIRE lock 10\n```\n\n【ZSet底层结构】\n\n```mermaid\ngraph TD\n    A[ZSet] --> B[ziplist]\n    A --> C[skiplist + dict]\n    \n    C --> C1[跳表]\n    C --> C2[字典]\n    \n    C1 -->|有序| C11[O(logN)查询]\n    C2 -->|快速| C21[O(1)查找]\n```\n\n【ZSet存储选择】\n\n| 条件 | 使用结构 |\n|:---:|:---|\n| 元素<128 && 字节<64 | ziplist |\n| 其他 | skiplist + dict |\n\n【ZSet使用场景】\n\n```bash\n# 排行榜\nZADD leaderboard 100 user:1\nZADD leaderboard 90 user:2\nZREVRANGE leaderboard 0 9 WITHSCORES\n\n# 延迟队列\nZADD delay:queue 1700000000 \"task:1\"\nZRANGEBYSCORE delay:queue 0 $NOW\n```",
    difficulty: 2
  },
  {
    id: 57,
    category: "数据库与缓存",
    question: "Redis持久化RDB和AOF的区别？混合持久化？",
    answer: "【Redis持久化方式】\n\n```mermaid\ngraph LR\n    A[Redis持久化] --> B[RDB]\n    A --> C[AOF]\n    A --> D[混合持久化]\n    \n    B -->|快照| B1[定期生成]\n    C -->|日志| C1[追加保存]\n    D --> B2[RDB+AOF]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【RDB vs AOF对比】\n\n| 特性 | RDB | AOF |\n|:---:|:---:|:---|\n| 方式 | 快照 | 追加日志 |\n| 文件体积 | 小 | 大 |\n| 恢复速度 | 快 | 慢 |\n| 数据安全 | 丢数据 | 可配置 |\n| 性能影响 | fork阻塞 | 持续IO |\n\n【RDB原理】\n\n```mermaid\ngraph TD\n    A[fork子进程] --> B[遍历内存]\n    B --> C[RDB文件]\n    C --> D[替换旧文件]\n    \n    style A fill:#ffcdd2\n```\n\n- bgsave：后台异步保存\n- fork：复制页表，不复制内存\n- COW：写时复制技术\n\n【AOF原理】\n\n| 写回策略 | 说明 |\n|:---:|:---|\n| always | 每条命令同步 |\n| everysec | 每秒同步 |\n| no | 操作系统决定 |\n\n```bash\n# 配置\nappendonly yes\nappendfsync everysec\n```\n\n【混合持久化】\n\n```bash\n# 开启\naof-use-rdb-preamble yes\n```\n\n混合模式：\n1. 重写时用RDB格式\n2. 新增命令用AOF格式\n3. 加载时自动识别",
    difficulty: 2
  },
  {
    id: 58,
    category: "数据库与缓存",
    question: "Redis缓存穿透、击穿、雪崩的解决方案？",
    answer: "【缓存问题】\n\n```mermaid\ngraph TD\n    A[缓存问题] --> B[穿透]\n    A --> C[击穿]\n    A --> D[雪崩]\n    \n    B -->|查询不存在| B1[大量请求到DB]\n    C -->|热点key过期| C1[并发请求DB]\n    D -->|大量key过期| D1[DB压力过大]\n    \n    style B fill:#ffcdd2\n    style C fill:#ffcdd2\n    style D fill:#ffcdd2\n```\n\n【缓存穿透】\n\n| 问题 | 解决方案 |\n|:---:|:---|\n| 查询不存在的数据 | 布隆过滤器 |\n| | 空值缓存 |\n| | 接口校验 |\n\n```java\n// 布隆过滤器\nBloomFilter<String> filter = BloomFilter.create(...);\nif (!filter.mightContain(key)) {\n    return null; // 直接返回\n}\n```\n\n【缓存击穿】\n\n| 问题 | 解决方案 |\n|:---:|:---|\n| 热点key过期 | 互斥锁 |\n| 并发请求 | 永不过期 |\n| | 双检锁 |\n\n```java\n// 双检锁\nString value = redis.get(key);\nif (value == null) {\n    synchronized (this) {\n        value = redis.get(key);\n        if (value == null) {\n            value = db.get(key);\n            redis.set(key, value);\n        }\n    }\n}\n```\n\n【缓存雪崩】\n\n| 问题 | 解决方案 |\n|:---:|:---|\n| 大量key过期 | 随机过期时间 |\n| | 永不过期 |\n| | 集群部署 |\n| | 限流降级 |\n\n```yaml\n# 随机过期时间\n- SET key value EX $((RANDOM % 9000) + 1000)\n```",
    difficulty: 3
  },
  {
    id: 59,
    category: "数据库与缓存",
    question: "Redis分布式锁的实现？Redisson原理？",
    answer: "【分布式锁实现】\n\n```mermaid\ngraph TD\n    A[分布式锁] --> B[SETNX]\n    A --> C[SET NX EX]\n    A --> D[Redisson]\n    \n    B -->|基础版| B1[原子性]\n    C -->|完善版| C1[过期/重试]\n    D -->|高级版| D1[看门狗/自动续期]\n```\n\n【SET命令实现】\n\n```bash\n# 基础版\nSET lock value NX EX 30\n\n# 返回OK获取锁\n# 返回nil获取失败\n```\n\n【问题与解决方案】\n\n| 问题 | 解决 |\n|:---:|:---|\n| 锁过期 | 看门狗自动续期 |\n| 不可重入 | 计数+Lua脚本 |\n| 误删锁 | value=UUID |\n| 主从脑裂 | RedLock |\n\n【Redisson原理】\n\n```mermaid\ngraph TD\n    A[获取锁] --> B[SET lock uuid NX EX]\n    B --> C{成功?}\n    C -->|是| D[开启看门狗]\n    C -->|否| E[订阅解锁消息]\n    E --> F[重试]\n    F --> B\n    \n    D --> G[每10秒续期]\n    G --> H{仍持有锁?}\n    H -->|是| G\n    H -->|否| I[自动解锁]\n```\n\n【看门狗机制】\n\n```java\n// 自动续期\nwatchdog.scheduleExpirationRenewal(threadId);\n\n// 续期逻辑\nif (ttl > 0) {\n    redis.expire(lockKey, ttl);\n}\n```\n\n【RedLock算法】\n\n```bash\n# 多个Redis实例\n1. 获取当前时间\n2. 依次获取锁\n3. 超过半数成功\n4. 计算持有时间\n```",
    difficulty: 3
  },
  {
    id: 60,
    category: "数据库与缓存",
    question: "Redis集群模式？哨兵vsCluster？哈希槽？",
    answer: "【Redis集群模式】\n\n```mermaid\ngraph TD\n    A[Redis集群] --> B[主从复制]\n    A --> C[哨兵模式]\n    A --> C[Cluster模式]\n    \n    B -->|一主多从| B1\n    C -->|高可用| C1[自动故障转移]\n    C -->|数据分片| C2[16384槽]\n```\n\n【三种模式对比】\n\n| 模式 | 数据分片 | 高可用 | 客户端 |\n|:---:|:---:|:---:|:---:|\n| 主从 | ❌ | ❌ | 需手动 |\n| 哨兵 | ❌ | ✅ | 需适配 |\n| Cluster | ✅ | ✅ | 需迁移 |\n\n【哨兵模式】\n\n```\nMaster1 ──→ Slave1\n    ↑          ↑\n  哨兵监控   故障转移\n```\n\n| 职责 | 说明 |\n|:---:|:---|\n| 监控 | 检查主从状态 |\n| 通知 | 推送故障 |\n| 选主 | 选择新主库 |\n\n【Cluster模式】\n\n```mermaid\ngraph TD\n    A[16384个槽] --> B[Node1:0-5460]\n    A --> C[Node2:5461-10922]\n    A --> D[Node3:10923-16383]\n    \n    B --> E[主从]\n    C --> F[主从]\n    D --> G[主从]\n```\n\n【哈希槽计算】\n\n```bash\n# CRC16算法\nslot = CRC16(key) % 16384\n\n# 示例\nkey = \"user:1\"\nslot = CRC16(\"user:1\") % 16384\n```\n\n【集群操作】\n\n```bash\n# 扩容\nredis-cli --cluster add-node new_host:new_port\n\n# 迁移槽\nredis-cli --cluster reshard host:port\n```",
    difficulty: 3
  },
  {
    id: 61,
    category: "数据库与缓存",
    question: "Redis大Key和热Key问题？如何发现和处理？",
    answer: "【大Key与热Key】\n\n```mermaid\ngraph TD\n    A[Redis问题] --> B[大Key]\n    A --> C[热Key]\n    \n    B -->|内存过大| B1[阻塞/内存不足]\n    C -->|请求过多| C1[CPU过高/崩溃]\n    \n    style B fill:#ffcdd2\n    style C fill:#ffcdd2\n```\n\n【大Key问题】\n\n| 问题 | 影响 |\n|:---:|:---|\n| 内存倾斜 | 单节点内存高 |\n| 阻塞 | del/expire阻塞 |\n| 传输 | 网络带宽高 |\n\n【热Key问题】\n\n| 问题 | 影响 |\n|:---:|:---|\n| CPU高 | 单节点压力大 |\n| 崩溃 | 雪崩效应 |\n\n【发现方法】\n\n```bash\n# 大Key\nredis-cli --bigkeys\n\n# 热Key\nredis-cli --hotkeys\n\n# 内存分析\nMEMORY USAGE key\n```\n\n【处理方案】\n\n| 问题 | 方案 |\n|:---:|:---|\n| 大Key拆分 | String→Hash |\n| 大Key压缩 | 压缩算法 |\n| 大Key删除 | UNLINK（非阻塞） |\n| 热Key本地缓存 | 多级缓存 |\n| 热Key分散 | 读写分离 |",
    difficulty: 3
  },
  {
    id: 62,
    category: "数据库与缓存",
    question: "MySQL和Redis一致性如何保证？",
    answer: "【缓存一致性】\n\n```mermaid\ngraph LR\n    A[更新策略] --> B[Cache Aside]\n    A --> C[Read Through]\n    A --> D[Write Through]\n    A --> E[Write Behind]\n    \n    style A fill:#e1f5fe\n```\n\n【Cache Aside模式】\n\n| 策略 | 说明 |\n|:---:|:---|\n| 读 | 缓存→miss→DB→缓存 |\n| 写 | DB→删除缓存 |\n\n【延迟双删】\n\n```java\n// 更新数据库\ndb.update(user);\n\n// 删除缓存\nredis.delete(key);\n\n// 延迟删除（防并发）\nThread.sleep(100);\nredis.delete(key);\n```\n\n【方案对比】\n\n| 方案 | 优点 | 缺点 |\n|:---:|:---|:---|\n| 先删缓存 | 简单 | 可能不一致 |\n| 先更新DB | 简单 | 可能不一致 |\n| 延迟双删 | 减少不一致 | 有延迟 |\n| 订阅binlog | 实时 | 复杂度高 |\n| MQ解耦 | 解耦 | 引入MQ |\n\n【最佳实践】\n\n| 场景 | 方案 |\n|:---:|:---|\n| 低一致性 | TTL缓存 |\n| 高一致性 | 双检+延迟 |\n| 实时一致 | binlog订阅 |",
    difficulty: 3
  },
  {
    id: 63,
    category: "数据库与缓存",
    question: "Elasticsearch倒排索引原理？与MySQL对比？",
    answer: "【倒排索引原理】\n\n```mermaid\ngraph TD\n    A[文档] --> B[分词]\n    B --> C[倒排表]\n    C --> D[Term:DocID列表]\n    \n    style C fill:#e1f5fe\n```\n\n【正排 vs 倒排】\n\n| 类型 | 说明 |\n|:---:|:---|\n| 正排 | DocID → 文档内容 |\n| 倒排 | Term → DocID列表 |\n\n【倒排表示例】\n\n```\n文档1: \"Tom loves Java\"\n文档2: \"Java is great\"\n文档3: \"Tom works\"\n\n倒排索引:\nTom    → [1, 3]\nloves  → [1]\nJava   → [1, 2]\nis     → [2]\ngreat  → [2]\nworks  → [3]\n```\n\n【ES vs MySQL对比】\n\n| 特性 | Elasticsearch | MySQL |\n|:---:|:---:|:---:|\n| 索引类型 | 倒排 | B+树 |\n| 查询能力 | 全文搜索 | 精确匹配 |\n| 性能 | 聚合/搜索快 | 事务支持 |\n| 数据量 | PB级 | TB级 |\n\n【使用场景】\n\n| 场景 | 选择 |\n|:---:|:---|\n| 精确查询 | MySQL |\n| 全文搜索 | ES |\n| 日志分析 | ES |\n| 业务数据 | MySQL |",
    difficulty: 3
  },
  {
    id: 64,
    category: "数据库与缓存",
    question: "MongoDB适用场景？文档模型设计？",
    answer: "【MongoDB特点】\n\n```mermaid\ngraph TD\n    A[MongoDB] --> B[文档数据库]\n    A --> C[JSON存储]\n    A --> D[高扩展]\n    A --> E[高并发]\n    \n    style A fill:#e1f5fe\n```\n\n【适用场景】\n\n| 场景 | 说明 |\n|:---:|:---|\n| 日志系统 | 写入量大 |\n| 社交数据 | 灵活结构 |\n| 物联网 | 时序数据 |\n| 内容管理 | 文档存储 |\n\n【文档模型设计】\n\n```json\n{\n  \"_id\": \"user:1\",\n  \"name\": \"Tom\",\n  \"address\": {\n    \"city\": \"Beijing\",\n    \"street\": \"Chaoyang\"\n  },\n  \"tags\": [\"vip\", \"active\"],\n  \"orders\": [\n    {\"id\": 1, \"amount\": 100},\n    {\"id\": 2, \"amount\": 200}\n  ]\n}\n```\n\n【设计原则】\n\n| 原则 | 说明 |\n|:---:|:---|\n| 内嵌 | 一对一/子文档 |\n| 引用 | 一对多/关联 |\n| 范式 | 按查询设计 |",
    difficulty: 2
  },
  {
    id: 65,
    category: "数据库与缓存",
    question: "HBase的LSM树结构？RowKey设计原则？",
    answer: "【HBase LSM树】\n\n```mermaid\ngraph TD\n    A[写入] --> B[MemStore]\n    B --> C[SSTable]\n    C --> D[合并]\n    C --> E[Compaction]\n    \n    style A fill:#e1f5fe\n```\n\n【LSM树特点】\n\n| 特点 | 说明 |\n|:---:|:---|\n| 顺序写 | 写性能高 |\n| 内存缓冲 | MemStore |\n| 磁盘合并 | Compaction |\n| 多层结构 | L0→Ln |\n\n【RowKey设计】\n\n| 原则 | 说明 |\n|:---:|:---|\n| 散列 | MD5/hash |\n| 长度 | 越短越好 |\n| 唯一 | 唯一标识 |\n| 排序 | 按查询顺序 |\n\n【盐值设计】\n\n```bash\n# 加盐\nsalt = id % 3\nrowkey = salt + \"_\" + id\n\n# 预分区\ncreate 'table', 'cf', {SPLITS => ['1', '2', '3']}\n```",
    difficulty: 3
  },
  {
    id: 66,
    category: "消息队列与中间件",
    question: "消息队列的使用场景？解耦、异步、削峰？",
    answer: "【消息队列核心场景】\n\n```mermaid\ngraph TD\n    A[MQ使用场景] --> B[解耦]\n    A --> C[异步]\n    A --> D[削峰]\n    \n    B -->|松耦合| B1[系统间无依赖]\n    C -->|非阻塞| C1[提升响应速度]\n    D -->|限流| D1[保护后端系统]\n    \n    style A fill:#e1f5fe\n```\n\n【三大核心场景】\n\n| 场景 | 说明 | 优势 |\n|:---:|:---|:---|\n| 解耦 | 系统间通过MQ通信 | 降低耦合度 |\n| 异步 | 非立即响应 | 提高吞吐量 |\n| 削峰 | 流量高峰期缓冲 | 保护系统 |\n\n【解耦示例】\n\n```mermaid\ngraph LR\n    A[订单系统] --> MQ[消息队列]\n    MQ --> B[库存系统]\n    MQ --> C[物流系统]\n    MQ --> D[通知系统]\n    \n    style A fill:#e1f5fe\n    style MQ fill:#fff3e0\n```\n\n- 订单系统只需发消息\n- 不关心下游系统\n- 下游系统独立处理\n\n【异步示例】\n\n```\n同步：订单创建 → 3秒\n异步：订单创建(10ms) → 消息(后台处理)\n```\n\n【削峰示例】\n\n```\n高峰：10000 QPS → MQ缓冲 → 系统处理：1000 QPS\n```",
    difficulty: 2
  },
  {
    id: 67,
    category: "消息队列与中间件",
    question: "Kafka的架构？Broker、Topic、Partition、Consumer Group？",
    answer: "【Kafka架构】\n\n```mermaid\ngraph TD\n    A[Kafka集群] --> B[Broker1]\n    A --> C[Broker2]\n    A --> D[Broker3]\n    \n    B --> E[Topic]\n    E --> F[Partition1]\n    E --> G[Partition2]\n    \n    F --> H[Replica1]\n    F --> I[Replica2]\n    \n    style E fill:#e1f5fe\n    style F fill:#fff3e0\n```\n\n【核心概念】\n\n| 概念 | 说明 |\n|:---:|:---|\n| Broker | Kafka服务节点 |\n| Topic | 消息主题 |\n| Partition | 分区，物理存储 |\n| Replica | 分区副本 |\n| Consumer Group | 消费组 |\n\n【Partition存储】\n\n```\nTopic: order-topic\n  Partition 0: [0, 1000]\n  Partition 1: [1001, 2000]\n  Partition 2: [2001, 3000]\n```\n\n【Consumer Group】\n\n- 同一消费组内消息不重复\n- 不同消费组消费全部消息\n- 负责分区分配\n\n【消息顺序】\n\n- 分区内有序\n- 全局有序需单分区",
    difficulty: 3
  },
  {
    id: 68,
    category: "消息队列与中间件",
    question: "Kafka为什么高吞吐？零拷贝技术？",
    answer: "【Kafka高吞吐原因】\n\n```mermaid\ngraph TD\n    A[Kafka高吞吐] --> B[顺序写磁盘]\n    A --> C[页缓存]\n    A --> D[零拷贝]\n    A --> E[批量处理]\n    \n    style A fill:#c8e6c9\n```\n\n【高性能原因】\n\n| 技术 | 说明 |\n|:---:|:---|\n| 顺序写 | 磁盘顺序写，接近内存 |\n| 页缓存 | OS页缓存，减少IO |\n| 零拷贝 | sendfile减少拷贝 |\n| 批量处理 | 批量压缩/发送 |\n| 稀疏索引 | 高效定位消息 |\n\n【零拷贝技术】\n\n```mermaid\ngraph LR\n    A[磁盘文件] --> B[内核缓冲区]\n    B --> C[用户缓冲区]\n    C --> D[Socket缓冲区]\n    D --> E[网卡]\n    \n    传统: A→B→C→B→D→E\n    零拷贝: A→B→D→E\n```\n\n| 方式 | 拷贝次数 | 上下文切换 |\n|:---:|:---:|:---:|\n| 传统 | 4次 | 4次 |\n| 零拷贝 | 2次 | 2次 |\n\n【sendfile系统调用】\n\n```c\n// 内核态直接传输\nsendfile(socket, file, size);\n```\n\n【顺序写原理】\n\n```\n传统随机写: 磁盘寻址 → 写入\nKafka顺序写: 直接追加 → 速度接近内存\n```",
    difficulty: 3
  },
  {
    id: 69,
    category: "消息队列与中间件",
    question: "Kafka的ISR机制？ACK设置？消息可靠性？",
    answer: "【ISR机制】\n\n```mermaid\ngraph TD\n    A[Leader] --> B[ISR列表]\n    B --> C[同步中的Follower]\n    B --> D[同步中的Follower]\n    C --> E{落后太多?}\n    D --> E\n    E -->|是| F[移出ISR]\n    \n    style A fill:#e1f5fe\n    style B fill:#fff3e0\n```\n\n【ISR定义】\n\n| 概念 | 说明 |\n|:---:|:---|\n| ISR | In-Sync Replicas |\n| Leader | 主分区 |\n| Follower | 从分区 |\n\n【ISR同步条件】\n\n- follower.fetch.min.bytes\n- replica.lag.time.max.ms\n\n【ACK设置】\n\n| ACK值 | 说明 | 可靠性 |\n|:---:|:---|:---|\n| 0 | 不等待确认 | 低 |\n| 1 | Leader确认 | 中 |\n| -1/all | ISR全部确认 | 高 |\n\n【可靠性配置】\n\n```properties\n# 生产者配置\nacks=all\nretries=3\nenable.idempotence=true\n```\n\n【消息不丢条件】\n\n1. 生产者：acks=all + 重试\n2. Broker：副本数>=2\n3. 消费者：手动提交",
    difficulty: 3
  },
  {
    id: 70,
    category: "消息队列与中间件",
    question: "Kafka消息丢失和重复消费如何解决？",
    answer: "【消息丢失场景】\n\n```mermaid\ngraph TD\n    A[消息丢失] --> B[生产者丢失]\n    A --> C[Broker丢失]\n    A --> D[消费者丢失]\n    \n    style A fill:#ffcdd2\n```\n\n【消息丢失解决】\n\n| 场景 | 解决方案 |\n|:---:|:---|\n| 生产者 | acks=all + 重试 |\n| Broker | 副本数>=2 |\n| 消费者 | 手动提交 |\n\n【消息重复原因】\n\n| 原因 | 说明 |\n|:---:|:---|\n| 生产者重试 | 网络抖动导致重试 |\n| 消费者重复消费 | 未及时提交offset |\n| Rebalance | 消费者组变更 |\n\n【幂等性实现】\n\n```java\n// 生产者幂等\nprops.put(\"enable.idempotence\", true);\n\n// 幂等条件\n// 1. Producer ID (PID)\n// 2. Sequence Number\n// 3. 分区内唯一\n```\n\n【消费者幂等】\n\n```java\n// 业务层面幂等\n// 1. 唯一ID\n// 2. 状态机\n// 3. 数据库去重\n```\n\n【最佳实践】\n\n| 场景 | 方案 |\n|:---:|:---|\n| 金融级 | 幂等+事务 |\n| 普通业务 | 幂等即可 |\n| 允许延迟 | 消息去重 |",
    difficulty: 3
  },
  {
    id: 71,
    category: "消息队列与中间件",
    question: "Kafka分区分配策略？Rebalance过程？",
    answer: "【分区分配策略】\n\n| 策略 | 说明 | 特点 |\n|:---:|:---|:---|\n| Range | 按主题逐个分配 | 可能不均 |\n| RoundRobin | 轮询 | 均匀 |\n| Sticky | 粘性 | 减少移动 |\n\n【Range策略】\n\n```bash\n# 示例：3消费者 5分区\nC1: P0, P1\nC2: P2, P3  \nC3: P4\n```\n\n【RoundRobin策略】\n\n```bash\n# 所有主题一起分配\nC1: P0, P3\nC2: P1, P4\nC3: P2\n```\n\n【Rebalance触发】\n\n| 触发条件 | 说明 |\n|:---:|:---|\n| 消费者加入 | 新消费者 |\n| 消费者离开 | 主动/异常 |\n| 消费者数量变化 | 订阅变化 |\n\n【Rebalance过程】\n\n```mermaid\nsequenceDiagram\n    participant C as Consumer\n    participant G as GroupCoordinator\n    participant K as Kafka\n    \n    C->>G: JoinGroup\n    G-->>C: JoinGroup响应\n    C->>G: SyncGroup\n    G-->>C: 分区分配结果\n```\n\n【避免Rebalance】\n\n```properties\n# 配置\nsession.timeout.ms=45s\nheartbeat.interval.ms=10s\n```",
    difficulty: 3
  },
  {
    id: 72,
    category: "消息队列与中间件",
    question: "RabbitMQ的交换机类型？消息路由模式？",
    answer: "【RabbitMQ交换机类型】\n\n```mermaid\ngraph TD\n    A[Exchange] --> B[Direct]\n    A --> C[Topic]\n    A --> D[Fanout]\n    A --> E[Headers]\n    \n    style A fill:#e1f5fe\n```\n\n【四种交换机】\n\n| 类型 | 路由规则 | 示例 |\n|:---:|:---|:---|\n| Direct | 完全匹配 | rountingKey=key |\n| Topic | 模糊匹配 | *.orange.# |\n| Fanout | 广播 | 所有队列 |\n| Headers | 属性匹配 | x-match=all |\n\n【Direct路由】\n\n```\nRouting Key: order.created\nQueue1: order.*      # 不匹配\nQueue2: order.created # 匹配 ✓\n```\n\n【Topic路由】\n\n| 符号 | 含义 |\n|:---:|:---|\n| * | 任意一个词 |\n| # | 零或多个词 |\n\n【Fanout】\n\n```\nexchange → 所有绑定的queue\n```\n\n【消息流程】\n\n```mermaid\nsequenceDiagram\n    participant P as Producer\n    participant E as Exchange\n    participant Q as Queue\n    participant C as Consumer\n    \n    P->>E: 发送消息(routingKey)\n    E->>Q: 路由到匹配队列\n    Q->>C: 推送消息\n```",
    difficulty: 2
  },
  {
    id: 73,
    category: "消息队列与中间件",
    question: "RabbitMQ如何保证消息不丢失？",
    answer: "【消息丢失环节】\n\n```mermaid\ngraph TD\n    A[消息流程] --> B[生产者]\n    A --> C[Broker]\n    A --> D[消费者]\n    \n    B -->|1.生产丢失| B1\n    C -->|2.存储丢失| C1\n    C -->|3.消费丢失| D1\n    \n    style A fill:#ffcdd2\n```\n\n【生产者保证】\n\n| 方案 | 说明 |\n|:---:|:---|\n| 事务 | 同步，性能差 |\n| 确认机制 | 异步，推荐 |\n\n```java\n// 确认模式\nchannel.confirmSelect();\nchannel.addConfirmListener((ack, tag) -> {\n    // 成功\n}, (ack, tag) -> {\n    // 失败，重试\n});\n```\n\n【Broker保证】\n\n| 方案 | 说明 |\n|:---:|:---|\n| 持久化 | 消息落盘 |\n| 镜像队列 | 主从同步 |\n\n```java\n// 消息持久化\nAMQP.BasicProperties properties = new AMQP.BasicProperties.Builder()\n    .deliveryMode(2)  // 持久化\n    .build();\n```\n\n【消费者保证】\n\n| 方案 | 说明 |\n|:---:|:---|\n| 手动ACK | 处理后确认 |\n| 关闭自动ACK | autoAck=false |\n\n```java\n// 手动确认\nchannel.basicConsume(\"queue\", false, (tag, delivery) -> {\n    try {\n        // 业务处理\n        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);\n    } catch (Exception e) {\n        channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, true);\n    }\n});\n```",
    difficulty: 3
  },
  {
    id: 74,
    category: "消息队列与中间件",
    question: "RocketMQ的架构？NameServer、Broker、Producer、Consumer？",
    answer: "【RocketMQ架构】\n\n```mermaid\ngraph TD\n    A[RocketMQ] --> B[NameServer]\n    A --> C[Broker]\n    A --> D[Producer]\n    A --> E[Consumer]\n    \n    B -->|路由发现| B1[无状态]\n    C -->|消息存储| C1[Master/Slave]\n    D -->|消息发送| D1[负载均衡]\n    E -->|消息消费| E1[拉取/推送]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【核心组件】\n\n| 组件 | 职责 |\n|:---:|:---|\n| NameServer | 路由注册中心，无状态 |\n| Broker | 消息存储转发 |\n| Producer | 消息生产者 |\n| Consumer | 消息消费者 |\n\n【Broker角色】\n\n| 角色 | 说明 |\n|:---:|:---|\n| Master | 主节点，可写可读 |\n| Slave | 从节点，只读 |\n\n【消息存储结构】\n\n```\nCommitLog: 顺序存储所有消息\nConsumeQueue: 消息队列索引\nIndexFile: 消息索引\n```\n\n【Producer发送模式】\n\n| 模式 | 说明 |\n|:---:|:---|\n| 同步 | 等待发送结果 |\n| 异步 | 回调通知 |\n| 单向 | 不等待 |\n\n【消费模式】\n\n| 模式 | 说明 |\n|:---:|:---|\n| 集群消费 | 消息均分 |\n| 广播消费 | 每个消费者全量 |",
    difficulty: 3
  },
  {
    id: 75,
    category: "消息队列与中间件",
    question: "RocketMQ的事务消息实现原理？",
    answer: "【事务消息原理】\n\n```mermaid\nsequenceDiagram\n    participant P as Producer\n    participant B as Broker\n    participant C as Consumer\n    \n    P->>B: 发送半消息\n    B-->>P: 成功\n    P->>B: 执行本地事务\n    P->>B: 提交/回滚\n    B-->>C: 投递消息\n```\n\n【事务消息流程】\n\n| 步骤 | 说明 |\n|:---:|:---|\n| 1. 发送半消息 | 暂不投递 |\n| 2. 执行本地事务 | 业务处理 |\n| 3. 提交事务 | 消息可投递 |\n| 4. 回滚 | 消息丢弃 |\n\n【半消息】\n\n- 暂不可见的消息\n- 存储在RocketMQ内部\n- 提交前对消费者不可见\n\n【事务状态】\n\n| 状态 | 说明 |\n|:---:|:---|\n| COMMIT | 提交，消息可投递 |\n| ROLLBACK | 回滚，消息丢弃 |\n| UNKNOWN | 未知，需回查 |\n\n【事务回查】\n\n```\n本地事务执行超时 → Broker回查\n  → Producer查询本地事务状态\n  → 根据状态提交/回滚\n```\n\n【代码示例】\n\n```java\n// 事务生产者\nTransactionListener listener = new TransactionListener() {\n    @Override\n    public LocalTransactionState executeLocalTransaction(Message msg, Object arg) {\n        // 执行本地事务\n        return LocalTransactionState.COMMIT;\n    }\n    \n    @Override\n    public LocalTransactionState checkLocalTransaction(MessageExt msg) {\n        // 回查本地事务状态\n        return LocalTransactionState.COMMIT;\n    }\n};\n\nTransactionProducer producer = builder.createTransactionListener(listener);\n```",
    difficulty: 3
  },
  {
    id: 76,
    category: "消息队列与中间件",
    question: "消息顺序性如何保证？全局有序vs分区有序？",
    answer: "【消息顺序性】\n\n```mermaid\ngraph LR\n    A[消息顺序] --> B[全局有序]\n    A --> C[分区有序]\n    \n    B -->|单分区| B1[性能低]\n    C -->|同分区| C1[性能高]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【两种顺序】\n\n| 类型 | 说明 |\n|:---:|:---|\n| 全局有序 | 所有消息严格有序 |\n| 分区内有序 | 同分区消息有序 |\n\n【分区有序实现】\n\n```java\n// 相同业务ID发送到同一分区\nInteger orderId = order.getId();\nint partition = orderId % partitionNum;\nproducer.send(message, new MessageQueueSelector() {\n    @Override\n    public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {\n        int partition = (int) arg;\n        return mqs.get(partition % mqs.size());\n    }\n}, orderId);\n```\n\n【消费有序】\n\n```java\n// 串行消费\nconsumer.registerMessageListener(new MessageListenerOrderly() {\n    @Override\n    public ConsumeOrderlyStatus consumeMessage(List<MessageExt> msgs, ConsumeOrderlyContext context) {\n        context.setAutoCommit(false);\n        for (MessageExt msg : msgs) {\n            // 串行处理\n        }\n        return ConsumeOrderlyStatus.SUCCESS;\n    }\n});\n```\n\n【注意事项】\n\n| 场景 | 方案 |\n|:---:|:---|\n| 全局有序 | 单分区 |\n| 分区内有序 | 相同key |\n| 避免乱序 | 串行消费 |",
    difficulty: 3
  },
  {
    id: 77,
    category: "消息队列与中间件",
    question: "消息积压如何处理？",
    answer: "【消息积压处理】\n\n```mermaid\ngraph TD\n    A[消息积压] --> B[消费者扩容]\n    A --> C[跳过消息]\n    A --> D[清理积压]\n    A --> E[优化消费]\n    \n    style A fill:#ffcdd2\n```\n\n【处理方案】\n\n| 方案 | 说明 |\n|:---:|:---|\n| 消费者扩容 | 增加消费实例 |\n| 跳过消息 | 跳过非关键消息 |\n| 清理积压 | 删除/转移到DLQ |\n| 优化消费 | 提高消费速度 |\n\n【消费者扩容】\n\n```bash\n# Kafka扩容消费者\n# 增加消费组实例数\n```\n\n【跳过消息】\n\n```java\n// 跳过积压消息\nconsumer.seekToEnd(topic, partition);\n// 或指定位置\nconsumer.seek(topic, partition, timestamp);\n```\n\n【死信队列】\n\n```java\n// 消息进入死信队列\n// 3次消费失败后进入DLQ\n```\n\n【优化消费逻辑】\n\n| 优化点 | 说明 |\n|:---:|:---|\n| 批量消费 | 减少IO |\n| 并行消费 | 多线程 |\n| 减少日志 | 提升性能 |\n| 异步处理 | 非阻塞 |",
    difficulty: 3
  },
  {
    id: 78,
    category: "消息队列与中间件",
    question: "消息队列选型？Kafka/RabbitMQ/RocketMQ对比？",
    answer: "【MQ对比选型】\n\n```mermaid\ngraph TD\n    A[MQ选型] --> B[Kafka]\n    A --> C[RabbitMQ]\n    A --> D[RocketMQ]\n    \n    B -->|日志/大数据| B1\n    C -->|中小规模| C1\n    D -->|金融/电商| D1\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n    style D fill:#c8e6c9\n```\n\n【对比表】\n\n| 特性 | Kafka | RabbitMQ | RocketMQ |\n|:---:|:---:|:---:|:---:|\n| 吞吐量 | 百万级 | 万级 | 十万级 |\n| 延迟 | 毫秒 | 微秒 | 毫秒 |\n| 持久化 | 文件 | 内存+文件 | 文件 |\n| 集群 | zk/kraft | 支持 | nameserver |\n| 顺序消息 | 分区顺序 | 支持 | 支持 |\n| 事务消息 | 弱 | 支持 | 完整支持 |\n\n【Kafka适用场景】\n\n| 场景 | 原因 |\n|:---:|:---|\n| 日志处理 | 高吞吐 |\n| 大数据 | 生态完善 |\n| 实时计算 | 消息堆积 |\n\n【RabbitMQ适用场景】\n\n| 场景 | 原因 |\n|:---:|:---|\n| 中小规模 | 简单易用 |\n| 灵活路由 | 交换机丰富 |\n| 低延迟 | Erlang实现 |\n\n【RocketMQ适用场景】\n\n| 场景 | 原因 |\n|:---:|:---|\n| 电商订单 | 事务消息 |\n| 金融系统 | 可靠性高 |\n| 削峰填谷 | 堆积能力强 |",
    difficulty: 2
  },
  {
    id: 79,
    category: "消息队列与中间件",
    question: "Pulsar与Kafka的架构差异？分层存储？",
    answer: "【Pulsar vs Kafka架构】\n\n```mermaid\ngraph LR\n    A[Pulsar] --> B[存算分离]\n    A --> C[BookKeeper]\n    A --> D[分层存储]\n    \n    style A fill:#e1f5fe\n```\n\n【核心差异】\n\n| 特性 | Pulsar | Kafka |\n|:---:|:---:|:---:|\n| 架构 | 存算分离 | 耦合 |\n| 存储 | BookKeeper | 自研 |\n| 扩展 | 易扩展 | 难扩展 |\n| 多租户 | 原生支持 | 需配置 |\n\n【Pulsar架构】\n\n```\nProducer → Broker → BookKeeper\n                ↓\n           Topic分层\n           (Tiered Storage)\n```\n\n【分层存储】\n\n```bash\n# Pulsar支持将旧消息存储到S3/HDFS\n# 释放内存和磁盘\n```\n\n【BookKeeper特点】\n\n| 特点 | 说明 |\n|:---:|:---|\n| 分布式 | 多节点存储 |\n| 持久化 | 3副本确认 |\n| 低延迟 | 毫秒级 |\n\n【Pulsar优势】\n\n| 优势 | 说明 |\n|:---:|:---|\n| 分层存储 | 降低成本 |\n| 多租户 | 隔离性好 |\n| 跨地域复制 | Geo-replication |",
    difficulty: 3
  },
  {
    id: 80,
    category: "消息队列与中间件",
    question: "MQTT协议特点？物联网场景应用？",
    answer: "【MQTT协议特点】\n\n```mermaid\ngraph TD\n    A[MQTT] --> B[发布订阅]\n    A --> C[轻量级]\n    A --> D[低带宽]\n    A --> E[QoS等级]\n    \n    style A fill:#e1f5fe\n```\n\n【MQTT特点】\n\n| 特点 | 说明 |\n|:---:|:---|\n| 轻量级 | 最小2字节头 |\n| 发布订阅 | 解耦生产消费 |\n| QoS | 3个等级 |\n| 持久化 | 会话保持 |\n\n【QoS等级】\n\n| 等级 | 说明 | 可靠性 |\n|:---:|:---|:---|\n| QoS 0 | 最多一次 | 低 |\n| QoS 1 | 至少一次 | 中 |\n| QoS 2 | 正好一次 | 高 |\n\n【MQTT协议示例】\n\n```bash\n# 连接\nCONNECT clientId, username, password\n\n# 订阅\nSUBSCRIBE topic/home/temperature\n\n# 发布\nPUBLISH topic/home/temperature payload\n```\n\n【物联网场景】\n\n| 场景 | 使用 |\n|:---:|:---|\n| 智能家居 | 设备状态同步 |\n| 车联网 | 车辆实时数据 |\n| 工业互联网 | 传感器采集 |\n| 可穿戴设备 | 健康数据 |\n\n【MQTT vs 其他MQ】\n\n| 特性 | MQTT | Kafka/RocketMQ |\n|:---:|:---:|:---:|\n| 协议 | MQTT | 自有协议 |\n| 设备 | 移动端友好 | 服务端为主 |\n| 规模 | 亿级设备 | 百万级主题 |\n| 延迟 | 低 | 中 |",
    difficulty: 2
  },
  {
    id: 81,
    category: "分布式系统与微服务",
    question: "CAP理论和BASE理论？实际应用取舍？",
    answer: "【CAP理论】\n\n```mermaid\ngraph TD\n    A[CAP] --> B[Consistency]\n    A --> C[Availability]\n    A --> D[Partition Tolerance]\n    \n    B -->|只能选两个| E\n    C --> E\n    D --> E\n    \n    style A fill:#e1f5fe\n```\n\n【CAP定义】\n\n| 特性 | 说明 |\n|:---:|:---|\n| C 一致性 | 所有节点数据一致 |\n| A 可用性 | 每次请求都有响应 |\n| P 分区容错 | 网络异常时仍可用 |\n\n【CAP取含】\n\n| 组合 | 说明 | 系统 |\n|:---:|:---|:---|\n| CA | 无分区容错 | 单机数据库 |\n| CP | 牺牲可用性 | ZooKeeper、HBase |\n| AP | 牺牲一致性 | Cassandra、Eureka |\n\n【BASE理论】\n\n```mermaid\ngraph LR\n    A[BASE] --> B[Basically Available]\n    A --> C[Soft State]\n    A --> D[Eventually Consistent]\n    \n    style A fill:#e1f5fe\n```\n\n| 特性 | 说明 |\n|:---:|:---|\n| Basically Available | 基本可用 |\n| Soft State | 软状态 |\n| Eventually Consistent | 最终一致 |\n\n【实际应用】\n\n| 场景 | 选择 |\n|:---:|:---|\n| 金融 | CP + 强一致 |\n| 电商 | AP + 最终一致 |\n| 注册中心 | AP |",
    difficulty: 3
  },
  {
    id: 82,
    category: "分布式系统与微服务",
    question: "分布式事务解决方案？2PC/3PC/TCC/Saga/本地消息表？",
    answer: "【分布式事务方案】\n\n```mermaid\ngraph TD\n    A[分布式事务] --> B[2PC]\n    A --> C[3PC]\n    A --> D[TCC]\n    A --> E[Saga]\n    A --> F[本地消息表]\n    \n    style A fill:#e1f5fe\n```\n\n【方案对比】\n\n| 方案 | 原理 | 优点 | 缺点 |\n|:---:|:---|:---|:---|\n| 2PC | 两阶段提交 | 简单 | 同步阻塞 |\n| 3PC | 三阶段提交 | 优化阻塞 | 数据不一致 |\n| TCC | 补偿机制 | 性能好 | 侵入性强 |\n| Saga | 链式补偿 | 异步 | 复杂 |\n| 消息表 | 最终一致 | 简单 | 延迟 |\n\n【2PC两阶段】\n\n```mermaid\nsequenceDiagram\n    participant C as Coordinator\n    participant P as Participant\n    \n    C->>P: Prepare\n    P-->>C: OK/FAIL\n    C->>P: Commit/Rollback\n```\n\n【TCC模式】\n\n```\nTry: 预留资源\nConfirm: 确认执行\nCancel: 取消预留\n```\n\n【Saga模式】\n\n```\nT1: 库存服务 -1\nT2: 订单服务 创建\nT3: 积分服务 +100\n\n某步失败 → 逆向补偿\n```",
    difficulty: 3
  },
  {
    id: 83,
    category: "分布式系统与微服务",
    question: "Seata的AT模式原理？undo_log作用？",
    answer: "【Seata AT模式】\n\n```mermaid\ngraph TD\n    A[Seata AT] --> B[TC]\n    A --> C[TM]\n    A --> D[RM]\n    \n    B -->|全局事务管理| B1\n    C -->|开启事务| C1\n    D -->|执行SQL+记录undo| D1\n    \n    style A fill:#e1f5fe\n```\n\n【角色说明】\n\n| 角色 | 说明 |\n|:---:|:---|\n| TC | Transaction Coordinator 事务协调器 |\n| TM | Transaction Manager 事务管理器 |\n| RM | Resource Manager 资源管理器 |\n\n【AT原理】\n\n1. TM开启全局事务\n2. RM执行SQL\n3. 自动记录undo_log\n4. 提交/回滚\n\n【undo_log表结构】\n\n```sql\nCREATE TABLE undo_log (\n    id bigint NOT NULL,\n    branch_id bigint NOT NULL,\n    xid varchar(100) NOT NULL,\n    context varchar(128) NOT NULL,\n    rollback_info longblob NOT NULL,\n    log_status int NOT NULL,\n    log_created datetime NOT NULL,\n    log_modified datetime NOT NULL\n);\n```\n\n【回滚流程】\n\n```\n1. 解析undo_log\n2. 反向SQL\n3. 删除undo_log\n```",
    difficulty: 3
  },
  {
    id: 84,
    category: "分布式系统与微服务",
    question: "分布式ID生成方案？雪花算法？",
    answer: "【分布式ID方案】\n\n```mermaid\ngraph TD\n    A[分布式ID] --> B[UUID]\n    A --> C[雪花算法]\n    A --> D[数据库号段]\n    A --> E[Redis]\n    \n    style A fill:#e1f5fe\n```\n\n【方案对比】\n\n| 方案 | 优点 | 缺点 | 适用 |\n|:---:|:---|:---|:---|\n| UUID | 简单 | 无序、占用大 | 测试 |\n| 雪花算法 | 有序、高效 | 依赖时钟 | 生产 |\n| 数据库号段 | 简单 | 单点 | 小规模 |\n| Redis | 高性能 | 可能重复 | 通用 |\n\n【雪花算法原理】\n\n```\n1位符号 + 41位时间戳 + 10位机器ID + 12位序列号\n= 64位long\n```\n\n```\n      [1][----------41----------][----10----][------12------]\n       ↓     时间戳(毫秒)        机器ID     序列号\n       \n时间戳: (2024-01-01) - 基准时间\n机器ID: 5位数据中心 + 5位机器ID\n序列号: 每毫秒从0开始\n```\n\n【代码实现】\n\n```java\npublic class SnowflakeIdWorker {\n    // 41位时间戳\n    private final long twepoch = 1609459200000L;\n    // 10位机器ID\n    private final long workerIdBits = 5L;\n    private final long datacenterIdBits = 5L;\n    // 12位序列号\n    private final long sequenceBits = 12L;\n    \n    public synchronized long nextId() {\n        long timestamp = timeGen();\n        if (timestamp < lastTimestamp) {\n            throw new RuntimeException(\"\");\n        }\n        if (timestamp == lastTimestamp) {\n            sequence = (sequence + 1) & maxSequence;\n        } else {\n            sequence = 0L;\n        }\n        lastTimestamp = timestamp;\n        return ((timestamp - twepoch) << timestampShift)\n            | (workerId << workerIdShift)\n            | sequence;\n    }\n}\n```",
    difficulty: 3
  },
  {
    id: 85,
    category: "分布式系统与微服务",
    question: "限流算法？计数器、滑动窗口、令牌桶、漏桶？",
    answer: "【限流算法】\n\n```mermaid\ngraph TD\n    A[限流算法] --> B[计数器]\n    A --> C[滑动窗口]\n    A --> D[令牌桶]\n    A --> E[漏桶]\n    \n    style A fill:#e1f5fe\n```\n\n【四种算法对比】\n\n| 算法 | 原理 | 优点 | 缺点 |\n|:---:|:---|:---|:---|\n| 计数器 | 固定窗口 | 简单 | 突发流量 |\n| 滑动窗口 | 滚动窗口 | 精确 | 复杂 |\n| 令牌桶 | 匀速生成 | 允许突发 | 实现复杂 |\n| 漏桶 | 匀速消费 | 流量平滑 | 不允许突发 |\n\n【计数器算法】\n\n```\n固定时间窗口：1秒100请求\n0.9秒: 100请求\n1.0秒: 新窗口，重置计数\n1.1秒: 100请求\n```\n\n【滑动窗口】\n\n```\n将时间窗口分成多个小窗口\n滑动计算总请求数\n```\n\n【令牌桶算法】\n\n```java\n// Guava RateLimiter\nRateLimiter limiter = RateLimiter.create(100); // 每秒100令牌\n\n// 获取令牌\nlimiter.acquire(); // 阻塞获取\nlimiter.tryAcquire(); // 非阻塞\n```\n\n【漏桶算法】\n\n```\n请求 → 队列 → 匀速消费 → 处理\n超过队列 → 拒绝\n```",
    difficulty: 3
  },
  {
    id: 86,
    category: "分布式系统与微服务",
    question: "熔断降级原理？Sentinel vs Hystrix？",
    answer: "【熔断降级原理】\n\n```mermaid\ngraph TD\n    A[熔断器] --> B[关闭]\n    B -->|失败率过高| C[打开]\n    C -->|半开| D[尝试请求]\n    D -->|成功| B\n    D -->|失败| C\n    \n    style A fill:#e1f5fe\n```\n\n【熔断器状态】\n\n| 状态 | 说明 |\n|:---:|:---|\n| Closed | 正常，请求通过 |\n| Open | 熔断，快速失败 |\n| Half-Open | 尝试，允许部分请求 |\n\n【熔断策略】\n\n| 策略 | 说明 |\n|:---:|:---|\n| 慢调用比例 | 响应时间过长 |\n| 异常比例 | 异常占比高 |\n| 异常数 | 异常数量多 |\n\n【Sentinel vs Hystrix】\n\n| 特性 | Sentinel | Hystrix |\n|:---:|:---:|:---:|\n| 限流 | 丰富 | 简单 |\n| 熔断 | 多策略 | 异常比例 |\n| 规则 | 动态配置 | 静态配置 |\n| 状态 | 维护中 | 停止维护 |\n| 社区 | 阿里 | Netflix |\n\n【Sentinel使用】\n\n```java\n@SentinelResource(value = \"test\", \n    fallback = \"fallbackHandler\",\n    blockHandler = \"blockHandler\")\npublic Result test() {\n    return Result.ok();\n}\n\npublic Result fallbackHandler() {\n    return Result.fail(\"降级响应\");\n}\n```",
    difficulty: 3
  },
  {
    id: 87,
    category: "分布式系统与微服务",
    question: "负载均衡算法？轮询、随机、加权、一致性哈希？",
    answer: "【负载均衡算法】\n\n```mermaid\ngraph TD\n    A[负载均衡] --> B[轮询]\n    A --> C[随机]\n    A --> D[加权]\n    A --> E[一致性哈希]\n    A --> F[最少连接]\n    \n    style A fill:#e1f5fe\n```\n\n【算法对比】\n\n| 算法 | 原理 | 优点 | 缺点 |\n|:---:|:---|:---|:---|\n| 轮询 | 依次分配 | 简单 | 不考虑差异 |\n| 随机 | 随机选择 | 简单 | 不确定 |\n| 加权 | 权重分配 | 灵活 | 需配置 |\n| 一致性哈希 | 哈希环 | 缓存友好 | 实现复杂 |\n| 最少连接 | 连接数少 | 动态 | 开销大 |\n\n【加权轮询】\n\n```\nServer A(权重3): 请求:请求:请求\nServer B(权重1): 请求\n```\n\n【一致性哈希】\n\n```mermaid\ngraph TD\n    A[哈希环] --> B[Server A]\n    A --> C[Server B]\n    A --> D[Server C]\n    A --> E[Key1]\n    E -->|顺时针| B\n    \n    style A fill:#e1f5fe\n```\n\n【实现示例】\n\n```java\n// Nginx加权轮询\nupstream backend {\n    server a weight=3;\n    server b weight=1;\n}\n\n// Ribbon随机\nRule=RandomRule\n\n// Ribbon一致性哈希\nRule=ConsistentHashRule\n```",
    difficulty: 2
  },
  {
    id: 88,
    category: "分布式系统与微服务",
    question: "服务注册发现的原理？健康检查机制？",
    answer: "【服务注册发现原理】\n\n```mermaid\nsequenceDiagram\n    participant P as Provider\n    participant R as Registry\n    participant C as Consumer\n    \n    P->>R: 注册服务\n    R-->>P: 确认\n    C->>R: 发现服务\n    R-->>C: 服务列表\n    C->>P: 调用\n```\n\n【注册中心功能】\n\n| 功能 | 说明 |\n|:---:|:---|\n| 服务注册 | 提供者注册地址 |\n| 服务发现 | 消费者获取列表 |\n|  健康检查 | 检测服务状态 |\n|  路由管理 | 权重、隔离 |\n\n【健康检查机制】\n\n| 方式 | 说明 |\n|:---:|:---|\n| 心跳 | 定时发送ping |\n| 客户端上报 | 客户端主动上报 |\n| 探针 | 注册中心主动探测 |\n\n【Eureka自我保护】\n\n```\n15分钟内心跳失败比例 > 85%\n→ 开启保护模式\n→ 不剔除服务\n→ 防止网络分区\n```\n\n【Nacos健康检查】\n\n| 模式 | 说明 |\n|:---:|:---|\n| HTTP | 探测健康接口 |\n| TCP | 端口探测 |\n| MySQL | 数据库探测 |",
    difficulty: 3
  },
  {
    id: 89,
    category: "分布式系统与微服务",
    question: "网关的作用？统一认证、路由、限流、日志？",
    answer: "【网关核心功能】\n\n```mermaid\ngraph TD\n    A[网关] --> B[路由]\n    A --> C[认证]\n    A --> D[限流]\n    A --> E[日志]\n    A --> F[协议转换]\n    \n    style A fill:#e1f5fe\n```\n\n【网关职责】\n\n| 功能 | 说明 |\n|:---:|:---|\n| 路由 | 转发请求到后端 |\n| 认证 | 权限校验 |\n| 限流 | 流量控制 |\n| 日志 | 访问记录 |\n| 协议转换 | HTTP/Dubbo |\n\n【认证流程】\n\n```mermaid\nsequenceDiagram\n    participant U as 用户\n    participant G as 网关\n    participant A as 认证服务\n    participant B as 业务\n    \n    U->>G: 请求\n    G->>A: 验证Token\n    A-->>G: 验证结果\n    G->>B: 转发请求\n    B-->>U: 响应\n```\n\n【限流实现】\n\n```java\n// Sentinel限流\n@SentinelResource(value = \"api\", \n    blockHandler = \"blocked\")\npublic String api() {\n    return \"OK\";\n}\n```\n\n【常见网关】\n\n| 网关 | 特点 |\n|:---:|:---|\n| Spring Cloud Gateway | 响应式 |\n| Zuul | 阻塞 |\n| Nginx | 性能高 |\n| Kong | 插件丰富 |",
    difficulty: 2
  },
  {
    id: 90,
    category: "分布式系统与微服务",
    question: "配置中心Apollo/Nacos原理？热更新实现？",
    answer: "【配置中心原理】\n\n```mermaid\ngraph TD\n    A[配置中心] --> B[客户端拉取]\n    A --> C[长轮询]\n    A --> D[推送通知]\n    \n    style A fill:#e1f5fe\n```\n\n【Apollo原理】\n\n| 组件 | 说明 |\n|:---:|:---|\n| Portal | 管理界面 |\n| Admin Service | 管理后端 |\n| Config Service | 配置读取 |\n| Client | SDK |\n\n【Nacos配置管理】\n\n| 功能 | 说明 |\n|:---:|:---|\n| 配置管理 | 增删改查 |\n| 版本管理 | 历史版本 |\n| 监听 | 配置变更通知 |\n| 权限 | 命名空间隔离 |\n\n【热更新实现】\n\n```java\n// Spring Boot动态刷新\n@RefreshScope\n@Configuration\npublic class Config {\n    @Value(\"${config.name}\")\n    private String name;\n}\n\n// 配置变化后\n// 1. 监听变化通知\n// 2. 重新绑定属性\n// 3. 刷新Bean\n```\n\n【长轮询机制】\n\n```\n1. 客户端请求配置\n2. 服务端hold请求(30秒)\n3. 配置变更或超时返回\n4. 客户端立即再次请求\n```",
    difficulty: 3
  },
  {
    id: 91,
    category: "分布式系统与微服务",
    question: "链路追踪SkyWalking/Pinpoint原理？",
    answer: "【链路追踪原理】\n\n```mermaid\ngraph TD\n    A[Trace] --> B[Span1]\n    A --> C[Span2]\n    A --> D[Span3]\n    \n    B -->|调用| C\n    C -->|调用| D\n    \n    style A fill:#e1f5fe\n```\n\n【核心概念】\n\n| 概念 | 说明 |\n|:---:|:---|\n| Trace | 一次完整请求 |\n| Span | 单个服务调用 |\n| SpanId | 调用层级 |\n| TraceId | 全局唯一ID |\n\n【数据传输】\n\n```mermaid\nsequenceDiagram\n    participant A as App\n    participant A as Agent\n    participant C as Collector\n    participant S as Storage\n    \n    A->>A: 埋点\n    A->>C: 上报数据\n    C->>S: 存储分析\n```\n\n【SkyWalking组成】\n\n| 组件 | 说明 |\n|:---:|:---|\n| Agent | 字节码增强 |\n| OAP Server | 收集分析 |\n| Storage | 存储后端 |\n| UI | 可视化 |\n\n【Pinpoint特点】\n\n- 无侵入埋点\n- 字节码增强\n- 分布式拓扑\n- 详细调用信息",
    difficulty: 3
  },
  {
    id: 92,
    category: "分布式系统与微服务",
    question: "容器化Docker核心概念？Namespace/Cgroup？",
    answer: "【Docker核心概念】\n\n```mermaid\ngraph TD\n    A[Docker] --> B[镜像]\n    A --> C[容器]\n    A --> D[仓库]\n    \n    style A fill:#e1f5fe\n```\n\n【三大概念】\n\n| 概念 | 说明 |\n|:---:|:---|\n| Image | 模板，只读 |\n| Container | 镜像运行实例 |\n| Registry | 镜像仓库 |\n\n【Namespace隔离】\n\n| 资源 | 说明 |\n|:---:|:---|\n| PID | 进程隔离 |\n| Network | 网络隔离 |\n| Mount | 文件系统隔离 |\n| User | 用户隔离 |\n| UTS | 主机名隔离 |\n| IPC | 信号量/共享内存 |\n\n【Cgroup资源限制】\n\n| 资源 | 说明 |\n|:---:|:---|\n| CPU | 限制CPU使用 |\n| Memory | 限制内存 |\n| IO | 限制磁盘IO |\n| PIDs | 限制进程数 |\n\n【Docker命令】\n\n```bash\n# 运行容器\ndocker run -d -p 8080:80 --name web nginx\n\n# 查看容器\ndocker ps\n\n# 进入容器\ndocker exec -it web bash\n```",
    difficulty: 2
  },
  {
    id: 93,
    category: "分布式系统与微服务",
    question: "Kubernetes核心资源对象？Pod/Deployment/Service？",
    answer: "【Kubernetes核心资源】\n\n```mermaid\ngraph TD\n    A[K8s] --> B[Pod]\n    A --> C[Deployment]\n    A --> D[Service]\n    A --> E[ConfigMap]\n    A --> F[Secret]\n    \n    style A fill:#e1f5fe\n```\n\n【核心对象】\n\n| 对象 | 说明 |\n|:---:|:---|\n| Pod | 最小调度单位 |\n| Deployment | 部署管理 |\n| Service | 服务发现 |\n| ConfigMap | 配置 |\n| Secret | 敏感配置 |\n\n【Pod概念】\n\n- 最小部署单元\n- 包含一个或多个容器\n- 共享网络和存储\n\n【Deployment】\n\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: my-app\n  template:\n    metadata:\n      labels:\n        app: my-app\n    spec:\n      containers:\n      - name: my-app\n        image: my-app:1.0\n        ports:\n        - containerPort: 8080\n```\n\n【Service类型】\n\n| 类型 | 说明 |\n|:---:|:---|\n| ClusterIP | 集群内部访问 |\n| NodePort | 节点端口访问 |\n| LoadBalancer | 负载均衡 |\n| ExternalName | DNS别名 |",
    difficulty: 3
  },
  {
    id: 94,
    category: "分布式系统与微服务",
    question: "gRPC与RESTful对比？Protobuf序列化？",
    answer: "【gRPC vs RESTful】\n\n```mermaid\ngraph LR\n    A[通信方式] --> B[gRPC]\n    A --> C[REST]\n    \n    B -->|HTTP/2| B1[双向流]\n    C -->|HTTP/1.1| C1[请求响应]\n    \n    style B fill:#e1f5fe\n    style C fill:#fff3e0\n```\n\n【对比表】\n\n| 特性 | gRPC | REST |\n|:---:|:---:|:---:|\n| 协议 | HTTP/2 | HTTP/1.1 |\n| 序列化 | Protobuf | JSON |\n| 传输 | 二进制 | 文本 |\n| 流 | 支持 | 需轮询 |\n| 性能 | 高 | 中 |\n\n【HTTP/2优势】\n\n| 特性 | 说明 |\n|:---:|:---|\n| 多路复用 | 单一连接多流 |\n| 头部压缩 | HPACK |\n| 服务器推送 | Server Push |\n\n【Protobuf使用】\n\n```protobuf\n// 定义消息\nsyntax = \"proto3\";\n\nmessage User {\n    int32 id = 1;\n    string name = 2;\n    string email = 3;\n}\n\n// 定义服务\nservice UserService {\n    rpc GetUser (UserRequest) returns (User);\n    rpc ListUsers (ListRequest) returns (stream User);\n}\n```\n\n【gRPC服务】\n\n```java\n// 定义服务\nservice UserService {\n    rpc GetUser (UserRequest) returns (User);\n}\n\n// 服务实现\npublic class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {\n    @Override\n    public void getUser(UserRequest request, \n                       StreamObserver<User> responseObserver) {\n        User user = findUser(request.getId());\n        responseObserver.onNext(user);\n        responseObserver.onCompleted();\n    }\n}\n```",
    difficulty: 3
  },
  {
    id: 95,
    category: "分布式系统与微服务",
    question: "领域驱动设计DDD？聚合、实体、值对象、领域事件？",
    answer: "【DDD核心概念】\n\n```mermaid\ngraph TD\n    A[DDD] --> B[聚合]\n    A --> C[实体]\n    A --> D[值对象]\n    A --> E[领域事件]\n    \n    style A fill:#e1f5fe\n```\n\n【核心概念】\n\n| 概念 | 说明 |\n|:---:|:---|\n| 聚合 | 业务边界 |\n| 实体 | 有唯一标识 |\n| 值对象 | 无标识，不变 |\n| 领域事件 | 事件驱动 |\n\n【聚合根】\n\n```\nOrder(聚合根)\n  ├── OrderId(实体)\n  ├── OrderLine(实体)\n  └── Money(值对象)\n```\n\n【实体 vs 值对象】\n\n| 特性 | 实体 | 值对象 |\n|:---:|:---:|:---|\n| 标识 | 有 | 无 |\n| 可变 | 可变 | 不可变 |\n| 相等 | ID相等 | 属性相等 |\n\n【领域事件】\n\n```java\n// 订单创建事件\npublic class OrderCreatedEvent {\n    private String orderId;\n    private BigDecimal amount;\n    private LocalDateTime createdAt;\n}\n\n// 发布\ndomainEventPublisher.publish(new OrderCreatedEvent(...));\n```\n\n【DDD分层】\n\n| 层 | 说明 |\n|:---:|:---|\n| 接入层 | API/Controller |\n| 应用层 | Service |\n| 领域层 | Domain |\n| 基础设施层 | DAO/Repository |",
    difficulty: 3
  },
  {
    id: 96,
    category: "JVM、性能与架构",
    question: "JVM内存结构？堆、栈、方法区、直接内存？",
    answer: "【JVM内存结构】\n\n```mermaid\ngraph TD\n    A[JVM] --> B[堆]\n    A --> C[栈]\n    A --> D[方法区]\n    A --> E[本地方法栈]\n    A --> F[程序计数器]\n    \n    B --> B1[Eden]\n    B --> B2[Survivor]\n    B --> B3[Old]\n    \n    style B fill:#e1f5fe\n```\n\n【内存区域】\n\n| 区域 | 说明 |\n|:---:|:---|\n| 堆 | 对象实例，GC主要区域 |\n| 栈 | 线程私有，方法调用 |\n| 方法区 | 类信息、静态变量 |\n| 本地方法栈 | Native方法 |\n| 程序计数器 | 当前线程行号 |\n\n【堆内存结构】\n\n| 区域 | 比例 | 说明 |\n|:---:|:---:|:---|\n| Eden | 1 | 新对象分配 |\n| Survivor | 1 | 存活对象 |\n| Old | 2 | 长生命周期对象 |\n\n【栈帧结构】\n\n```\n┌─────────────┐\n│  局部变量表  │\n├─────────────┤\n│  操作数栈   │\n├─────────────┤\n│  动态链接   │\n├─────────────┤\n│  返回地址   │\n└─────────────┘\n```\n\n【OOM场景】\n\n| 区域 | OOM类型 |\n|:---:|:---|\n| 堆 | OutOfMemoryError: Java heap space |\n| 栈 | StackOverflowError / OOM |\n| 方法区 | OutOfMemoryError: Metaspace |\n| 直接内存 | OutOfMemoryError |",
    difficulty: 3
  },
  {
    id: 97,
    category: "JVM、性能与架构",
    question: "线上CPU100%或内存溢出如何排查？",
    answer: "【CPU100%排查】\n\n```mermaid\ngraph TD\n    A[CPU100%] --> B[top命令]\n    B --> C[jstack]\n    C --> D[定位线程]\n    D --> E[代码分析]\n    \n    style A fill:#ffcdd2\n```\n\n【排查步骤】\n\n```bash\n# 1. 找到Java进程\ntop -c\n# 显示Java进程CPU排序\n\n# 2. 找到占用CPU的线程\ntop -Hp <pid>\n\n# 3. 线程ID转16进制\nprintf \"%x\" <tid>\n\n# 4. 导出线程堆栈\njstack <pid> > stack.txt\n\n# 5. 查找线程\ngrep \"nid=0x<tid>\" stack.txt\n```\n\n【内存溢出排查】\n\n```bash\n# 1. 导出堆转储\njmap -dump:format=b,file=heap.hprof <pid>\n\n# 2. 使用MAT分析\n# https://memory.analyzer\n```\n\n【Arthas使用】\n\n```bash\n# 启动Arthas\njava -jar arthas-boot.jar\n\n# 查看dashboard\ndashboard\n\n# 线程分析\nthread -n 10\n\n# 堆内存分析\nheapdump /tmp/heap.hprof\n\n# 方法耗时\ntrace class method\n```\n\n【常见原因】\n\n| 问题 | 原因 |\n|:---:|:---|\n| CPU高 | 死循环、GC频繁 |\n| 内存高 | 内存泄漏、大对象 |\n| 线程多 | 线程池配置不当 |",
    difficulty: 3
  },
  {
    id: 98,
    category: "JVM、性能与架构",
    question: "高并发系统的设计原则？",
    answer: "【高并发设计原则】\n\n```mermaid\ngraph TD\n    A[高并发设计] --> B[无状态]\n    A --> C[缓存]\n    A --> D[异步]\n    A --> E[降级]\n    A --> F[限流]\n    A --> G[扩容]\n    \n    style A fill:#c8e6c9\n```\n\n【设计原则】\n\n| 原则 | 说明 |\n|:---:|:---|\n| 无状态 | 可水平扩展 |\n| 缓存 | 减少数据库压力 |\n| 异步 | 削峰填谷 |\n| 降级 | 核心功能优先 |\n| 限流 | 保护系统 |\n| 扩容 | 应对流量 |\n\n【分层架构】\n\n```mermaid\ngraph TD\n    A[接入层] --> B[网关层]\n    B --> C[业务服务]\n    C --> D[数据访问]\n    \n    C --> E[缓存]\n    C --> F[消息队列]\n    \n    style C fill:#e1f5fe\n```\n\n【优化手段】\n\n| 手段 | 说明 |\n|:---:|:---|\n| CDN | 静态资源加速 |\n| 页面缓存 | 减少请求 |\n| 连接池 | 数据库复用 |\n| 异步 | 消息队列 |\n| 读写分离 | 分散压力 |\n\n【技术选型】\n\n| 场景 | 技术 |\n|:---:|:---|\n| 缓存 | Redis |\n| 消息队列 | Kafka/RocketMQ |\n| 搜索引擎 | Elasticsearch |\n| 存储 | MySQL分库分表 |",
    difficulty: 2
  },
  {
    id: 99,
    category: "JVM、性能与架构",
    question: "秒杀系统如何设计？防超卖、高性能、高可用？",
    answer: "【秒杀系统架构】\n\n```mermaid\ngraph TD\n    A[秒杀系统] --> B[限流]\n    B --> C[缓存]\n    C --> D[消息队列]\n    D --> E[数据库]\n    \n    style A fill:#e1_f5fe\n```\n\n【核心挑战】\n\n| 挑战 | 解决方案 |\n|:---:|:---|\n| 高并发 | 限流+缓存 |\n| 超卖 | 库存扣减 |\n| 热点数据 | Redis缓存 |\n| 机器人 | 验证码/限IP |\n\n【架构设计】\n\n```mermaid\ngraph LR\n    A[用户] --> B[CDN]\n    B --> C[网关限流]\n    C --> D[Redis预减库存]\n    D -->|库存不足| E[返回失败]\n    D -->|有库存| F[下单请求]\n    F --> G[MQ异步下单]\n    G --> H[数据库扣减]\n    H --> I[返回成功]\n```\n\n【防超卖方案】\n\n```java\n// Redis原子扣减\nLong stock = redisTemplate.opsForValue().decrement(\"stock:skuId\");\nif (stock < 0) {\n    // 库存不足\n    return false;\n}\n\n// 数据库乐观锁\nUPDATE stock SET count = count - 1 \nWHERE sku_id = ? AND count > 0;\n```\n\n【限流策略】\n\n| 限流点 | 方案 |\n|:---:|:---|\n| 入口 | Nginx限流 |\n| 网关 | Sentinel |\n| 业务 | Redis计数器 |\n\n【高可用保障】\n\n| 保障 | 说明 |\n|:---:|:---|\n| 隔离 | 独立服务 |\n| 熔断 | 异常降级 |\n| 幂等 | 防止重复 |\n| 限流 | 保护后端 |",
    difficulty: 3
  },
  {
    id: 100,
    category: "JVM、性能与架构",
    question: "设计一个短链系统？存储、跳转、统计？",
    answer: "【短链系统设计】\n\n```mermaid\ngraph TD\n    A[短链系统] --> B[生成]\n    A --> C[存储]\n    A --> D[跳转]\n    A --> E[统计]\n    \n    style A fill:#e1f5fe\n```\n\n【短链原理】\n\n```\n原链: https://example.com/article/123456789\n短链: https://t.cn/Rt7gKx\n```\n\n【生成算法】\n\n| 方案 | 原理 |\n|:---:|:---|\n| 自增ID | 数据库自增 |\n| 哈希 | MD5+Base62 |\n| 雪花 | 分布式ID |\n\n【Base62编码】\n\n```java\n// 62字符: 0-9 a-z A-Z\nprivate static final String CHARS = \"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\";\n\npublic String encode(long id) {\n    StringBuilder sb = new StringBuilder();\n    while (id > 0) {\n        sb.append(CHARS.charAt((int)(id % 62)));\n        id /= 62;\n    }\n    return sb.reverse().toString();\n}\n```\n\n【存储设计】\n\n```sql\n-- 短链表\nCREATE TABLE short_url (\n    id BIGINT PRIMARY KEY,\n    short_code VARCHAR(10) UNIQUE,\n    original_url VARCHAR(2048),\n    expire_time DATETIME,\n    created_at DATETIME\n);\n```\n\n【跳转流程】\n\n```mermaid\nsequenceDiagram\n    participant U as 用户\n    participant S as 短链服务\n    participant D as DB\n    \n    U->>S: 访问短链\n    S->>D: 查询长链\n    D-->>S: 返回长链\n    S->>U: 302重定向\n```\n\n【跳转优化】\n\n| 优化 | 说明 |\n|:---:|:---|\n| 缓存 | Redis缓存映射 |\n| 布隆 | 快速判断不存在 |\n| 预生成 | 批量生成 |\n\n【统计功能】\n\n| 统计 | 说明 |\n|:---:|:---|\n| PV | 访问量 |\n| UV | 独立访客 |\n| Referer | 来源分析 |\n| 时间段 | 分时统计 |",
    difficulty: 3
  },
];

module.exports = { questionsData };