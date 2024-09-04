import React from "react";
import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./context/auth/protectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";
import History from "./pages/History/History";
import Favorites from "./pages/Favorites/Favorites";

function App() {
  useEffect(() => {
    document.body.classList.add('bg-dark', 'text-white');

    return () => {
      document.body.classList.remove('bg-dark', 'text-white');
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Separate Route to conditionally render Navbar based on the path */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />}  />
          <Route path="/history" element={<History />}  />
          <Route path="/favorites" element={<Favorites  />} />
          {/*
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/history" element={<ProtectedRoute element={<History />} />} />
          <Route path="/favorites" element={<ProtectedRoute element={<Favorites />} />} /> */}
        </Route>
        {/* Route without Navbar */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

function LayoutWithNavbar() {
  const location = useLocation();
  
  // This is an alternative place to exclude Navbar from certain paths if needed
  return (
    <>
      {location.pathname !== "/auth" && <Navbar />}
      <div id="App">
        <Outlet />  {/* This component renders the active Route's children */}
      </div>
    </>
  );
}

export default App;
