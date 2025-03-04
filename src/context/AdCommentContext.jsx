import React, { createContext, useState, useContext } from "react";
import axiosInstance from "../services/axiosInstance";

// Create a context
const AdCommentContext = createContext();

// Provider component to wrap your app
export const AdCommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch comments for a specific ad based on adId
  const fetchCommentsForAd = async (adId) => {
    setLoading(true); // Set loading to true before making the API call
    setError(null); // Clear any previous errors
    try {
      const response = await axiosInstance.get(`/ad-comment/${adId}`); // Updated URL to match API route
      setComments(response.data.data.allAdComments); // Save the comments from the API response
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err?.response?.data?.message || "Failed to load comments"); // Use error message from the server if available
    } finally {
      setLoading(false); // Set loading to false after the API call finishes
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

// Custom hook to access the context
export const useAdComments = () => {
  const context = useContext(AdCommentContext);
  if (!context) {
    throw new Error("useAdComments must be used within an AdCommentProvider");
  }
  return context;
};
