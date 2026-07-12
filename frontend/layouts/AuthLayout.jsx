import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-app text-primary p-4">
      <div className="w-full max-w-md">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AuthLayout;
