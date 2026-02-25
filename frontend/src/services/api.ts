import type { InterviewQuestion } from '../types/InterviewQuestion';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  async getAllQuestions(): Promise<InterviewQuestion[]> {
    const response = await fetch(`${API_BASE_URL}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return response.json();
  },

  async getQuestionsByCategory(category: string): Promise<InterviewQuestion[]> {
    // 在前端实现筛选，避免后端处理中文参数的问题
    const allQuestions = await api.getAllQuestions();
    return allQuestions.filter(q => q.category === category);
  },

  async getQuestionsByDifficulty(difficulty: number): Promise<InterviewQuestion[]> {
    // 在前端实现筛选，避免后端处理参数的问题
    const allQuestions = await api.getAllQuestions();
    return allQuestions.filter(q => q.difficulty === difficulty);
  },

  async getQuestionById(id: number): Promise<InterviewQuestion> {
    const response = await fetch(`${API_BASE_URL}/question/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch question with id: ${id}`);
    }
    return response.json();
  },

  async getAllCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
};
