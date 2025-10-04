import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ProgramsManagement = () => {
  const [formData, setFormData] = useState({
    type: 'individual_adult',
    title: '',
    description: '',
    goals: '',
    age_range: '',
    price: '',
    duration: '',
    faq: '',
    image_url: '',
  });
  const [creating, setCreating] = useState(false);
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const headers = getAuthHeader();
      
      const programData = {
        ...formData,
        price: parseInt(formData.price),
        goals: formData.goals.split('\n').filter(g => g.trim()),
        faq: formData.faq ? JSON.parse(formData.faq) : [],
      };

      await axios.post(`${API_URL}/api/programs`, programData, { headers });
      
      toast.success('Программа создана');
      setFormData({
        type: 'individual_adult',
        title: '',
        description: '',
        goals: '',
        age_range: '',
        price: '',
        duration: '',
        faq: '',
        image_url: '',
      });
    } catch (error) {
      console.error('Failed to create program:', error);
      toast.error('Ошибка создания программы');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Создать программу</h2>
        <p className="text-gray-600">Добавление новой программы развития</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип программы</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="preschool">Дошкольная подготовка</option>
                <option value="early_development">Раннее развитие</option>
                <option value="individual_child">Индивидуальное (дети)</option>
                <option value="individual_adult">Индивидуальное (взрослые)</option>
                <option value="group_child">Групповые занятия</option>
                <option value="goal_setting">Целеполагание</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Возрастной диапазон</label>
              <input
                type="text"
                value={formData.age_range}
                onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="18+ лет"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Название программы</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Индивидуальное консультирование"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Описание программы..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Цели (каждая с новой строки)</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Развитие навыков&#10;Повышение уверенности&#10;..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Цена (₽)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="2900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Длительность</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="50 минут"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">FAQ (JSON формат)</label>
            <textarea
              value={formData.faq}
              onChange={(e) => setFormData(prev => ({ ...prev, faq: e.target.value }))}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder='[{"question": "Вопрос?", "answer": "Ответ"}]'
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            <span>{creating ? 'Создание...' : 'Создать программу'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramsManagement;
