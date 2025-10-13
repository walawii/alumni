import React, { useState, useEffect } from 'react';
import { getNews } from '../services/newsService';
import type { NewsArticle } from '../types';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
  <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
    <img src={article.imageUrl} alt={article.title} className="h-48 w-full object-cover" />
    <div className="p-6">
      <p className="text-sm text-gray-500 mb-2">{article.date}</p>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
      <p className="text-gray-600 line-clamp-3">{article.excerpt}</p>
    </div>
  </div>
);

const News: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    setNewsArticles(getNews());
  }, []);

  return (
    <div className="py-12 md:py-16 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Kabar Terkini</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Berita & Inspirasi Alumni
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {newsArticles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;