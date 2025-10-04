import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Clock, CheckCircle, Star, Quote, Phone, MapPin, MessageCircle } from 'lucide-react';
import axios from 'axios';
import AppointmentModal from '../components/AppointmentModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
      setPrograms(response.data.slice(0, 3)); // Show first 3 programs
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

      {/* Hero Section with Modern Parallax Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Animated Background Layers */}
        <div className="absolute inset-0">
          {/* Back layer with gradient */}
          <div 
            className="absolute inset-0 parallax-back"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1707130868349-3ed75fc7fe8f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxncmFkaWVudCUyMGFic3RyYWN0fGVufDB8fHxibHVlfDE3NTkxNTA0NTN8MA&ixlib=rb-4.1.0&q=85)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.7
            }}
          />
          
          {/* Middle layer with nature */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1561765781-f7de2b8c56a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxuYXR1cmUlMjBjYWxtfGVufDB8fHxibHVlfDE3NTkxNTA0NTl8MA&ixlib=rb-4.1.0&q=85)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              backgroundAttachment: 'fixed'
            }}
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-800/50 to-purple-900/60" />
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-40 right-32 w-48 h-48 bg-purple-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-20 w-24 h-24 bg-indigo-400/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 scroll-reveal">
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-100 font-medium mb-6">
              ✨ Профессиональное развитие с заботой
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Психологический центр
              <span className="block bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mt-2">
                развития личности
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
              Помогаем детям и взрослым раскрыть свой потенциал через современные методы психологического развития и индивидуальный подход
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center scroll-reveal">
            <button
              onClick={() => openAppointmentModal()}
              className="group bg-white text-indigo-900 px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-2xl btn-hover btn-pulse flex items-center"
              data-testid="hero-appointment-btn"
            >
              Записаться на консультацию
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <Link
              to="/programs"
              className="group border-2 border-white/50 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all transform hover:scale-105 flex items-center"
              data-testid="hero-programs-btn"
            >
              Наши программы
              <ArrowRight className="ml-3 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 scroll-reveal">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Почему выбирают нас</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы создаем комфортную и профессиональную среду для вашего развития
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center scroll-reveal card-hover bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="scroll-reveal">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-indigo-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding" data-testid="programs-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши программы</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Профессиональные программы развития для всех возрастов
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {programs.map((program) => (
                <div key={program.id} className="scroll-reveal program-card bg-white rounded-2xl shadow-lg overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={program.image_url} 
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-medium px-4 py-1.5 rounded-full">
                        {program.age_range}
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {program.price} ₽
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {program.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {program.duration}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <Link
                        to={`/programs/${program.id}`}
                        className="flex-1 text-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                        data-testid={`program-link-${program.id}`}
                      >
                        Подробнее
                      </Link>
                      <button
                        onClick={() => openAppointmentModal(program.id)}
                        className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
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
              className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors btn-hover"
              data-testid="view-all-programs-btn"
            >
              Все программы
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы наших клиентов</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы гордимся доверием наших клиентов и их успехами
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="scroll-reveal testimonial-card rounded-2xl p-6 text-white">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-purple-200 mb-4" />
                <p className="text-lg mb-6 leading-relaxed">{testimonial.content}</p>
                <div>
                  <div className="font-semibold text-lg">{testimonial.name}</div>
                  <div className="text-purple-200">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-indigo-600 text-white" data-testid="newsletter-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="scroll-reveal">
            <h2 className="text-4xl font-bold mb-4">Будьте в курсе новостей</h2>
            <p className="text-xl text-indigo-200 mb-8">
              Подпишитесь на нашу рассылку и получайте полезные материалы по психологии и развитию
            </p>
            {subscribed ? (
              <div className="bg-green-500 text-white p-4 rounded-lg max-w-md mx-auto slide-in-right">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                <p>Спасибо за подписку! Мы будем присылать вам интересные материалы.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email"
                    required
                    className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white form-input"
                    data-testid="newsletter-email-input"
                  />
                  <button
                    type="submit"
                    className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors btn-hover"
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
      <section className="section-padding bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl font-bold mb-4">Как с нами связаться</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Мы всегда готовы ответить на ваши вопросы и помочь в выборе программы развития
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone */}
            <div className="text-center scroll-reveal">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Телефон</h3>
              <p className="text-gray-300 mb-2">+7 (912) 345-67-89</p>
              <p className="text-gray-300">+7 (495) 123-45-67</p>
            </div>
            
            {/* Address */}
            <div className="text-center scroll-reveal">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Адрес</h3>
              <p className="text-gray-300 mb-2">г. Москва</p>
              <p className="text-gray-300">ул. Психологов, д. 15</p>
            </div>
            
            {/* Working Hours */}
            <div className="text-center scroll-reveal">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">График работы</h3>
              <p className="text-gray-300 mb-2">Пн-Пт: 9:00-20:00</p>
              <p className="text-gray-300">Сб-Вс: 10:00-18:00</p>
            </div>
            
            {/* WhatsApp */}
            <div className="text-center scroll-reveal">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
              <p className="text-gray-300 mb-2">Быстрая связь</p>
              <a 
                href="https://wa.me/79123456789" 
                className="text-green-400 hover:text-green-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Написать в WhatsApp
              </a>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="mt-16 text-center scroll-reveal">
            <h3 className="text-2xl font-semibold mb-8">Мы в социальных сетях</h3>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://vk.com/psychocenter" 
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-white font-bold">ВК</span>
              </a>
              <a 
                href="https://instagram.com/psychocenter" 
                className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-white font-bold">IG</span>
              </a>
              <a 
                href="https://t.me/psychocenter" 
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-white font-bold">TG</span>
              </a>
              <a 
                href="https://youtube.com/@psychocenter" 
                className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
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
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="scroll-reveal bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Готовы начать путь развития?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Свяжитесь с нами сегодня и сделайте первый шаг к позитивным изменениям
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openAppointmentModal()}
                className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 btn-hover"
                data-testid="cta-appointment-btn"
              >
                Записаться на консультацию
              </button>
              <Link
                to="/contacts"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105"
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