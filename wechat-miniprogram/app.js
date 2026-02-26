// app.js
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
      // 读取本地JSON文件
      const fs = wx.getFileSystemManager();
      const res = fs.readFileSync('questions.json', 'utf-8');
      const questions = JSON.parse(res);
      
      // 转换id为字符串，确保类型一致
      this.globalData.questions = questions.map(q => ({
        ...q,
        id: q.id.toString()
      }));
      
      // 提取所有类别
      this.extractCategories();
      console.log('面试题数据加载成功', this.globalData.questions.length, '条数据');
    } catch (err) {
      console.error('数据加载失败', err);
      // 备用数据，防止加载失败
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
    }
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
