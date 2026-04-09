
import { useState, useEffect } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function Team() {
  const { currentUser, users, awardSkillCoins } = useAppContext();
  const { showToast } = useToast();
  const [userRole, setUserRole] = useState<'employee' | 'mentor' | 'manager' | 'admin' | 'hr'>('employee');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardReason, setRewardReason] = useState('');
  const [rewardSuccess, setRewardSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) setUserRole(currentUser.role as any);
  }, [currentUser]);

  const handleRewardEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setRewardAmount('');
    setRewardReason('');
    setRewardSuccess(false);
    setShowRewardModal(true);
  };

  const submitReward = () => {
    if (selectedEmployee && rewardAmount && rewardReason) {
      awardSkillCoins(selectedEmployee.id, Number(rewardAmount));
      showToast(`${selectedEmployee.name} получил ${rewardAmount} SC`, 'success');
      setRewardSuccess(true);
      setTimeout(() => {
        setShowRewardModal(false);
        setSelectedEmployee(null);
        setRewardAmount('');
        setRewardReason('');
        setRewardSuccess(false);
      }, 1500);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'employee': return 'Сотрудник';
      case 'mentor': return 'Наставник';
      case 'manager': return 'Руководитель';
      case 'hr': return 'HR';
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

  // Employee view — static team
  const renderEmployeeTeam = () => (
    <>
      <div className="mb-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Моя команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Участников команды</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600">Активных проекта</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">89%</p>
              <p className="text-sm text-gray-600">Эффективность</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { name: 'Михаил Иванов', position: 'Ведущий разработчик', role: 'Наставник', coins: 2850, status: 'online' },
          { name: 'Анна Козлова', position: 'Маркетолог', role: 'Сотрудник', coins: 1620, status: 'online' },
          { name: 'Александр Петров', position: 'Дизайнер', role: 'Сотрудник', coins: 1480, status: 'away' },
          { name: 'Мария Сидорова', position: 'Аналитик', role: 'Сотрудник', coins: 1750, status: 'online' },
          { name: 'Дмитрий Козлов', position: 'QA инженер', role: 'Сотрудник', coins: 1320, status: 'offline' },
          { name: 'Елена Смирнова', position: 'HR-менеджер', role: 'Руководитель', coins: 0, status: 'online' }
        ].map((member, index) => (
          <Card key={index}>
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={`https://readdy.ai/api/search-image?query=professional%20business%20person%20in%20modern%20office%20environment%2C%20clean%20corporate%20background%2C%20business%20portrait%20style&width=60&height=60&seq=team${index}&orientation=squarish`}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.position}</p>
                <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                  member.role === 'Наставник' ? 'bg-green-100 text-green-800' :
                  member.role === 'Руководитель' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {member.role}
                </span>
                {member.coins > 0 && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <i className="ri-coin-line mr-1"></i>
                    <span>{member.coins} SC</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <i className="ri-message-line mr-1"></i>Написать
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <i className="ri-user-line mr-1"></i>Профиль
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  // Mentor view — static mentees
  const renderMentorTeam = () => (
    <>
      <div className="mb-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Мои подопечные</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-gray-600">Подопечных</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">74%</p>
              <p className="text-sm text-gray-600">Средний прогресс</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">12</p>
              <p className="text-sm text-gray-600">Задач на проверке</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">1,240</p>
              <p className="text-sm text-gray-600">SC одобрено</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { name: 'Эдуард Алтунбаев', position: 'Junior разработчик', progress: 67, tasks: 12, completed: 8, pending: 2, coins: 280 },
          { name: 'Анна Козлова', position: 'Маркетолог', progress: 85, tasks: 15, completed: 13, pending: 1, coins: 455 },
          { name: 'Александр Петров', position: 'Дизайнер', progress: 45, tasks: 10, completed: 4, pending: 3, coins: 140 },
          { name: 'Мария Сидорова', position: 'Аналитик', progress: 92, tasks: 18, completed: 16, pending: 0, coins: 560 },
          { name: 'Дмитрий Козлов', position: 'QA инженер', progress: 73, tasks: 14, completed: 10, pending: 1, coins: 350 }
        ].map((employee, index) => (
          <Card key={index}>
            <div className="flex items-start space-x-4">
              <img
                src={`https://readdy.ai/api/search-image?query=professional%20business%20person%20in%20modern%20office%20environment%2C%20clean%20corporate%20background%2C%20business%20portrait%20style&width=60&height=60&seq=mentee${index}&orientation=squarish`}
                alt={employee.name}
                className="w-12 h-12 rounded-full object-cover object-top"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Прогресс адаптации</span><span>{employee.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${employee.progress >= 80 ? 'bg-green-500' : employee.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${employee.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{employee.completed}/{employee.tasks}</p>
                    <p className="text-xs text-gray-500">Задач</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-orange-600">{employee.pending}</p>
                    <p className="text-xs text-gray-500">На проверке</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-600">{employee.coins}</p>
                    <p className="text-xs text-gray-500">SC заработано</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <i className="ri-eye-line mr-1"></i>Подробнее
                  </Button>
                  <Button size="sm" className="flex-1">
                    <i className="ri-message-line mr-1"></i>Связаться
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  // Manager view — employees from context with real skillCoins
  const renderManagerTeam = () => {
    const employees = users.filter(u => u.role === 'employee' || u.role === 'mentor');
    return (
      <>
        <div className="mb-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Все сотрудники</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Всего сотрудников</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'employee' && u.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Сотрудников</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.role === 'mentor').length}</p>
                <p className="text-sm text-gray-600">Наставников</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {users.length > 0 ? Math.round(users.reduce((s, u) => s + u.skillCoins, 0) / users.length) : 0}
                </p>
                <p className="text-sm text-gray-600">Средние SC</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {employees.map((employee, index) => (
            <Card key={employee.id}>
              <div className="flex items-start space-x-4">
                <img
                  src={`https://readdy.ai/api/search-image?query=professional%20business%20person%20in%20modern%20office%20environment%2C%20clean%20corporate%20background%2C%20business%20portrait%20style&width=60&height=60&seq=manager${index}&orientation=squarish`}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                  <p className="text-xs text-gray-500">{employee.department}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(employee.role)}`}>
                      {getRoleLabel(employee.role)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {employee.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-3 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">SkillCoins:</span>
                      <span className="text-sm font-semibold text-blue-600">{employee.skillCoins} SC</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleRewardEmployee(employee)}
                    >
                      <i className="ri-coin-line mr-1"></i>Наградить
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <i className="ri-eye-line mr-1"></i>Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  };

  // Admin view — all users from context
  const renderAdminTeam = () => (
    <>
      <div className="mb-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Все пользователи системы</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm text-gray-600">Всего пользователей</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-sm text-gray-600">Активных</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'mentor').length}</p>
              <p className="text-sm text-gray-600">Наставников</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.role === 'manager').length}</p>
              <p className="text-sm text-gray-600">Руководителей</p>
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Пользователь</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Роль</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Отдел</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Статус</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Последний вход</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{user.department}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ru-RU') : 'Никогда'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole={userRole} />

      <div className="flex-1 overflow-y-auto">
        <Header
          title={
            userRole === 'mentor' ? 'Мои подопечные' :
            userRole === 'manager' ? 'Все сотрудники' :
            userRole === 'admin' ? 'Все пользователи' : 'Команда'
          }
          hideCoins={userRole === 'manager' || userRole === 'admin'}
        />

        <main className="p-6">
          {userRole === 'mentor' ? renderMentorTeam() :
           userRole === 'manager' ? renderManagerTeam() :
           userRole === 'admin' ? renderAdminTeam() :
           renderEmployeeTeam()}
        </main>
      </div>

      {/* Модальное окно награждения */}
      {showRewardModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            {rewardSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Награда начислена!</h3>
                <p className="text-gray-600">
                  +{rewardAmount} SC → {selectedEmployee.name}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Наградить сотрудника</h3>
                  <button onClick={() => setShowRewardModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.position || selectedEmployee.role}</p>
                  <p className="text-sm text-blue-600 mt-1">Текущий баланс: {selectedEmployee.skillCoins} SC</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Количество SkillCoins</label>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    placeholder="Например: 100"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Причина награждения</label>
                  <textarea
                    value={rewardReason}
                    onChange={(e) => setRewardReason(e.target.value)}
                    placeholder="За отличную работу и перевыполнение плана..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button variant="secondary" onClick={() => setShowRewardModal(false)} className="flex-1">Отмена</Button>
                  <Button
                    onClick={submitReward}
                    className="flex-1"
                    disabled={!rewardAmount || !rewardReason}
                  >
                    <i className="ri-coin-line mr-2"></i>Начислить {rewardAmount ? `${rewardAmount} SC` : 'SC'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
