import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const programId = searchParams.get('program');
  
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    program_id: programId || '',
    client_name: '',
    client_phone: '',
    client_email: '',
    child_name: '',
    child_age: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
    privacy_accepted: false
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programId && programs.length > 0) {
      const program = programs.find(p => p.id === programId);
      setSelectedProgram(program);
      setFormData(prev => ({ ...prev, program_id: programId }));
    }
  }, [programId, programs]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/programs`);
      setPrograms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setLoading(false);
      toast.error('Ошибка загрузки программ');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'program_id') {
      const program = programs.find(p => p.id === value);
      setSelectedProgram(program);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Format date for API
      const appointmentData = {
        ...formData,
        preferred_date: new Date(formData.preferred_date).toISOString(),
        child_age: formData.child_age ? parseInt(formData.child_age) : null
      };
      
      await axios.post(`${API}/appointments`, appointmentData);
      
      setSubmitted(true);
      toast.success('Заявка успешно отправлена!');
      
      // Reset form after delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error('Ошибка отправки заявки. Попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const isChildProgram = selectedProgram && (
    selectedProgram.type === 'preschool' || 
    selectedProgram.type === 'early_development' || 
    selectedProgram.type === 'individual_child' || 
    selectedProgram.type === 'group_child'
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Заявка отправлена!</h2>
          <p className="text-gray-600 mb-6">
            Спасибо за вашу заявку. Мы свяжемся с вами в ближайшее время для подтверждения записи.
          </p>
          <p className="text-sm text-gray-500">
            Вы будете перенаправлены на главную страницу через несколько секунд...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="appointment-title">
            Записаться на консультацию
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Заполните форму ниже, и мы свяжемся с вами для подтверждения записи
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Выберите программу *
                  </label>
                  <select
                    name="program_id"
                    value={formData.program_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                    data-testid="program-select"
                  >
                    <option value="">Выберите программу</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.title} - {program.price} ₽
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Program Info */}
                {selectedProgram && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl">{selectedProgram.type === 'preschool' ? '🎓' : '📚'}</div>
                      <div>
                        <h3 className="font-semibold text-indigo-900">{selectedProgram.title}</h3>
                        <p className="text-sm text-indigo-700">
                          {selectedProgram.age_range} • {selectedProgram.duration} • {selectedProgram.price} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-indigo-600" />
                    Контактная информация
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                      placeholder="Ваше полное имя"
                      data-testid="client-name-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        name="client_phone"
                        value={formData.client_phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                        placeholder="+7 (xxx) xxx-xx-xx"
                        data-testid="client-phone-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="client_email"
                        value={formData.client_email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                        placeholder="your@email.com"
                        data-testid="client-email-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Child Information (if applicable) */}
                {isChildProgram && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Информация о ребенке
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Имя ребенка
                        </label>
                        <input
                          type="text"
                          name="child_name"
                          value={formData.child_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                          placeholder="Имя ребенка"
                          data-testid="child-name-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Возраст ребенка
                        </label>
                        <input
                          type="number"
                          name="child_age"
                          value={formData.child_age}
                          onChange={handleInputChange}
                          min="1"
                          max="18"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                          placeholder="Возраст"
                          data-testid="child-age-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferred Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                    Желаемое время
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Предпочитаемая дата *
                      </label>
                      <input
                        type="date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                        data-testid="preferred-date-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Предпочитаемое время *
                      </label>
                      <select
                        name="preferred_time"
                        value={formData.preferred_time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                        data-testid="preferred-time-select"
                      >
                        <option value="">Выберите время</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                    Дополнительная информация
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                    placeholder="Расскажите о ваших потребностях, вопросах или пожеланиях..."
                    data-testid="message-textarea"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-hover flex items-center justify-center"
                  data-testid="submit-appointment-btn"
                >
                  {submitting ? (
                    <>
                      <div className="loading-spinner mr-3" />
                      Отправляем...
                    </>
                  ) : (
                    'Отправить заявку'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Контакты</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  <a href="tel:+79038509090" className="text-gray-700 hover:text-indigo-600 transition-colors">
                    +7 (903) 850-90-90
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-indigo-600" />
                  <a href="mailto:info@psycenter-vrn.ru" className="text-gray-700 hover:text-indigo-600 transition-colors">
                    info@psycenter-vrn.ru
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p>Пн-Пт: 9:00-20:00</p>
                    <p>Сб-Вс: 10:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Что будет дальше?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                  <p>Мы свяжемся с вами в течение 2 часов</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                  <p>Подтвердим удобное время</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                  <p>Проведем консультацию</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Почему нам доверяют</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">500+ довольных клиентов</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Опыт работы 5+ лет</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Конфиденциальность</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Гарантия результата</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;