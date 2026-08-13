import {
  BrowserRouter,
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
// import ReportDetailsPage from "./pages/dashboard/reports/reportDetailsPage";

import ProtectedRoute from "./components/ProtectedRoute";

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
    <BrowserRouter>
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
            element={<ProjectsPage />}
          />
          <Route
            path="projects/new"
            element={<NewProjectPage />}
          />
          <Route
            path="projects/:id"
            element={<ProjectDetailsPage />}
          />
          <Route
            path="projects/:id/edit"
            element={<EditProjectPage />}
          />

          {/* inspection routes */}
          <Route
            path="inspection"
            element={<InspectionsPage />}
          />

          <Route
            path="inspection/new"
            element={<StartInspectionPage />}
          />

          <Route
            path="inspection/drafts"
            element={<DraftInspectionsPage />}
          />

          <Route
            path="inspection/:id"
            element={<InspectionDetailsPage />}
          />

          <Route
            path="inspection/:id/edit"
            element={<EditInspectionPage />}
          />

          <Route
            path="inspection/:id/upload-images"
            element={<UploadImagesPage />}
          />

          {/* analysis routes */}
          <Route
            path="/dashboard/ai-analysis"
            element={<AnalyticsPage />}
          />

          <Route
            path="/dashboard/ai-analysis/:analysisId"
            element={<AnalysisDetailsPage />}
          />

          <Route
            path="inspection/:inspectionId/ai-analysis/:analysisId"
            element={<AIProcessingPage />}
          />

          <Route
            path="inspection/:inspectionId/ai-results/:analysisId"
            element={<AIResultsPage />}
          />

          {/* annotation routes */}

          <Route
            path="inspection/:inspectionId/annotation/:analysisId"
            element={<AnnotationWorkspacePage />}
          />

          <Route
            path="inspection/:inspectionId/validation/:analysisId"
            element={<ValidationPage />}
          />

          {/* report routes */}

          <Route
            path="reports"
            element={<ReportsPage />}
          />
          {/* 
          <Route
            path="reports/:reportId"
            element={<ReportDetailsPage />}
          /> */}

          <Route
            path="profile"
            element={<Profile />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;