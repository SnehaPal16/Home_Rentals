import React, { useState } from "react";
import "../styles/login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const loggedIn = await response.json();

        console.log(loggedIn);

        // Store user role in localStorage after successful login
        localStorage.setItem("token", loggedIn.token);
        localStorage.setItem("user", JSON.stringify(loggedIn.user));
        localStorage.setItem("userRole", loggedIn.user.role);

        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        // Redirect based on user role
        if (loggedIn.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/"); // Redirect to the home page or user dashboard
        }
      } else {
        const error = await response.json();
        console.error("Login failed:", error.message);
        alert(error.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">LOG IN</button>
        </form>
        <a href="/register">Don't have an account? SignUp here</a>
      </div>
    </div>
  );
};

export default LoginPage;
