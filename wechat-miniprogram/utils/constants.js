/**
 * 公共常量和工具函数
 */

/**
 * 获取难度标签
 * @param {number} difficulty - 难度级别 (1: Easy, 2: Medium, 3: Hard)
 * @returns {string} - 难度标签文本
 */
function getDifficultyLabel(difficulty) {
  const difficultyMap = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
  };
  return difficultyMap[difficulty] || 'Unknown';
}

module.exports = {
  getDifficultyLabel
};