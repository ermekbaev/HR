
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, getCurrentUserData, tasks, logout } = useAppContext();
  const userData = getCurrentUserData();

  if (!currentUser || !userData) {
    navigate('/login');
    return null;
  }

  const myTasks = tasks.filter(t => t.employeeId === currentUser.id);
  const completedTasks = myTasks.filter(t => t.status === 'completed');
  const totalEarned = completedTasks.reduce((s, t) => s + t.coins, 0);

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'mentor': return 'bg-green-100 text-green-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const achievements = [
    ...(completedTasks.length >= 1 ? [{ icon: 'ri-star-line', label: 'Первый шаг', color: 'text-yellow-500', bg: 'bg-yellow-100' }] : []),
    ...(completedTasks.length >= 3 ? [{ icon: 'ri-trophy-line', label: 'Три победы', color: 'text-orange-500', bg: 'bg-orange-100' }] : []),
    ...(userData.skillCoins >= 100 ? [{ icon: 'ri-coin-line', label: 'Богач', color: 'text-yellow-600', bg: 'bg-yellow-50' }] : []),
    ...(userData.skillCoins >= 1000 ? [{ icon: 'ri-vip-crown-line', label: 'SkillCoins Pro', color: 'text-purple-600', bg: 'bg-purple-100' }] : []),
    ...(myTasks.length > 0 ? [{ icon: 'ri-focus-3-line', label: 'Активный участник', color: 'text-blue-600', bg: 'bg-blue-100' }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole={currentUser.role as any} />

      <div className="flex-1 overflow-y-auto">
        <Header title="Мой профиль" />

        <main className="p-6 max-w-4xl mx-auto">
          {/* Шапка профиля */}
          <Card className="mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <i className="ri-user-line text-white text-3xl"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleColor(userData.role)}`}>
                    {getRoleLabel(userData.role)}
                  </span>
                </div>
                <p className="text-gray-500 mb-1">{userData.position}</p>
                <p className="text-sm text-gray-400">{userData.department}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="ri-mail-line mr-1"></i>
                    {userData.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="ri-login-circle-line mr-1"></i>
                    @{userData.username}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-300 text-red-700 hover:bg-red-50 flex-shrink-0">
                <i className="ri-logout-box-line mr-1"></i>Выйти
              </Button>
            </div>
          </Card>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <i className="ri-coin-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{userData.skillCoins.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">SkillCoins</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <i className="ri-check-double-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                  <p className="text-sm text-gray-500">Задач выполнено</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i className="ri-award-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{totalEarned}</p>
                  <p className="text-sm text-gray-500">SC заработано</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Информация */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Логин</span>
                  <span className="text-sm font-medium text-gray-900">@{userData.username}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">{userData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Отдел</span>
                  <span className="text-sm font-medium text-gray-900">{userData.department}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Должность</span>
                  <span className="text-sm font-medium text-gray-900">{userData.position}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Статус</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {userData.status === 'active' ? 'Активен' : 'Неактивен'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">В системе с</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(userData.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </Card>

            {/* Достижения */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Достижения</h3>
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <i className="ri-medal-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-sm text-gray-400">Выполняйте задачи, чтобы получить достижения</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((a, i) => (
                    <div key={i} className={`flex items-center space-x-3 p-3 rounded-xl ${a.bg}`}>
                      <i className={`${a.icon} ${a.color} text-xl`}></i>
                      <span className="text-sm font-medium text-gray-800">{a.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {myTasks.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Прогресс задач</span>
                    <span>{completedTasks.length}/{myTasks.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.round((completedTasks.length / myTasks.length) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round((completedTasks.length / myTasks.length) * 100)}% завершено
                  </p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
