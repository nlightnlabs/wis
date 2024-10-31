import React, { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from "./components/Header";
import Home from "./components/Home"
import SignIn from './components/SignIn.js';
import Settings from './components/Settings.js';

function App() {

  const mode = useSelector((state) => state.environment.mode);
  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
  const user = useSelector((state) => state.authentication.isAuthenticated);

  const contextApi = {
    isAuthenticated,
    mode,
    user
  }


  return (
    <div className={`flex flex-col w-full bg-mode-${mode} h-[100vh] overflow-hidden fade-in`}>
      {/* Show Header regardless of the page if authenticated */}
      <Router>
      {isAuthenticated && <Header />}
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

