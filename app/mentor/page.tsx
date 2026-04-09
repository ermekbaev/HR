
import { useState } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function MentorDashboard() {
  const { tasks, approveTask, rejectTask } = useAppContext();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.requiresApproval);

  // Employees derived from tasks (unique employees who have tasks)
  const employeeMap = new Map<string, any>();
  tasks.forEach(t => {
    if (!employeeMap.has(t.employeeId)) {
      employeeMap.set(t.employeeId, {
        id: t.employeeId,
        name: t.employeeName,
        tasks: 0, completed: 0
      });
    }
    const emp = employeeMap.get(t.employeeId);
    emp.tasks++;
    if (t.status === 'completed') emp.completed++;
  });
  const employees = Array.from(employeeMap.values());

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const openReviewModal = (task: any, action: 'approve' | 'reject') => {
    setSelectedTask(task);
    setReviewAction(action);
    setReviewFeedback('');
    setShowReviewModal(true);
  };

  const submitReview = () => {
    if (!selectedTask) return;
    if (reviewAction === 'approve') {
      approveTask(selectedTask.id, reviewFeedback);
      showToast(`Задача «${selectedTask.title}» одобрена`, 'success');
    } else {
      rejectTask(selectedTask.id, reviewFeedback);
      showToast(`Задача «${selectedTask.title}» отклонена`, 'error');
    }
    setShowReviewModal(false);
    setSelectedTask(null);
    setReviewFeedback('');
  };

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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole="mentor" />

      <div className="flex-1 overflow-y-auto">
        <Header title="Панель наставника" />

        <main className="p-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ri-hourglass-line text-orange-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
                  <p className="text-sm text-gray-500">На проверке</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                  <p className="text-sm text-gray-500">Одобрено</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-team-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                  <p className="text-sm text-gray-500">Подопечных</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-coin-line text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {completedTasks.reduce((s, t) => s + t.coins, 0)}
                  </p>
                  <p className="text-sm text-gray-500">SC одобрено</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Вкладки */}
          <div className="mb-6">
            <Card>
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${activeTab === 'pending' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  На проверке ({pendingTasks.length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${activeTab === 'completed' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Одобренные ({completedTasks.length})
                </button>
                <button
                  onClick={() => setActiveTab('employees')}
                  className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${activeTab === 'employees' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Мои подопечные
                </button>
              </div>
            </Card>
          </div>

          {/* Задачи на проверке */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <Card key={task.id}>
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 bg-orange-500 mt-1 flex items-center justify-center">
                      <i className="ri-hourglass-line text-white text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <i className="ri-user-line mr-1"></i>
                              <span>Сотрудник: {task.employeeName}</span>
                            </div>
                            {task.submittedAt && (
                              <div className="flex items-center text-sm text-gray-500">
                                <i className="ri-time-line mr-1"></i>
                                <span>Отправлено: {new Date(task.submittedAt).toLocaleDateString('ru-RU')} в {new Date(task.submittedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{task.category}</span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">+{task.coins} SC</span>
                        </div>
                      </div>

                      {task.submissionNotes && (
                        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Комментарий сотрудника:</h4>
                          <p className="text-sm text-gray-700">{task.submissionNotes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="ri-calendar-line mr-1"></i>
                          Срок: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReviewModal(task, 'reject')}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <i className="ri-close-line mr-1"></i>Отклонить
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openReviewModal(task, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <i className="ri-check-line mr-1"></i>Одобрить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {pendingTasks.length === 0 && (
                <Card>
                  <div className="text-center py-12">
                    <i className="ri-inbox-line text-gray-400 text-4xl mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет задач на проверке</h3>
                    <p className="text-gray-500">Все задачи проверены или пока не поступили новые</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Одобренные */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <Card key={task.id}>
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 mt-1 flex items-center justify-center">
                      <i className="ri-check-line text-white text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <i className="ri-user-line mr-1"></i>
                              <span>Сотрудник: {task.employeeName}</span>
                            </div>
                            {task.approvedAt && (
                              <div className="flex items-center text-sm text-gray-500">
                                <i className="ri-check-line mr-1"></i>
                                <span>Одобрено: {new Date(task.approvedAt).toLocaleDateString('ru-RU')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{task.category}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+{task.coins} SC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {completedTasks.length === 0 && (
                <Card>
                  <div className="text-center py-12">
                    <i className="ri-inbox-line text-gray-400 text-4xl mb-4"></i>
                    <p className="text-gray-500">Нет одобренных задач</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Подопечные */}
          {activeTab === 'employees' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {employees.map((emp, index) => (
                <Card key={emp.id}>
                  <div className="flex items-start space-x-4">
                    <img
                      src={`https://readdy.ai/api/search-image?query=professional%20business%20person%20in%20modern%20office%20environment%2C%20clean%20corporate%20background%2C%20business%20portrait%20style&width=60&height=60&seq=employee${index}&orientation=squarish`}
                      alt={emp.name}
                      className="w-12 h-12 rounded-full object-cover object-top"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{emp.name}</h3>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Прогресс задач</span>
                          <span>{emp.completed}/{emp.tasks}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: emp.tasks > 0 ? `${Math.round((emp.completed / emp.tasks) * 100)}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">Задач: {emp.completed}/{emp.tasks}</div>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedEmployee(emp); setShowEmployeeModal(true); }}>
                          <i className="ri-eye-line mr-1"></i>Подробнее
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {employees.length === 0 && (
                <Card>
                  <div className="text-center py-12">
                    <p className="text-gray-500">Нет подопечных</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Модальное окно проверки */}
      {showReviewModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {reviewAction === 'approve' ? 'Одобрить задачу' : 'Отклонить задачу'}
              </h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h4>
              <p className="text-sm text-gray-600 mb-2">Сотрудник: {selectedTask.employeeName}</p>
              {selectedTask.submissionNotes && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{selectedTask.submissionNotes}</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {reviewAction === 'approve' ? 'Комментарий (необязательно)' : 'Причина отклонения (обязательно)'}
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                placeholder={reviewAction === 'approve' ? 'Отличная работа!...' : 'Укажите что нужно исправить...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{reviewFeedback.length}/500</p>
            </div>

            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setShowReviewModal(false)} className="flex-1">Отмена</Button>
              <Button
                onClick={submitReview}
                className={`flex-1 ${reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={reviewAction === 'reject' && !reviewFeedback.trim()}
              >
                {reviewAction === 'approve' ? 'Одобрить' : 'Отклонить'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подопечного */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h2>
              <button onClick={() => setShowEmployeeModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{selectedEmployee.completed}</div>
                  <div className="text-sm text-gray-500">Выполнено задач</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{selectedEmployee.tasks}</div>
                  <div className="text-sm text-gray-500">Всего задач</div>
                </div>
              </Card>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Последние задачи:</h3>
              {tasks.filter(t => t.employeeId === selectedEmployee.id).slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{t.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    t.status === 'completed' ? 'bg-green-100 text-green-800'
                    : t.status === 'pending' ? 'bg-orange-100 text-orange-800'
                    : t.status === 'rejected' ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                  }`}>
                    {t.status === 'completed' ? 'Выполнено' : t.status === 'pending' ? 'На проверке' : t.status === 'rejected' ? 'Отклонено' : 'Активная'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
