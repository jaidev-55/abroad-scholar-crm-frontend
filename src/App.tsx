import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/layouts/AdminLayout";
import LeadsPipeline from "./pages/leads/page";
import Dashboardpage from "./pages/dashboard/page";
import AllLeadsPage from "./pages/all-leads/page";
import MyProfilePage from "./pages/my-profile/page";
import EnrolledStudentsPage from "./pages/enrolled/page";
import LostLeadsPage from "./pages/lost-leads/page";
import CounselorsPage from "./pages/counselors/page";
import AllFollowupsPage from "./pages/folllow-ups/page";
import LeadSourcePage from "./pages/lead-source/page";
import IeltsPage from "./pages/ielts/page";
import TasksPage from "./pages/tasks/TasksPage";
import LoginPage from "./pages/auth/Login";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UsersPage from "./pages/users/UsersPage";
import PerformancePage from "./pages/performance/page";
import ApplicationPage from "./pages/application/page";
import VisaProcessingPage from "./pages/visaprocess/page";
import AdIntegrationPage from "./pages/adIntegration/page";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboardpage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="applications" element={<ApplicationPage />} />
          <Route path="visa" element={<VisaProcessingPage />} />
          <Route path="leads-pipeline" element={<LeadsPipeline />} />
          <Route path="all-leads" element={<AllLeadsPage />} />
          <Route path="my-profile" element={<MyProfilePage />} />
          <Route path="enrolled" element={<EnrolledStudentsPage />} />
          <Route path="ad-integration" element={<AdIntegrationPage />} />
          <Route path="lost-leads" element={<LostLeadsPage />} />
          <Route path="counselors" element={<CounselorsPage />} />
          <Route path="follow-ups" element={<AllFollowupsPage />} />
          <Route path="lead-sources" element={<LeadSourcePage />} />
          <Route path="ielts" element={<IeltsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
