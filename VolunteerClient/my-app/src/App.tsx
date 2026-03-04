import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import{ LoginPage } from './pages/LoginPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          {/* כאן אפשר להוסיף עוד Routes לדפים אחרים */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
