import { useState } from "react";
import { AuthProvider } from "./components/Auth/Auth";
import { BrowserRouter } from "react-router-dom";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import Landing from "./pages/Authentication/Landing";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
