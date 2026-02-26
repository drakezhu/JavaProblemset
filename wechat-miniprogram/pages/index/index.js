// index.js
const app = getApp();

Page({
  data: {
    questions: [],
    filteredQuestions: [],
    currentQuestions: [],
    categories: [],
    selectedCategory: '',
    selectedDifficulty: 0,
    currentPage: 1,
    questionsPerPage: 9,
    totalPages: 1,
    loading: true,
    error: null
  },

  onLoad() {
    // 页面加载时执行
    this.setData({
      questions: app.globalData.questions,
      categories: app.globalData.categories,
      selectedCategory: app.globalData.selectedCategory,
      selectedDifficulty: app.globalData.selectedDifficulty
    });
    
    // 筛选问题
    this.filterQuestions();
  },

  onShow() {
    // 页面显示时执行
    if (app.globalData.questions.length > 0 && this.data.questions.length === 0) {
      this.setData({
        questions: app.globalData.questions,
        categories: app.globalData.categories
      });
      this.filterQuestions();
    }
  },

  // 筛选问题
  filterQuestions() {
    const { selectedCategory, selectedDifficulty, questionsPerPage } = this.data;
    
    // 使用全局方法筛选问题
    const filtered = app.filterQuestions(selectedCategory, selectedDifficulty);
    
    // 计算总页数
    const totalPages = Math.ceil(filtered.length / questionsPerPage);
    
    // 重置到第一页
    const currentPage = 1;
    const currentQuestions = app.getPaginatedQuestions(filtered, currentPage, questionsPerPage);
    
    this.setData({
      filteredQuestions: filtered,
      currentQuestions: currentQuestions,
      currentPage: currentPage,
      totalPages: totalPages,
      loading: false
    });
  },

  // 切换类别
  handleCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    const newCategory = category === this.data.selectedCategory ? '' : category;
    
    this.setData({
      selectedCategory: newCategory,
      loading: true
    });
    
    // 更新全局数据
    app.globalData.selectedCategory = newCategory;
    
    // 重新筛选
    this.filterQuestions();
  },

  // 切换难度
  handleDifficultyChange(e) {
    const difficulty = parseInt(e.currentTarget.dataset.difficulty);
    const newDifficulty = difficulty === this.data.selectedDifficulty ? 0 : difficulty;
    
    this.setData({
      selectedDifficulty: newDifficulty,
      loading: true
    });
    
    // 更新全局数据
    app.globalData.selectedDifficulty = newDifficulty;
    
    // 重新筛选
    this.filterQuestions();
  },

  // 切换页面
  handlePageChange(e) {
    const pageType = e.currentTarget.dataset.type;
    const { currentPage, totalPages, filteredQuestions, questionsPerPage } = this.data;
    
    let newPage = currentPage;
    if (pageType === 'prev' && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (pageType === 'next' && currentPage < totalPages) {
      newPage = currentPage + 1;
    }
    
    if (newPage !== currentPage) {
      const currentQuestions = app.getPaginatedQuestions(filteredQuestions, newPage, questionsPerPage);
      
      this.setData({
        currentPage: newPage,
        currentQuestions: currentQuestions
      });
    }
  },

  // 更改每页显示数量
  handleQuestionsPerPageChange(e) {
    const questionsPerPage = parseInt(e.detail.value);
    
    this.setData({
      questionsPerPage: questionsPerPage,
      loading: true
    });
    
    // 更新全局数据
    app.globalData.questionsPerPage = questionsPerPage;
    
    // 重新筛选
    this.filterQuestions();
  },

  // 查看问题详情
  handleQuestionClick(e) {
    const question = e.currentTarget.dataset.question;
    
    // 跳转到详情页
    wx.navigateTo({
      url: `/pages/details/details?id=${question.id}`,
      success: (res) => {
        // 传递问题数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          question: question
        });
      }
    });
  },

  // 获取难度标签
  getDifficultyLabel(difficulty) {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }
});
