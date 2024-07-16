import Home from "./pages/Homepage";
import NoPage from "./pages/Error";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="*" element={<NoPage/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App