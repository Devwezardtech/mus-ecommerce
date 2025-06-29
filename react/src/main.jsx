// 📁 main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContect.jsx";
import "./index.css";
import Footer from "./layouts/footer.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <React.StrictMode>
    <App />
    <Footer />
  </React.StrictMode>
  </AuthProvider>
);
