import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Target, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProgramDetailPage = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState({});

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      const response = await axios.get(`${API}/programs/${id}`);
      setProgram(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching program:', error);
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getProgramIcon = (type) => {
    switch (type) {
      case 'preschool':
      case 'early_development':
        return '🎓';
      case 'individual_child':
      case 'individual_adult':
        return '👤';
      case 'group_child':
        return '👥';
      case 'goal_setting':
        return '🎯';
      default:
        return '📚';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Программа не найдена</h2>
          <Link to="/programs" className="text-indigo-600 hover:text-indigo-800">
            Вернуться к программам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="program-detail-page">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Главная</Link>
            <span>/</span>
            <Link to="/programs" className="hover:text-indigo-600">Программы</Link>
            <span>/</span>
            <span className="text-gray-900">{program.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={program.image_url} 
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link 
              to="/programs"
              className="text-white hover:text-indigo-200 transition-colors flex items-center"
              data-testid="back-to-programs-btn"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Вернуться
            </Link>
          </div>
          <div className="text-white max-w-4xl">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">{getProgramIcon(program.type)}</span>
              <div>
                <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {program.age_range}
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6" data-testid="program-title">
              {program.title}
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed mb-8">
              {program.description}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center text-lg">
                <Clock className="h-6 w-6 mr-2 text-indigo-200" />
                <span>Продолжительность: {program.duration}</span>
              </div>
              <div className="text-3xl font-bold text-yellow-300">
                {program.price} ₽
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Goals Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8" data-testid="program-goals">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-indigo-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Цели программы</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.goals.map((goal, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">О программе</h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  
                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mb-6">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Кому подходит эта программа?</h3>
                    <p className="text-indigo-800">
                      Программа разработана для возрастной группы <strong>{program.age_range}</strong> и поможет достичь поставленных целей через профессиональный подход.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
                      <Clock className="h-8 w-8 mb-3" />
                      <h4 className="font-semibold text-lg mb-2">Продолжительность</h4>
                      <p className="text-indigo-100">{program.duration} на одно занятие</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-xl">
                      <Users className="h-8 w-8 mb-3" />
                      <h4 className="font-semibold text-lg mb-2">Формат</h4>
                      <p className="text-green-100">
                        {program.type.includes('individual') ? 'Индивидуальные занятия' : Групповые занятия'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              {program.faq && program.faq.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8" data-testid="program-faq">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
                  <div className="space-y-4">
                    {program.faq.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          data-testid={`faq-question-${index}`}
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {openFaq[index] ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {openFaq[index] && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-700 leading-relaxed" data-testid={`faq-answer-${index}`}>
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8" data-testid="booking-card">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {program.price} ₽
                  </div>
                  <p className="text-gray-600">за одно занятие</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Продолжительность:</span>
                    <span className="font-medium">{program.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Возраст:</span>
                    <span className="font-medium">{program.age_range}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Формат:</span>
                    <span className="font-medium">
                      {program.type.includes('individual') ? 'Индивидуально' : 'Групповое'}
                    </span>
                  </div>
                </div>
                
                <Link
                  to={`/appointment?program=${program.id}`}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors btn-hover block text-center"
                  data-testid="book-program-btn"
                >
                  Записаться на программу
                </Link>
                
                <div className="mt-4 text-center">
                  <a
                    href="tel:+79038509090"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium"
                    data-testid="call-link"
                  >
                    или позвоните +7 (903) 850-90-90
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Нужна консультация?</h3>
                <p className="text-indigo-100 mb-4 text-sm">
                  Наши специалисты ответят на все вопросы и помогут выбрать подходящую программу
                </p>
                <Link
                  to="/contacts"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors btn-hover block text-center"
                  data-testid="contact-consultation-btn"
                >
                  Получить консультацию
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Почему нам доверяют</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Опытные специалисты</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Проверенные методики</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Индивидуальный подход</span>
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
      </section>
    </div>
  );
};

export default ProgramDetailPage;