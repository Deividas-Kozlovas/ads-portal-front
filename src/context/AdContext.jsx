/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../services/axiosInstance";

const AdContext = createContext();

export const AdProvider = ({ children }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please login.");
          return;
        }

        const response = await axiosInstance.get("/ads", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAds(response.data.data.ads);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch ads.");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <AdContext.Provider value={{ ads, loading, error }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error("useAds must be used within an AdProvider");
  }
  return context;
};
