// app.js
// 面试题数据 - 可以直接编辑此数组来添加、修改或删除问题
const interviewQuestions = [
  {
    id: 1,
    category: "Java基础",
    question: "什么是Java的多态？",
    answer: "多态是指同一个方法调用可以根据对象的不同而表现出不同的行为。在Java中，多态通过方法重写和方法重载实现。方法重写是子类对父类方法的重新实现，方法重载是在同一个类中定义多个同名但参数列表不同的方法。",
    difficulty: 1
  },
  {
    id: 2,
    category: "Java基础",
    question: "Java中的HashMap和HashTable有什么区别？",
    answer: "1. 线程安全性：HashMap非线程安全，HashTable线程安全\n2. 性能：HashMap性能更好，因为HashTable的方法都被synchronized修饰\n3. 允许的键值：HashMap允许null键和null值，HashTable不允许\n4. 继承关系：HashMap继承自AbstractMap，HashTable继承自Dictionary",
    difficulty: 2
  },
  {
    id: 3,
    category: "Java基础",
    question: "什么是Java的反射机制？",
    answer: "反射是指在运行时动态获取类的信息并操作类的成员（字段、方法、构造器）的能力。通过反射，我们可以在运行时创建对象、调用方法、访问和修改字段值，而不需要在编译时知道类的具体信息。",
    difficulty: 2
  },
  {
    id: 4,
    category: "集合框架",
    question: "ArrayList和LinkedList的区别？",
    answer: "1. 底层实现：ArrayList基于数组实现，LinkedList基于双向链表实现\n2. 访问效率：ArrayList随机访问效率高（O(1)），LinkedList随机访问效率低（O(n)）\n3. 插入删除效率：ArrayList插入删除元素需要移动其他元素，效率低（O(n)）；LinkedList插入删除元素只需要修改指针，效率高（O(1)）\n4. 内存占用：ArrayList内存占用较小，只存储元素本身；LinkedList内存占用较大，还需要存储前后指针",
    difficulty: 1
  },
  {
    id: 5,
    category: "集合框架",
    question: "HashMap的工作原理？",
    answer: "HashMap基于哈希表实现，通过key的hashCode()计算哈希值，然后通过扰动函数和取模运算确定元素在数组中的位置。如果发生哈希冲突，使用链表或红黑树存储冲突的元素。Java 8中，当链表长度超过8且数组容量大于64时，会将链表转换为红黑树以提高查询效率。",
    difficulty: 3
  },
  {
    id: 6,
    category: "多线程",
    question: "什么是线程安全？如何实现线程安全？",
    answer: "线程安全是指多个线程同时访问共享资源时，不会导致数据不一致或其他意外情况。实现线程安全的方式有：\n1. 使用synchronized关键字\n2. 使用Lock接口及其实现类\n3. 使用线程安全的集合类（如ConcurrentHashMap）\n4. 使用原子类（如AtomicInteger）\n5. 使用ThreadLocal\n6. 使用volatile关键字保证可见性",
    difficulty: 2
  },
  {
    id: 7,
    category: "多线程",
    question: "ThreadPoolExecutor的核心参数有哪些？",
    answer: "ThreadPoolExecutor的核心参数包括：\n1. corePoolSize：核心线程数\n2. maximumPoolSize：最大线程数\n3. keepAliveTime：非核心线程的空闲存活时间\n4. unit：keepAliveTime的时间单位\n5. workQueue：工作队列，用于存储等待执行的任务\n6. threadFactory：线程工厂，用于创建线程\n7. handler：拒绝策略，当线程池和队列都满时的处理策略",
    difficulty: 3
  },
  {
    id: 8,
    category: "Spring框架",
    question: "Spring IoC容器的作用是什么？",
    answer: "Spring IoC（Inversion of Control）容器的作用是管理Bean的生命周期和依赖注入。它将对象的创建、初始化、依赖关系的管理等工作从代码中分离出来，由容器统一管理，实现了控制反转。这样可以减少代码耦合，提高代码的可测试性和可维护性。",
    difficulty: 2
  },
  {
    id: 9,
    category: "Spring框架",
    question: "Spring AOP的实现原理？",
    answer: "Spring AOP基于动态代理实现，有两种方式：\n1. 对于实现了接口的类，使用JDK动态代理\n2. 对于没有实现接口的类，使用CGLIB动态代理\nAOP通过切面（Aspect）、连接点（Join Point）、通知（Advice）、切点（Pointcut）等概念，将横切关注点（如日志、事务、安全等）从业务逻辑中分离出来，实现了代码的模块化和复用。",
    difficulty: 3
  },
  {
    id: 10,
    category: "数据库",
    question: "什么是索引？索引的优缺点？",
    answer: "索引是数据库中用于提高查询效率的数据结构，它可以快速定位到数据所在的位置。\n优点：\n1. 提高查询效率\n2. 加速表之间的连接\n3. 强制数据唯一性\n缺点：\n1. 占用存储空间\n2. 降低插入、更新、删除操作的效率\n3. 索引需要维护，增加了数据库的负担",
    difficulty: 2
  }
];

App({
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
    
    // 加载面试题数据
    this.loadQuestions();
  },
  
  globalData: {
    questions: [],
    categories: [],
    selectedCategory: '',
    selectedDifficulty: 0,
    currentPage: 1,
    questionsPerPage: 9
  },
  
  // 加载面试题数据
  loadQuestions() {
    try {
      // 直接使用嵌入的数据
      this.globalData.questions = interviewQuestions.map(q => ({
        ...q,
        id: q.id.toString()
      }));
      // 提取所有类别
      this.extractCategories();
      console.log('面试题数据加载成功', this.globalData.questions.length, '条数据');
    } catch (err) {
      console.error('数据加载失败', err);
      this.loadDefaultData();
    }
  },
  
  // 加载默认数据
  loadDefaultData() {
    this.globalData.questions = [
      {
        id: '1',
        question: '什么是Java的多线程？',
        answer: 'Java的多线程是指在一个程序中同时执行多个线程，每个线程处理不同的任务。Java通过Thread类和Runnable接口支持多线程编程。',
        category: 'Java核心',
        difficulty: 1
      },
      {
        id: '2',
        question: 'Spring Boot的核心注解有哪些？',
        answer: '@SpringBootApplication、@RestController、@RequestMapping等。',
        category: 'Spring框架',
        difficulty: 2
      },
      {
        id: '3',
        question: '什么是JVM？',
        answer: 'JVM（Java Virtual Machine）是Java虚拟机，是Java程序运行的环境。',
        category: 'Java核心',
        difficulty: 1
      }
    ];
    this.globalData.categories = ['Java核心', 'Spring框架'];
    console.log('加载默认数据成功');
  },
  
  // 提取所有类别
  extractCategories() {
    const categories = new Set();
    this.globalData.questions.forEach(question => {
      categories.add(question.category);
    });
    this.globalData.categories = Array.from(categories);
  },
  
  // 筛选问题
  filterQuestions(category, difficulty) {
    let filtered = this.globalData.questions;
    
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }
    
    if (difficulty > 0) {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    
    return filtered;
  },
  
  // 分页获取问题
  getPaginatedQuestions(filteredQuestions, page, pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredQuestions.slice(start, end);
  }
});
