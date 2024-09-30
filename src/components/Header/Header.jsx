import React, { useContext, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineHome,
} from "react-icons/ai";
import { AuthContext } from "../Auth/Auth";
import styles from "./Header.module.css";

const Header = () => {
  const { isAuthenticated, logout, userInfo } = useContext(AuthContext);
  const roleId = userInfo.role_id;
  const location = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [navVisible, setNavVisible] = useState(false); // State to manage nav visibility

  const renderMenu = () => {
    if (!roleId || location.pathname === "/home") return null;

    const menuItems = {
      1: [
        { to: "/news", text: "News" },
        { to: "/courses", text: "Courses" },
        { to: "/students", text: "Students" },
        { to: "/users", text: "Users" },
      ],
      2: [
        { to: "/users", text: "Staff" },
        { to: "/courses", text: "Courses" },
        { to: "/news", text: "News" },
      ],
      3: [
        { to: "/myCourses", text: "My Courses" },
        { to: `/contact/${userInfo.user_id}`, text: "Contact Address" },
        { to: "/news", text: "News" },
      ],
      4: [
        { to: "/news", text: "News" },
        { to: "/users", text: "Staff" },
        { to: `/contact/${userInfo.user_id}`, text: "Contact Address" },
      ],
      5: [
        { to: "/users", text: "Staff" },
        { to: "/courses", text: "Courses" },
        { to: "/news", text: "News" },
        { to: "/students", text: "Students" },
      ],
    };

    return (
      <ul className={styles.menuList}>
        {menuItems[roleId]?.map((item) => (
          <li key={item.to} className={styles.navItem}>
            <Link
              to={item.to}
              className={styles.navLink}
              onClick={() => setNavVisible(false)} // Hide nav on link click
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const toggleNav = () => {
    setNavVisible(!navVisible); // Toggle visibility
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logoText}>ECE Department</h1>
      </div>
      {!isAuthenticated && (
        <div>
          <ul>
            <li className={styles.navItem}>
              <Link to="/" className={styles.navLink}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
      <div>
        <div className={styles.toggleMenu} onClick={toggleNav}>
          {navVisible ? "❌" : "☰"} {/* Toggle icon */}
        </div>
        <div
          className={`${styles.navContainer} ${
            navVisible ? styles.active : ""
          }`}
        >
          {/* Render conditional menu based on role and route */}
          {isAuthenticated && location.pathname !== "/home" && renderMenu()}
          {/* Profile, Settings, Home, and Logout Icons */}
          <div className={styles.icons}>
            {isAuthenticated && (
              <div className={styles.lowerHeader}>
                <ul className={styles.profileMenu}>
                  <li className={styles.navItem}>
                    <Link to="/home" className={styles.navLink}>
                      <AiOutlineHome
                        className={`${styles.icon} ${styles.homeIcon}`}
                      />
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to={`/profile`} className={styles.navLink}>
                      <AiOutlineUser
                        className={`${styles.icon} ${styles.profileIcon}`}
                      />
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/settings" className={styles.navLink}>
                      <AiOutlineSetting
                        className={`${styles.icon} ${styles.settingIcon}`}
                      />
                    </Link>
                  </li>
                  <li className={styles.navItem} onClick={logout}>
                    <AiOutlineLogout
                      className={`${styles.icon} ${styles.logoutIcon}`}
                    />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
