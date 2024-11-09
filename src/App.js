import React, { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from "./components/Header";
import Home from "./components/Home"
import EventStaffing from "./components/EventStaffing"
import StoreTrends from "./components/StoreTrends"
import SignIn from './components/SignIn.js';
import Settings from './components/Settings.js';
import Navbar from './components/Navbar.js';

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

      <div className={`flex flex-col w-full bg-mode-${mode} h-[100vh] overflow-y-auto fade-in`}>

      <Router>
        {isAuthenticated && <Header />}
        {isAuthenticated && <Navbar />}
        
      <div className="w-full h-[100%] overflow-y-auto">
        <Routes>
          <Route path="/" element={<ProtectedRoute><EventStaffing /></ProtectedRoute>} />
          <Route path="/event_staffing" element={<ProtectedRoute><EventStaffing /></ProtectedRoute>} />
          <Route path="/store_trends" element={<ProtectedRoute><StoreTrends /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

