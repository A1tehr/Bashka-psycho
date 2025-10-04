import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AppointmentModal = ({ isOpen, onClose, selectedProgram = null }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    program_id: selectedProgram || '',
    preferred_date: '',
    preferred_time: '',
    message: '',
    child_name: '',
    child_age: '',
    privacy_accepted: false
  });

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedProgram) {
      setFormData(prev => ({ ...prev, program_id: selectedProgram }));
    }
  }, [selectedProgram]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/programs`);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/appointments`, formData);
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      client_name: '',
      client_phone: '',
      client_email: '',
      program_id: selectedProgram || '',
      preferred_date: '',
      preferred_time: '',
      message: '',
      child_name: '',
      child_age: ''
    });
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Записаться на занятие</h2>
          <p className="text-indigo-100">Заполните форму, и мы свяжемся с вами в ближайшее время</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Заявка отправлена!</h3>
              <p className="text-gray-600 text-lg">
                Спасибо за обращение. Мы свяжемся с вами в течение 24 часов.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-indigo-600" />
                  Ваше имя *
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Иван Иванов"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Child Info (optional) */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-900 mb-3">Информация о ребенке (если применимо)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Имя ребенка
                    </label>
                    <input
                      type="text"
                      name="child_name"
                      value={formData.child_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Имя"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Возраст ребенка
                    </label>
                    <input
                      type="text"
                      name="child_age"
                      value={formData.child_age}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="5 лет"
                    />
                  </div>
                </div>
              </div>

              {/* Program Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Выберите программу *
                </label>
                <select
                  name="program_id"
                  value={formData.program_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">Выберите программу</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.title} - {program.price} ₽
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                    Предпочитаемая дата *
                  </label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                    Предпочитаемое время *
                  </label>
                  <select
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Выберите время</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                  Дополнительная информация
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Расскажите о причине обращения или задайте вопрос..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Отправка...' : 'Отправить заявку'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
