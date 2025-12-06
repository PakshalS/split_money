import { Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import NoPage from "./pages/Error";
import Login from "./components/auth/Login";
import Register from "./components/auth/Signup";
import ProtectedRoute from "./components/protectedroute";
import Homee from "./pages/main2";
import Friends from "./components/secure/friends/friends";
import Settings from "./components/secure/settings/settings";
import GroupCreate from "./components/secure/create-group/creategroup";
import GroupDetails from "./components/secure/group/groupdetails";
import Layout from "./components/layout";
import ForgotPassReq from "./components/auth/ForgotPass";

function App() {
  return (
    <Routes>
      {/* Landing page WITHOUT Layout */}
      <Route path="/" element={<Home />} />
    

      {/* Routes WITH Layout (persistent navbar) */}
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element = {<ForgotPassReq/>} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-group"
          element={
            <ProtectedRoute>
              <GroupCreate />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Group Details WITHOUT Layout (no navbar) */}
      <Route
        path="/groups/:groupId"
        element={
          <ProtectedRoute>
            <GroupDetails />
          </ProtectedRoute>
        }
      />

      {/* Error page */}
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default App;