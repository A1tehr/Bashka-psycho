import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Clock, CheckCircle, Star, Quote, Phone, MapPin, MessageCircle } from 'lucide-react';
import axios from 'axios';
import AppointmentModal from '../components/AppointmentModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  useEffect(() => {
    fetchPrograms();
    // Add scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/programs`);
      setPrograms(response.data); // Show all programs in carousel
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/newsletter`, { email });
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    }
  };

  const openAppointmentModal = (programId = null) => {
    setSelectedProgramId(programId);
    setIsModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsModalOpen(false);
    setSelectedProgramId(null);
  };

  const features = [
    {
      icon: Users,
      title: 'Опытные специалисты',
      description: 'Команда профессиональных психологов с многолетним опытом работы'
    },
    {
      icon: Award,
      title: 'Проверенные методики',
      description: 'Используем только научно обоснованные и эффективные подходы'
    },
    {
      icon: Clock,
      title: 'Гибкий график',
      description: 'Удобное время занятий, подстраиваемся под ваш распорядок дня'
    }
  ];

  const testimonials = [
    {
      name: 'Анна Иванова',
      role: 'Мама Миши, 6 лет',
      content: 'Благодаря программе дошкольной подготовки мой сын стал более уверенным и готовым к школе. Очень довольны результатами!',
      rating: 5
    },
    {
      name: 'Дмитрий Петров',
      role: 'Папа Софии, 12 лет',
      content: 'Индивидуальные консультации помогли дочери справиться с трудностями в учебе. Теперь она учится с удовольствием.',
      rating: 5
    },
    {
      name: 'Елена Сидорова',
      role: 'Клиент, 28 лет',
      content: 'Программа по тайм-менеджменту кардинально изменила мою жизнь. Научилась планировать время и достигать целей.',
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: 'Довольных клиентов' },
    { number: '5+', label: 'Лет опыта' },
    { number: '6', label: 'Программ развития' },
    { number: '98%', label: 'Положительных отзывов' }
  ];

  return (
    <div className="homepage relative">
      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/79123456789"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        title="Связаться через WhatsApp"
      >
        <MessageCircle className="w-8 h-8" style={{ marginTop: '16px', marginLeft: '16px' }} />
      </a>

      {/* Hero Section - Light and Warm Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1588979355313-6711a095465f" 
            alt="Happy family"
            className="w-full h-full object-cover"
          />
          {/* Light overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-peach-50/90 to-orange-50/85" />
          
          {/* Soft floating shapes with warm colors */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-peach-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-24 w-80 h-80 bg-soft-blue-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-32 w-48 h-48 bg-orange-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-cream-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 scroll-reveal">
            <div className="inline-block px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-orange-600 font-medium mb-6 shadow-sm border border-orange-100">
              ✨ Профессиональное развитие с заботой
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Психологический центр
              <span className="block bg-gradient-to-r from-orange-500 via-peach-500 to-orange-600 bg-clip-text text-transparent mt-2">
                развития личности
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Помогаем детям и взрослым раскрыть свой потенциал через современные методы психологического развития и индивидуальный подход
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center scroll-reveal">
            <button
              onClick={() => openAppointmentModal()}
              className="group btn-orange text-white px-12 py-5 rounded-full text-lg font-semibold flex items-center shadow-lg"
              data-testid="hero-appointment-btn"
            >
              Записаться на консультацию
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <Link
              to="/programs"
              className="group border-2 border-orange-400 text-orange-600 bg-white/80 backdrop-blur-sm px-12 py-5 rounded-full text-lg font-semibold hover:bg-orange-50 transition-all transform hover:scale-105 flex items-center shadow-lg"
              data-testid="hero-programs-btn"
            >
              Наши программы
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 scroll-reveal">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <div className="text-3xl md:text-5xl font-bold text-orange-600 mb-2">{stat.number}</div>
                <div className="text-gray-700 text-sm md:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <div className="flex justify-center gap-4 mb-6">
              <span className="text-5xl emotion-icon">😊</span>
              <span className="text-5xl emotion-icon">❤️</span>
              <span className="text-5xl emotion-icon">🌟</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Почему выбирают нас</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Мы создаем комфортную и профессиональную среду для вашего развития
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center scroll-reveal gentle-hover bg-gradient-to-br from-cream-50 to-peach-50 p-10 rounded-soft-lg border border-orange-100 relative overflow-hidden">
                  {index === 0 && (
                    <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                      <img src="https://images.unsplash.com/photo-1650504148053-ae51b12dc1d4" alt="" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                      <img src="https://images.unsplash.com/photo-1650504149601-f9fdd445c187" alt="" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  )}
                  <div className="w-20 h-20 peach-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-md relative z-10">
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section - Removed duplicate, using only hero stats */}

      {/* Programs Section */}
      <section className="section-padding scroll-reveal bg-gradient-to-br from-cream-50 to-peach-50/30" data-testid="programs-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Наши программы</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Профессиональные программы развития для всех возрастов
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div className="loading-spinner" style={{ borderTopColor: '#ff7730' }} />
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Программы временно недоступны</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {programs.map((program) => (
                <div key={program.id} className="program-card bg-white rounded-soft-lg soft-shadow-lg overflow-hidden group">
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={program.image_url} 
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-gradient-to-r from-peach-100 to-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full border border-orange-200">
                        {program.age_range}
                      </span>
                      <span className="text-2xl font-bold text-orange-600">
                        {program.price} ₽
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {program.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-orange-500" />
                        {program.duration}
                      </span>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Link
                        to={`/programs/${program.id}`}
                        className="flex-1 text-center px-4 py-3 border-2 border-orange-400 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all"
                        data-testid={`program-link-${program.id}`}
                      >
                        Подробнее
                      </Link>
                      <button
                        onClick={() => openAppointmentModal(program.id)}
                        className="flex-1 text-center px-4 py-3 btn-orange text-white rounded-xl font-semibold shadow-md"
                      >
                        Записаться
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center scroll-reveal">
            <Link
              to="/programs"
              className="inline-flex items-center btn-orange text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg"
              data-testid="view-all-programs-btn"
            >
              Все программы
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Отзывы наших клиентов</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Мы гордимся доверием наших клиентов и их успехами
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="scroll-reveal testimonial-card rounded-soft-lg p-8 shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-orange-500 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-orange-300 mb-4" />
                <p className="text-lg mb-6 leading-relaxed text-gray-700">{testimonial.content}</p>
                <div>
                  <div className="font-bold text-lg text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding warm-gradient" data-testid="newsletter-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Будьте в курсе новостей</h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Подпишитесь на нашу рассылку и получайте полезные материалы по психологии и развитию
            </p>
            {subscribed ? (
              <div className="bg-green-500 text-white p-6 rounded-soft max-w-md mx-auto slide-in-right shadow-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-3" />
                <p className="text-lg font-medium">Спасибо за подписку! Мы будем присылать вам интересные материалы.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email"
                    required
                    className="flex-1 px-6 py-4 rounded-full text-gray-900 border-2 border-orange-200 focus:outline-none focus:border-orange-400 form-input bg-white shadow-sm"
                    data-testid="newsletter-email-input"
                  />
                  <button
                    type="submit"
                    className="btn-orange text-white px-8 py-4 rounded-full font-semibold shadow-lg"
                    data-testid="newsletter-submit-btn"
                  >
                    Подписаться
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-padding bg-gradient-to-br from-soft-blue-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Как с нами связаться</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Мы всегда готовы ответить на ваши вопросы и помочь в выборе программы развития
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone */}
            <div className="text-center scroll-reveal gentle-hover bg-white p-8 rounded-soft shadow-md">
              <div className="w-20 h-20 peach-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Phone className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Телефон</h3>
              <p className="text-gray-700 mb-2 font-medium">+7 (912) 345-67-89</p>
              <p className="text-gray-700 font-medium">+7 (495) 123-45-67</p>
            </div>
            
            {/* Address */}
            <div className="text-center scroll-reveal gentle-hover bg-white p-8 rounded-soft shadow-md">
              <div className="w-20 h-20 bg-gradient-to-br from-soft-blue-500 to-soft-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Адрес</h3>
              <p className="text-gray-700 mb-2 font-medium">г. Москва</p>
              <p className="text-gray-700 font-medium">ул. Психологов, д. 15</p>
            </div>
            
            {/* Working Hours */}
            <div className="text-center scroll-reveal gentle-hover bg-white p-8 rounded-soft shadow-md">
              <div className="w-20 h-20 bg-gradient-to-br from-cream-500 to-cream-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">График работы</h3>
              <p className="text-gray-700 mb-2 font-medium">Пн-Пт: 9:00-20:00</p>
              <p className="text-gray-700 font-medium">Сб-Вс: 10:00-18:00</p>
            </div>
            
            {/* WhatsApp */}
            <div className="text-center scroll-reveal gentle-hover bg-white p-8 rounded-soft shadow-md">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">WhatsApp</h3>
              <p className="text-gray-700 mb-3 font-medium">Быстрая связь</p>
              <a 
                href="https://wa.me/79123456789" 
                className="text-green-600 hover:text-green-700 transition-colors font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Написать в WhatsApp
              </a>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="mt-16 text-center scroll-reveal">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Мы в социальных сетях</h3>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://vk.com/psychocenter" 
                className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-white font-bold text-lg">ВК</span>
              </a>
              <a 
                href="https://instagram.com/psychocenter" 
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-white font-bold text-lg">IG</span>
              </a>
              <a 
                href="https://t.me/psychocenter" 
                className="w-16 h-16 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-white font-bold text-lg">TG</span>
              </a>
              <a 
                href="https://youtube.com/@psychocenter" 
                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-white font-bold">YT</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="scroll-reveal peach-gradient rounded-soft-lg p-12 md:p-16 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Готовы начать путь развития?</h2>
            <p className="text-xl md:text-2xl text-orange-50 mb-10 leading-relaxed">
              Свяжитесь с нами сегодня и сделайте первый шаг к позитивным изменениям
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => openAppointmentModal()}
                className="bg-white text-orange-600 px-10 py-5 rounded-full text-lg font-bold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                data-testid="cta-appointment-btn"
              >
                Записаться на консультацию
              </button>
              <Link
                to="/contacts"
                className="border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-orange-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                data-testid="cta-contact-btn"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={closeAppointmentModal}
        selectedProgram={selectedProgramId}
      />
    </div>
  );
};

export default HomePage;