
import { useState } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';
import type { AppUser } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const { users, createUser, updateUser, deleteUser, toggleUserStatus, resetToDefaults } = useAppContext();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [newUser, setNewUser] = useState({
    username: '', name: '', email: '', role: 'employee' as AppUser['role'],
    department: '', position: '', password: ''
  });

  const handleCreateUser = () => {
    setEditingUser(null);
    setNewUser({ username: '', name: '', email: '', role: 'employee', department: '', position: '', password: '' });
    setShowUserModal(true);
  };

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setNewUser({ username: user.username, name: user.name, email: user.email, role: user.role, department: user.department, position: user.position, password: '' });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        position: newUser.position,
        ...(newUser.password ? { password: newUser.password } : {})
      });
      showToast(`Данные пользователя ${newUser.name} обновлены`, 'success');
    } else {
      createUser(newUser);
      showToast(`Пользователь ${newUser.name} создан`, 'success');
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleReset = () => {
    if (confirm('Сбросить все данные к начальным значениям? Это действие нельзя отменить.')) {
      resetToDefaults();
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      deleteUser(id);
    }
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'mentor': return 'bg-green-100 text-green-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'hr': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole="admin" />

      <div className="flex-1 overflow-y-auto">
        <Header title="Панель администратора" hideCoins={true} />

        <main className="p-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-sm text-gray-500">Всего пользователей</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-check-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
                  <p className="text-sm text-gray-500">Активных</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-shield-user-line text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'mentor').length}</p>
                  <p className="text-sm text-gray-500">Наставников</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-crown-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'manager').length}</p>
                  <p className="text-sm text-gray-500">Руководителей</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Вкладки */}
          <div className="mb-6">
            <Card>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Пользователи
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Настройки системы
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  {activeTab === 'users' && (
                    <Button onClick={handleCreateUser}>
                      <i className="ri-add-line mr-1"></i>Добавить пользователя
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <i className="ri-restart-line mr-1"></i>Сброс данных
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Список пользователей */}
          {activeTab === 'users' && (
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
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm text-gray-900">{user.department}</p>
                            <p className="text-xs text-gray-500">{user.position}</p>
                          </div>
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
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-800 cursor-pointer" title="Редактировать">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`cursor-pointer ${user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                              title={user.status === 'active' ? 'Заблокировать' : 'Активировать'}
                            >
                              <i className={user.status === 'active' ? 'ri-lock-line' : 'ri-lock-unlock-line'}></i>
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 cursor-pointer" title="Удалить">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Настройки */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Общие настройки</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Автоматическое одобрение задач</p>
                      <p className="text-sm text-gray-500">Задачи без флага «Требует подтверждения» одобряются автоматически</p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Уведомления наставникам</p>
                      <p className="text-sm text-gray-500">Отправлять уведомления о новых задачах на проверке</p>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </button>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Система SkillCoins</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Базовая награда за задачу</label>
                    <input type="number" defaultValue="25" className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <p className="text-xs text-gray-500 mt-1">SkillCoins</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Множитель за срочные задачи</label>
                    <input type="number" step="0.1" defaultValue="1.5" className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Модальное окно создания/редактирования */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Полное имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Логин</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser(p => ({ ...p, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={editingUser ? 'Оставьте пустым, чтобы не менять' : 'Пароль'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(p => ({ ...p, role: e.target.value as AppUser['role'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                >
                  <option value="employee">Сотрудник</option>
                  <option value="mentor">Наставник</option>
                  <option value="manager">Руководитель</option>
                  <option value="hr">HR-специалист</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Отдел</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser(p => ({ ...p, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="IT отдел"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                <input
                  type="text"
                  value={newUser.position}
                  onChange={(e) => setNewUser(p => ({ ...p, position: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Junior разработчик"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="secondary" onClick={() => setShowUserModal(false)} className="flex-1">Отмена</Button>
              <Button
                onClick={handleSaveUser}
                className="flex-1"
                disabled={!newUser.name || !newUser.username || !newUser.email || (!editingUser && !newUser.password)}
              >
                {editingUser ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
