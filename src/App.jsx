import { useState } from "react";
import { AuthProvider } from "./components/Auth/Auth";
import { BrowserRouter } from "react-router-dom";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
