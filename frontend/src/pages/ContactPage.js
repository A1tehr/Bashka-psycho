import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacy_accepted: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API}/contacts`, formData);
      setSubmitted(true);
      toast.success('Сообщение успешно отправлено!');
      
      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          privacy_accepted: false
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Ошибка отправки сообщения. Попробуйте еще раз.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="warm-gradient py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <span className="text-5xl">📞</span>
            <span className="text-5xl">💬</span>
            <span className="text-5xl">📍</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900" data-testid="contact-title">
            Контакты
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Мы всегда готовы ответить на ваши вопросы и помочь вам начать путь к позитивным изменениям
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Как с нами связаться</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Выберите удобный для вас способ связи. Мы отвечаем на все обращения в течение 2 часов.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Phone */}
                <div className="bg-white p-6 rounded-soft soft-shadow-lg border border-orange-100 gentle-hover">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 peach-gradient rounded-full flex items-center justify-center shadow-md">
                      <Phone className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Телефон</h3>
                      <a 
                        href="tel:+79038509090" 
                        className="text-orange-600 hover:text-orange-700 transition-colors font-semibold text-lg"
                        data-testid="phone-link"
                      >
                        +7 (903) 850-90-90
                      </a>
                      <p className="text-sm text-gray-600 mt-1">Звоните с 9:00 до 20:00</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white p-6 rounded-soft soft-shadow-lg border border-orange-100 gentle-hover">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-soft-blue-500 to-soft-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <Mail className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Email</h3>
                      <a 
                        href="mailto:info@psycenter-vrn.ru" 
                        className="text-soft-blue-600 hover:text-soft-blue-700 transition-colors font-semibold text-lg"
                        data-testid="email-link"
                      >
                        info@psycenter-vrn.ru
                      </a>
                      <p className="text-sm text-gray-600 mt-1">Отвечаем в течение 2 часов</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white p-6 rounded-soft soft-shadow-lg border border-orange-100 gentle-hover">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cream-500 to-cream-600 rounded-full flex items-center justify-center shadow-md">
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Адрес</h3>
                      <p className="text-cream-700 font-semibold text-lg">г. Воронеж</p>
                      <p className="text-sm text-gray-600 mt-1">Точный адрес уточняется при записи</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white p-6 rounded-soft soft-shadow-lg border border-orange-100 gentle-hover">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Режим работы</h3>
                      <div className="text-orange-600 font-semibold text-lg">
                        <p>Пн-Пт: 9:00-20:00</p>
                        <p>Сб-Вс: 10:00-18:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Мы в социальных сетях</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://vk.com/psycenter_vrn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    data-testid="vk-social-link"
                  >
                    <span className="text-sm font-bold">ВК</span>
                  </a>
                  <a
                    href="https://instagram.com/psycenter_vrn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    data-testid="instagram-social-link"
                  >
                    <span className="text-sm font-bold">IG</span>
                  </a>
                </div>
                <p className="text-indigo-100 text-sm mt-4">
                  Подписывайтесь на наши соцсети для получения полезных советов и новостей
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Напишите нам
              </h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Сообщение отправлено!</h3>
                  <p className="text-gray-600">
                    Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                        placeholder="Ваше полное имя"
                        data-testid="contact-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                        placeholder="+7 (xxx) xxx-xx-xx"
                        data-testid="contact-phone-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                      placeholder="your@email.com"
                      data-testid="contact-email-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тема сообщения *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                      data-testid="contact-subject-select"
                    >
                      <option value="">Выберите тему</option>
                      <option value="Консультация">Консультация по программам</option>
                      <option value="Запись">Запись на занятия</option>
                      <option value="Вопрос">Общие вопросы</option>
                      <option value="Отзыв">Отзыв о работе</option>
                      <option value="Предложение">Предложения и пожелания</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сообщение *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent form-input"
                      placeholder="Опишите ваш вопрос или сообщение подробнее..."
                      data-testid="contact-message-textarea"
                    />
                  </div>

                  {/* Privacy Policy Checkbox */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="privacy_accepted"
                      checked={formData.privacy_accepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, privacy_accepted: e.target.checked }))}
                      required
                      className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Я ознакомился(лась) с{' '}
                      <Link 
                        to="/privacy" 
                        target="_blank"
                        className="text-indigo-600 hover:text-indigo-800 underline"
                      >
                        политикой конфиденциальности
                      </Link>
                      {' '}и согласен(на) на обработку персональных данных *
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-hover flex items-center justify-center"
                    data-testid="contact-submit-btn"
                  >
                    {submitting ? (
                      <>
                        <div className="loading-spinner mr-3" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Отправить сообщение
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h2>
            <p className="text-lg text-gray-600">
              Ответы на самые популярные вопросы о нашей работе
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: 'Как проходят консультации?',
                answer: 'Консультации проводятся как очно, так и онлайн. В комфортной атмосфере мы обсуждаем ваши запросы и составляем индивидуальный план работы.'
              },
              {
                question: 'Какова стоимость услуг?',
                answer: 'Стоимость всех наших программ составляет 2900 рублей за одно занятие. Мы предлагаем гибкие варианты оплаты и скидки для курсов.'
              },
              {
                question: 'Можно ли прийти на пробное занятие?',
                answer: 'Конечно! Мы предлагаем бесплатную консультацию, в ходе которой вы сможете понять, подходит ли вам наш подход и методики.'
              },
              {
                question: 'Как быстро будут видны результаты?',
                answer: 'Первые позитивные изменения обычно заметны уже через 4-6 занятий. Однако сроки индивидуальны и зависят от многих факторов.'
              },
              {
                question: 'Конфиденциальность гарантирована?',
                answer: 'Конечно. Все наши специалисты соблюдают принципы конфиденциальности согласно этическому кодексу психолога.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Свяжитесь с нами сегодня и начните путь к позитивным изменениям
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+79038509090"
              className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors btn-hover"
              data-testid="cta-call-btn"
            >
              Позвонить сейчас
            </a>
            <a
              href="https://wa.me/79038509090?text=Здравствуйте! Хочу записаться на консультацию"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              data-testid="cta-whatsapp-btn"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;