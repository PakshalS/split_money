import Home from "./pages/Homepage";
import NoPage from "./pages/Error";
import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Signup";
import ProtectedRoute from "./components/protectedroute";
import Homee from "./pages/main2";
import Friends from "./components/secure/friends";
import Settings from "./components/secure/settings";
import Creategroup from "./components/secure/creategroup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NoPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute><Homee/></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><Friends/></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
      <Route path="/create-group" element={<ProtectedRoute><Creategroup/></ProtectedRoute>} />
    </Routes>
  );
}


export default App;
