import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import NavigationComponent from "./components/NavigationComponent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { CategoryProvider } from "./context/CategoryContext";
import { AdProvider } from "./context/AdContext";

function App() {
  return (
    <Router>
      <CategoryProvider>
        <AdProvider>
          <NavigationWithVisibility />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AdProvider>
      </CategoryProvider>
    </Router>
  );
}

const NavigationWithVisibility = () => {
  const location = useLocation();

  const shouldHideNavbar =
    location.pathname === "/register" || location.pathname === "/login";

  return <>{!shouldHideNavbar && <NavigationComponent />}</>;
};

export default App;
