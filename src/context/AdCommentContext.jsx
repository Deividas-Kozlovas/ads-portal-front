/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";
import axiosInstance from "../services/axiosInstance";

// Create a context
const AdCommentContext = createContext();

// Provider component to wrap your app
export const AdCommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommentsForAd = async (adId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/ad-comment/${adId}`);
      setComments(response.data.data.allAdComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err?.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdCommentContext.Provider
      value={{ comments, loading, error, fetchCommentsForAd }}
    >
      {children}
    </AdCommentContext.Provider>
  );
};

export const useAdComments = () => {
  const context = useContext(AdCommentContext);
  if (!context) {
    throw new Error("useAdComments must be used within an AdCommentProvider");
  }
  return context;
};
