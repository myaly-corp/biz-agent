// components/ProtectedRoute.jsx
import { ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
    children: ReactNode;
  };
  

const ProtectedRoute = ({ children  } : ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // or a loading spinner

  return isSignedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;