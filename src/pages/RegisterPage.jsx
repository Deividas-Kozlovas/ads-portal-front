import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

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
      console.error("Error:", error);
      if (error.response) {
        if (error.response.data.message === "Email already taken") {
          setError(
            "This email is already registered. Please choose another one."
          );
        } else {
          console.error("Error Response:", error.response.data);
          setError(
            error.response.data.message ||
              "Something went wrong while registering, try again later."
          );
        }
      } else {
        console.error("Network Error:", error.message);
        setError("Network error. Please try again later.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="p-2">
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="p-2">
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="p-2">
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPasswordConfirm" className="p-2">
          <Form.Control
            type="password"
            name="passwordConfirm"
            placeholder="Confirm your password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default Register;
