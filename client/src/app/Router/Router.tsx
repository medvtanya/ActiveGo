import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { Route, Routes } from "react-router";
import Layout from "../Layout/Layout";
import RegistrationPage from "@/pages/RegistrationPage/RegistrationPage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import EventFormPage from "@/features/EventFormPage/EventFormPage";
import SportClub from "@/pages/SportClubPage/SportClubPage";
import EventPage from "@/pages/EventPage/EventPage";
import OneSportClubPage from "@/pages/OneSportClubPage/OneSportClubPage";
import SubscribePage from "@/pages/SubscribePage/SubscribePage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import UserProfilePage from "@/pages/UserProfilePage/UserProfilePage";
import TelegramPasswordReset from "@/pages/PasswordResetPage/TelegramPasswordReset";
import DetailsEventPage from "@/pages/DetailsEventPage/DetailsEventPage";
import { YandexMap } from "@/widgets/mapWidgetes/map/map";
import MainPage from "@/pages/MainPage/MainPage";
import IsAdminPage from "@/pages/IsAdminPage/IsAdminPage";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminRedirect from "@/components/AdminRedirect";
import PublicRoute from "@/components/PublicRoute";
import Chat from "@/widgets/Chat/Chat";
import { AllEventsMap } from "@/widgets/mapWidgetes/getAllEventMap/getAllEventMap";
import { OneEventMap } from "@/widgets/mapWidgetes/getOneEventMap/getOneEventMap";
import GalleryEventPage from "@/pages/GalleryEventPage/GalleryEventPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import AccessSportClub from "@/features/AccessSportClub/AccessSportClub";
import FirstPage from "@/pages/FirtPage/FirstPage";
import SportClubForm from "@/features/SportClubForm/SportClubForm";
import MyChatsPage from "@/pages/MyChatsPage/MyChatsPage";

export default function Router() {
  return (
    <AdminRedirect>
      <Routes>
        <Route path={CLIENT_ROUTES.HOME} element={<Layout />}>
          <Route
            path={CLIENT_ROUTES.HOME}
            element={
              <PublicRoute redirectTo={CLIENT_ROUTES.MAIN}>
                <FirstPage />
              </PublicRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.MAIN}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.REGISTRATION}
            element={
              <PublicRoute>
                <RegistrationPage />
              </PublicRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.LOGIN}
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.RESET_PASSWORD}
            element={<TelegramPasswordReset />}
          />

          <Route
            path={CLIENT_ROUTES.ADMIN}
            element={
              <AdminProtectedRoute>
                <IsAdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="sportclub"
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <SportClub />
              </ProtectedRoute>
            }
          />

          <Route
            path={CLIENT_ROUTES.SPORT_CLUB + "/:id"}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <OneSportClubPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.EVENT}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <EventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.SUBSCRIBE_TO_SPORT_CLUB}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <SubscribePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.EVENT + "/:id"}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <DetailsEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.PROFILE}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.USER_PROFILE}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.GALLERY + "/:id"}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <GalleryEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.EVENTFORM}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <EventFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.CREATE_SPORT_CLUB}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <SportClubForm />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.MAP}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <YandexMap />
              </ProtectedRoute>
            }
          />

          <Route
            path={CLIENT_ROUTES.ACCESS_SPORT_CLUB}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <AccessSportClub />
              </ProtectedRoute>
            }
          />

          <Route path={CLIENT_ROUTES.CHAT} element={<Chat />} />

          <Route
            path={CLIENT_ROUTES.ALL_EVENTS_MAP}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.VIDEO}>
                <AllEventsMap />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.ONE_EVENT_MAP + "/:id"}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.VIDEO}>
                <OneEventMap />
              </ProtectedRoute>
            }
          />
          <Route
            path={CLIENT_ROUTES.MY_CHATS}
            element={
              <ProtectedRoute redirectTo={CLIENT_ROUTES.HOME}>
                <MyChatsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AdminRedirect>
  );
}
