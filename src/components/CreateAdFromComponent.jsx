import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../context/CategoryContext";
import axiosInstance from "../services/axiosInstance";

const CreateAddFormComponent = () => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    image: "",
    city: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, price, image, city, category } = formData;
    if (!title || !description || !price || !image || !city || !category) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please login.");
        return;
      }

      const response = await axiosInstance.post("ads", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setError("");
        navigate(0);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create New Ad</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle" className="p-2">
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter ad title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="p-2">
          <Form.Control
            type="text"
            name="description"
            placeholder="Enter ad description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPrice" className="p-2">
          <Form.Control
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formImage" className="p-2">
          <Form.Control
            type="text"
            name="image"
            placeholder="Enter image URL"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCity" className="p-2">
          <Form.Control
            type="text"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCategory" className="p-2">
          <Form.Control
            as="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </Form.Control>
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
              Posting...
            </>
          ) : (
            "Create Ad"
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

export default CreateAddFormComponent;
