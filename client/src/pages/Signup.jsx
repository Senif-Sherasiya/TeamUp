import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 3) newErrors.name = "Name must be at least 3 characters";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";

    const password = form.password;
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(password))
      newErrors.password = "At least one uppercase letter required";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      newErrors.password = "At least one special character required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5070/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-slate-100 dark:from-[#0f0f0f] dark:via-[#131313] dark:to-[#1a1a1a] flex items-center justify-center px-4 py-12 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-8 backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create your account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full text-base py-2 rounded-xl">
            Sign Up
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6 dark:text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
