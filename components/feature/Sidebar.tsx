
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  userRole: 'employee' | 'mentor' | 'manager' | 'admin' | 'hr';
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname.slice(1) || 'dashboard');
  const { currentUser, logout, getPendingTasksCount, getUnansweredSurveysCount, hasUnreadTaskFeedback } = useAppContext();

  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    setActiveItem(path);
  }, [location.pathname]);

  const pendingCount = getPendingTasksCount();
  const surveyCount = getUnansweredSurveysCount();

  const menuItems: Record<SidebarProps['userRole'], MenuItem[]> = {
    employee: [
      { id: 'dashboard', label: 'Дашборд', icon: 'ri-dashboard-3-line', path: '/dashboard', badge: surveyCount > 0 ? surveyCount : undefined },
      { id: 'onboarding', label: 'Моя адаптация', icon: 'ri-user-add-line', path: '/onboarding' },
      { id: 'tasks', label: 'Задачи', icon: 'ri-task-line', path: '/tasks', badge: hasUnreadTaskFeedback ? 1 : undefined },
      { id: 'learning', label: 'Обучение', icon: 'ri-book-open-line', path: '/learning' },
      { id: 'rewards', label: 'Награды', icon: 'ri-gift-line', path: '/rewards' },
      { id: 'team', label: 'Команда', icon: 'ri-team-line', path: '/team' }
    ],
    mentor: [
      { id: 'mentor', label: 'Панель наставника', icon: 'ri-shield-user-line', path: '/mentor', badge: pendingCount > 0 ? pendingCount : undefined },
      { id: 'team', label: 'Мои подопечные', icon: 'ri-team-line', path: '/team' },
      { id: 'onboarding', label: 'Прогресс адаптации', icon: 'ri-bar-chart-line', path: '/onboarding' }
    ],
    manager: [
      { id: 'dashboard', label: 'Дашборд', icon: 'ri-dashboard-3-line', path: '/dashboard' },
      { id: 'team', label: 'Все сотрудники', icon: 'ri-team-line', path: '/team' },
      { id: 'analytics', label: 'Общая сводка', icon: 'ri-bar-chart-line', path: '/analytics' }
    ],
    hr: [
      { id: 'hr/candidates', label: 'Кандидаты', icon: 'ri-user-search-line', path: '/hr/candidates' },
      { id: 'hr/ranking', label: 'ИИ-ранжирование', icon: 'ri-robot-line', path: '/hr/ranking' },
      { id: 'hr/interviews', label: 'Собеседования', icon: 'ri-calendar-check-line', path: '/hr/interviews' },
      { id: 'analytics', label: 'Аналитика', icon: 'ri-bar-chart-line', path: '/analytics' }
    ],
    admin: [
      { id: 'admin', label: 'Панель администратора', icon: 'ri-settings-3-line', path: '/admin' },
      { id: 'analytics', label: 'Общая аналитика', icon: 'ri-bar-chart-line', path: '/analytics' },
      { id: 'team', label: 'Все пользователи', icon: 'ri-team-line', path: '/team' }
    ]
  };

  const handleNavigation = (item: MenuItem) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'employee': return 'Сотрудник';
      case 'mentor': return 'Наставник';
      case 'manager': return 'Руководитель';
      case 'hr': return 'HR-специалист';
      case 'admin': return 'Администратор';
      default: return role;
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm overflow-y-auto flex-shrink-0">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="ri-robot-line text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '700' }}>
              HR-Автопилот
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems[userRole]?.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                  activeItem === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <i className={`${item.icon} text-lg ${
                  activeItem === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                }`}></i>
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-3 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer text-left"
            title="Мой профиль"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-user-line text-white text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser?.name || 'Пользователь'}
              </p>
              <p className="text-xs text-gray-500">
                {getRoleLabel(currentUser?.role || userRole)}
              </p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            title="Выйти"
          >
            <i className="ri-logout-box-line text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
