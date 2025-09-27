import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchRelatedPosts();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API}/blog/${slug}`);
      setPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog`);
      // Filter out current post and get first 3
      const related = response.data
        .filter(p => p.slug !== slug)
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h2>
          <Link to="/blog" className="text-indigo-600 hover:text-indigo-800">
            Вернуться к блогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Главная</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-indigo-600">Блог</Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/blog"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              data-testid="back-to-blog-btn"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Вернуться к блогу
            </Link>
          </div>

          {/* Article Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center mr-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center mr-6">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                data-testid="share-btn"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Поделиться
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight" data-testid="post-title">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none" data-testid="post-content">
            {/* Since this is a simple implementation, we'll display the content as is */}
            {/* In a real implementation, you might want to use a markdown parser */}
            <div className="text-gray-700 leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
              
              {/* Sample content for demonstration */}
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Полезный совет</h3>
                <p className="text-indigo-800">
                  Помните, что каждый ребенок уникален и развивается в своем темпе. Профессиональная поддержка поможет выявить и раскрыть его потенциал.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Ключевые выводы</h2>
              <ul className="space-y-3 text-lg">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 text-xl">•</span>
                  Психологическое развитие - это непрерывный процесс
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 text-xl">•</span>
                  Профессиональная поддержка ускоряет достижение целей
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 text-xl">•</span>
                  Индивидуальный подход - основа эффективной работы
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Нужна помощь?</h3>
              <p className="text-indigo-100 mb-6">
                Наши специалисты готовы помочь вам разобраться в вопросах развития и психологии
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/appointment"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors btn-hover"
                  data-testid="article-cta-appointment"
                >
                  Записаться на консультацию
                </Link>
                <Link
                  to="/contacts"
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                  data-testid="article-cta-contact"
                >
                  Задать вопрос
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Похожие статьи</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article 
                  key={relatedPost.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
                  data-testid={`related-post-${relatedPost.id}`}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedPost.image_url} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(relatedPost.created_at)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        to={`/blog/${relatedPost.slug}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm"
                    >
                      Читать далее
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;