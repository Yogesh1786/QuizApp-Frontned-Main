import axios from "axios";
import React, { useState } from "react";
import { baseUrl } from "../api";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOff } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ fetchUserDetails }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(`${baseUrl}/api/user/login`, {
        email,
        password,
      });

      if (response.status) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        toast.success("Login Successful 🎉");
        fetchUserDetails(response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("error", error);
      toast.error("Username or password is incorrect ❌");
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <ToastContainer />
      <div className="p-4 shadow border bg-white" style={{ width: "500px" }}>
        <h2 className="text-center fw-bold mb-3">Login</h2>
        <p className="text-center text-muted mb-4">Welcome back 👋</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              className="form-control border-0 border-bottom rounded-0"
              id="email"
              placeholder="e.g. johndoe@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control border-0 border-bottom rounded-0"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary border-0"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <IoEyeOff /> : <IoEyeOutline />}
              </button>
            </div>
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
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <small>
            Not registered yet?{" "}
            <Link
              to="/registration"
              className="text-decoration-none fw-semibold"
            >
              Create an account
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
