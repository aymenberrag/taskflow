import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import TaskPage from "./pages/TaskPage";
import Tasks from "./pages/Tasks";

import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import ProtectedRoute from "./component/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/projects/:id"
            element={<ProjectPage />}
          />

          <Route
            path="/tasks/:id"
            element={<TaskPage />}
          />

          <Route
            path="/notifications"
            element={
              <Notifications />
            }
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;