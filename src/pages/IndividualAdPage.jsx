import React, { useState, useEffect } from "react";
import { Spinner, Alert, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAds } from "../context/AdContext";
import { useCategories } from "../context/CategoryContext";
import CommentsFormComponent from "../components/CommentsFormComponent";
import CommentsTableComponent from "../components/CommentsTableComponent";

const IndividualAdPage = () => {
  const { adId } = useParams();
  const { ads, loading: adsLoading, error: adsError } = useAds();
  const { categories } = useCategories();
  const [ad, setAd] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const selectedAd = ads.find((ad) => ad._id === adId);
    if (selectedAd) {
      setAd(selectedAd);
      const category = categories.find(
        (cat) => cat._id === selectedAd.category
      );
      setCategoryTitle(category ? category.title : "No category");
    }
  }, [adId, ads, categories]);

  if (adsLoading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div className="container mt-5">
      {adsError && <Alert variant="danger">{adsError}</Alert>}

      {ad ? (
        <Card>
          <Card.Body>
            <Card.Title>{ad.title}</Card.Title>
            <Card.Text>{ad.description}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">
              {ad.price} $
            </Card.Subtitle>
            <Card.Text>City: {ad.city}</Card.Text>
            <Card.Text>Category: {categoryTitle}</Card.Text>{" "}
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="danger">Ad not found.</Alert>
      )}

      <Button
        variant="secondary"
        onClick={() => navigate("/")}
        className="mt-3"
      >
        Back to Ads
      </Button>
      <CommentsFormComponent adId={adId} />
      <CommentsTableComponent adId={adId} />
    </div>
  );
};

export default IndividualAdPage;
