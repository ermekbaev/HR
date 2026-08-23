'use client'

import { useRouter } from 'next/navigation'


import { useState } from 'react';

import Card from '@/components/base/Card';
import Button from '@/components/base/Button';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';

function getRoleHome(role: string): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'mentor': return '/mentor';
    case 'hr': return '/hr/candidates';
    default: return '/dashboard';
  }
}

export default function Login() {
  const router = useRouter();
  const { login } = useAppContext();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const doLogin = async (username: string, password: string) => {
    const user = await login(username, password);
    if (user) {
      router.push(getRoleHome(user.role));
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await doLogin(formData.username, formData.password);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="ri-robot-line text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '700' }}>
            HR-Автопилот
          </h1>
          <p className="text-gray-600">Система управления адаптацией сотрудников</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Логин
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Введите ваш логин"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Введите ваш пароль"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Вход...
                </div>
              ) : (
                'Войти в систему'
              )}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Данные для входа предоставляются системным администратором
          </p>
        </div>
      </div>
    </div>
  );
}
