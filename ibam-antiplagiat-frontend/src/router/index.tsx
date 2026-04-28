import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
// Étudiant
const DashboardEtudiant = lazy(() => import("@/pages/etudiant/DashboardEtudiant"));
const MesThemesPage = lazy(() => import("@/pages/etudiant/MesThemesPage"));
const SoumettreThemePage = lazy(() => import("@/pages/etudiant/SoumettreThemePage"));
const MesRapportsPage = lazy(() => import("@/pages/etudiant/MesRapportsPage"));
const DeposerRapportPage = lazy(() => import("@/pages/etudiant/DeposerRapportPage"));

// Chef de département
const DashboardChefPage = lazy(() => import("@/pages/chef_dept/DashboardChefPage"));
const ThemesAValiderPage = lazy(() => import("@/pages/chef_dept/ThemesAValiderPage"));
const DetailRapportChefPage = lazy(() => import("@/pages/chef_dept/DetailRapportChefPage"));
const ResultatAnalysePage = lazy(() => import("@/pages/chef_dept/ResultatAnalysePage"));

// Directeur adjoint
const DashboardDirPage = lazy(() => import("@/pages/dir_adjoint/DashboardDirPage"));
const SessionsPage = lazy(() => import("@/pages/dir_adjoint/SessionsPage"));
const RapportsAValiderPage = lazy(() => import("@/pages/dir_adjoint/RapportsAValiderPage"));

// Administrateur
const DashboardAdminPage = lazy(() => import("@/pages/admin/DashboardAdminPage"));
const GestionUtilisateursPage = lazy(() => import("@/pages/admin/GestionUtilisateursPage"));

// Composants factices pour l'instant pour éviter des erreurs lors du rendu sur les pages non implémentées
const FallbackPage = () => <div className="p-8">Page en construction</div>;

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Suspense><LoginPage /></Suspense> },
      { path: "/mot-de-passe-oublie", element: <Suspense><FallbackPage /></Suspense> },
      { path: "/reinitialiser", element: <Suspense><FallbackPage /></Suspense> },
    ],
  },
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <RoleRoute /> },

      // Étudiant
      { path: "/etudiant/dashboard",       element: <RoleRoute roles={["ETUDIANT"]}><Suspense><DashboardEtudiant /></Suspense></RoleRoute> },
      { path: "/etudiant/themes",          element: <RoleRoute roles={["ETUDIANT"]}><Suspense><MesThemesPage /></Suspense></RoleRoute> },
      { path: "/etudiant/themes/nouveau",  element: <RoleRoute roles={["ETUDIANT"]}><Suspense><SoumettreThemePage /></Suspense></RoleRoute> },
      { path: "/etudiant/rapports",        element: <RoleRoute roles={["ETUDIANT"]}><Suspense><MesRapportsPage /></Suspense></RoleRoute> },
      { path: "/etudiant/rapports/deposer", element: <RoleRoute roles={["ETUDIANT"]}><Suspense><DeposerRapportPage /></Suspense></RoleRoute> },

      // Chef
      { path: "/chef/dashboard",   element: <RoleRoute roles={["CHEF_DEPT"]}><Suspense><DashboardChefPage /></Suspense></RoleRoute> },
      { path: "/chef/themes",      element: <RoleRoute roles={["CHEF_DEPT"]}><Suspense><ThemesAValiderPage /></Suspense></RoleRoute> },
      { path: "/chef/rapports",    element: <RoleRoute roles={["CHEF_DEPT"]}><Suspense><DetailRapportChefPage /></Suspense></RoleRoute> }, // Ou une liste de rapports
      { path: "/chef/rapports/:id", element: <RoleRoute roles={["CHEF_DEPT"]}><Suspense><DetailRapportChefPage /></Suspense></RoleRoute> },
      { path: "/chef/analyses/:analyseId", element: <RoleRoute roles={["CHEF_DEPT"]}><Suspense><ResultatAnalysePage /></Suspense></RoleRoute> },

      // Dir adjoint
      { path: "/directeur/dashboard",  element: <RoleRoute roles={["DIR_ADJOINT"]}><Suspense><DashboardDirPage /></Suspense></RoleRoute> },
      { path: "/directeur/sessions",   element: <RoleRoute roles={["DIR_ADJOINT"]}><Suspense><SessionsPage /></Suspense></RoleRoute> },
      { path: "/directeur/rapports",   element: <RoleRoute roles={["DIR_ADJOINT"]}><Suspense><RapportsAValiderPage /></Suspense></RoleRoute> },

      // Admin
      { path: "/admin/dashboard",     element: <RoleRoute roles={["ADMIN"]}><Suspense><DashboardAdminPage /></Suspense></RoleRoute> },
      { path: "/admin/utilisateurs",  element: <RoleRoute roles={["ADMIN"]}><Suspense><GestionUtilisateursPage /></Suspense></RoleRoute> },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
