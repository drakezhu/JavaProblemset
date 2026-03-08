// app.js
const app = getApp();
const { questionsData } = require('./questions.js');

App({
  onLaunch() {
    console.log('小程序启动');
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
  
  loadQuestions() {
    try {
      console.log('开始加载面试题数据');
      console.log('原始数据长度:', questionsData.length);
      this.globalData.questions = questionsData.map(q => ({
        ...q,
        id: q.id.toString()
      }));
      console.log('处理后数据长度:', this.globalData.questions.length);
      this.extractCategories();
      console.log('提取的类别:', this.globalData.categories);
      console.log('Kafka类别是否存在:', this.globalData.categories.includes('Kafka'));
      console.log('面试题数据加载成功', this.globalData.questions.length, '条数据');
    } catch (err) {
      console.error('数据加载失败', err);
      this.loadDefaultData();
    }
  },
  
  loadDefaultData() {
    this.globalData.questions = [
      {
        id: '1',
        question: '什么是Java的多线程？',
        answer: 'Java的多线程是指在一个程序中同时执行多个线程。',
        category: 'Java核心',
        difficulty: 1
      }
    ];
    this.globalData.categories = ['Java核心'];
    console.log('加载默认数据成功');
  },
  
  extractCategories() {
    const categories = new Set();
    this.globalData.questions.forEach(question => {
      categories.add(question.category);
    });
    this.globalData.categories = Array.from(categories);
  },
  
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
  
  getPaginatedQuestions(filteredQuestions, page, pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredQuestions.slice(start, end);
  }
});
