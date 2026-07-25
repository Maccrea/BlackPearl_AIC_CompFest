import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminLayout from "../layouts/AdminLayout";
import OperatorLayout from "../layouts/OperatorLayout";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import KnowledgeAI from "../pages/admin/KnowledgeAI";
import UploadData from "../pages/admin/UploadData";
import MachineManagement from "../pages/admin/Machine";
import UserManagement from "../pages/admin/UserManagement";
import Settings from "../pages/admin/Settings";

// Operator Pages
import OperatorDashboard from "../pages/operator/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "knowledge-ai",
        element: <KnowledgeAI />,
      },
      {
        path: "upload-data",
        element: <UploadData />,
      },
      {
        path: "machines",
        element: <MachineManagement />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/operator",
    element: <OperatorLayout />,
    children: [
      {
        index: true,
        element: <OperatorDashboard />,
      },
    ],
  },

  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);