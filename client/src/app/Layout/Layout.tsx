import Footer from '@/widgets/Footer/Footer';
import { Outlet, useLocation } from 'react-router';
import './Layout.css';

export default function Layout() {
  const location = useLocation();

  const shouldShowFooter =
    location.pathname !== '/' && !location.pathname.includes('/admin');

  return (
    <div className="layout">
      <main className="main-content">
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}
