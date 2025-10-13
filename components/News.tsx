import React, { useState, useCallback, useEffect } from 'react';
import { generateAlumniStory } from '../services/geminiService';
import { getNews } from '../services/newsService';
import type { NewsArticle } from '../types';
import { SparklesIcon } from './Icons';

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

const GeminiStoryGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateStory = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Silakan masukkan bidang profesi atau keahlian.');
      return;
    }
    setIsLoading(true);
    setError('');
    setStory('');
    const result = await generateAlumniStory(prompt);
    if(result.startsWith("Error:") || result.startsWith("Maaf,")) {
        setError(result);
    } else {
        setStory(result);
    }
    setIsLoading(false);
  }, [prompt]);

  return (
    <div className="bg-brand-blue-950/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 my-16 text-white">
      <div className="flex items-center gap-4 mb-4">
        <SparklesIcon className="w-10 h-10 text-yellow-300"/>
        <h2 className="text-3xl font-bold">Generator Kisah Sukses Alumni (AI)</h2>
      </div>
      <p className="text-brand-blue-200 mb-6">
        Ingin membaca cerita inspiratif? Masukkan sebuah profesi atau bidang keahlian (contoh: "teknologi", "kedokteran", "seni musik") dan biarkan AI kami membuatkan kisah sukses alumni fiktif untuk Anda.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Pengusaha Start-up"
          className="flex-grow px-4 py-3 rounded-md bg-brand-blue-900 border border-brand-blue-700 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerateStory}
          disabled={isLoading}
          className="flex items-center justify-center px-6 py-3 font-semibold rounded-md bg-yellow-400 text-brand-blue-950 hover:bg-yellow-300 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Membuat Cerita...
            </>
          ) : (
            'Buatkan Cerita!'
          )}
        </button>
      </div>
      
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {story && (
        <div className="mt-8 p-6 bg-brand-blue-900/50 border border-brand-blue-700 rounded-lg">
          <h4 className="text-xl font-semibold mb-2 text-yellow-300">Kisah Inspiratif Alumni di Bidang "{prompt}"</h4>
          <p className="text-brand-blue-100 whitespace-pre-wrap">{story}</p>
        </div>
      )}
    </div>
  );
};


const News: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    setNewsArticles(getNews());
  }, []);

  return (
    <div className="py-16 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Kabar Terkini</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Berita & Inspirasi Alumni
          </p>
        </div>

        <GeminiStoryGenerator />
        
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