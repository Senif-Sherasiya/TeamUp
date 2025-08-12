import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5070/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-slate-100 dark:from-[#0f0f0f] dark:via-[#131313] dark:to-[#1a1a1a] flex items-center justify-center px-4 py-12 text-gray-900 dark:text-white transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-8 backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" className="w-full py-3 text-base rounded-xl">
            Login
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Sign up
          </Link>
        </p>

        </motion.div>
    </div>
  );
}
