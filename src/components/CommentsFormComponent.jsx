import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import axiosInstance from "../services/axiosInstance";
const CommentsFormComponent = ({ adId }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const userId = loggedUser ? loggedUser.id : null;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (!userId) {
      setError("You must be logged in to comment.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        comment,
        ad: adId,
        user: userId,
      };

      const response = await axiosInstance.post("/ad-comment", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.status === "success") {
        setSuccess("Comment added successfully!");
        setComment("");
        setError("");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to add comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Leave a Comment</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formComment" className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your comment"
            value={comment}
            onChange={handleCommentChange}
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
              Adding Comment...
            </>
          ) : (
            "Add Comment"
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

export default CommentsFormComponent;
