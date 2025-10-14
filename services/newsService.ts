import type { NewsArticle } from '../types';
import { apiGet, apiSet } from './apiService';

const DB_KEY = 'news';

// Function to get all news from the mock API
export const getNews = async (): Promise<NewsArticle[]> => {
  return await apiGet(DB_KEY);
};

// Function to add a new news article
export const addNews = async (newArticle: Omit<NewsArticle, 'id'> & { id?: number }): Promise<void> => {
  const articles = await getNews();
  const articleToAdd: NewsArticle = {
    ...newArticle,
    id: newArticle.id || Date.now(),
  };
  // Add to the beginning of the list
  const updatedArticles = [articleToAdd, ...articles];
  await apiSet(DB_KEY, updatedArticles);
};

// Function to update an existing news article
export const updateNews = async (updatedArticle: NewsArticle): Promise<void> => {
  const articles = await getNews();
  const updatedList = articles.map(a => 
    a.id === updatedArticle.id ? updatedArticle : a
  );
  await apiSet(DB_KEY, updatedList);
};

// Function to delete a news article by ID
export const deleteNews = async (articleId: number): Promise<void> => {
  const articles = await getNews();
  const updatedArticles = articles.filter(a => a.id !== articleId);
  await apiSet(DB_KEY, updatedArticles);
};
