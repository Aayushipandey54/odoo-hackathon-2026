import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
      <AIChatbot />
    </>
  );
};

export default MainLayout;
