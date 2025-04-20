import axios from "axios";
import React, { useState } from "react";
import { baseUrl } from "../api";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseUrl}/api/user/signup`, {
        name,
        email,
        password,
      });

      if (data.status) {
        toast.success("Hurraay! Account created 🎉");
        navigate("/login");
      }
    } catch (error) {
      console.error("error", error);
      toast.error("Something went wrong during signup ❌");
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <ToastContainer />
      <div className="p-4 shadow border bg-white" style={{ width: "500px" }}>
        <h2 className="text-center fw-bold mb-3">Sign Up</h2>
        <p className="text-center text-muted mb-4">Create your account 👤</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Name
            </label>
            <input
              type="text"
              className="form-control border-0 border-bottom rounded-0"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              className="form-control border-0 border-bottom rounded-0"
              id="email"
              placeholder="E.g. johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control border-0 border-bottom rounded-0"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>

          <button type="submit" className="btn btn-dark w-100 fw-semibold">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <small>
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Login here
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signup;
