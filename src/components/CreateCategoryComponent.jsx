import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const CreateCategoryForm = () => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCategoryTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!categoryTitle.trim()) {
      setError("Category title is required.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please login.");
        return;
      }

      const response = await axiosInstance.post(
        "/category",
        { title: categoryTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setCategoryTitle("");
        setSuccess("Category created successfully!");
      }
      setLoading(false);

      navigate(0);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        setError(error.response.data.message || "Something went wrong.");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Category</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCategoryTitle" className="p-2">
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter category title"
            value={categoryTitle}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Creating...
            </>
          ) : (
            "Create Category"
          )}
        </Button>
      </Form>

      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default CreateCategoryForm;
