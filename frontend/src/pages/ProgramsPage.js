import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Clock, Target } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${API}/programs`);
      setPrograms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Все программы' },
    { id: 'children', name: 'Для детей' },
    { id: 'adults', name: 'Для взрослых' },
    { id: 'group', name: 'Групповые' },
    { id: 'individual', name: 'Индивидуальные' }
  ];

  const filterPrograms = (programs, category) => {
    if (category === 'all') return programs;
    if (category === 'children') {
      return programs.filter(p => 
        p.type === 'preschool' || 
        p.type === 'early_development' || 
        p.type === 'individual_child' || 
        p.type === 'group_child'
      );
    }
    if (category === 'adults') {
      return programs.filter(p => 
        p.type === 'individual_adult' || 
        p.type === 'goal_setting'
      );
    }
    if (category === 'group') {
      return programs.filter(p => p.type === 'group_child');
    }
    if (category === 'individual') {
      return programs.filter(p => 
        p.type === 'individual_child' || 
        p.type === 'individual_adult'
      );
    }
    return programs;
  };

  const filteredPrograms = filterPrograms(programs, selectedCategory);

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

  // Schema.org structured data for programs listing
  const programsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Программы психологического развития",
    "description": "Программы всестороннего развития для детей и взрослых в психологическом центре",
    "numberOfItems": programs.length,
    "itemListElement": programs.slice(0, 6).map((program, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": program.title,
        "description": program.description,
        "provider": {
          "@type": "Organization",
          "name": "Психологический центр развития"
        }
      }
    }))
  };

  return (
    <div className="programs-page">
      <SEO 
        title="Программы развития"
        description="Все программы психологического центра. Программы для детей и взрослых: дошкольная подготовка, раннее развитие, индивидуальные и групповые занятия, достижение целей. Выберите подходящую программу."
        keywords="программы развития, детские программы, взрослые программы, психологические программы, дошкольная подготовка, раннее развитие, индивидуальные занятия"
        canonical={`${BACKEND_URL}/programs`}
        schemaMarkup={programsSchema}
      />
      
      {/* Hero Section */}
      <section className="text-white py-20" style={{ backgroundColor: '#F5F0E6', color: '#2D2D2D' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="programs-title">
            Наши программы развития
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#5C5C5C' }}>
            Выберите программу, которая поможет вам или вашему ребенку раскрыть потенциал и достичь новых высот
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid={`filter-${category.id}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16" data-testid="programs-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="loading-spinner" />
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <p className="text-lg text-gray-600">
                  Найдено программ: <span className="font-semibold text-indigo-600">{filteredPrograms.length}</span>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPrograms.map((program) => (
                  <div 
                    key={program.id} 
                    className="card-hover bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                    data-testid={`program-card-${program.id}`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={program.image_url} 
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white bg-opacity-90 text-2xl px-3 py-2 rounded-full">
                          {getProgramIcon(program.type)}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {program.price} ₽
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                          {program.age_range}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {program.duration}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {program.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                      
                      {/* Goals preview */}
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <Target className="h-4 w-4 text-indigo-600 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Цели программы:</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {program.goals.slice(0, 2).map((goal, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-indigo-600 mr-2">•</span>
                              {goal}
                            </li>
                          ))}
                          {program.goals.length > 2 && (
                            <li className="text-indigo-600 text-sm font-medium">
                              +{program.goals.length - 2} еще...
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/programs/${program.id}`}
                          className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors btn-hover flex items-center"
                          data-testid={`program-detail-btn-${program.id}`}
                        >
                          Подробнее
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link
                          to={`/appointment?program=${program.id}`}
                          className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors text-sm"
                          data-testid={`program-appointment-btn-${program.id}`}
                        >
                          Записаться
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredPrograms.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Программы не найдены</h3>
                  <p className="text-gray-600">Попробуйте выбрать другую категорию</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-white">
            <Users className="h-12 w-12 mx-auto mb-6 text-indigo-200" />
            <h2 className="text-3xl font-bold mb-4">Не можете выбрать подходящую программу?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Наши специалисты помогут подобрать идеальную программу для ваших целей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 btn-hover"
                data-testid="consultation-btn"
              >
                Получить консультацию
              </Link>
              <a
                href="tel:+79175755221"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105"
                data-testid="call-btn"
              >
                Позвонить сейчас
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;