// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import HackathonDetail from "./pages/HackathonDetail";
import { Toaster } from 'react-hot-toast';
import PublicProfile from "./pages/PublicProfile";


export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/hackathons/:id" element={<HackathonDetail />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
        {/* <Route path="*" element={<Login />} /> */}
      </Routes>
    </>

  );
}