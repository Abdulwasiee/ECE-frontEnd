import React, { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineHome, // Import the Home icon
} from "react-icons/ai"; // Icons for profile, settings, logout, and home
import { AuthContext } from "../Auth/Auth";
import styles from "./Header.module.css";

const Header = () => {
  const { isAuthenticated, logout, userInfo } = useContext(AuthContext);
  const roleId = userInfo.role_id;
  const location = useLocation();

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
            <Link to={item.to} className={styles.navLink}>
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logoText}>ECE Department</h1>
      </div>
      <nav className={styles.navContainer}>
        <ul className={styles.navList}>
          {isAuthenticated ? (
            <li onClick={logout} className={styles.navItem}>
              <AiOutlineLogout className={styles.icon} /> {/* Logout Icon */}
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

      {/* Render conditional menu based on role and route */}
      {isAuthenticated && location.pathname !== "/home" && renderMenu()}

      {/* Profile, Settings, Home, and Logout Icons */}
      {isAuthenticated && (
        <div className={styles.lowerHeader}>
          <ul className={styles.profileMenu}>
            <li className={styles.navItem}>
              <Link to="/home" className={styles.navLink}>
                {" "}
                {/* Home Icon */}
                <AiOutlineHome
                  className={`${styles.icon} ${styles.homeIcon}`}
                />
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                to={`/profile/${userInfo.user_id}`}
                className={styles.navLink}
              >
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
    </header>
  );
};

export default Header;
