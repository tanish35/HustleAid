import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import TokenPage from "./pages/TokenPage";
import VendorDetails from "./pages/VendorDetailsPage";
import TransactionDetails from "./pages/TransactionDetailsPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TrainBookingPage from "./pages/TrainBookingPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dummy/train" element={<TrainBookingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/tokens" element={<TokenPage />} />
          <Route
            path="/transactions/:tokenType"
            element={<TransactionDetails />}
          />
          <Route path="/vendor/:walletAddress" element={<VendorDetails />} />
        </Route>

        <Route path="/" element={<Navigate to="/tokens" replace />} />

        {/* <Route path="*" element={<Navigate to="/tokens" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
