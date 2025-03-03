import { useState } from "react";
import { axiosInstance } from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password, passwordConfirm } = formData;

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email is in bad format");
      return;
    }

    if (password.length < 8) {
      setError("Password must be longer than 7 characters");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/user/register", {
        name,
        email,
        password,
        passwordConfirm,
      });

      setError("");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(`Error: ${error}`);
      setError("Something went wrong while registering, try again later.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="passwordConfirm"
        placeholder="Confirm Password"
        value={formData.passwordConfirm}
        onChange={handleChange}
        required
      />
      <button type="submit">{loading ? "Registering..." : "Register"}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Register;
