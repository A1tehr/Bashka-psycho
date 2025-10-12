import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Save, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    phone: '',
    email: '',
    address: '',
    work_schedule: '',
    vk_link: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Ошибка загрузки настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const headers = getAuthHeader();
      await axios.put(`${API_URL}/api/settings`, settings, { headers });
      toast.success('Настройки сохранены');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Ошибка сохранения настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Настройки сайта</h2>
        <p className="text-gray-600">Управление контактной информацией</p>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Телефон</span>
              </div>
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="+7 (495) 123-45-67"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="vitapsy.center@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Адрес</span>
              </div>
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Москва, ул. Примерная, д. 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>График работы</span>
              </div>
            </label>
            <input
              type="text"
              value={settings.work_schedule}
              onChange={(e) => handleChange('work_schedule', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ссылка на ВКонтакте
            </label>
            <input
              type="url"
              value={settings.vk_link}
              onChange={(e) => handleChange('vk_link', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://vk.com/psychocenter"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
