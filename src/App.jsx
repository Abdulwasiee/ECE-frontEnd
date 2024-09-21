import { useState } from "react";
import { AuthProvider } from "./components/Auth/Auth";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
