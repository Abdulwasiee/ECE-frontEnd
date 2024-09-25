import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Authentication/Landing";
import Protect from "./components/Protection/protect";
import Home from "./pages/Home/Home";
import NewsPage from "./pages/News/NewsPage";
import CoursePage from "./pages/Course/CoursePage";
import AddCoursePage from "./pages/Course/AddCourse";
import StudentPage from "./pages/Users/StudentsPage";
import UsersPage from "./pages/Users/UsersPage";
import CreateUserPage from "./pages/Users/CreateUser";
import PostNews from "./pages/News/PostNews";
import MyNewsPage from "./pages/News/MyPost";
import FileUploadPage from "./pages/Material/PostMaterial";
import MaterialPage from "./pages/Material/MaterialPage";
import StaffCoursePage from "./pages/Course/staffCourse";
import ContactPage from "./pages/Contact/ContactPage";
import PostContactInfo from "./pages/Contact/PostContact";
import AssignStaffPage from "./pages/Users/AssignStaff";
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
        <Route
          path="/news"
          element={
            <Protect>
              <NewsPage />
            </Protect>
          }
        />
        <Route
          path="/courses"
          element={
            <Protect>
              <CoursePage />
            </Protect>
          }
        />
        <Route
          path="/addCourse"
          element={
            <Protect>
              <AddCoursePage />
            </Protect>
          }
        />
        <Route
          path="/students"
          element={
            <Protect>
              <StudentPage />
            </Protect>
          }
        />
        <Route
          path="/users"
          element={
            <Protect>
              <UsersPage />
            </Protect>
          }
        />
        <Route
          path="/createUser"
          element={
            <Protect>
              <CreateUserPage />
            </Protect>
          }
        />
        <Route
          path="/postNews"
          element={
            <Protect>
              <PostNews />
            </Protect>
          }
        />
        <Route
          path="/myPosts"
          element={
            <Protect>
              <MyNewsPage />
            </Protect>
          }
        />
        <Route
          path="/postMaterial/:courseId"
          element={
            <Protect>
              <FileUploadPage />
            </Protect>
          }
        />
        <Route
          path="/materials/:courseId"
          element={
            <Protect>
              <MaterialPage />
            </Protect>
          }
        />
        <Route
          path="/myCourses"
          element={
            <Protect>
              <StaffCoursePage />
            </Protect>
          }
        />
        <Route
          path="/contact/:userId"
          element={
            <Protect>
              <ContactPage />
            </Protect>
          }
        />
        <Route
          path="/addContact"
          element={
            <Protect>
              <PostContactInfo />
            </Protect>
          }
        />
        <Route
          path="/assignstaff/:batchCourseId"
          element={
            <Protect>
              <AssignStaffPage />
            </Protect>
          }
        />
      </Routes>
    </>
  );
}

export default Router;
