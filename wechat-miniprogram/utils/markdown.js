/**
 * 简单的Markdown解析器 - 微信小程序版
 * 支持：标题、粗体、列表、表格、代码块
 */

function parseMarkdown(text) {
  if (!text) return [];
  
  const lines = text.split('\n');
  const result = [];
  let currentBlock = null;
  let inCodeBlock = false;
  let codeContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 代码块开始/结束
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
    
    // 跳过空行
    if (!line) {
      if (currentBlock) {
        result.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }
    
    // 标题
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
    
    // 表格（简化处理：识别|开头或包含|的行）
    if (line.includes('|') && (line.startsWith('|') || line.match(/\|.*\|/))) {
      // 检查是否是分隔行
      if (line.match(/^[\s|:-]+$/)) {
        continue; // 跳过分隔行
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
    
    // 列表
    if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
      if (currentBlock && currentBlock.type !== 'list') {
        if (currentBlock) result.push(currentBlock);
        currentBlock = { type: 'list', items: [] };
      }
      const item = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
      if (currentBlock.type === 'list') {
        currentBlock.items.push(item);
      }
      continue;
    }
    
    // 段落
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

/**
 * 解析纯文本答案中的格式化内容
 */
function parseAnswer(answer) {
  if (!answer) return [];
  
  // 先尝试检测是否有Markdown标记
  const hasMarkdown = answer.includes('#') || 
                     answer.includes('```') || 
                     answer.includes('|') ||
                     answer.includes('- ');
  
  if (!hasMarkdown) {
    // 没有Markdown标记，按段落和列表处理
    return parsePlainText(answer);
  }
  
  return parseMarkdown(answer);
}

/**
 * 解析纯文本
 */
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
    
    // 检测列表项
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
    
    // 检测分隔符（如1. 2. 3.）
    if (trimmed.match(/^\d+\.\s+/) && !trimmed.includes('：') && !trimmed.includes('?')) {
      if (currentBlock && currentBlock.type !== 'list') {
        if (currentBlock) result.push(currentBlock);
        currentBlock = { type: 'list', items: [] };
      }
      if (currentBlock && currentBlock.type === 'list') {
        currentBlock.items.push(trimmed);
      }
      continue;
    }
    
    // 检测标题标记（如【xxx】）
    if (trimmed.startsWith('【') && trimmed.endsWith('】')) {
      if (currentBlock) result.push(currentBlock);
      currentBlock = {
        type: 'heading',
        level: 2,
        content: trimmed
      };
      continue;
    }
    
    // 段落
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

module.exports = {
  parseMarkdown,
  parseAnswer,
  parsePlainText
};
