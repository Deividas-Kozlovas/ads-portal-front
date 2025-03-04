import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdCardComponent from "../components/AdCardComponent";
import { Container } from "react-bootstrap";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Container className="pt-5">
        <AdCardComponent />
      </Container>
    </div>
  );
};

export default HomePage;
