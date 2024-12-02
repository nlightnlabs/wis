import React, { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from "./components/Header";
import EventStaffing from "./components/EventStaffing"
import StoreTrends from "./components/StoreTrends"
import SignIn from './components/SignIn.js';
import Settings from './components/Settings.js';
import Navbar from './components/Navbar.js';

function App() {

  const mode = useSelector((state) => state.environment.mode);
  const isAuthenticated = useSelector((state) => state.authentication.isAuthenticated);
  
  console.log("app.js page")

  return (

      <div className={`flex flex-col w-full bg-mode-${mode} h-[100vh] overflow-y-auto fade-in`}>

      <Router>
        {isAuthenticated && <Header />}
        {isAuthenticated && <Navbar />}
        
      <div className="w-full h-[100%] overflow-y-auto">
        <Routes>
          <Route path="/wis" element={<ProtectedRoute><EventStaffing /></ProtectedRoute>} />
          <Route path="/wis/event_staffing" element={<ProtectedRoute><EventStaffing /></ProtectedRoute>} />
          <Route path="/wis/store_trends" element={<ProtectedRoute><StoreTrends /></ProtectedRoute>} />
          <Route path="/wis/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/wis/signin" element={<SignIn />} />
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

