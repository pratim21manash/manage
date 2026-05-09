import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import DashboardHome from "./DashboardHome";
import MyTasks from "./MyTasks";

const EmployeeDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/tasks" element={<MyTasks />} />
      </Routes>
    </Layout>
  );
};

export default EmployeeDashboard;
