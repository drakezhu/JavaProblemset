// details.js
const { getDifficultyLabel } = require('../../utils/constants');
const app = getApp();

Page({
  data: {
    question: null,
    loading: true,
    parsedAnswer: []
  },

  onLoad(options) {
    const questionId = options.id;
    
    if (typeof this.getOpenerEventChannel === 'function') {
      const eventChannel = this.getOpenerEventChannel();
      
      const timer = setTimeout(() => {
        if (this.data.loading) {
          console.log('Event channel data not received, trying to load from global data');
          this.findQuestionById(questionId);
        }
      }, 500);
      
      if (eventChannel) {
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          clearTimeout(timer);
          const parsed = parseAnswer(data.question.answer);
          this.setData({
            question: data.question,
            parsedAnswer: parsed,
            loading: false
          });
          wx.setNavigationBarTitle({
            title: data.question.category
          });
        });
      } else {
        clearTimeout(timer);
        this.findQuestionById(questionId);
      }
    } else {
      console.log('getOpenerEventChannel method not available, loading from global data');
      this.findQuestionById(questionId);
    }
  },

  findQuestionById(questionId) {
    const questions = app.globalData.questions;
    const question = questions.find(q => q.id == questionId);
    
    if (question) {
      const parsed = parseAnswer(question.answer);
      this.setData({
        question: question,
        parsedAnswer: parsed,
        loading: false
      });
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

  handleBack() {
    wx.navigateBack();
  }
});

function parseAnswer(answer) {
  if (!answer) return [];
  
  const hasMarkdown = answer.includes('#') || 
                     answer.includes('```') || 
                     answer.includes('|') ||
                     answer.includes('- ');
  
  if (!hasMarkdown) {
    return parsePlainText(answer);
  }
  
  return parseMarkdown(answer);
}

function parsePlainText(text) {
  const lines = text.split('\n');
  const result = [];
  let currentBlock = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (currentBlock) {
        result.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }
    
    if (trimmed.match(/^[-*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      if (currentBlock && currentBlock.type !== 'list') {
        if (currentBlock) result.push(currentBlock);
        currentBlock = { type: 'list', items: [] };
      }
      const item = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
      if (currentBlock && currentBlock.type === 'list') {
        currentBlock.items.push(item);
      }
      continue;
    }
    
    if (trimmed.startsWith('【') && trimmed.endsWith('】')) {
      if (currentBlock) result.push(currentBlock);
      currentBlock = {
        type: 'heading',
        level: 2,
        content: trimmed
      };
      continue;
    }
    
    if (currentBlock && currentBlock.type === 'paragraph') {
      currentBlock.content += '\n' + trimmed;
    } else {
      if (currentBlock) result.push(currentBlock);
      currentBlock = {
        type: 'paragraph',
        content: trimmed
      };
    }
  }
  
  if (currentBlock) result.push(currentBlock);
  
  return result;
}

function parseMarkdown(text) {
  if (!text) return [];
  
  const lines = text.split('\n');
  const result = [];
  let currentBlock = null;
  let inCodeBlock = false;
  let codeContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        if (currentBlock) result.push(currentBlock);
        inCodeBlock = true;
        codeContent = [];
        currentBlock = { type: 'code', content: '' };
      } else {
        currentBlock.content = codeContent.join('\n');
        result.push(currentBlock);
        inCodeBlock = false;
        currentBlock = null;
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }
    
    if (!line) {
      if (currentBlock) {
        result.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }
    
    if (line.startsWith('#')) {
      if (currentBlock) result.push(currentBlock);
      const match = line.match(/^(#{1,6})\s+(.+)/);
      if (match) {
        currentBlock = {
          type: 'heading',
          level: match[1].length,
          content: match[2]
        };
      }
      continue;
    }
    
    if (line.includes('|') && (line.startsWith('|') || line.match(/\|.*\|/))) {
      if (line.match(/^[\s|:-]+$/)) {
        continue;
      }
      if (currentBlock && currentBlock.type === 'table') {
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        currentBlock.rows.push(cells);
      } else {
        if (currentBlock) result.push(currentBlock);
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        currentBlock = {
          type: 'table',
          headers: cells,
          rows: []
        };
      }
      continue;
    }
    
    if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
      if (currentBlock && currentBlock.type !== 'list') {
        if (currentBlock) result.push(currentBlock);
        currentBlock = { type: 'list', items: [] };
      }
      const item = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
      if (currentBlock && currentBlock.type === 'list') {
        currentBlock.items.push(item);
      }
      continue;
    }
    
    if (currentBlock && currentBlock.type === 'paragraph') {
      currentBlock.content += '\n' + line;
    } else {
      if (currentBlock) result.push(currentBlock);
      currentBlock = {
        type: 'paragraph',
        content: line
      };
    }
  }
  
  if (currentBlock) result.push(currentBlock);
  
  return result;
}
