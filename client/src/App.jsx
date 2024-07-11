import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import DoctorPage from "./pages/DoctorPage/DoctorPage";
import PatientPage from "./pages/PatientPage/PatientPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ErrorPage from "./pages/Error/ErrorPage";
import PrivateRoute from "./components/privateRoutes";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route
            path="/patient"
            element={<PrivateRoute element={PatientPage} />}
          />
          <Route
            path="/doctor"
            element={<PrivateRoute element={DoctorPage} />}
          />
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="*" element={<ErrorPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
