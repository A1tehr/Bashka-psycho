import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Mail, Send, FileText, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    appointments: 0,
    contacts: 0,
    newsletter: 0,
    programs: 0,
  });
  const [loading, setLoading] = useState(true);
  const { getAuthHeader } = useAuth();
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const headers = getAuthHeader();
      
      const [appointmentsRes, contactsRes, newsletterRes, programsRes] = await Promise.all([
        axios.get(`${API_URL}/api/appointments`, { headers }),
        axios.get(`${API_URL}/api/contacts`, { headers }),
        axios.get(`${API_URL}/api/newsletter`, { headers }),
        axios.get(`${API_URL}/api/programs`),
      ]);

      setStats({
        appointments: appointmentsRes.data.length,
        contacts: contactsRes.data.length,
        newsletter: newsletterRes.data.length,
        programs: programsRes.data.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Записи',
      value: stats.appointments,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/appointments'
    },
    {
      title: 'Контакты',
      value: stats.contacts,
      icon: Mail,
      color: 'from-green-500 to-green-600',
      link: '/admin/contacts'
    },
    {
      title: 'Подписчики',
      value: stats.newsletter,
      icon: Send,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/newsletter'
    },
    {
      title: 'Программы',
      value: stats.programs,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/programs'
    },
  ];

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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Добро пожаловать!</h2>
        <p className="text-gray-600">Обзор статистики психологического центра</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.link}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </a>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/programs"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
          >
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Добавить программу</p>
          </a>
          <a
            href="/admin/blog"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
          >
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Создать статью</p>
          </a>
          <a
            href="/admin/newsletter"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
          >
            <Send className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Отправить рассылку</p>
          </a>
          <a
            href="/admin/settings"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
          >
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Настройки сайта</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
