/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../services/axiosInstance";

const initialState = {
  categories: [],
  loading: false,
  error: "",
};

const CategoryContext = createContext(initialState);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/category");
        if (response.data.status === "success") {
          const cats = response.data.data.categories;
          if (cats.length === 0) {
            setError("No categories found");
          }
          setCategories(cats);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, setCategories, loading, error }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
