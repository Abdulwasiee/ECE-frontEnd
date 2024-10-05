import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import styles from "./Home.module.css";
import { AuthContext } from "../../components/Auth/Auth";
import Encryptor from "../../components/Protection/Encryptor";

const Home = () => {
  const { userInfo } = useContext(AuthContext);
  const user_id = Encryptor.encrypt(userInfo.user_id);
  const { role_id } = userInfo;

  const renderMenu = () => {
    if (!role_id) return null;

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
        { to: `/contact/${user_id}`, text: "Contact Address" },
        { to: "/news", text: "News" },
      ],
      4: [
        { to: "/news", text: "News" },
        { to: "/users", text: "Staff" },
        { to: `/contact/${user_id}`, text: "Contact Address" },
        { to: "/students", text: "Students" },
        { to: "/myCourses", text: "My Courses" },
        { to: "/courses", text: "Courses" },
      ],
      5: [
        { to: "/users", text: "Staff" },
        { to: "/courses", text: "Courses" },
        { to: "/news", text: "News" },
        { to: "/students", text: "Students" },
        { to: `/contact/${user_id}`, text: "Contact Address" },
      ],
    };

    const menu = menuItems[role_id] || [];

    return (
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menu.map((item, index) => (
            <li key={index} className={styles.menuItem}>
              <Link to={item.to} className={styles.menuLink}>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <Layout>
      <div className={styles.homeContainer}>
        <div className={styles.welcomeContainer}>
          <h2 className={styles.welcomeMessage}>Welcome to the Dashboard</h2>
          <div className={styles.menuContainer}>{renderMenu()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
