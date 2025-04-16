import React, { useEffect, useState } from "react";
import "../styles/listings.scss";
import { categories } from "../data";
import Loader from "./Loader";
import ListingCard from "./ListingCard";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setListings } from "../redux/state";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const listings = useSelector((state) => state.listings);

  const getFeedListing = async () => {
    try {
      const response = await axios.get(
        selectedCategory !== "All"
          ? `http://localhost:8080/properties?category=${selectedCategory}`
          : "http://localhost:8080/properties"
      );
      console.log("first");
      const data = await response.data;
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListing();
  }, [selectedCategory]);

  console.log(listings);
  return (
    <div>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${category.label === selectedCategory ? "selected" : ""}`}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {listings.map(
            (
              {_id,
              creator,
              listingPhotoPath,
              city,
              provience,
              country,
              category,
              type,
              price,
              booking=false}
            ) => (
              <ListingCard 
                listingId = {_id}
                creator = {creator}
                listingPhotoPath = {listingPhotoPath}
                city = {city}
                provience = {provience}
                country = {country}
                category = {category}
                type = {type}
                price = {price}
                booking = {booking}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Listings;
