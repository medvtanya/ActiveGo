import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = CLIENT_ROUTES.MAIN,
}) => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const user = useAppSelector((state) => state.user.user);
  const accessToken = useAppSelector((state) => state.user.accessToken);

  console.log("PublicRoute - состояние:", {
    isAuth,
    hasUser: !!user,
    hasToken: !!accessToken,
  });

  if (isAuth) {
    console.log(
      "PublicRoute - перенаправление авторизованного пользователя на:",
      redirectTo
    );
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
