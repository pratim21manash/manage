import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import DashboardHome from "./DashboardHome";
import TasksManagement from "./TasksManagement";
import UsersManagement from "./UsersManagement";
import TaskStats from "./TaskStats";

const AdminDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/tasks" element={<TasksManagement />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/stats" element={<TaskStats />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
