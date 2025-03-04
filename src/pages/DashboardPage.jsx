import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateAddFromComponent from "../components/CreateAdFromComponent";
import CreateCategoryComponent from "../components/CreateCategoryComponent";
import CategoryTableComponent from "../components/CategoryTableComponent";
import AdTableComponent from "../components/AdTableComponent";

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser.isAdmin) {
      navigate("/");
      return;
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <>
        <h2 className="mb-4">Dashboard</h2>
        <CreateCategoryComponent />
        <CategoryTableComponent />
        <CreateAddFromComponent />
        <AdTableComponent />
      </>
    </div>
  );
};

export default DashboardPage;
