// details.js
const app = getApp();

Page({
  data: {
    question: null,
    loading: true
  },

  onLoad(options) {
    // 页面加载时执行
    const questionId = options.id;
    
    // 检查getOpenerEventChannel方法是否存在
    if (typeof this.getOpenerEventChannel === 'function') {
      // 监听来自首页的数据传递
      const eventChannel = this.getOpenerEventChannel();
      
      // 设置一个定时器，确保即使eventChannel传递失败，也能加载数据
      const timer = setTimeout(() => {
        if (this.data.loading) {
          console.log('Event channel data not received, trying to load from global data');
          this.findQuestionById(questionId);
        }
      }, 500);
      
      if (eventChannel) {
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          clearTimeout(timer); // 清除定时器
          this.setData({
            question: data.question,
            loading: false
          });
          // 设置导航栏标题
          wx.setNavigationBarTitle({
            title: data.question.category
          });
        });
      } else {
        clearTimeout(timer); // 清除定时器
        // 如果没有通过eventChannel传递数据，则从全局数据中查找
        this.findQuestionById(questionId);
      }
    } else {
      // 如果getOpenerEventChannel方法不存在，直接从全局数据中查找
      console.log('getOpenerEventChannel method not available, loading from global data');
      this.findQuestionById(questionId);
    }
  },

  // 根据ID查找问题
  findQuestionById(questionId) {
    const questions = app.globalData.questions;
    const question = questions.find(q => q.id === questionId);
    
    if (question) {
      this.setData({
        question: question,
        loading: false
      });
      // 设置导航栏标题
      wx.setNavigationBarTitle({
        title: question.category
      });
    } else {
      this.setData({
        error: '问题不存在',
        loading: false
      });
    }
  },

  // 返回上一页
  handleBack() {
    wx.navigateBack();
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
