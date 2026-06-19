import React from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '@/shared/hooks/reduxHooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
}

function ProtectedRoute({ children, redirectTo }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const accessToken = useAppSelector((state) => state.user.accessToken);

  console.log('ProtectedRoute - состояние:', {
    isAuth,
    hasUser: !!user,
    hasToken: !!accessToken,
    loading,
  });

  if (loading) {
    console.log('ProtectedRoute - загрузка...');
    return <div>Загрузка...</div>;
  }

  if (accessToken && !user) {
    console.log(
      'ProtectedRoute - есть токен, но нет пользователя, загрузка...'
    );
    return <div>Загрузка...</div>;
  }

  if (!accessToken && !user) {
    console.log(
      'ProtectedRoute - нет токена и пользователя, перенаправление на:',
      redirectTo
    );
    return <Navigate to={redirectTo} replace />;
  }

  if (user && !isAuth) {
    console.log(
      'ProtectedRoute - есть пользователь, но не авторизован, перенаправление на:',
      redirectTo
    );
   
    if (user.telegram_id) {
      console.log(
        'ProtectedRoute - пользователь с Telegram ID, разрешаем доступ для заполнения формы'
      );
      return <>{children}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  console.log('ProtectedRoute - доступ разрешен');
  return <>{children}</>;
}

export default ProtectedRoute;
