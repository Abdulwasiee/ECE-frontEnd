import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Authentication/Landing";
import Protect from "./components/Protection/protect";
import Home from "./pages/Home/Home";
import NewsPage from "./pages/News/NewsPage";
import CoursePage from "./pages/Course/CoursePage";
import AddCoursePage from "./pages/Course/AddCourse";
import StudentPage from "./pages/Users/StudentsPage";
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
      </Routes>
    </>
  );
}

export default Router;
