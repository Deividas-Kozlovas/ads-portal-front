import React, { useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { useCategories } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const CategoryTableComponent = () => {
  const { categories, loading, error } = useCategories();
  const [deleteError, setDeleteError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setDeleteLoading(true);
      try {
        await axiosInstance.delete(`/category/${categoryId}`);

        setDeleteError(null);

        navigate(0);
      } catch (err) {
        console.error(err);
        setDeleteError("Failed to delete category.");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div>
      <h2>Categories</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {deleteError && <Alert variant="danger">{deleteError}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.title}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(category._id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No categories available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoryTableComponent;
