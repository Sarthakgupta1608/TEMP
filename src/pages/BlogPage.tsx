import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/mockData';
import type { BlogPost } from '../types';
import { BookOpen, Search, Clock, ArrowRight, X } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = ['All', 'Travel Advice', 'Destinations', 'Product & AI'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold text-purple-600 dark:text-purple-400">
          <BookOpen className="w-4 h-4" /> Traveller Insights & Guides
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Himalayan Travel <span className="ai-gradient-text">Journal</span>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Expert guides, destination secrets, and direct-booking travel hacks from local Sikkimese and Himachali operators.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card rounded-3xl p-4">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setActiveArticle(post)}
            className="glass-card glass-card-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {post.category}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.publishedDate}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60 mt-4">
              <div className="flex items-center gap-2">
                <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{post.author.name}</span>
              </div>

              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Read <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ARTICLE MODAL READ VIEW */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 relative border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {activeArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {activeArticle.title}
              </h2>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 block">{activeArticle.author.name}</span>
                    <span className="text-[10px] text-gray-400">{activeArticle.author.role}</span>
                  </div>
                </div>
                <span>•</span>
                <span>{activeArticle.publishedDate}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden">
              <img src={activeArticle.coverImage} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
              <p className="font-semibold text-gray-900 dark:text-white text-base">
                {activeArticle.excerpt}
              </p>
              <p>{activeArticle.content}</p>
              <p>
                When planning your mountain getaway, working directly with local ground partners ensures authentic hotel choices, experienced local drivers familiar with steep passes, and hassle-free permit approvals.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
