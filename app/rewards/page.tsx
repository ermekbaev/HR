
import { useState } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function Rewards() {
  const { currentUser, getCurrentUserData, awardSkillCoins } = useAppContext();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);

  const userData = getCurrentUserData();
  const skillCoins = userData?.skillCoins ?? 0;

  const categories = [
    { id: 'all', label: 'Все награды', icon: 'ri-gift-line' },
    { id: 'merchandise', label: 'Мерч', icon: 'ri-t-shirt-line' },
    { id: 'benefits', label: 'Льготы', icon: 'ri-heart-line' },
    { id: 'experiences', label: 'Впечатления', icon: 'ri-camera-line' },
    { id: 'development', label: 'Развитие', icon: 'ri-book-line' }
  ];

  const rewards = [
    {
      id: 1,
      title: 'Фирменная футболка',
      description: 'Стильная футболка с логотипом компании',
      price: 200,
      category: 'merchandise',
      image: 'corporate branded t-shirt with company logo on clean white background, professional product photography, high quality fabric, modern design',
      available: true,
      popular: true
    },
    {
      id: 2,
      title: 'Дополнительный выходной',
      description: 'Один дополнительный день отпуска',
      price: 500,
      category: 'benefits',
      image: 'relaxing vacation concept with beach chair and umbrella, peaceful sunny day, clean minimalist background, professional photography',
      available: true,
      popular: false
    },
    {
      id: 3,
      title: 'Курс английского языка',
      description: 'Онлайн-курс английского языка на 3 месяца',
      price: 800,
      category: 'development',
      image: 'online english learning course illustration with books and digital devices, modern educational environment, bright professional lighting',
      available: true,
      popular: true
    },
    {
      id: 4,
      title: 'Кофейная кружка',
      description: 'Керамическая кружка с корпоративным дизайном',
      price: 150,
      category: 'merchandise',
      image: 'elegant ceramic coffee mug with corporate branding, clean white background, professional product photography, high quality porcelain',
      available: true,
      popular: false
    },
    {
      id: 5,
      title: 'Билеты в кино',
      description: 'Два билета в кинотеатр на любой фильм',
      price: 400,
      category: 'experiences',
      image: 'cinema tickets and popcorn on clean background, entertainment concept, professional photography, bright lighting',
      available: true,
      popular: false
    },
    {
      id: 6,
      title: 'Массаж в офисе',
      description: '30-минутный расслабляющий массаж',
      price: 600,
      category: 'benefits',
      image: 'professional office massage therapy session, relaxing spa environment, clean modern office setting, wellness concept',
      available: false,
      popular: true
    },
    {
      id: 7,
      title: 'Рюкзак с логотипом',
      description: 'Качественный рюкзак для работы и путешествий',
      price: 350,
      category: 'merchandise',
      image: 'professional business backpack with company logo, modern design, clean background, high quality materials, corporate branding',
      available: true,
      popular: false
    },
    {
      id: 8,
      title: 'Мастер-класс по кулинарии',
      description: 'Участие в кулинарном мастер-классе',
      price: 700,
      category: 'experiences',
      image: 'cooking masterclass with professional chef in modern kitchen, culinary education, bright professional lighting, clean environment',
      available: true,
      popular: false
    }
  ];

  const filteredRewards = activeCategory === 'all'
    ? rewards
    : rewards.filter(reward => reward.category === activeCategory);

  const handlePurchase = (reward: typeof rewards[0]) => {
    if (!currentUser) return;
    // Списываем SC (отрицательная сумма)
    awardSkillCoins(currentUser.id, -reward.price);
    setPurchasedIds(prev => [...prev, reward.id]);
    showToast(`«${reward.title}» получена! -${reward.price} SC`, 'success');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar userRole="employee" />

      <div className="flex-1 overflow-y-auto">
        <Header title="Магазин наград" />

        <main className="p-6">
          {/* Баланс и статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-coin-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{skillCoins.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Доступно SkillCoins</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-shopping-bag-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{purchasedIds.length}</p>
                  <p className="text-sm text-gray-500">Получено наград</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-trophy-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {rewards.filter(r => purchasedIds.includes(r.id)).reduce((s, r) => s + r.price, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Потрачено всего</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Категории */}
          <div className="mb-8">
            <Card>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className={`${category.icon} text-lg`}></i>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Каталог наград */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRewards.map((reward) => {
              const purchased = purchasedIds.includes(reward.id);
              const canBuy = reward.available && skillCoins >= reward.price && !purchased;
              return (
                <Card key={reward.id} className="relative">
                  {reward.popular && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                      Популярное
                    </div>
                  )}

                  <div className="mb-4">
                    <img
                      src="/ruble.png"
                      alt={reward.title}
                      className="w-full h-40 object-cover object-top rounded-lg"
                    />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <i className="ri-coin-line text-yellow-600"></i>
                        <span className="font-bold text-gray-900">{reward.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">SC</span>
                      </div>

                      {!reward.available && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Нет в наличии
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!canBuy}
                    variant={canBuy ? 'primary' : 'outline'}
                    onClick={() => canBuy && handlePurchase(reward)}
                  >
                    {purchased
                      ? 'Получено ✓'
                      : !reward.available
                      ? 'Недоступно'
                      : skillCoins < reward.price
                      ? 'Недостаточно SC'
                      : 'Получить награду'
                    }
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* История покупок */}
          <div className="mt-12">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">История наград</h3>
                <Button variant="ghost" size="sm">
                  Показать все
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <img
                    src="https://readdy.ai/api/search-image?query=corporate%20branded%20t-shirt%20with%20company%20logo%20on%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%20fabric%2C%20modern%20design&width=60&height=60&seq=history1&orientation=squarish"
                    alt="Награда"
                    className="w-12 h-12 rounded-lg object-cover object-top mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Фирменная футболка</h4>
                    <p className="text-sm text-gray-500">Получено 3 дня назад</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">-200 SC</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Доставлено
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <img
                    src="https://readdy.ai/api/search-image?query=elegant%20ceramic%20coffee%20mug%20with%20corporate%20branding%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20quality%20porcelain&width=60&height=60&seq=history2&orientation=squarish"
                    alt="Награда"
                    className="w-12 h-12 rounded-lg object-cover object-top mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Кофейная кружка</h4>
                    <p className="text-sm text-gray-500">Получено неделю назад</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">-150 SC</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Доставлено
                    </span>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <img
                    src="https://readdy.ai/api/search-image?query=cinema%20tickets%20and%20popcorn%20on%20clean%20background%2C%20entertainment%20concept%2C%20professional%20photography%2C%20bright%20lighting&width=60&height=60&seq=history3&orientation=squarish"
                    alt="Награда"
                    className="w-12 h-12 rounded-lg object-cover object-top mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Билеты в кино</h4>
                    <p className="text-sm text-gray-500">Получено 2 недели назад</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">-400 SC</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Использовано
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
