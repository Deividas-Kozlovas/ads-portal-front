import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    const { email, password } = formData;

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/user/login", { email, password });
      setError("");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        setError(error.response.data.message || "Invalid Credentials");
      } else {
        setError("Network error. Please try again later.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      <Form onSubmit={handleSubmit}>
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
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
        <Row className="justify-content-center pt-2">
          <Col xs="auto">
            <p>
              Dent have account{" "}
              <Link className="auth-form__switch" to="/register">
                Register
              </Link>
            </p>
          </Col>
        </Row>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Form>
    </div>
  );
};

export default LoginPage;
