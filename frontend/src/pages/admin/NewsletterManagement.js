import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Mail, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    html_content: '',
  });
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const headers = getAuthHeader();
      const response = await axios.get(`${API_URL}/api/newsletter`, { headers });
      setSubscribers(response.data);
    } catch (error) {
      console.error('Failed to load subscribers:', error);
      toast.error('Ошибка загрузки подписчиков');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    
    if (!emailData.subject || !emailData.html_content) {
      toast.error('Заполните тему и текст письма');
      return;
    }

    setSending(true);
    
    try {
      const headers = getAuthHeader();
      const response = await axios.post(
        `${API_URL}/api/newsletter/send`,
        emailData,
        { headers }
      );
      
      toast.success(`Рассылка отправлена! Доставлено: ${response.data.sent}, Ошибок: ${response.data.failed}`);
      setEmailData({ subject: '', html_content: '' });
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      toast.error('Ошибка отправки рассылки');
    } finally {
      setSending(false);
    }
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Рассылка</h2>
          <p className="text-gray-600">Подписчиков: {subscribers.length}</p>
        </div>
        <button
          onClick={loadSubscribers}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Обновить</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Newsletter form */}
        <div>
          <form onSubmit={handleSendNewsletter} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Отправить рассылку</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тема письма
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Новости центра развития"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст письма (HTML)
                </label>
                <textarea
                  value={emailData.html_content}
                  onChange={(e) => setEmailData(prev => ({ ...prev, html_content: e.target.value }))}
                  rows="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                  placeholder="<p>Здравствуйте!</p><p>Приглашаем вас на...</p>"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                <span>{sending ? 'Отправка...' : `Отправить ${subscribers.length} подписчикам`}</span>
              </button>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Примечание:</strong> Для работы рассылки необходимо настроить SMTP параметры в .env файле backend (SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_EMAIL)
              </p>
            </div>
          </form>
        </div>

        {/* Subscribers list */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Подписчики</h3>
            
            {subscribers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600">Нет подписчиков</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{subscriber.email}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(subscriber.subscribed_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterManagement;
