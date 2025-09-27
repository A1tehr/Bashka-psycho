import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Clock, CheckCircle, Star, Quote } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
    <div className="homepage">
      {/* Hero Section with Parallax */}
      <section className="hero-parallax relative" data-testid="hero-section">
        <div 
          className="hero-background"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/7579302/pexels-photo-7579302.jpeg)',
          }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 float-animation">
            Психологический центр
            <span className="block text-4xl md:text-6xl mt-2 text-indigo-200">развития</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Помогаем детям и взрослым раскрыть свой потенциал через профессиональные программы развития
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointment"
              className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 btn-hover"
              data-testid="hero-appointment-btn"
            >
              Записаться на консультацию
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/programs"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105"
              data-testid="hero-programs-btn"
            >
              Наши программы
            </Link>
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
                <div key={program.id} className="scroll-reveal card-hover bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={program.image_url} 
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                        {program.age_range}
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {program.price} ₽
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{program.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {program.description.substring(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/programs/${program.id}`}
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                        data-testid={`program-link-${program.id}`}
                      >
                        Подробнее
                        <ArrowRight className="inline-block ml-1 h-4 w-4" />
                      </Link>
                      <span className="text-sm text-gray-500">{program.duration}</span>
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

      {/* CTA Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="scroll-reveal bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Готовы начать путь развития?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Свяжитесь с нами сегодня и сделайте первый шаг к позитивным изменениям
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/appointment"
                className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 btn-hover"
                data-testid="cta-appointment-btn"
              >
                Записаться на консультацию
              </Link>
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
    </div>
  );
};

export default HomePage;