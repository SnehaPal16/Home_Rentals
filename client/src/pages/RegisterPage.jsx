import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    role: "user", // Default role
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword || formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      setFormData({
        ...formData,
        profileImage: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const navigate = useNavigate();

  const sendUserData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("confirmPassword", formData.confirmPassword);
    formDataToSend.append("role", formData.role);

    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/registerSubmit",
        formDataToSend
      );
      setIsSubmitting(false);

      if (response.status === 201) {
        toast.success("Registration successful! Redirecting to login...", { autoClose: 3000 });
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      setIsSubmitting(false);
      toast.error("Error registering user. Please try again.");
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form">
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {!passwordMatch && <p style={{ color: "red" }}>Password Not Matched!</p>}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            style={{ display: "none" }}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Preview"
              style={{ maxWidth: "80px" }}
            />
          )}

          <button
            type="submit"
            disabled={!passwordMatch || isSubmitting}
            onClick={sendUserData}
          >
            {isSubmitting ? "Submitting..." : "REGISTER"}
          </button>
        </form>
        <a href="/login">Already Have An Account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
