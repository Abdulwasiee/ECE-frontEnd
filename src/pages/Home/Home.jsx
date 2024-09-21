import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import styles from "./Home.module.css";
import { AuthContext } from "../../components/Auth/Auth";

const Home = () => {
  const { userInfo } = useContext(AuthContext);
  const { first_name, last_name, role_id, batch_ids, stream_id } = userInfo; // Destructure userInfo
  const [error, setError] = useState(null);

  const renderProfileCard = () => {
    return (
      <div className={styles.profileCard}>
        <h2>User Profile</h2>
        {first_name && <p>First Name: {first_name}</p>}
        {last_name && <p>Last Name: {last_name}</p>}
        {role_id && <p>Role ID: {role_id}</p>}
        {batch_ids.length > 0 && <p>Batch IDs: {batch_ids.join(", ")}</p>}
        {stream_id && <p>Stream ID: {stream_id}</p>}
      </div>
    );
  };

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

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <Layout>
      <div className={styles.homeContainer}>
        <h1 className={styles.heading}>Welcome to the Dashboard</h1>
        {renderProfileCard()}
        {renderMenu()}
      </div>
    </Layout>
  );
};

export default Home;
