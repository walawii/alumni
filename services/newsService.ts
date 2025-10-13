import type { NewsArticle } from '../types';
import { NEWS_ARTICLES } from '../constants';

const NEWS_DB_KEY = 'newsDatabase';

// Function to get all news from localStorage
export const getNews = (): NewsArticle[] => {
  try {
    const newsJson = localStorage.getItem(NEWS_DB_KEY);
    if (newsJson) {
      return JSON.parse(newsJson);
    } else {
      // If no data, initialize with mock data
      localStorage.setItem(NEWS_DB_KEY, JSON.stringify(NEWS_ARTICLES));
      return NEWS_ARTICLES;
    }
  } catch (error) {
    console.error("Failed to parse news data from localStorage", error);
    return NEWS_ARTICLES;
  }
};

// Function to save all news to localStorage
const saveNews = (articles: NewsArticle[]): void => {
  localStorage.setItem(NEWS_DB_KEY, JSON.stringify(articles));
};

// Function to add a new news article
export const addNews = (newArticle: Omit<NewsArticle, 'id'> & { id?: number }): void => {
  const articles = getNews();
  const articleToAdd: NewsArticle = {
    ...newArticle,
    id: newArticle.id || Date.now(),
  };
  saveNews([...articles, articleToAdd]);
};

// Function to update an existing news article
export const updateNews = (updatedArticle: NewsArticle): void => {
  const articles = getNews();
  const updatedList = articles.map(a => 
    a.id === updatedArticle.id ? updatedArticle : a
  );
  saveNews(updatedList);
};

// Function to delete a news article by ID
export const deleteNews = (articleId: number): void => {
  const articles = getNews();
  const updatedArticles = articles.filter(a => a.id !== articleId);
  saveNews(updatedArticles);
};
