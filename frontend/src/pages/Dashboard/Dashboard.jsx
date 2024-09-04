import { useEffect, useState } from "react";
import "./Dashboard.css";
import { isAuthenticated } from "../../context/auth/auth";
import UnauthenticatedLanding from "./UnauthenticatedLanding/UnauthenticatedLanding";
import AuthenticatedLanding from "./AuthenticatedLanding/AuthenticatedLanding";

const Dashboard = () => {
  const [viewAuthenticatedDashboard, setViewAuthenticatedDashboard] =
    useState(false);

  useEffect(() => {
    setViewAuthenticatedDashboard(isAuthenticated());
    console.log("DASHBOARD CHECK", viewAuthenticatedDashboard);
  }, []);

  return (
    <div id="dashboard">
      {viewAuthenticatedDashboard ? (
        <AuthenticatedLanding />
      ) : (
        <UnauthenticatedLanding />
      )}
    </div>
  );
};

export default Dashboard;
