import React, { useEffect } from 'react';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import { Navigate, useLocation } from 'react-router-dom';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

interface AdminRedirectProps {
  children: React.ReactNode;
}

const AdminRedirect: React.FC<AdminRedirectProps> = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const location = useLocation();

  
  useEffect(() => {
    console.log('AdminRedirect - состояние:', {
      user,
      loading,
      isAuth,
      pathname: location.pathname,
      isAdmin: user?.isAdmin,
      userType: typeof user,
      userIsAdminType: typeof user?.isAdmin,
      shouldRedirect:
        isAuth && user?.isAdmin && location.pathname !== CLIENT_ROUTES.ADMIN,
    });
  }, [user, loading, isAuth, location.pathname]);


  if (loading) {
    return <>{children}</>;
  }


  if (isAuth && user?.isAdmin && location.pathname !== CLIENT_ROUTES.ADMIN) {
    console.log(
      'AdminRedirect - перенаправляем администратора на админ-панель'
    );
    return <Navigate to={CLIENT_ROUTES.ADMIN} replace />;
  }


  return <>{children}</>;
};

export default AdminRedirect;
