import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function OperatorLayout() {
  return (
    <div className="app-shell app-shell--operator flex h-screen overflow-hidden text-white">
      <Sidebar role="operator" />

      <div className="flex flex-1 flex-col">
        <Topbar role="operator" />

        <main className="main-panel flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}