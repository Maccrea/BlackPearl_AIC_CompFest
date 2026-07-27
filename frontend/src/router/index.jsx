import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import OperatorLayout from "../layouts/OperatorLayout";

import Login from "../pages/auth/LoginRole"
import Welcome from "../pages/Welcome";
import Help from "../pages/Help";


import AdminDashboard from "../pages/admin/Dashboard";
import KnowledgeAI from "../pages/admin/Knowledge";
import UploadDoc from "../pages/admin/UploadDoc";
import MachineManagement from "../pages/admin/Machine";
import UserManagement from "../pages/admin/User";
// import Settings from "../pages/admin/Settings";
import UploadInterview from "../pages/admin/UploadInterview"
import KnowledgeDetail from "../pages/admin/KnowledgeDetail"
import UploadDesc from "../pages/admin/UploadDesc";

import OperatorDashboard from "../pages/operator/Dashboard";
import ProductionLine from "../pages/operator/ProductionLine";
import MachineDiagnostic from "../pages/operator/MachineDiagnosticHub";
// import MachineStatus from "../pages/operator/MachineStatus";
// import Recommendation from "../pages/operator/Recommendation";
// import Validation from "../pages/operator/Validation";
import MachineDetail from "../pages/operator/MachineDetail";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/help",
    element: <Help />,
  },
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
        path: "knowledge-ai/upload-doc",
        element: <UploadDoc />,
      },
      {
        path: "machines",
        element: <MachineManagement />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      // {
      //   path: "settings",
      //   element: <Settings />,
      // },
      {
        path: "knowledge-ai/upload-interview",
        element: <UploadInterview />,
      },
      {
        path: "knowledge-ai/upload-description",
        element: <UploadDesc />,
      },
      {
        path: "knowledge-ai/:id",
        element: <KnowledgeDetail />,
      },
    ],
  },
  {
    path: "/operator",
    element: <OperatorLayout />,
    children: [
      {
        path: "machine-detail/:id",
        element: <MachineDetail />,
      },
      {
        index: true,
        element: <OperatorDashboard />,
      },
      {
        path: "production-line",
        element: <ProductionLine />,
      },
      // {
      //   path: "machine-status",
      //   element: <MachineStatus />,
      // },
      {
        path: "machine-diagnostic",
        element: <MachineDiagnostic />,
      },
      {
        path: "machine-diagnostic/:id",
        element: <MachineDiagnostic />,
      },
      // {
      //   path: "recommendation",
      //   element: <Recommendation />,
      // },
      // {
      //   path: "validation",
      //   element: <Validation />,
      // },
    ],
  }
]);