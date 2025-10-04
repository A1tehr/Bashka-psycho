import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Newspaper, Plus } from 'lucide-react';
import { toast } from 'sonner';

const BlogManagement = () => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    tags: '',
    image_url: '',
    published: true,
  });
  const [creating, setCreating] = useState(false);
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const headers = getAuthHeader();
      
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      await axios.post(`${API_URL}/api/blog`, postData, { headers });
      
      toast.success('Статья создана');
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: '',
        tags: '',
        image_url: '',
        published: true,
      });
    } catch (error) {
      console.error('Failed to create blog post:', error);
      toast.error('Ошибка создания статьи');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Создать статью</h2>
        <p className="text-gray-600">Добавление новой статьи в блог</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Как помочь ребенку..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="kak-pomoch-rebenku"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Краткое описание</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Краткое описание статьи..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Содержание статьи</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows="12"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Полный текст статьи..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Автор</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Детский психолог"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Теги (через запятую)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="психология, дети, развитие"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL изображения</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
              required
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Опубликовать сразу
            </label>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            <span>{creating ? 'Создание...' : 'Создать статью'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogManagement;
