// import { Route } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
// import DashboardLayout from "../layouts/DashboardLayout";
// import Dashboard from "../pages/dashboard/Dashboard";
// import UploadInspection from "../pages/dashboard/UploadInspection";
// import AnalysisResult from "../pages/dashboard/AnalysisResult";
// import InspectionHistory from "../pages/dashboard/InspectionHistory";

// export function DashboardRoutes() {
//     return (
//         <Route
//             path="/dashboard"
//             element={
//                 <ProtectedRoute>
//                     <DashboardLayout />
//                 </ProtectedRoute>
//             }
//         >
//             <Route index element={<Dashboard />} />
//             <Route path="upload-inspection" element={<UploadInspection />} />
//             <Route path="analysis-result" element={<AnalysisResult />} />
//             <Route path="inspection-history" element={<InspectionHistory />} />
//         </Route>
//     );
// }