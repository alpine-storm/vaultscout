import { Navigate, Route, Routes } from "react-router-dom";
import { AppProviders } from "@/components/providers/AppProviders";
import { DashboardPage } from "@/pages/DashboardPage";
import { WalletsPage } from "@/pages/WalletsPage";
import { WalletDetailPage } from "@/pages/WalletDetailPage";
import { StrategiesPage } from "@/pages/StrategiesPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { AdminPage } from "@/pages/AdminPage";

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/wallets/:id" element={<WalletDetailPage />} />
        <Route path="/strategies" element={<StrategiesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppProviders>
  );
}
