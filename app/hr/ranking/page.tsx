
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/feature/Sidebar';
import Header from '../../../components/feature/Header';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';

interface RankedCandidate {
  id: string;
  name: string;
  position: string;
  aiScore: number;
  matchScore: number;
  experienceScore: number;
  skillsScore: number;
  cultureScore: number;
  skills: string[];
  experience: string;
  recommendation: string;
  strengths: string[];
  concerns: string[];
}

const mockRankedCandidates: RankedCandidate[] = [
  {
    id: '1',
    name: 'Александр Волков',
    position: 'Frontend-разработчик',
    aiScore: 94,
    matchScore: 96,
    experienceScore: 92,
    skillsScore: 95,
    cultureScore: 93,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    experience: '5 лет',
    recommendation: 'Настоятельно рекомендуется',
    strengths: ['Глубокие знания React экосистемы', 'Опыт работы в крупных проектах', 'Хорошие soft skills'],
    concerns: []
  },
  {
    id: '2',
    name: 'Игорь Новиков',
    position: 'DevOps Engineer',
    aiScore: 92,
    matchScore: 90,
    experienceScore: 94,
    skillsScore: 93,
    cultureScore: 91,
    skills: ['Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    experience: '6 лет',
    recommendation: 'Рекомендуется',
    strengths: ['Богатый опыт с облачными технологиями', 'Сертификаты AWS'],
    concerns: ['Нет опыта с GCP']
  },
  {
    id: '3',
    name: 'Дмитрий Козлов',
    position: 'Backend-разработчик',
    aiScore: 91,
    matchScore: 89,
    experienceScore: 95,
    skillsScore: 90,
    cultureScore: 90,
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    experience: '7 лет',
    recommendation: 'Рекомендуется',
    strengths: ['Большой опыт разработки', 'Знание архитектурных паттернов'],
    concerns: ['Предпочитает удалённую работу']
  },
  {
    id: '4',
    name: 'Мария Соколова',
    position: 'UX/UI Дизайнер',
    aiScore: 89,
    matchScore: 91,
    experienceScore: 85,
    skillsScore: 92,
    cultureScore: 88,
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    experience: '3 года',
    recommendation: 'Рекомендуется с оговорками',
    strengths: ['Креативный подход', 'Хорошее портфолио'],
    concerns: ['Меньше опыта чем требуется']
  },
  {
    id: '5',
    name: 'Анна Петрова',
    position: 'Product Manager',
    aiScore: 86,
    matchScore: 84,
    experienceScore: 88,
    skillsScore: 85,
    cultureScore: 87,
    skills: ['Agile', 'Scrum', 'Jira', 'Analytics'],
    experience: '4 года',
    recommendation: 'Рекомендуется с оговорками',
    strengths: ['Опыт в IT-продуктах', 'Аналитический склад ума'],
    concerns: ['Нет опыта управления большой командой']
  }
];

export default function HRRanking() {
  const navigate = useNavigate();
  const [candidates] = useState<RankedCandidate[]>(mockRankedCandidates);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const positions = ['all', ...new Set(candidates.map(c => c.position))];

  const filteredCandidates = selectedPosition === 'all' 
    ? candidates 
    : candidates.filter(c => c.position === selectedPosition);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRecommendationColor = (rec: string) => {
    if (rec.includes('Настоятельно')) return 'bg-emerald-100 text-emerald-700';
    if (rec === 'Рекомендуется') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole="hr" />

      <div className="flex-1 overflow-y-auto">
        <Header title="ИИ-ранжирование кандидатов" hideCoins />
        
        <main className="p-6">
          {/* Описание */}
          <Card className="mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="ri-robot-line text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Интеллектуальное ранжирование</h2>
                <p className="text-sm text-gray-600">
                  ИИ анализирует резюме кандидатов, сопоставляет их навыки с требованиями вакансий и оценивает культурное соответствие компании. 
                  Кандидаты автоматически ранжируются по совокупности факторов.
                </p>
              </div>
              <Button onClick={handleReanalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Анализ...
                  </>
                ) : (
                  <>
                    <i className="ri-refresh-line mr-2"></i>
                    Переанализировать
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Фильтр по позиции */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Фильтр по позиции:</span>
            <div className="flex flex-wrap gap-2">
              {positions.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    selectedPosition === pos
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {pos === 'all' ? 'Все позиции' : pos}
                </button>
              ))}
            </div>
          </div>

          {/* Список ранжированных кандидатов */}
          <div className="space-y-4">
            {filteredCandidates.map((candidate, index) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Ранг */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    #{index + 1}
                  </div>

                  {/* Информация о кандидате */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.position} • {candidate.experience}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                          {candidate.aiScore}%
                        </div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getRecommendationColor(candidate.recommendation)}`}>
                          {candidate.recommendation}
                        </span>
                      </div>
                    </div>

                    {/* Оценки по категориям */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Соответствие</span>
                          <span className="font-medium">{candidate.matchScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${getScoreBg(candidate.matchScore)}`} style={{ width: `${candidate.matchScore}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Опыт</span>
                          <span className="font-medium">{candidate.experienceScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${getScoreBg(candidate.experienceScore)}`} style={{ width: `${candidate.experienceScore}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Навыки</span>
                          <span className="font-medium">{candidate.skillsScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${getScoreBg(candidate.skillsScore)}`} style={{ width: `${candidate.skillsScore}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Культура</span>
                          <span className="font-medium">{candidate.cultureScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${getScoreBg(candidate.cultureScore)}`} style={{ width: `${candidate.cultureScore}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Навыки */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Сильные стороны и опасения */}
                    <div className="flex items-start space-x-6">
                      {candidate.strengths.length > 0 && (
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">Сильные стороны:</p>
                          <ul className="space-y-1">
                            {candidate.strengths.map((s, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start">
                                <i className="ri-check-line text-emerald-500 mr-1 mt-0.5"></i>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {candidate.concerns.length > 0 && (
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">Возможные риски:</p>
                          <ul className="space-y-1">
                            {candidate.concerns.map((c, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start">
                                <i className="ri-alert-line text-yellow-500 mr-1 mt-0.5"></i>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" onClick={() => setSelectedCandidate(candidate)}>
                      <i className="ri-eye-line mr-1"></i>
                      Детали
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate('/hr/interviews')}>
                      <i className="ri-calendar-line mr-1"></i>
                      Собеседование
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Модальное окно детального анализа */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Детальный ИИ-анализ</h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCandidate.name}</h3>
                  <p className="text-gray-600">{selectedCandidate.position}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(selectedCandidate.aiScore)}`}>
                    {selectedCandidate.aiScore}%
                  </div>
                  <p className="text-sm text-gray-500">Общая оценка ИИ</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">Детализация оценки</h4>
                {[
                  { label: 'Соответствие требованиям', score: selectedCandidate.matchScore, desc: 'Насколько навыки и опыт соответствуют вакансии' },
                  { label: 'Релевантный опыт', score: selectedCandidate.experienceScore, desc: 'Качество и релевантность предыдущего опыта' },
                  { label: 'Технические навыки', score: selectedCandidate.skillsScore, desc: 'Уровень владения требуемыми технологиями' },
                  { label: 'Культурное соответствие', score: selectedCandidate.cultureScore, desc: 'Совместимость с ценностями и культурой компании' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{item.label}</span>
                      <span className={`font-bold ${getScoreColor(item.score)}`}>{item.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className={`h-2 rounded-full ${getScoreBg(item.score)}`} style={{ width: `${item.score}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg mb-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-robot-line text-blue-600 text-xl mt-0.5"></i>
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Рекомендация ИИ</p>
                    <p className="text-sm text-blue-800">{selectedCandidate.recommendation}. Кандидат демонстрирует высокий уровень соответствия требованиям позиции и культуре компании.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={() => navigate('/hr/interviews')} className="flex-1">
                  <i className="ri-calendar-line mr-2"></i>
                  Назначить собеседование
                </Button>
                <Button variant="outline" onClick={() => setSelectedCandidate(null)} className="flex-1">
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
