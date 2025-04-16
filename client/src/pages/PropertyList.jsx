import { useEffect, useState } from "react";
import "../styles/List.scss";
import  Loader  from "../components/Loader";
import {Navbar}  from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setPropertyList } from "../redux/state";
import axios from "axios";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const PropertyList = () => {
  const propertyList = useSelector((state) => state.user.propertyList);
  const userId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getPropertyList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/${userId}/properties`
      );
      const data = response.data;
      dispatch(setPropertyList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Property List failed!", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!propertyList || propertyList.length === 0) {
    return (
      <div>
        <Navbar />
        <h1 className="title-list">Your Property List</h1>
        <p className="empty-message">No properties found in your list.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>
      <div className="list">
        {propertyList.map((property) => (
          <ListingCard
            key={property._id}
            listingId={property._id}
            creator={property.creator}
            listingPhotoPath={property.listingPhotoPath}
            city={property.city}
            province={property.province}
            country={property.country}
            category={property.category}
            startDate={property.startDate}
            endDate={property.endDate}
            totalPrice={property.price}
            booking={true}
          />
        ))}
      </div>

      <Footer/>
    </div>
  );
};

export default PropertyList;