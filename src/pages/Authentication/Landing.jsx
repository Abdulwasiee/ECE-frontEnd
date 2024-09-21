import React, { memo } from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Register from "../../components/Register/Register";
import SignIn from "../../components/SignIn/SignIn";
import landingStyles from "./Landing.module.css";

const Landing = () => {
  const location = useLocation(); // Get the current path
  const isRegisterPage = location.pathname === "/register";

  return (
    <Layout>
      <section className={landingStyles.landingContainer}>
        <div className={landingStyles.authenticationContainer}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <div className={landingStyles.authSwitch}>
            <p>
              {isRegisterPage
                ? "Already have an account? "
                : "Don’t have an account? "}
              <Link
                to={isRegisterPage ? "/signIn" : "/register"}
                className={landingStyles.authLink}
              >
                {isRegisterPage ? "Sign in here" : "Register here"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default memo(Landing);
