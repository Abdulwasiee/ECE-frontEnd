import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Authentication/Landing";
import Protect from "./components/Protection/protect";
import Home from "./pages/Home/Home";
function Router() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Landing />} />
        <Route
          path="/home"
          element={
            <Protect>
              <Home />
            </Protect>
          }
        />
      </Routes>
    </>
  );
}

export default Router;
