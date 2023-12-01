import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signUp" element={<SignupPage />} />
      </Routes>
    </Router>
    // <div>Hello</div>
  );
}

export default App;
