import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import OperatorLayout from "../layouts/OperatorLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import KnowledgeAI from "../pages/admin/Knowledge";
import UploadData from "../pages/admin/Upload";
import MachineManagement from "../pages/admin/Machine";
import UserManagement from "../pages/admin/User";
import Settings from "../pages/admin/Settings";

import OperatorDashboard from "../pages/operator/Dashboard";
import ProductionLine from "../components/cards/ProductionLine";
import AIAnalysis from "../pages/operator/AIAnalysis";
import MachineStatus from "../pages/operator/MachineStatus";
import Recommendation from "../pages/operator/Recommendation";
import Validation from "../pages/operator/Validation";

export const router = createBrowserRouter([
  {
    path: "/",
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
    {
      path: "production-line",
      element: <ProductionLine />,
    },
    {
      path: "machine-status",
      element: <MachineStatus />,
    },
    {
      path: "ai-analysis",
      element: <AIAnalysis />,
    },
    {
      path: "recommendation",
      element: <Recommendation />,
    },
    {
      path: "validation",
      element: <Validation />,
    },
  ],
}
]);