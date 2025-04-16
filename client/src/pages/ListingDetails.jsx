import React, { useEffect, useState } from "react";
import "../styles/listingDetails.scss";
import "../styles/FeedbackCard.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { facilities } from "../data";
import Footer from "../components/Footer.jsx";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import { enUS } from "date-fns/locale";
import { Navbar } from "../components/Navbar";
import { useSelector } from "react-redux";
import FeedbackForm from "../components/FeedbackForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [hostId, setHostId] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const navigate = useNavigate();

  const getListingDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/properties/${listingId}`
      );
      const data = response.data;
      const creatorId = data.creator;
      setHostId(creatorId);
      setListing(data);
      setLoading(false);
      toast.success("Listing details loaded successfully!");
    } catch (error) {
      console.log("Fetch Listing Details Failed", error.message);
      toast.error("Failed to load listing details.");
    }
  };

  const getFeedbacks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/feedback/properties/${listingId}/feedbacks`
      );
      setFeedbacks(response.data);
      toast.success("Feedbacks fetched successfully!");
    } catch (error) {
      console.log("Fetch Feedbacks Failed", error.message);
      toast.error("Failed to fetch feedbacks.");
    }
  };

  useEffect(() => {
    getListingDetails();
    getFeedbacks();
  }, [listingId]);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const today = new Date();
  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);
  console.log(listing)

  const customerId = useSelector((state) => state?.user?._id);
  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        hostId,
        listingId,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };
      const result = await axios.post(
        "http://localhost:8080/booking/create",
        bookingForm
      );
      if (result.data.acknowledged) {
        toast.success("Booking created successfully!");
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("You Can't Book Your Own Property");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
        </div>

        <div className="photos">
          {listing.listingPhotoPath?.map((item) => (
            <img
              src={`http://localhost:8080/${item.replace("public", "")}`}
              alt="listing photos"
            />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province}, {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`http://localhost:8080/${listing.hostProfileImagePath.replace(
              "public",
              ""
            )}`}
            alt="host"
          />
          <h3>
            Hosted by {listing.hostFirstName} {listing.hostLastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities.split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange
                ranges={dateRange}
                onChange={handleSelect}
                locale={enUS}
                minDate={today}
              />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}
              <h2>Total Price : ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>
              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <FeedbackForm listingId={listingId} userId={customerId} />
          <h2>Customer Feedback</h2>
          {feedbacks.length > 0 ? (
            <div className="feedback-list">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="feedback-card">
                  <div className="feedback-header">
                    <span className="rating">
                      <strong>Rating:</strong> {feedback.rating} / 5
                    </span>
                    <span className="date">
                      <strong>On:</strong>{" "}
                      {new Date(feedback.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="feedback-comment">
                    <strong>Comment:</strong> {feedback.comment}
                  </div>

                  <div className="feedback-footer">
                    {feedback.user ? (
                      <div className="user-info">
                        <img
                          src={`http://localhost:8080/${feedback.user.profileImage.replace(
                            "public",
                            ""
                          )}`}
                          alt={feedback.user.firstName}
                          className="user-image"
                        />
                        <span>
                          <strong>Posted by:</strong> {feedback.user.firstName}{" "}
                          {feedback.user.lastName}
                        </span>
                      </div>
                    ) : (
                      <p>User details unavailable</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No feedback yet.</p>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};
