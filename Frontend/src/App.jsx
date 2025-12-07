import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Homepage";
import NoPage from "./pages/Error";
import Login from "./components/auth/Login";
import Register from "./components/auth/Signup";
import ProtectedRoute from "./components/protectedroute";
import Friends from "./components/secure/friends/friends";
import Settings from "./components/secure/settings/settings";
import GroupDetails from "./components/secure/group/groupdetails";
import ForgotPassReq from "./components/auth/ForgotPass";
import MainLayout from "./components/secure/shared/layout";

function App() {
  return (
    <Routes>
      {/* Public routes WITHOUT Layout */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassReq />} />

      {/* Protected routes WITH MainLayout (persistent navbar + sidebar) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Home/Groups page - shows group list */}
        <Route path="home" element={<></>} />
        
        {/* Friends page */}
        <Route path="friends" element={<Friends />} />
        
        {/* Settings page */}
        <Route path="settings" element={<Settings />} />
        
        {/* Group Details page (will show in right panel on desktop) */}
        <Route path="groups/:groupId" element={<GroupDetails />} />
      </Route>

      <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default App;