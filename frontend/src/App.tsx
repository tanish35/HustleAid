import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
// import HomePage from './pages/HomePage';
import TokenPage from "./pages/TokenPage";
import { TransactionDetails } from "./pages/TransactionDetailsPage";

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
      </Routes>
    </Router>
  );
}

export default App;
