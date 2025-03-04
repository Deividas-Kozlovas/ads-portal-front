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
import IndividualAdPage from "./pages/IndividualAdPage";
import { CategoryProvider } from "./context/CategoryContext";
import { AdProvider } from "./context/AdContext";
import { AdCommentProvider } from "./context/AdCommentContext";

function App() {
  return (
    <Router>
      <CategoryProvider>
        <AdProvider>
          <AdCommentProvider>
            <NavigationWithVisibility />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ad/:adId" element={<IndividualAdPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </AdCommentProvider>
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
