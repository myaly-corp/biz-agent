// App.jsx or App.tsx
import {  Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import Formpage from "./Formpage";
import SignInPage from "./SignIn";
import ProtectedRoute from "./lib/ProtectedRoute";
function App() {
  return (

    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Formpage />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  );
}

export default App;