import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog`);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAllTags = () => {
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)];
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="warm-gradient py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <span className="text-5xl">📝</span>
            <span className="text-5xl">🧠</span>
            <span className="text-5xl">💡</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900" data-testid="blog-title">
            Блог о психологии
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Полезные статьи о психологии, развитии детей и взрослых, советы от наших специалистов
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-8 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-400" />
              <input
                type="text"
                placeholder="Поиск по статьям..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                data-testid="blog-search-input"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${
                  !selectedTag
                    ? 'btn-orange text-white shadow-md'
                    : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
                }`}
                data-testid="tag-all"
              >
                Все темы
              </button>
              {getAllTags().map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${
                    selectedTag === tag
                      ? 'btn-orange text-white shadow-md'
                      : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
                  }`}
                  data-testid={`tag-${tag.replace(/\s+/g, '-')}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-gradient-to-br from-cream-50 to-peach-50/30" data-testid="blog-posts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="loading-spinner" style={{ borderTopColor: '#ff7730' }} />
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <p className="text-lg text-gray-700">
                  Найдено статей: <span className="font-bold text-orange-600">{filteredPosts.length}</span>
                </p>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <article 
                      key={post.id} 
                      className="blog-card gentle-hover bg-white rounded-soft-lg soft-shadow-lg overflow-hidden border border-orange-100"
                      data-testid={`blog-post-${post.id}`}
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.image_url} 
                          alt={post.title}
                          className="blog-image w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                          <span>{formatDate(post.created_at)}</span>
                          <span className="mx-2">•</span>
                          <User className="h-4 w-4 mr-1 text-orange-500" />
                          <span>{post.author}</span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span 
                              key={tag}
                              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-peach-100 to-orange-100 text-orange-700 text-xs font-semibold rounded-full border border-orange-200"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-gray-600 px-2 py-1">
                              +{post.tags.length - 2} еще
                            </span>
                          )}
                        </div>
                        
                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors"
                          data-testid={`read-more-${post.id}`}
                        >
                          Читать полностью
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Статьи не найдены</h3>
                  <p className="text-gray-600 mb-4">Попробуйте изменить поисковый запрос или фильтр</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag('');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Очистить фильтры
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Не пропустите новые статьи</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Подпишитесь на нашу рассылку и первыми узнавайте о новых материалах
          </p>
          <Link
            to="/#newsletter"
            className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors btn-hover"
            data-testid="newsletter-signup-btn"
          >
            Подписаться на рассылку
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;