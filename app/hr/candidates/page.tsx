
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/feature/Sidebar';
import Header from '../../../components/feature/Header';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import { useAppContext } from '../../../context/AppContext';
import type { Candidate, CandidateStatus } from '../../../context/AppContext';

const STATUS_ORDER: CandidateStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const STATUS_LABELS: Record<CandidateStatus, string> = {
  new: 'Новый', screening: 'Скрининг', interview: 'Собеседование',
  offer: 'Оффер', hired: 'Принят', rejected: 'Отклонён'
};

const STATUS_COLORS: Record<CandidateStatus, string> = {
  new: 'bg-gray-100 text-gray-700', screening: 'bg-yellow-100 text-yellow-700',
  interview: 'bg-blue-100 text-blue-700', offer: 'bg-green-100 text-green-700',
  hired: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700'
};

export default function HRCandidates() {
  const navigate = useNavigate();
  const { candidates, updateCandidateStatus, addCandidate } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', position: '', email: '', phone: '', experience: '', source: 'HeadHunter' });

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: candidates.length,
    new: candidates.filter(c => c.status === 'new').length,
    interview: candidates.filter(c => c.status === 'interview').length,
    offer: candidates.filter(c => c.status === 'offer').length
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleMoveStatus = (candidateId: string, newStatus: CandidateStatus) => {
    updateCandidateStatus(candidateId, newStatus);
    // update selectedCandidate if open
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAddCandidate = () => {
    if (!newForm.name || !newForm.position || !newForm.email) return;
    addCandidate({
      name: newForm.name,
      position: newForm.position,
      email: newForm.email,
      phone: newForm.phone,
      experience: newForm.experience || 'Не указан',
      skills: [],
      aiScore: Math.floor(70 + Math.random() * 25),
      status: 'new',
      appliedDate: new Date().toISOString().split('T')[0],
      source: newForm.source
    });
    setShowAddModal(false);
    setNewForm({ name: '', position: '', email: '', phone: '', experience: '', source: 'HeadHunter' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole="hr" />

      <div className="flex-1 overflow-y-auto">
        <Header title="Кандидаты" hideCoins />

        <main className="p-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-search-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Всего кандидатов</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-add-line text-gray-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                  <p className="text-sm text-gray-500">Новых</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-calendar-check-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.interview}</p>
                  <p className="text-sm text-gray-500">На собеседовании</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-file-text-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.offer}</p>
                  <p className="text-sm text-gray-500">Офферы</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Фильтры */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Поиск по имени или должности..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
              >
                <option value="all">Все статусы</option>
                {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <Button onClick={() => setShowAddModal(true)}>
                <i className="ri-add-line mr-2"></i>Добавить кандидата
              </Button>
            </div>
          </Card>

          {/* Таблица */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Кандидат</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Должность</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Опыт</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ИИ-оценка</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Статус</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Источник</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                            <p className="text-xs text-gray-500">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4"><p className="text-sm text-gray-900">{candidate.position}</p></td>
                      <td className="py-4 px-4"><p className="text-sm text-gray-600">{candidate.experience}</p></td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold ${getAIScoreColor(candidate.aiScore)}`}>
                          <i className="ri-robot-line mr-1"></i>{candidate.aiScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={candidate.status}
                          onChange={(e) => handleMoveStatus(candidate.id, e.target.value as CandidateStatus)}
                          className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_COLORS[candidate.status]}`}
                        >
                          {STATUS_ORDER.map(s => (
                            <option key={s} value={s} className="bg-white text-gray-900">{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-4"><p className="text-sm text-gray-600">{candidate.source}</p></td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Подробнее"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button
                            onClick={() => navigate('/hr/interviews')}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                            title="Назначить собеседование"
                          >
                            <i className="ri-calendar-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">Кандидаты не найдены</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>

      {/* Модалка деталей кандидата */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Профиль кандидата</h2>
                <button onClick={() => setSelectedCandidate(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCandidate.name}</h3>
                  <p className="text-gray-600">{selectedCandidate.position}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedCandidate.status]}`}>
                      {STATUS_LABELS[selectedCandidate.status]}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold ${getAIScoreColor(selectedCandidate.aiScore)}`}>
                      <i className="ri-robot-line mr-1"></i>ИИ-оценка: {selectedCandidate.aiScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Воронка найма */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-3">Этап воронки найма:</p>
                <div className="flex items-center space-x-1 overflow-x-auto">
                  {STATUS_ORDER.filter(s => s !== 'rejected').map((stage, idx) => (
                    <button
                      key={stage}
                      onClick={() => handleMoveStatus(selectedCandidate.id, stage)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedCandidate.status === stage
                          ? 'bg-blue-600 text-white shadow'
                          : STATUS_ORDER.indexOf(selectedCandidate.status) > idx
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {STATUS_LABELS[stage]}
                    </button>
                  ))}
                  <button
                    onClick={() => handleMoveStatus(selectedCandidate.id, 'rejected')}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedCandidate.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    Отклонить
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Телефон</p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Опыт работы</p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.experience}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Источник</p>
                  <p className="text-sm font-medium text-gray-900">{selectedCandidate.source}</p>
                </div>
              </div>

              {selectedCandidate.skills.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Навыки</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button onClick={() => navigate('/hr/interviews')} className="flex-1">
                  <i className="ri-calendar-line mr-2"></i>Назначить собеседование
                </Button>
                <Button variant="outline" onClick={() => setSelectedCandidate(null)} className="flex-1">Закрыть</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка добавления */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Добавить кандидата</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
                <input type="text" value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Введите ФИО" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность *</label>
                <input type="text" value={newForm.position} onChange={e => setNewForm(p => ({ ...p, position: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="Желаемая должность" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={newForm.email} onChange={e => setNewForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input type="tel" value={newForm.phone} onChange={e => setNewForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="+7 (999) 123-45-67" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Опыт работы</label>
                <input type="text" value={newForm.experience} onChange={e => setNewForm(p => ({ ...p, experience: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="3 года" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Источник</label>
                <select value={newForm.source} onChange={e => setNewForm(p => ({ ...p, source: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer">
                  <option>HeadHunter</option>
                  <option>LinkedIn</option>
                  <option>Рекомендация</option>
                  <option>Сайт компании</option>
                  <option>Другое</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button onClick={handleAddCandidate} className="flex-1" disabled={!newForm.name || !newForm.position || !newForm.email}>
                  Добавить
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Отмена</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
