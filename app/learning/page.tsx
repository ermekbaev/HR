
import { useState } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';

export default function Learning() {
  const [userRole] = useState<'employee' | 'manager' | 'hr' | 'admin'>('employee');
  const [skillCoins] = useState(1250);
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    {
      id: 1,
      title: 'Основы работы в команде',
      description: 'Изучите принципы эффективной командной работы и коммуникации',
      duration: '2 часа',
      level: 'Базовый',
      progress: 30,
      coins: 100,
      status: 'in_progress',
      image: 'modern office training course illustration with professional business people learning in bright corporate environment, clean minimalist background, professional lighting'
    },
    {
      id: 2,
      title: 'Эффективная коммуникация',
      description: 'Развитие навыков делового общения и презентации',
      duration: '1.5 часа',
      level: 'Средний',
      progress: 0,
      coins: 75,
      status: 'available',
      image: 'corporate communication skills training illustration with business professionals in modern office setting, clean professional background, bright lighting'
    },
    {
      id: 3,
      title: 'Управление временем',
      description: 'Техники планирования и повышения личной эффективности',
      duration: '3 часа',
      level: 'Продвинутый',
      progress: 100,
      coins: 150,
      status: 'completed',
      image: 'time management training course with modern office workspace, productivity tools and calendar, professional business environment'
    },
    {
      id: 4,
      title: 'Цифровая безопасность',
      description: 'Основы информационной безопасности в корпоративной среде',
      duration: '1 час',
      level: 'Базовый',
      progress: 0,
      coins: 50,
      status: 'locked',
      image: 'cybersecurity training illustration with digital security concepts, modern technology background, professional corporate setting'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Первые шаги',
      description: 'Завершен первый курс',
      icon: 'ri-star-line',
      color: 'yellow',
      earned: true
    },
    {
      id: 2,
      title: 'Командный игрок',
      description: 'Изучены основы командной работы',
      icon: 'ri-team-line',
      color: 'blue',
      earned: true
    },
    {
      id: 3,
      title: 'Мастер времени',
      description: 'Освоены техники тайм-менеджмента',
      icon: 'ri-time-line',
      color: 'green',
      earned: false
    },
    {
      id: 4,
      title: 'Эксперт безопасности',
      description: 'Пройдены все курсы по безопасности',
      icon: 'ri-shield-line',
      color: 'purple',
      earned: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-gray-100 text-gray-800';
      case 'locked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'in_progress': return 'В процессе';
      case 'available': return 'Доступен';
      case 'locked': return 'Заблокирован';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole={userRole} />

      <div className="flex-1 overflow-y-auto">
        <Header title="Обучение" skillCoins={skillCoins} />
        
        <main className="p-6">
          {/* Статистика обучения */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-book-open-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-sm text-gray-500">Всего курсов</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-500">Завершено</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">6.5</p>
                  <p className="text-sm text-gray-500">Часов обучения</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-trophy-line text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-500">Достижений</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Вкладки */}
          <div className="mb-6">
            <Card>
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                    activeTab === 'courses'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Курсы
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
                    activeTab === 'achievements'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Достижения
                </button>
              </div>
            </Card>
          </div>

          {/* Контент вкладок */}
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <div className="flex space-x-4">
                    <img
                      src={`https://readdy.ai/api/search-image?query=$%7Bcourse.image%7D&width=120&height=120&seq=course${course.id}&orientation=squarish`}
                      alt={course.title}
                      className="w-20 h-20 rounded-lg object-cover object-top flex-shrink-0"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                          {getStatusLabel(course.status)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-bar-chart-line mr-1"></i>
                          {course.level}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-coin-line mr-1"></i>
                          +{course.coins} SC
                        </span>
                      </div>
                      
                      {course.progress > 0 && course.status !== 'completed' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Прогресс</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Button
                          size="sm"
                          disabled={course.status === 'locked'}
                          variant={course.status === 'completed' ? 'outline' : 'primary'}
                        >
                          {course.status === 'completed' 
                            ? 'Пересмотреть'
                            : course.status === 'in_progress'
                            ? 'Продолжить'
                            : course.status === 'locked'
                            ? 'Заблокирован'
                            : 'Начать курс'
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`text-center ${achievement.earned ? '' : 'opacity-60'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    achievement.earned 
                      ? `bg-${achievement.color}-500` 
                      : 'bg-gray-300'
                  }`}>
                    <i className={`${achievement.icon} text-white text-2xl`}></i>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  
                  {achievement.earned ? (
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Получено
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      Не получено
                    </span>
                  )}
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
