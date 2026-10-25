import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import LandingPage from "./pages/landing/landingPage";

import SignupPage from "./pages/auth/signup";
import LoginPage from "./pages/auth/login";
import ForgotPasswordPage from "./pages/auth/forgotPassword";
import ResetPasswordPage from "./pages/auth/resetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/dashboardHome";
import Profile from "./pages/dashboard/profile";
import Notifications from "./pages/dashboard/notifications";
import Settings from "./pages/dashboard/settings";
import ProjectsPage from "./pages/dashboard/projects/projectsPage";
import NewProjectPage from "./pages/dashboard/projects/newProject";
import ProjectDetailsPage from "./pages/dashboard/projects/projectDetails";
import EditProjectPage from "./pages/dashboard/projects/editProject";
// import TeamManagementPage from "./pages/dashboard/team/teamManagementPage";
import InspectionsPage from "./pages/dashboard/inspection/InspectionPage";
import DraftInspectionsPage from "./pages/dashboard/inspection/DraftInspectionsPage";
import StartInspectionPage from "./pages/dashboard/inspection/StartInspectionPage";
import InspectionDetailsPage from "./pages/dashboard/inspection/inspectionDetailsPage";
import EditInspectionPage from "./pages/dashboard/inspection/editInspectionPage";
import UploadImagesPage from "./pages/dashboard/inspection/UploadImagesPage";
import AnalyticsPage from "./pages/dashboard/analysis/analysisPage";
import AnalysisDetailsPage from "./pages/dashboard/analysis/analysisDetailsPage";
import AIProcessingPage from "./pages/dashboard/analysis/AIProcessingPage";
import AIResultsPage from "./pages/dashboard/analysis/AIResultsPage";
import AnnotationWorkspacePage from "./pages/dashboard/annotation/AnnotationWorkspacePage";
import ValidationPage from "./pages/dashboard/annotation/ValidationPage";
import ReportsPage from "./pages/dashboard/reports/reportsPage";
import ReportDetailsPage from "./pages/dashboard/reports/reportDetailsPage";
import ReportExportPage from "./pages/dashboard/reports/reportExportPage";
import ProtectedRoute from "./components/ProtectedRoute";
//admin imports
import AdminPlaceholderPage from "./components/admin/AdminPlaceholderPage";
import AdminDashboard from "./pages/dashboard/adminDashboard";

function LoginRoute() {
  const navigate = useNavigate();
  return <LoginPage onNavigate={navigate} />;
}

function SignupRoute() {
  const navigate = useNavigate();
  return <SignupPage onNavigate={navigate} />;
}

function ForgotPasswordRoute() {
  const navigate = useNavigate();
  return <ForgotPasswordPage onNavigate={navigate} />;
}

function ResetPasswordRoute() {
  const navigate = useNavigate();
  const { token = "" } = useParams();

  return (
    <ResetPasswordPage
      onNavigate={navigate}
      token={token}
    />
  );
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={<LoginRoute />}
      />

      <Route
        path="/signup"
        element={<SignupRoute />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordRoute />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPasswordRoute />}
      />

      {/* Protected Dashboard */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<DashboardHome />}
        />
        {/* project routes */}
        <Route
          path="projects"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/new"
          element={
            <ProtectedRoute allowedRoles={["Engineer"]}>
              <NewProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/:id"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Engineer"]}>
              <EditProjectPage />
            </ProtectedRoute>
          }
        />

        {/* team management */}
        {/* <Route
            path="team"
            element={
              <ProtectedRoute allowedRoles={["Engineer"]}>
                <TeamManagementPage />
              </ProtectedRoute>
            }
          /> */}

        {/* inspection routes */}
        <Route
          path="inspection"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <InspectionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/new"
          element={
            <ProtectedRoute allowedRoles={["Inspector"]}>
              <StartInspectionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/drafts"
          element={
            <ProtectedRoute allowedRoles={["Inspector"]}>
              <DraftInspectionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/:id"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <InspectionDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Inspector"]}>
              <EditInspectionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/:id/upload-images"
          element={
            <ProtectedRoute allowedRoles={["Inspector"]}>
              <UploadImagesPage />
            </ProtectedRoute>
          }
        />

        {/* analysis routes */}
        <Route
          path="/dashboard/ai-analysis"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ai-analysis/:analysisId"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <AnalysisDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/:inspectionId/ai-analysis/:analysisId"
          element={
            <ProtectedRoute allowedRoles={["Engineer"]}>
              <AIProcessingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/:inspectionId/ai-results/:analysisId"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <AIResultsPage />
            </ProtectedRoute>
          }
        />

        {/* annotation routes — Engineer only */}
        <Route
          path="inspection/:inspectionId/annotation/:analysisId"
          element={
            <ProtectedRoute allowedRoles={["Engineer"]}>
              <AnnotationWorkspacePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="inspection/:inspectionId/validation/:analysisId"
          element={
            <ProtectedRoute allowedRoles={["Engineer"]}>
              <ValidationPage />
            </ProtectedRoute>
          }
        />

        {/* report routes — view/download for both roles */}
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/inspection/:inspectionId/report/:reportId"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <ReportDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/reports/:reportId/export"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <ReportExportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["Engineer", "Inspector"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
        {/* admin routes: Admin only */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminPlaceholderPage itemId="users" />} />
          <Route path="teams" element={<AdminPlaceholderPage itemId="teams" />} />
          <Route path="projects" element={<AdminPlaceholderPage itemId="projects" />} />
          <Route path="inspections" element={<AdminPlaceholderPage itemId="inspections" />} />
          <Route path="analyses" element={<AdminPlaceholderPage itemId="analyses" />} />
          <Route path="reports" element={<AdminPlaceholderPage itemId="reports" />} />
          <Route path="activity-log" element={<AdminPlaceholderPage itemId="activity-log" />} />
          <Route path="account" element={<AdminPlaceholderPage itemId="account" />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;