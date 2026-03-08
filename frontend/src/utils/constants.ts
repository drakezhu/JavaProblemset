/**
 * 公共常量和工具函数
 */

/**
 * 获取难度标签
 * @param difficulty - 难度级别 (1: Easy, 2: Medium, 3: Hard)
 * @returns 难度标签文本
 */
export function getDifficultyLabel(difficulty: number): string {
  const difficultyMap: Record<number, string> = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
  };
  return difficultyMap[difficulty] || 'Unknown';
}
