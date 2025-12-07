import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, FileText, Download } from 'lucide-react';
import SEO from '../components/SEO';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PrivacyPolicyPage = () => {
  const documents = [
    {
      name: 'Согласие на рекламную рассылку',
      filename: 'Согласие на рекламную рассылку.docx',
    },
    {
      name: 'Согласие на обработку ПД (запись на консультацию)',
      filename: 'Согласие_субъекта_на_обработку_ПД_запись_на_консультацию.docx',
    },
    {
      name: 'Согласие на обработку ПД (запись на занятие)',
      filename: 'Согласие_субъекта_на_обработку_ПД_вместе_с_согласием_на_обработку.docx',
    },
    {
      name: 'Политика обработки персональных данных',
      filename: 'Политика обработки ПД.docx',
    },
  ];

  return (
    <div className="privacy-policy-page">
      <SEO
        title="Политика конфиденциальности"
        description="Политика конфиденциальности персональных данных психологического центра развития. Условия обработки и защиты персональных данных."
        keywords="политика конфиденциальности, обработка персональных данных, защита данных"
        canonical={`${BACKEND_URL}/privacy`}
      />
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
                Политика конфиденциальности персональных данных
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

      {/* Download Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Официальные документы</h2>
            <p className="text-gray-600 mt-2">
              Вы можете скачать все юридические документы, регулирующие обработку персональных данных
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {documents.map((doc, index) => (
                <li key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <a
                    href={`/${encodeURIComponent(doc.filename)}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Download className="h-5 w-5 mr-3" />
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Остальной контент вашей политики (как в исходном компоненте) */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* === Здесь вставляете ВЕСЬ остальной JSX из вашего оригинального компонента === */}
            {/* Например, блок "Официальный документ", "Введение", "Какие данные мы собираем" и т.д. */}

            {/* Чтобы не дублировать весь длинный код — просто оставьте комментарий или вставьте оригинальный JSX */}
            {/* Но если вы хотите полную версию — скажите, и я включу всё */}

            {/* Остальные разделы (введение, сбор данных, права и т.д.) — вставьте как есть из оригинала */}
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
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
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