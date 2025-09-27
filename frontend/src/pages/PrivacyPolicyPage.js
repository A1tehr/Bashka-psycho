import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Главная</Link>
            <span>/</span>
            <span className="text-gray-900">Политика конфиденциальности</span>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link 
              to="/"
              className="inline-flex items-center text-white hover:text-indigo-200 transition-colors mr-6"
              data-testid="back-home-btn"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              На главную
            </Link>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold" data-testid="privacy-title">
                Политика конфиденциальности
              </h1>
              <p className="text-indigo-200 text-lg mt-2">
                Последнее обновление: 1 января 2025 г.
              </p>
            </div>
          </div>
          <p className="text-xl text-indigo-100 leading-relaxed">
            Мы ценим ваше доверие и обязуемся защищать вашу личную информацию согласно высочайшим стандартам.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg mb-8">
              <div className="flex items-center mb-3">
                <FileText className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-indigo-900 m-0">Введение</h2>
              </div>
              <p className="text-indigo-800 m-0">
                Психологический центр развития (далее - "Мы", "Наш центр") обязуется обеспечивать конфиденциальность и защиту персональных данных наших клиентов.
              </p>
            </div>

            {/* Data Collection */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Какие данные мы собираем</h2>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Личная информация</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• ФИО (полное имя)</li>
                  <li>• Номер телефона</li>
                  <li>• Адрес электронной почты</li>
                  <li>• Возраст (для детских программ)</li>
                  <li>• Информация о детях (при необходимости)</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Техническая информация</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• IP-адрес</li>
                  <li>• Информация о браузере</li>
                  <li>• Операционная система</li>
                  <li>• Данные о cookies</li>
                </ul>
              </div>
            </div>

            {/* Data Usage */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Как мы используем ваши данные</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Основные цели</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Предоставление психологических услуг</li>
                    <li>• Организация занятий и консультаций</li>
                    <li>• Связь с клиентами</li>
                    <li>• Обработка заявок и записей</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительно</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Улучшение качества услуг</li>
                    <li>• Анализ эффективности программ</li>
                    <li>• Информирование о новых услугах</li>
                    <li>• Напоминания о записях</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Protection */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Как мы защищаем ваши данные</h2>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Меры безопасности</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Техническая защита:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Шифрование данных</li>
                      <li>• Защищенные серверы</li>
                      <li>• Регулярные резервные копии</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Организационная защита:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Ограниченный доступ</li>
                      <li>• Обучение сотрудников</li>
                      <li>• Контроль и аудит</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Этические принципы</h3>
                <p className="text-gray-700 mb-4">
                  Наши специалисты строго соблюдают этический кодекс психолога, включая принципы конфиденциальности и неразглашения.
                </p>
                <p className="text-sm text-gray-600">
                  Вся информация, полученная в ходе консультаций, является строго конфиденциальной.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ваши права</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Право на доступ</h3>
                  <p className="text-green-800 text-sm">
                    Вы можете запросить информацию о том, какие ваши данные у нас хранятся и как мы их используем.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Право на исправление</h3>
                  <p className="text-blue-800 text-sm">
                    Вы можете попросить нас исправить любую неточную или неполную информацию.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">Право на удаление</h3>
                  <p className="text-yellow-800 text-sm">
                    В определенных случаях вы можете попросить нас удалить ваши персональные данные.
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Отзыв согласия</h3>
                  <p className="text-purple-800 text-sm">
                    Вы можете в любое время отозвать свое согласие на обработку персональных данных.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Использование cookies</h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Наш веб-сайт использует cookies для улучшения пользовательского опыта и анализа трафика.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Обязательные cookies</h4>
                    <p className="text-gray-600">Необходимы для работы сайта</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Аналитические cookies</h4>
                    <p className="text-gray-600">Помогают улучшать сайт</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Маркетинговые cookies</h4>
                    <p className="text-gray-600">Мы не используем</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Изменения в политике</h2>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-orange-800 mb-4">
                  Мы оставляем за собой право вводить изменения в эту Политику конфиденциальности. О всех существенных изменениях мы будем информировать наших клиентов.
                </p>
                <p className="text-sm text-orange-700">
                  Продолжая пользоваться нашими услугами после внесения изменений, вы соглашаетесь с обновленной Политикой.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Контактная информация</h2>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <p className="text-indigo-800 mb-4">
                  Если у вас есть вопросы о данной Политике конфиденциальности или о том, как мы обрабатываем ваши персональные данные, пожалуйста, свяжитесь с нами:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-indigo-900 mb-1">Телефон:</p>
                    <a href="tel:+79038509090" className="text-indigo-600 hover:text-indigo-800">
                      +7 (903) 850-90-90
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-indigo-900 mb-1">Email:</p>
                    <a href="mailto:info@psycenter-vrn.ru" className="text-indigo-600 hover:text-indigo-800">
                      info@psycenter-vrn.ru
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Есть вопросы?</h2>
          <p className="text-indigo-100 mb-6">
            Обращайтесь к нам по любым вопросам конфиденциальности
          </p>
          <Link
            to="/contacts"
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors btn-hover"
            data-testid="privacy-contact-btn"
          >
            Связаться с нами
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;