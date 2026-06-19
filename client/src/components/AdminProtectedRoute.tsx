import React from "react";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { Navigate } from "react-router-dom";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const isAuth = useAppSelector((state) => state.user.isAuth);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user || !isAuth) {
    return <Navigate to={CLIENT_ROUTES.LOGIN} replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to={CLIENT_ROUTES.MAIN} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
