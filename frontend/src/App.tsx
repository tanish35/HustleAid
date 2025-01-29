import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
// import HomePage from './pages/HomePage';
import TokenPage from "./pages/TokenPage";
import VendorDetails from "./pages/VendorDetailsPage";
import TransactionDetails from "./pages/TransactionDetailsPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/tokens" element={<TokenPage />} />
        <Route
          path="/transactions/:tokenType"
          element={<TransactionDetails />}
        />
        <Route path="/vendor/:walletAddress" element={<VendorDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
