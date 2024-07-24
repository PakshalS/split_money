import Home from "./pages/Homepage";
import NoPage from "./pages/Error";
import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Signup";
import ProtectedRoute from "./components/protectedroute";
import Homee from "./components/secure/main2";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NoPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute><Homee/></ProtectedRoute>} />
    </Routes>
  );
}


export default App;
