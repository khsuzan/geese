import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPassword onBack={() => window.history.back()} />} />
      </Routes>
    </BrowserRouter>
  );
}
