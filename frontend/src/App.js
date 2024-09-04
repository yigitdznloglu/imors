import React from "react";
import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./context/auth/protectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";

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
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />}  />
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

function LayoutWithNavbar() {
  const location = useLocation();
  
  return (
    <>
      {location.pathname !== "/auth" && <Navbar />}
      <div id="App">
        <Outlet />
      </div>
    </>
  );
}

export default App;
