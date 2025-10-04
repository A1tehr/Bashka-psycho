import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Plus, Edit2, Trash2, X, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';

const ProgramsManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [viewingProgram, setViewingProgram] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/programs`);
      setPrograms(response.data);
    } catch (error) {
      console.error('Failed to load programs:', error);
      toast.error('Ошибка загрузки программ');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setEditingProgram(null);
    setShowForm(false);
  };

  const handleEdit = (program) => {
    setFormData({
      type: program.type,
      title: program.title,
      description: program.description,
      goals: program.goals.join('\n'),
      age_range: program.age_range,
      price: program.price.toString(),
      duration: program.duration,
      faq: JSON.stringify(program.faq, null, 2),
      image_url: program.image_url,
    });
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleDelete = async (programId) => {
    try {
      const headers = getAuthHeader();
      await axios.delete(`${API_URL}/api/programs/${programId}`, { headers });
      toast.success('Программа удалена');
      loadPrograms();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete program:', error);
      toast.error('Ошибка удаления программы');
    }
  };

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

      if (editingProgram) {
        await axios.put(`${API_URL}/api/programs/${editingProgram.id}`, programData, { headers });
        toast.success('Программа обновлена');
      } else {
        await axios.post(`${API_URL}/api/programs`, programData, { headers });
        toast.success('Программа создана');
      }
      
      resetForm();
      loadPrograms();
    } catch (error) {
      console.error('Failed to save program:', error);
      toast.error(editingProgram ? 'Ошибка обновления программы' : 'Ошибка создания программы');
    } finally {
      setCreating(false);
    }
  };

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const programTypeLabels = {
    preschool: 'Дошкольная подготовка',
    early_development: 'Раннее развитие',
    individual_child: 'Индивидуальное (дети)',
    individual_adult: 'Индивидуальное (взрослые)',
    group_child: 'Групповые занятия',
    goal_setting: 'Целеполагание',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Управление программами</h2>
          <p className="text-gray-600">Всего программ: {programs.length}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showForm ? 'Отменить' : 'Создать программу'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingProgram ? 'Редактировать программу' : 'Новая программа'}
            </h3>
            
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

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
                <span>{creating ? 'Сохранение...' : (editingProgram ? 'Обновить программу' : 'Создать программу')}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отменить
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск программ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Programs List */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет программ</h3>
          <p className="text-gray-600">Создайте первую программу развития</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={program.image_url}
                alt={program.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {programTypeLabels[program.type]}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{program.price} ₽</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{program.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{program.age_range}</span>
                  <span>{program.duration}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewingProgram(program)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Просмотр</span>
                  </button>
                  <button
                    onClick={() => handleEdit(program)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Изменить</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(program)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewingProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Детали программы</h3>
                <button
                  onClick={() => setViewingProgram(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <img
                src={viewingProgram.image_url}
                alt={viewingProgram.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Тип</label>
                  <p className="text-gray-900">{programTypeLabels[viewingProgram.type]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Название</label>
                  <p className="text-gray-900">{viewingProgram.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Описание</label>
                  <p className="text-gray-900">{viewingProgram.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Цели</label>
                  <ul className="list-disc list-inside text-gray-900 space-y-1">
                    {viewingProgram.goals.map((goal, idx) => (
                      <li key={idx}>{goal}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Возраст</label>
                    <p className="text-gray-900">{viewingProgram.age_range}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Цена</label>
                    <p className="text-gray-900">{viewingProgram.price} ₽</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Длительность</label>
                    <p className="text-gray-900">{viewingProgram.duration}</p>
                  </div>
                </div>
                {viewingProgram.faq && viewingProgram.faq.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">FAQ</label>
                    <div className="space-y-3">
                      {viewingProgram.faq.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900">{item.question}</p>
                          <p className="text-gray-600 text-sm mt-1">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Подтвердите удаление</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить программу "{deleteConfirm.title}"? Это действие нельзя отменить.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Удалить
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsManagement;