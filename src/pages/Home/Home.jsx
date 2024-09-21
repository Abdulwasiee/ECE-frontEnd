import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import styles from "./Home.module.css";
import { AuthContext } from "../../components/Auth/Auth";

const Home = () => {
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo.user_id;
  const roleId = userInfo.role_id;
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current position in the menu

  const renderMenu = () => {
    if (!roleId) return null;

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
        { to: `/contact/${userId}`, text: "Contact Address" },
        { to: "/news", text: "News" },
      ],
      4: [
        { to: "/news", text: "News" },
        { to: "/users", text: "Staff" },
        { to: `/contact/${userId}`, text: "Contact Address" },
      ],
      5: [
        { to: "/users", text: "Staff" },
        { to: "/courses", text: "Courses" },
        { to: "/news", text: "News" },
        { to: "/students", text: "Students" },
      ],
    };

    const menu = menuItems[roleId] || [];
    const visibleItems = menu.slice(currentIndex, currentIndex + 3); // Show 3 items at a time

    return (
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {visibleItems.map((item, index) => (
            <li key={index} className={styles.menuItem}>
              <Link to={item.to} className={styles.menuLink}>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.navButtons}>
          <button
            className={styles.navButton}
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
          >
            &larr; Prev
          </button>
          <button
            className={styles.navButton}
            onClick={() =>
              setCurrentIndex((prev) => Math.min(prev + 1, menu.length - 3))
            }
            disabled={currentIndex >= menu.length - 3}
          >
            Next &rarr;
          </button>
        </div>
      </nav>
    );
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <Layout>
      <div className={styles.homeContainer}>
        <h1 className={styles.heading}>Welcome to the Dashboard</h1>
        {renderMenu()}
      </div>
    </Layout>
  );
};

export default Home;
