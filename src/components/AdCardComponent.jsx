import React, { useState } from "react";
import { Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useAds } from "../context/AdContext";
import { useCategories } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const AdCardComponent = () => {
  const { ads, loading, error, setAds } = useAds();
  const { categories } = useCategories();
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState(null);
  const navigator = useNavigate();

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const handleCardClick = (adId) => {
    navigator(`/ad/${adId}`);
  };

  const handleLike = async (adId) => {
    if (!loggedUser) return;

    setLikeLoading(true);
    try {
      const payload = {
        ad: adId,
        user: loggedUser.id,
      };

      const response = await axiosInstance.post("/like-ad", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.status === "success") {
        setLikeError(null);
        setAds((prevAds) =>
          prevAds.map((ad) =>
            ad._id === adId ? { ...ad, likes: response.data.data.likes } : ad
          )
        );
      }
    } catch (err) {
      console.error(err);
      setLikeError("Failed to like ad.");
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div>
      <h2>Ads</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {likeError && <Alert variant="danger">{likeError}</Alert>}
      <Row>
        {Array.isArray(ads) && ads.length > 0 ? (
          ads.map((ad) => {
            const hasLiked =
              ad.likes &&
              loggedUser &&
              ad.likes.some((like) => like.user === loggedUser.id);
            return (
              <Col key={ad._id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{ad.title}</Card.Title>
                    <Card.Text>{ad.description}</Card.Text>
                    <Card.Subtitle className="mb-2 text-muted">
                      {ad.price} $
                    </Card.Subtitle>
                    <Card.Text>City: {ad.city}</Card.Text>
                    <Card.Text>
                      Category:{" "}
                      {categories.find((cat) => cat._id === ad.category)
                        ?.title || "No category"}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Row className="w-100">
                      <Col className="d-flex justify-content-start">
                        <Button
                          style={{
                            height: "50px",
                          }}
                          variant="primary"
                          onClick={() => handleCardClick(ad._id)}
                        >
                          View Details
                        </Button>
                      </Col>
                      <Col className="d-flex justify-content-end">
                        <Button
                          variant="link"
                          onClick={() => handleLike(ad._id)}
                          disabled={likeLoading}
                          className="f"
                          style={{
                            padding: "0",
                          }}
                        >
                          <span
                            style={{
                              color: hasLiked ? "red" : "grey",
                              fontSize: "2.5em",
                            }}
                          >
                            ♥
                          </span>
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col>
            <p>No ads available.</p>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AdCardComponent;
