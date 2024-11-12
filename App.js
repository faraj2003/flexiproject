import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ChooseUser from "./pages/ChooseUser";
import Chatbot from "./components/Chatbot";

const App = () => {
  const { currentRole } = useSelector((state) => state.user);

  return (
    <Router>
      {currentRole === null && (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser visitor="normal" />} />
          <Route
            path="/chooseasguest"
            element={<ChooseUser visitor="guest" />}
          />
          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
          <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
          <Route path="/Adminregister" element={<AdminRegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}

      {currentRole === "Admin" && (
        <>
          <AdminDashboard />
          <Chatbot /> {/* Render Chatbot in Admin dashboard */}
        </>
      )}

      {currentRole === "Student" && (
        <>
          <StudentDashboard />
          <Chatbot /> {/* Render Chatbot in Student dashboard */}
        </>
      )}

      {currentRole === "Teacher" && (
        <>
          <TeacherDashboard />
          <Chatbot /> {/* Render Chatbot in Teacher dashboard */}
        </>
      )}
    </Router>
  );
};

export default App;
