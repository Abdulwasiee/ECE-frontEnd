import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import styles from "./Home.module.css";
import { AuthContext } from "../../components/Auth/Auth";
import Encryptor from "../../components/Protection/Encryptor";
import {
  FaNewspaper,
  FaBook,
  FaUsers,
  FaUserTie,
  FaEnvelope,
} from "react-icons/fa";

const Home = () => {
  const { userInfo } = useContext(AuthContext);
  const user_id = Encryptor.encrypt(userInfo.user_id);
  const { role_id } = userInfo;

  const renderMenu = () => {
    if (!role_id) return null;

    const menuItems = {
      1: [
        {
          to: "/news",
          text: "Announcement",
          description:
            "Stay informed! Click here to view the latest announcements and never miss an update.",
          icon: <FaNewspaper />,
        },
        {
          to: "/courses",
          text: "Courses",
          description: "Explore our diverse courses available.",
          icon: <FaBook />,
        },
        {
          to: "/students",
          text: "Students",
          description: "Connect with fellow students.",
          icon: <FaUsers />,
        },
        {
          to: "/users",
          text: "Users",
          description: "Manage user accounts and profiles.",
          icon: <FaUserTie />,
        },
      ],
      2: [
        {
          to: "/users",
          text: "Staff",
          description: "Meet our dedicated staff members.",
          icon: <FaUserTie />,
        },
        {
          to: "/courses",
          text: "Courses",
          description: "Discover courses tailored for you.",
          icon: <FaBook />,
        },
        {
          to: "/news",
          text: "Announcement",
          description:
            "Stay informed! Click here to view the latest announcements and never miss an update.",
          icon: <FaNewspaper />,
        },
      ],
      3: [
        {
          to: "/myCourses",
          text: "My Courses",
          description: "View and manage your enrolled courses.",
          icon: <FaBook />,
        },
        {
          to: `/contact/${user_id}`,
          text: "Contact Address",
          description: "Reach out to us for support.",
          icon: <FaEnvelope />,
        },
        {
          to: "/news",
          text: "Announcement",
          description:
            "Stay informed! Click here to view the latest announcements and never miss an update.",
          icon: <FaNewspaper />,
        },
      ],
      4: [
        {
          to: "/news",
          text: "Announcement",
          description:
            "Stay informed! Click here to view the latest announcements and never miss an update.",
          icon: <FaNewspaper />,
        },
        {
          to: "/users",
          text: "Staff",
          description: "Learn more about our staff.",
          icon: <FaUserTie />,
        },
        {
          to: `/contact/${user_id}`,
          text: "Contact Address",
          description: "Get in touch for inquiries.",
          icon: <FaEnvelope />,
        },
        {
          to: "/students",
          text: "Students",
          description: "Join the community of learners.",
          icon: <FaUsers />,
        },
        {
          to: "/myCourses",
          text: "My Courses",
          description: "Manage your course progress.",
          icon: <FaBook />,
        },
        {
          to: "/courses",
          text: "Courses",
          description: "Find the right course for you.",
          icon: <FaBook />,
        },
      ],
      5: [
        {
          to: "/users",
          text: "Staff",
          description: "Meet the team that supports you.",
          icon: <FaUserTie />,
        },
        {
          to: "/courses",
          text: "Courses",
          description: "Check out our exciting courses.",
          icon: <FaBook />,
        },
        {
          to: "/news",
          text: "Announcement",
          description:
            "Stay informed! Click here to view the latest announcements and never miss an update.",
          icon: <FaNewspaper />,
        },
        {
          to: "/students",
          text: "Students",
          description: "Engage with fellow learners.",
          icon: <FaUsers />,
        },
        {
          to: `/contact/${user_id}`,
          text: "Contact Address",
          description: "We're here to help you.",
          icon: <FaEnvelope />,
        },
      ],
    };
    const menu = menuItems[role_id] || [];

    return (
      <nav className={styles.nav}>
        <div className={styles.serviceContainer}>
          {menu.map((item, index) => (
            <div key={index} className={styles.singleService}>
              <Link to={item.to} className={styles.serviceLink}>
                <span className={styles.serviceIcon}>{item.icon}</span>
                <h6 className={styles.serviceTitle}>{item.text}</h6>
                <p className={styles.serviceDescription}>{item.description}</p>
              </Link>
            </div>
          ))}
        </div>
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
