import React, { useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { useAds } from "../context/AdContext";
import axiosInstance from "../services/axiosInstance";

const AdTableComponent = () => {
  const { ads, loading, error, setAds } = useAds();
  const [deleteError, setDeleteError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async (adId) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      setDeleteLoading(true);
      try {
        await axiosInstance.delete(`/ads/${adId}`);
        setDeleteError(null);
        setAds((prevAds) => prevAds.filter((ad) => ad._id !== adId));
        navigator(0);
      } catch (err) {
        console.error(err);
        setDeleteError("Failed to delete ad.");
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
      <h2>Ads</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {deleteError && <Alert variant="danger">{deleteError}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>City</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(ads) && ads.length > 0 ? (
            ads.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td>{ad.price}</td>
                <td>{ad.city}</td>
                <td>{ad.category?.title}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(ad._id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No ads available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdTableComponent;
