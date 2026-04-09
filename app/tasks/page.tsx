
import { useState, useEffect } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';

export default function Tasks() {
  const { currentUser, tasks, submitTask, clearTaskFeedback } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskNotes, setTaskNotes] = useState('');

  // Clear "tasks updated" badge on mount
  useEffect(() => {
    clearTaskFeedback();
  }, []);

  // Only tasks belonging to current employee
  const myTasks = tasks.filter(t => t.employeeId === currentUser?.id);

  const filters = [
    { id: 'all', label: 'Все задачи', count: myTasks.length },
    { id: 'active', label: 'Активные', count: myTasks.filter(t => t.status === 'active').length },
    { id: 'completed', label: 'Выполненные', count: myTasks.filter(t => t.status === 'completed').length },
    { id: 'pending', label: 'На проверке', count: myTasks.filter(t => t.status === 'pending').length },
    { id: 'rejected', label: 'Отклонённые', count: myTasks.filter(t => t.status === 'rejected').length },
    { id: 'overdue', label: 'Просроченные', count: myTasks.filter(t => t.status === 'overdue').length }
  ];

  const filteredTasks = activeFilter === 'all'
    ? myTasks
    : myTasks.filter(task => task.status === activeFilter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Обычный';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнено';
      case 'pending': return 'На проверке';
      case 'active': return 'Активная';
      case 'rejected': return 'Отклонено';
      default: return 'Неизвестно';
    }
  };

  const handleTaskClick = (task: any) => {
    if (task.status === 'active' || task.status === 'rejected') {
      setSelectedTask(task);
      setTaskProgress(task.status === 'rejected' ? 0 : task.progress);
      setTaskNotes('');
      setShowTaskModal(true);
    }
  };

  const handleSubmitTask = () => {
    if (selectedTask) {
      submitTask(selectedTask.id, taskProgress, taskNotes);
      setShowTaskModal(false);
      setSelectedTask(null);
      setTaskProgress(0);
      setTaskNotes('');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole="employee" />

      <div className="flex-1 overflow-y-auto">
        <Header title="Задачи" />

        <main className="p-6">
          {/* Фильтры */}
          <div className="mb-6">
            <Card>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      activeFilter === filter.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-medium">{filter.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeFilter === filter.id ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-task-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{myTasks.length}</p>
                  <p className="text-sm text-gray-500">Всего задач</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{myTasks.filter(t => t.status === 'completed').length}</p>
                  <p className="text-sm text-gray-500">Выполнено</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ri-hourglass-line text-orange-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{myTasks.filter(t => t.status === 'pending').length}</p>
                  <p className="text-sm text-gray-500">На проверке</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{myTasks.filter(t => t.status === 'active').length}</p>
                  <p className="text-sm text-gray-500">В процессе</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-coin-line text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{myTasks.filter(t => t.status === 'active').reduce((s, t) => s + t.coins, 0)}</p>
                  <p className="text-sm text-gray-500">Доступно SC</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Список задач */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center cursor-pointer ${
                    task.status === 'completed'
                      ? 'border-green-500 bg-green-500'
                      : task.status === 'pending'
                      ? 'border-orange-500 bg-orange-500'
                      : task.status === 'rejected'
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}>
                    {task.status === 'completed' && <i className="ri-check-line text-white text-sm"></i>}
                    {task.status === 'pending' && <i className="ri-hourglass-line text-white text-sm"></i>}
                    {task.status === 'rejected' && <i className="ri-close-line text-white text-sm"></i>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>

                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <i className="ri-user-line mr-1"></i>
                          <span>Наставник: {task.mentor}</span>
                          {task.requiresApproval && (
                            <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Требует подтверждения
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {task.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                    </div>

                    {/* На проверке */}
                    {task.status === 'pending' && task.submittedAt && (
                      <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-orange-800">Отправлено на проверку</span>
                          <span className="text-xs text-orange-600">
                            {new Date(task.submittedAt).toLocaleDateString('ru-RU')} в {new Date(task.submittedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {task.submissionNotes && (
                          <p className="text-sm text-orange-700"><strong>Комментарий:</strong> {task.submissionNotes}</p>
                        )}
                      </div>
                    )}

                    {/* Отклонено */}
                    {task.status === 'rejected' && task.rejectionFeedback && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-red-800">Задача отклонена наставником</span>
                          {task.rejectedAt && (
                            <span className="text-xs text-red-600">
                              {new Date(task.rejectedAt).toLocaleDateString('ru-RU')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-red-700"><strong>Причина:</strong> {task.rejectionFeedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="ri-calendar-line mr-1"></i>
                          {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                        </div>
                        {task.progress > 0 && task.status !== 'completed' && task.status !== 'rejected' && (
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${task.status === 'pending' ? 'bg-orange-500' : 'bg-blue-600'}`}
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{task.progress}%</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800'
                          : task.status === 'pending' ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status === 'completed' ? 'Получено' : task.status === 'pending' ? 'Ожидает' : `+${task.coins}`} SC
                        </span>

                        {task.status === 'active' && (
                          <Button size="sm" onClick={() => handleTaskClick(task)}>Выполнить</Button>
                        )}
                        {task.status === 'rejected' && (
                          <Button size="sm" onClick={() => handleTaskClick(task)} className="bg-red-600 hover:bg-red-700">Переделать</Button>
                        )}
                        {task.status === 'pending' && (
                          <span className="text-sm text-orange-600 font-medium">Ожидает проверки</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredTasks.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <i className="ri-inbox-line text-gray-400 text-4xl mb-4"></i>
                  <p className="text-gray-500">Нет задач в этой категории</p>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Модальное окно выполнения задачи */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTask.status === 'rejected' ? 'Доработка задачи' : 'Выполнение задачи'}
              </h3>
              <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedTask.description}</p>

              <div className="flex items-center space-x-2 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedTask.priority)}`}>
                  {getPriorityLabel(selectedTask.priority)}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{selectedTask.category}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">+{selectedTask.coins} SC</span>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-4">
                <i className="ri-user-line text-gray-600 mr-2"></i>
                <div>
                  <p className="text-sm font-medium text-gray-900">Наставник: {selectedTask.mentor}</p>
                  {selectedTask.requiresApproval && (
                    <p className="text-xs text-gray-600">Задача требует подтверждения наставника</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Прогресс выполнения: {taskProgress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={taskProgress}
                onChange={(e) => setTaskProgress(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Комментарий {taskProgress === 100 && selectedTask.requiresApproval ? '(обязательно)' : '(необязательно)'}
              </label>
              <textarea
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder={taskProgress === 100 && selectedTask.requiresApproval
                  ? 'Опишите как была выполнена задача для наставника...'
                  : 'Добавьте комментарий о выполнении задачи...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{taskNotes.length}/500</p>
            </div>

            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setShowTaskModal(false)} className="flex-1">Отмена</Button>
              <Button
                onClick={handleSubmitTask}
                className="flex-1"
                disabled={taskProgress === 100 && selectedTask.requiresApproval && !taskNotes.trim()}
              >
                {taskProgress === 100
                  ? selectedTask.requiresApproval ? 'Отправить на проверку' : 'Завершить задачу'
                  : 'Сохранить прогресс'}
              </Button>
            </div>

            {taskProgress === 100 && (
              <div className={`mt-4 p-3 border rounded-lg ${selectedTask.requiresApproval ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center">
                  <i className={`mr-2 ${selectedTask.requiresApproval ? 'ri-hourglass-line text-orange-600' : 'ri-coin-line text-green-600'}`}></i>
                  <span className={`text-sm ${selectedTask.requiresApproval ? 'text-orange-800' : 'text-green-800'}`}>
                    {selectedTask.requiresApproval
                      ? `Задача будет отправлена на проверку наставнику ${selectedTask.mentor}`
                      : `Вы получите +${selectedTask.coins} SkillCoins за выполнение этой задачи!`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
