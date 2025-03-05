import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all ads on component mount (only once)
  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/ads");
        setAds(response.data);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Add an ad to the state without re-fetching
  const addAd = (newAd) => {
    setAds((prevAds) => [...prevAds, newAd]);
  };

  // Delete an ad from the state without re-fetching
  const deleteAd = (adId) => {
    setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
  };

  // Update an ad in the state without re-fetching
  const updateAd = (updatedAd) => {
    setAds((prevAds) =>
      prevAds.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad))
    );
  };

  // Perform a server-side action (create, update, delete) and update local state
  const handleAddAd = async (newAd) => {
    try {
      const response = await axiosInstance.post("/ads", newAd);
      // After successfully creating the ad, add it to the state
      addAd(response.data); // Add the newly created ad to the state
    } catch (error) {
      console.error("Failed to create ad:", error);
    }
  };

  const handleDeleteAd = async (adId) => {
    try {
      await axiosInstance.delete(`/ads/${adId}`);
      // After successfully deleting the ad, remove it from the state
      deleteAd(adId);
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const handleUpdateAd = async (updatedAd) => {
    try {
      const response = await axiosInstance.put(
        `/ads/${updatedAd.id}`,
        updatedAd
      );
      // After successfully updating the ad, update it in the state
      updateAd(response.data); // Update the ad in the state
    } catch (error) {
      console.error("Failed to update ad:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ads,
        loading,
        handleAddAd,
        handleDeleteAd,
        handleUpdateAd,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
