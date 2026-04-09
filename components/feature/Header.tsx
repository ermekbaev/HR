
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  hideCoins?: boolean;
}

export default function Header({ title, hideCoins = false }: HeaderProps) {
  const { getCurrentUserData, currentUser, notifications, getUnreadNotificationsCount, markAllNotificationsRead } = useAppContext();
  const userData = getCurrentUserData();
  const skillCoins = userData?.skillCoins ?? 0;
  const unreadCount = getUnreadNotificationsCount();

  const [showBell, setShowBell] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBell(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleBell = () => {
    if (!showBell && unreadCount > 0) markAllNotificationsRead();
    setShowBell(prev => !prev);
  };

  const myNotifications = currentUser
    ? notifications.filter(n => n.forUserId === currentUser.id).slice(0, 15)
    : [];

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return d.toLocaleDateString('ru-RU');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {!hideCoins && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
              <i className="ri-coin-line text-yellow-600 text-xl"></i>
              <div>
                <p className="text-sm font-semibold text-yellow-800">{skillCoins.toLocaleString()}</p>
                <p className="text-xs text-yellow-600">SkillCoins</p>
              </div>
            </div>

            <div className="relative" ref={bellRef}>
              <button
                onClick={toggleBell}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer relative"
              >
                <i className="ri-notification-3-line text-xl"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showBell && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Уведомления</h3>
                    {myNotifications.length > 0 && (
                      <span className="text-xs text-gray-400">{myNotifications.length} событий</span>
                    )}
                  </div>

                  {myNotifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <i className="ri-notification-off-line text-3xl text-gray-300 mb-2"></i>
                      <p className="text-sm text-gray-400">Уведомлений пока нет</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {myNotifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 flex items-start space-x-3 ${!n.read ? 'bg-blue-50' : ''}`}>
                          <i className={`${n.icon} ${n.color} text-lg mt-0.5 flex-shrink-0`}></i>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                          </div>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
