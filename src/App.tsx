import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import Formpage from "./Formpage";
import SignInPage from "./SignIn";
import ProtectedRoute from "./lib/ProtectedRoute";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import SignUpPage from "./SignUp";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Formpage />
          </ProtectedRoute>
        }
      />
     <Route path="/sign-in/*" element={<SignInPage />} />
     <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="/summary" element={<Summary />} />
      {/* <Route
        path="/sso-callback"
        element={<AuthenticateWithRedirectCallback signInUrl="/login" signUpUrl="/signup" />}
      /> */}
    </Routes>
  );
}

export default App;
