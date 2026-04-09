
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/feature/Sidebar';
import Header from '../../../components/feature/Header';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  type: 'phone' | 'video' | 'onsite';
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  interviews: Interview[];
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Александр Волков',
    position: 'Frontend-разработчик',
    date: '2024-01-22',
    time: '10:00',
    type: 'video',
    interviewer: 'Михаил Петров',
    status: 'scheduled'
  },
  {
    id: '2',
    candidateName: 'Мария Соколова',
    position: 'UX/UI Дизайнер',
    date: '2024-01-22',
    time: '14:00',
    type: 'onsite',
    interviewer: 'Анна Сидорова',
    status: 'scheduled'
  },
  {
    id: '3',
    candidateName: 'Игорь Новиков',
    position: 'DevOps Engineer',
    date: '2024-01-23',
    time: '11:00',
    type: 'video',
    interviewer: 'Дмитрий Козлов',
    status: 'scheduled'
  },
  {
    id: '4',
    candidateName: 'Дмитрий Козлов',
    position: 'Backend-разработчик',
    date: '2024-01-24',
    time: '15:00',
    type: 'phone',
    interviewer: 'Елена Смирнова',
    status: 'scheduled'
  },
  {
    id: '5',
    candidateName: 'Анна Петрова',
    position: 'Product Manager',
    date: '2024-01-19',
    time: '10:00',
    type: 'video',
    interviewer: 'Михаил Петров',
    status: 'completed',
    notes: 'Хороший кандидат, рекомендуется второй этап'
  }
];

const interviewers = [
  'Михаил Петров',
  'Анна Сидорова',
  'Дмитрий Козлов',
  'Елена Смирнова',
  'Ольга Кузнецова'
];

const candidates = [
  { name: 'Александр Волков', position: 'Frontend-разработчик' },
  { name: 'Мария Соколова', position: 'UX/UI Дизайнер' },
  { name: 'Дмитрий Козлов', position: 'Backend-разработчик' },
  { name: 'Игорь Новиков', position: 'DevOps Engineer' },
  { name: 'Анна Петрова', position: 'Product Manager' }
];

export default function HRInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 22)); // January 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    position: '',
    date: '',
    time: '10:00',
    type: 'video' as 'phone' | 'video' | 'onsite',
    interviewer: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'hr' && user.role !== 'admin') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Start from Monday
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const dayInterviews = interviews.filter(int => int.date === dateStr);
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        interviews: dayInterviews
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return 'ri-phone-line';
      case 'video': return 'ri-video-chat-line';
      case 'onsite': return 'ri-building-line';
      default: return 'ri-calendar-line';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'phone': return 'Телефон';
      case 'video': return 'Видео';
      case 'onsite': return 'Офис';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Запланировано';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (day.interviews.length === 0) {
      setNewInterview(prev => ({
        ...prev,
        date: day.date.toISOString().split('T')[0]
      }));
      setShowScheduleModal(true);
    }
  };

  const handleScheduleInterview = () => {
    if (!newInterview.candidateName || !newInterview.date || !newInterview.interviewer) return;
    
    const interview: Interview = {
      id: Date.now().toString(),
      ...newInterview,
      status: 'scheduled'
    };
    
    setInterviews([...interviews, interview]);
    setShowScheduleModal(false);
    setNewInterview({
      candidateName: '',
      position: '',
      date: '',
      time: '10:00',
      type: 'video',
      interviewer: ''
    });
  };

  const handleCandidateSelect = (name: string) => {
    const candidate = candidates.find(c => c.name === name);
    setNewInterview(prev => ({
      ...prev,
      candidateName: name,
      position: candidate?.position || ''
    }));
  };

  const upcomingInterviews = interviews
    .filter(int => int.status === 'scheduled')
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
    .slice(0, 5);

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    thisWeek: interviews.filter(i => {
      const intDate = new Date(i.date);
      const today = new Date(2024, 0, 22);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return intDate >= today && intDate <= weekEnd && i.status === 'scheduled';
    }).length
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole="hr" />

      <div className="flex-1 overflow-y-auto">
        <Header title="Собеседования" hideCoins />
        
        <main className="p-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-calendar-check-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Всего собеседований</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
                  <p className="text-sm text-gray-500">Запланировано</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-check-double-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-sm text-gray-500">Завершено</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-calendar-event-line text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                  <p className="text-sm text-gray-500">На этой неделе</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Календарь */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Календарь собеседований</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="ri-arrow-left-s-line text-xl"></i>
                    </button>
                    <span className="text-lg font-medium text-gray-900 min-w-[150px] text-center">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="ri-arrow-right-s-line text-xl"></i>
                    </button>
                  </div>
                </div>

                {/* Дни недели */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Дни месяца */}
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateClick(day)}
                      className={`min-h-[80px] p-2 rounded-lg border transition-colors cursor-pointer ${
                        day.isCurrentMonth
                          ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          : 'bg-gray-50 border-gray-100 text-gray-400'
                      } ${
                        selectedDate?.toDateString() === day.date.toDateString()
                          ? 'ring-2 ring-blue-500'
                          : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {day.interviews.slice(0, 2).map((int) => (
                          <div
                            key={int.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInterview(int);
                            }}
                            className={`text-xs px-1.5 py-0.5 rounded truncate ${
                              int.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {int.time} {int.candidateName.split(' ')[0]}
                          </div>
                        ))}
                        {day.interviews.length > 2 && (
                          <div className="text-xs text-gray-500 px-1.5">
                            +{day.interviews.length - 2} ещё
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Ближайшие собеседования */}
            <div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ближайшие</h3>
                  <Button size="sm" onClick={() => setShowScheduleModal(true)}>
                    <i className="ri-add-line mr-1"></i>
                    Назначить
                  </Button>
                </div>

                <div className="space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      onClick={() => setSelectedInterview(interview)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{interview.candidateName}</p>
                          <p className="text-xs text-gray-500">{interview.position}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          interview.type === 'video' ? 'bg-blue-100 text-blue-600' :
                          interview.type === 'phone' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          <i className={getTypeIcon(interview.type)}></i>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                        <span className="flex items-center">
                          <i className="ri-calendar-line mr-1"></i>
                          {new Date(interview.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {interview.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        <i className="ri-user-line mr-1"></i>
                        {interview.interviewer}
                      </p>
                    </div>
                  ))}

                  {upcomingInterviews.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <i className="ri-calendar-line text-4xl mb-2"></i>
                      <p className="text-sm">Нет запланированных собеседований</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно назначения собеседования */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Назначить собеседование</h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Кандидат</label>
                <select
                  value={newInterview.candidateName}
                  onChange={(e) => handleCandidateSelect(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
                >
                  <option value="">Выберите кандидата</option>
                  {candidates.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} — {c.position}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                  <input
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
                  <select
                    value={newInterview.time}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип собеседования</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'video', label: 'Видео', icon: 'ri-video-chat-line' },
                    { value: 'phone', label: 'Телефон', icon: 'ri-phone-line' },
                    { value: 'onsite', label: 'Офис', icon: 'ri-building-line' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewInterview(prev => ({ ...prev, type: type.value as any }))}
                      className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                        newInterview.type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <i className={`${type.icon} text-xl mb-1`}></i>
                      <p className="text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Интервьюер</label>
                <select
                  value={newInterview.interviewer}
                  onChange={(e) => setNewInterview(prev => ({ ...prev, interviewer: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
                >
                  <option value="">Выберите интервьюера</option>
                  {interviewers.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleScheduleInterview} className="flex-1">
                  Назначить
                </Button>
                <Button variant="outline" onClick={() => setShowScheduleModal(false)} className="flex-1">
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно деталей собеседования */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Детали собеседования</h2>
                <button
                  onClick={() => setSelectedInterview(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {selectedInterview.candidateName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedInterview.candidateName}</h3>
                  <p className="text-gray-600">{selectedInterview.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Дата и время</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedInterview.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">{selectedInterview.time}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Формат</p>
                  <div className="flex items-center space-x-2">
                    <i className={`${getTypeIcon(selectedInterview.type)} text-blue-600`}></i>
                    <span className="text-sm font-medium text-gray-900">{getTypeLabel(selectedInterview.type)}</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Интервьюер</p>
                  <p className="text-sm font-medium text-gray-900">{selectedInterview.interviewer}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Статус</p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInterview.status)}`}>
                    {getStatusLabel(selectedInterview.status)}
                  </span>
                </div>
              </div>

              {selectedInterview.notes && (
                <div className="p-4 bg-blue-50 rounded-lg mb-6">
                  <p className="text-xs font-medium text-blue-700 mb-1">Заметки</p>
                  <p className="text-sm text-blue-900">{selectedInterview.notes}</p>
                </div>
              )}

              <div className="flex space-x-3">
                {selectedInterview.status === 'scheduled' && (
                  <>
                    <Button className="flex-1">
                      <i className="ri-check-line mr-2"></i>
                      Завершить
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <i className="ri-close-line mr-2"></i>
                      Отменить
                    </Button>
                  </>
                )}
                {selectedInterview.status !== 'scheduled' && (
                  <Button variant="outline" onClick={() => setSelectedInterview(null)} className="flex-1">
                    Закрыть
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
