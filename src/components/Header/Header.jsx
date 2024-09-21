import React, { useContext } from "react";
import { AuthContext } from "../Auth/Auth";
import styles from "./Header.module.css";

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext); 

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logoText}>ECE Department</h1>
      </div>
      <nav className={styles.navContainer}>
        <ul className={styles.navList}>
          {isAuthenticated ? (
            <li onClick={logout} className={styles.navItem}>
              Logout
            </li>
          ) : (
            <li className={styles.navItem}>
              <a href="/" className={styles.navLink}>
                Login
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
