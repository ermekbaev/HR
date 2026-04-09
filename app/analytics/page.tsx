
import { useState, useEffect } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function Analytics() {
  const { currentUser, surveys, createSurvey } = useAppContext();
  const { showToast } = useToast();
  const [userRole, setUserRole] = useState<'employee' | 'manager' | 'hr' | 'admin'>('hr');
  const [activeTab, setActiveTab] = useState('overview');
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [surveyCreated, setSurveyCreated] = useState(false);
  const [surveyForm, setSurveyForm] = useState({
    title: '', description: '', type: 'satisfaction',
    targetAudience: 'all', questions: [''], frequency: 'once'
  });

  useEffect(() => {
    if (currentUser) setUserRole(currentUser.role as any);
  }, [currentUser]);

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: 'ri-dashboard-line' },
    { id: 'engagement', label: 'Вовлечённость', icon: 'ri-heart-pulse-line' },
    { id: 'retention', label: 'Удержание', icon: 'ri-user-heart-line' },
    { id: 'onboarding', label: 'Адаптация', icon: 'ri-user-add-line' }
  ];

  const surveyTypes = [
    { value: 'satisfaction', label: 'Удовлетворённость работой' },
    { value: 'worklife', label: 'Баланс работы и жизни' },
    { value: 'team', label: 'Отношения в команде' },
    { value: 'leadership', label: 'Качество руководства' },
    { value: 'development', label: 'Развитие и обучение' },
    { value: 'custom', label: 'Пользовательский опрос' }
  ];

  const targetAudiences = [
    { value: 'all', label: 'Все сотрудники' },
    { value: 'new', label: 'Новые сотрудники (до 6 месяцев)' },
    { value: 'department', label: 'Конкретный отдел' },
    { value: 'role', label: 'Определённая роль' }
  ];

  const frequencies = [
    { value: 'once', label: 'Однократно' },
    { value: 'weekly', label: 'Еженедельно' },
    { value: 'monthly', label: 'Ежемесячно' },
    { value: 'quarterly', label: 'Ежеквартально' }
  ];

  const handleSurveyFormChange = (field: string, value: string) => {
    setSurveyForm(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const q = [...surveyForm.questions];
    q[index] = value;
    setSurveyForm(prev => ({ ...prev, questions: q }));
  };

  const addQuestion = () => setSurveyForm(prev => ({ ...prev, questions: [...prev.questions, ''] }));

  const removeQuestion = (index: number) => {
    if (surveyForm.questions.length > 1) {
      setSurveyForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmitSurvey = () => {
    createSurvey({
      title: surveyForm.title,
      description: surveyForm.description,
      type: surveyForm.type,
      targetAudience: surveyForm.targetAudience,
      questions: surveyForm.questions.filter(q => q.trim()),
      frequency: surveyForm.frequency,
      createdBy: currentUser?.id || 'hr'
    });
    showToast(`Опрос «${surveyForm.title}» создан и отправлен сотрудникам`, 'success');
    setSurveyCreated(true);
    setTimeout(() => {
      setShowSurveyModal(false);
      setSurveyCreated(false);
      setSurveyForm({ title: '', description: '', type: 'satisfaction', targetAudience: 'all', questions: [''], frequency: 'once' });
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole={userRole} />

      <div className="flex-1 overflow-y-auto">
        <Header title="Аналитика и прогнозы" hideCoins />

        <main className="p-6">
          {/* Вкладки */}
          <div className="mb-8">
            <Card padding="sm">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <i className={`${tab.icon} text-lg`}></i>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">587</p>
                      <p className="text-sm text-gray-500">Всего сотрудников</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-line text-blue-600 text-xl"></i>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-600 text-sm font-medium">+12</span>
                    <span className="text-gray-500 text-sm ml-1">за месяц</span>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">23%</p>
                      <p className="text-sm text-gray-500">Текучесть кадров</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="ri-arrow-down-line text-red-600 text-xl"></i>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-600 text-sm font-medium">-12%</span>
                    <span className="text-gray-500 text-sm ml-1">к прошлому году</span>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">78%</p>
                      <p className="text-sm text-gray-500">Индекс вовлечённости</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-heart-pulse-line text-green-600 text-xl"></i>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-600 text-sm font-medium">+8%</span>
                    <span className="text-gray-500 text-sm ml-1">за квартал</span>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">14 дней</p>
                      <p className="text-sm text-gray-500">Время адаптации</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-time-line text-purple-600 text-xl"></i>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-green-600 text-sm font-medium">-16 дней</span>
                    <span className="text-gray-500 text-sm ml-1">улучшение</span>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Динамика текучести</h3>
                    <Button variant="ghost" size="sm"><i className="ri-download-line mr-2"></i>Экспорт</Button>
                  </div>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <i className="ri-bar-chart-line text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-500">График динамики текучести по месяцам</p>
                      <p className="text-sm text-gray-400 mt-1">Показывает снижение с 35% до 23%</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Вовлечённость по отделам</h3>
                    <Button variant="ghost" size="sm"><i className="ri-download-line mr-2"></i>Экспорт</Button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'IT-отдел', value: 85, color: 'bg-green-500' },
                      { name: 'Маркетинг', value: 78, color: 'bg-blue-500' },
                      { name: 'Продажи', value: 72, color: 'bg-yellow-500' },
                      { name: 'Поддержка', value: 68, color: 'bg-orange-500' }
                    ].map(dept => (
                      <div key={dept.name}>
                        <div className="flex justify-between text-sm mb-1"><span>{dept.name}</span><span>{dept.value}%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${dept.color} h-2 rounded-full`} style={{ width: `${dept.value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-robot-line text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">AI-прогнозы рисков</h3>
                      <p className="text-sm text-gray-500">Анализ вероятности увольнения сотрудников</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Настроить модель</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-red-900">Высокий риск</h4>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">12 человек</span>
                    </div>
                    <p className="text-sm text-red-700 mb-3">Вероятность увольнения &gt; 70%</p>
                    <div className="space-y-1">
                      <div className="text-xs text-red-600">• Низкая вовлечённость</div>
                      <div className="text-xs text-red-600">• Пропуски мероприятий</div>
                      <div className="text-xs text-red-600">• Снижение активности</div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-yellow-900">Средний риск</h4>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">28 человек</span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">Вероятность увольнения 30-70%</p>
                    <div className="space-y-1">
                      <div className="text-xs text-yellow-600">• Нестабильная активность</div>
                      <div className="text-xs text-yellow-600">• Редкая обратная связь</div>
                      <div className="text-xs text-yellow-600">• Средние показатели</div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-green-900">Низкий риск</h4>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">547 человек</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">Вероятность увольнения &lt; 30%</p>
                    <div className="space-y-1">
                      <div className="text-xs text-green-600">• Высокая вовлечённость</div>
                      <div className="text-xs text-green-600">• Активное участие</div>
                      <div className="text-xs text-green-600">• Положительная динамика</div>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'engagement' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Пульс-опросы</h3>
                  <span className="text-sm text-gray-500">{surveys.length} создано</span>
                </div>

                {/* Existing surveys */}
                <div className="space-y-3 mb-4">
                  {surveys.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">Опросы ещё не созданы</div>
                  ) : (
                    surveys.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{s.title}</h4>
                          <p className="text-sm text-gray-500">{s.questions.length} вопрос(а) • {s.completedBy.length} ответ(а)</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Активен</span>
                      </div>
                    ))
                  )}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Удовлетворённость работой</h4>
                      <p className="text-sm text-gray-500">Последний опрос: 2 дня назад</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">8.2</p>
                      <p className="text-xs text-gray-500">из 10</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Баланс работы и жизни</h4>
                      <p className="text-sm text-gray-500">Последний опрос: неделю назад</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">7.5</p>
                      <p className="text-xs text-gray-500">из 10</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline" onClick={() => setShowSurveyModal(true)}>
                  Создать новый опрос
                </Button>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Активность в системе</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Ежедневная активность', value: 89, color: 'bg-blue-600' },
                    { label: 'Участие в обучении', value: 76, color: 'bg-green-600' },
                    { label: 'Использование наград', value: 64, color: 'bg-yellow-600' },
                    { label: 'Обратная связь', value: 52, color: 'bg-orange-600' }
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2"><span>{item.label}</span><span>{item.value}%</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Модалка создания опроса */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {surveyCreated ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-check-line text-green-600 text-3xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Опрос создан!</h3>
                  <p className="text-gray-600">Опрос отправлен сотрудникам и доступен для прохождения.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Создать новый опрос</h2>
                    <button onClick={() => setShowSurveyModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Название опроса</label>
                      <input type="text" value={surveyForm.title} onChange={(e) => handleSurveyFormChange('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Введите название опроса" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                      <textarea value={surveyForm.description} onChange={(e) => handleSurveyFormChange('description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2} placeholder="Краткое описание цели опроса" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Тип опроса</label>
                      <select value={surveyForm.type} onChange={(e) => handleSurveyFormChange('type', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {surveyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Целевая аудитория</label>
                      <select value={surveyForm.targetAudience} onChange={(e) => handleSurveyFormChange('targetAudience', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {targetAudiences.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Частота проведения</label>
                      <select value={surveyForm.frequency} onChange={(e) => handleSurveyFormChange('frequency', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {frequencies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Вопросы опроса</label>
                      <div className="space-y-3">
                        {surveyForm.questions.map((q, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <input type="text" value={q} onChange={(e) => handleQuestionChange(i, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={`Вопрос ${i + 1}`} />
                            {surveyForm.questions.length > 1 && (
                              <button onClick={() => removeQuestion(i)} className="text-red-500 hover:text-red-700 cursor-pointer"><i className="ri-delete-bin-line"></i></button>
                            )}
                          </div>
                        ))}
                        <button onClick={addQuestion} className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
                          <i className="ri-add-line mr-1"></i>Добавить вопрос
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <Button variant="ghost" onClick={() => setShowSurveyModal(false)}>Отмена</Button>
                    <Button onClick={handleSubmitSurvey} disabled={!surveyForm.title || surveyForm.questions.some(q => !q.trim())}>
                      Создать опрос
                    </Button>
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
