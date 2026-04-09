
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import type { Survey } from '../../context/AppContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, tasks, surveys, completeSurvey, users, submitTask, cancelTask } = useAppContext();
  const { showToast } = useToast();
  const [userRole, setUserRole] = useState<'employee' | 'manager'>('employee');
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>({});
  const [surveyDone, setSurveyDone] = useState(false);

  useEffect(() => {
    if (currentUser) setUserRole(currentUser.role as any);
  }, [currentUser]);

  const myTasks = tasks.filter(t => t.employeeId === currentUser?.id);
  const availableSurveys = surveys.filter(s => currentUser && !s.completedBy.includes(currentUser.id));

  const handleOpenSurvey = (survey: Survey) => {
    setActiveSurvey(survey);
    setSurveyAnswers({});
    setSurveyDone(false);
  };

  const handleSubmitSurvey = () => {
    if (activeSurvey) {
      completeSurvey(activeSurvey.id);
      setSurveyDone(true);
      setTimeout(() => {
        setActiveSurvey(null);
        setSurveyDone(false);
      }, 1500);
    }
  };

  // ── Employee Dashboard ────────────────────────────────────────────────────

  const renderEmployeeDashboard = () => (
    <>
      {/* Прогресс адаптации */}
      <div className="mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Прогресс адаптации</h2>
            <span className="text-sm text-gray-500">30 дней</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Выполнено задач</span>
              <span>{myTasks.filter(t => t.status === 'completed').length} из {myTasks.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: myTasks.length > 0 ? `${Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100)}%` : '0%' }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="ri-check-line text-green-600 text-xl"></i>
              </div>
              <p className="text-sm font-medium text-gray-900">Первая неделя</p>
              <p className="text-xs text-gray-500">Завершено</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="ri-time-line text-blue-600 text-xl"></i>
              </div>
              <p className="text-sm font-medium text-gray-900">Вторая неделя</p>
              <p className="text-xs text-gray-500">В процессе</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <i className="ri-lock-line text-gray-400 text-xl"></i>
              </div>
              <p className="text-sm font-medium text-gray-900">Третья неделя</p>
              <p className="text-xs text-gray-500">Заблокировано</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <button onClick={() => navigate('/tasks')} className="text-left cursor-pointer w-full">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-task-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{myTasks.filter(t => t.status === 'completed').length}</p>
                <p className="text-sm text-gray-500">Выполнено задач</p>
              </div>
            </div>
          </Card>
        </button>
        <button onClick={() => navigate('/learning')} className="text-left cursor-pointer w-full">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-book-open-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Курса пройдено</p>
              </div>
            </div>
          </Card>
        </button>
        <button onClick={() => navigate('/profile')} className="text-left cursor-pointer w-full">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-trophy-line text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500">Достижений</p>
              </div>
            </div>
          </Card>
        </button>
      </div>

      {/* Опросы от HR */}
      {availableSurveys.length > 0 && (
        <div className="mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">Доступные опросы</h3>
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {availableSurveys.length}
                </span>
              </div>
              <p className="text-sm text-gray-500">Пройдите опросы от HR-команды</p>
            </div>
            <div className="space-y-3">
              {availableSurveys.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{s.title}</h4>
                    {s.description && <p className="text-sm text-gray-600 mt-1">{s.description}</p>}
                    <p className="text-xs text-gray-500 mt-1">{s.questions.length} вопрос(а)</p>
                  </div>
                  <Button size="sm" onClick={() => handleOpenSurvey(s)}>
                    Пройти
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Задачи и обучение */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Текущие задачи</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>Все задачи</Button>
          </div>
          <div className="space-y-3">
            {myTasks.slice(0, 4).map(t => {
              const isDone = t.status === 'completed' || t.status === 'pending';
              return (
                <div key={t.id} className={`flex items-center p-3 rounded-lg group ${isDone ? 'bg-green-50' : 'bg-gray-50'}`}>
                  {isDone ? (
                    <button
                      onClick={() => {
                        if (t.status === 'pending') {
                          cancelTask(t.id);
                          showToast(`«${t.title}» возвращена в работу`, 'info');
                        }
                      }}
                      className={`w-4 h-4 bg-green-600 rounded mr-3 flex items-center justify-center flex-shrink-0 ${t.status === 'pending' ? 'hover:bg-gray-400 cursor-pointer' : 'cursor-default'} transition-colors`}
                      title={t.status === 'pending' ? 'Отменить отправку' : undefined}
                    >
                      <i className="ri-check-line text-white text-xs"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        submitTask(t.id, 100, '');
                        showToast(
                          t.requiresApproval ? `«${t.title}» отправлена на проверку` : `«${t.title}» выполнена! +${t.coins} SC`,
                          t.requiresApproval ? 'info' : 'success'
                        );
                      }}
                      className="w-4 h-4 border-2 border-blue-600 rounded mr-3 flex-shrink-0 hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center"
                      title={t.requiresApproval ? 'Отправить на проверку' : 'Отметить выполненной'}
                    >
                      <i className="ri-check-line text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{t.title}</p>
                    <p className="text-xs text-gray-400">
                      {t.status === 'pending' ? 'На проверке' : t.status === 'completed' ? 'Выполнено' : `До ${new Date(t.dueDate).toLocaleDateString('ru-RU')}`}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${isDone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    +{t.coins} SC
                  </span>
                </div>
              );
            })}
            {myTasks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Нет задач</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Рекомендуемое обучение</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>Все курсы</Button>
          </div>
          <div className="space-y-4">
            <button onClick={() => navigate('/learning')} className="w-full text-left cursor-pointer">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src="https://readdy.ai/api/search-image?query=modern%20office%20training%20course%20illustration%20with%20professional%20business%20people%20learning%20in%20bright%20corporate%20environment%2C%20clean%20minimalist%20background%2C%20professional%20lighting&width=60&height=60&seq=course1&orientation=squarish"
                    alt="Курс"
                    className="w-12 h-12 rounded-lg object-cover object-top"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">Основы работы в команде</h4>
                    <p className="text-xs text-gray-500 mt-1">2 часа • Базовый уровень</p>
                    <div className="flex items-center mt-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">30%</span>
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">+100 SC</span>
                </div>
              </div>
            </button>
            <button onClick={() => navigate('/learning')} className="w-full text-left cursor-pointer">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src="https://readdy.ai/api/search-image?query=corporate%20communication%20skills%20training%20illustration%20with%20business%20professionals%20in%20modern%20office%20setting%2C%20clean%20professional%20background%2C%20bright%20lighting&width=60&height=60&seq=course2&orientation=squarish"
                    alt="Курс"
                    className="w-12 h-12 rounded-lg object-cover object-top"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">Эффективная коммуникация</h4>
                    <p className="text-xs text-gray-500 mt-1">1.5 часа • Средний уровень</p>
                    <div className="flex items-center mt-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Не начат</span>
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">+75 SC</span>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Достижения */}
      <div className="mt-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Последние достижения</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>Все достижения</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Первый день', sub: 'Добро пожаловать!', color: 'from-yellow-50 to-yellow-100', bg: 'bg-yellow-500', icon: 'ri-star-line' },
              { title: 'Знакомство', sub: 'Профиль заполнен', color: 'from-blue-50 to-blue-100', bg: 'bg-blue-500', icon: 'ri-user-line' },
              { title: 'Ученик', sub: 'Первый курс пройден', color: 'from-green-50 to-green-100', bg: 'bg-green-500', icon: 'ri-book-line' },
              { title: 'Командный игрок', sub: 'Участие в проекте', color: 'from-purple-50 to-purple-100', bg: 'bg-purple-500', icon: 'ri-team-line' }
            ].map((a, i) => (
              <button key={i} onClick={() => navigate('/profile')} className="cursor-pointer text-left w-full">
                <div className={`text-center p-4 bg-gradient-to-br ${a.color} rounded-lg`}>
                  <div className={`w-12 h-12 ${a.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <i className={`${a.icon} text-white text-xl`}></i>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );

  // ── Manager Dashboard ──────────────────────────────────────────────────────

  const renderManagerDashboard = () => {
    const employees = users.filter(u => u.role === 'employee' || u.role === 'mentor');
    const topEmployees = [...employees].sort((a, b) => b.skillCoins - a.skillCoins).slice(0, 3);

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-team-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-sm text-gray-500">Всего сотрудников</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-add-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500">На адаптации</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-task-line text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-500">Выполнение задач</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-bar-chart-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-sm text-gray-500">Общая эффективность</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Топ сотрудники месяца</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/team')}>Все сотрудники</Button>
            </div>
            <div className="space-y-4">
              {topEmployees.map((emp, index) => (
                <button key={emp.id} onClick={() => navigate('/team')} className="w-full cursor-pointer text-left">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{emp.skillCoins} SC</p>
                  </div>
                </div>
                </button>
              ))}
              {topEmployees.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Активность команды</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Выполнено задач сегодня</span>
                <span className="text-lg font-semibold text-gray-900">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Активных сотрудников</span>
                <span className="text-lg font-semibold text-gray-900">{users.filter(u => u.status === 'active').length}/{users.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Средний прогресс адаптации</span>
                <span className="text-lg font-semibold text-gray-900">74%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Выдано SkillCoins (всего)</span>
                <span className="text-lg font-semibold text-gray-900">{users.reduce((s, u) => s + u.skillCoins, 0).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Показатели по отделам</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'IT отдел', employees: 8, efficiency: 94, avgCoins: 1420 },
              { name: 'Маркетинг', employees: 6, efficiency: 87, avgCoins: 1180 },
              { name: 'Продажи', employees: 10, efficiency: 91, avgCoins: 1350 }
            ].map((dept, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">{dept.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Сотрудников:</span>
                    <span className="font-medium">{dept.employees}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Эффективность:</span>
                    <span className="font-medium">{dept.efficiency}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Средние SC:</span>
                    <span className="font-medium">{dept.avgCoins}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole={userRole} />

      <div className="flex-1 overflow-y-auto">
        <Header
          title={userRole === 'manager' ? 'Дашборд руководителя' : 'Дашборд'}
          hideCoins={userRole === 'manager'}
        />

        <main className="p-6">
          {userRole === 'manager' ? renderManagerDashboard() : renderEmployeeDashboard()}
        </main>
      </div>

      {/* Модалка опроса */}
      {activeSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {surveyDone ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-check-line text-green-600 text-3xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Спасибо!</h3>
                  <p className="text-gray-600">Ваши ответы отправлены HR-команде.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{activeSurvey.title}</h2>
                    <button onClick={() => setActiveSurvey(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                  {activeSurvey.description && (
                    <p className="text-gray-600 mb-6">{activeSurvey.description}</p>
                  )}
                  <div className="space-y-6">
                    {activeSurvey.questions.map((q, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{i + 1}. {q}</label>
                        <textarea
                          value={surveyAnswers[String(i)] || ''}
                          onChange={(e) => setSurveyAnswers(prev => ({ ...prev, [String(i)]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                          placeholder="Ваш ответ..."
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button variant="secondary" onClick={() => setActiveSurvey(null)} className="flex-1">Отмена</Button>
                    <Button onClick={handleSubmitSurvey} className="flex-1">Отправить ответы</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
