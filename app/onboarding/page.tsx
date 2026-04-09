
import { useState, useEffect } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';

export default function Onboarding() {
  const [userRole, setUserRole] = useState<'employee' | 'mentor' | 'manager' | 'admin'>('employee');
  const [skillCoins] = useState(1250);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'employee');
      } catch (error) {
        console.error('Failed to parse currentUser from localStorage:', error);
      }
    }
  }, []);

  // Контент для сотрудника (моя адаптация)
  const renderEmployeeOnboarding = () => (
    <>
      {/* Общий прогресс */}
      <div className="mb-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Добро пожаловать в команду!</h2>
              <p className="text-gray-600 mt-1">Ваш путь адаптации в компании</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">67%</p>
              <p className="text-sm text-gray-500">Завершено</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full" style={{ width: '67%' }}></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>12 из 18 задач выполнено</span>
            <span>Осталось 8 дней</span>
          </div>
        </Card>
      </div>

      {/* Этапы адаптации */}
      <div className="space-y-6">
        {/* Первая неделя */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Первая неделя</h3>
                <p className="text-sm text-gray-500">Знакомство с компанией</p>
              </div>
            </div>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">Завершено</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { task: 'Заполнить профиль', completed: true, coins: 30 },
              { task: 'Пройти вводный инструктаж', completed: true, coins: 50 },
              { task: 'Встретиться с HR', completed: true, coins: 40 },
              { task: 'Получить рабочее место', completed: true, coins: 25 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-white text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-900">{item.task}</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+{item.coins} SC</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Вторая неделя */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-time-line text-white text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Вторая неделя</h3>
                <p className="text-sm text-gray-500">Изучение процессов</p>
              </div>
            </div>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">В процессе</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { task: 'Изучить корпоративные ценности', completed: true, coins: 25, current: false },
              { task: 'Пройти курс по безопасности', completed: true, coins: 40, current: false },
              { task: 'Встреча с наставником', completed: false, coins: 50, current: true },
              { task: 'Изучить рабочие процессы', completed: false, coins: 35, current: false }
            ].map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                item.completed ? 'bg-green-50' : item.current ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-500' : item.current ? 'bg-blue-500' : 'border-2 border-gray-300'
                  }`}>
                    {item.completed ? (
                      <i className="ri-check-line text-white text-xs"></i>
                    ) : item.current ? (
                      <i className="ri-time-line text-white text-xs"></i>
                    ) : null}
                  </div>
                  <span className="text-sm text-gray-900">{item.task}</span>
                  {item.current && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Текущая</span>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  +{item.coins} SC
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Третья неделя */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <i className="ri-lock-line text-gray-500 text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Третья неделя</h3>
                <p className="text-sm text-gray-500">Практическая работа</p>
              </div>
            </div>
            <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Заблокировано</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { task: 'Первый проект', coins: 100 },
              { task: 'Работа в команде', coins: 75 },
              { task: 'Презентация результатов', coins: 80 },
              { task: 'Обратная связь от коллег', coins: 60 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">{item.task}</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">+{item.coins} SC</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Полезные ресурсы */}
      <div className="mt-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Полезные ресурсы</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <i className="ri-book-line text-blue-600 text-lg"></i>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Справочник сотрудника</h4>
              <p className="text-sm text-gray-500">Все что нужно знать о компании</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <i className="ri-team-line text-green-600 text-lg"></i>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Контакты команды</h4>
              <p className="text-sm text-gray-500">Кто есть кто в компании</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <i className="ri-question-line text-purple-600 text-lg"></i>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Часто задаваемые вопросы</h4>
              <p className="text-sm text-gray-500">Ответы на популярные вопросы</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );

  // Контент для наставника (прогресс адаптации подопечных)
  const renderMentorOnboarding = () => (
    <>
      <div className="mb-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Прогресс адаптации подопечных</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-gray-600">Всего подопечных</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">74%</p>
              <p className="text-sm text-gray-600">Средний прогресс</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">12</p>
              <p className="text-sm text-gray-600">Задач на проверке</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {[
          { name: 'Эдуард Алтунбаев', position: 'Junior разработчик', progress: 67, week: 2, tasks: 12, completed: 8, startDate: '2024-01-08' },
          { name: 'Анна Козлова', position: 'Маркетолог', progress: 85, week: 3, tasks: 15, completed: 13, startDate: '2023-12-25' },
          { name: 'Александр Петров', position: 'Дизайнер', progress: 45, week: 2, tasks: 10, completed: 4, startDate: '2024-01-10' },
          { name: 'Мария Сидорова', position: 'Аналитик', progress: 92, week: 4, tasks: 18, completed: 16, startDate: '2023-12-18' },
          { name: 'Дмитрий Козлов', position: 'QA инженер', progress: 73, week: 3, tasks: 14, completed: 10, startDate: '2023-12-28' }
        ].map((employee, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <img
                  src={`https://readdy.ai/api/search-image?query=professional%20business%20person%20in%20modern%20office%20environment%2C%20clean%20corporate%20background%2C%20business%20portrait%20style&width=60&height=60&seq=employee${index}&orientation=squarish`}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                  <p className="text-xs text-gray-500">Начал: {new Date(employee.startDate).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  employee.week === 1 ? 'bg-blue-100 text-blue-800' :
                  employee.week === 2 ? 'bg-yellow-100 text-yellow-800' :
                  employee.week === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {employee.week} неделя
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Прогресс адаптации</span>
                <span>{employee.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    employee.progress >= 80 ? 'bg-green-500' :
                    employee.progress >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${employee.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">{employee.completed}/{employee.tasks}</p>
                <p className="text-xs text-gray-500">Задач выполнено</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{Math.floor(Math.random() * 5) + 1}</p>
                <p className="text-xs text-gray-500">На проверке</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{employee.completed * 35}</p>
                <p className="text-xs text-gray-500">SkillCoins заработано</p>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <i className="ri-eye-line mr-1"></i>
                Подробнее
              </Button>
              <Button size="sm" className="flex-1">
                <i className="ri-message-line mr-1"></i>
                Связаться
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole={userRole} />

      <div className="flex-1 overflow-y-auto">
        <Header 
          title={userRole === 'mentor' ? 'Прогресс адаптации' : 'Моя адаптация'} 
          skillCoins={userRole === 'mentor' ? 2850 : skillCoins} 
        />
        
        <main className="p-6">
          {userRole === 'mentor' ? renderMentorOnboarding() : renderEmployeeOnboarding()}
        </main>
      </div>
    </div>
  );
}
