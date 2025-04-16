// FeedbackForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/feedbackForm.scss";

const FeedbackForm = ({ listingId, userId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post(`http://localhost:8080/feedback/${listingId}/feedback`, {
            userId,
            comment,
            rating,
          });
          setSuccessMessage("Feedback submitted successfully");
          setErrorMessage("");
        } catch (error) {
          setErrorMessage("You Cannot Add Feedback To Your Own Property");
          setSuccessMessage("");
        }
    };
  

  return (
    <div className="feedback-form">
      <div className="feedback-form_content">
        <div className="feedback-form_title">We'd love your feedback!</div>
        <form className="feedback-form_form" onSubmit={handleSubmit}>
          <textarea
            className="feedback-form_textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment"
            required
          />
          <input
            className="feedback-form_input"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            required
          />
          <button className="feedback-form_button" type="submit">
            Submit Feedback
          </button>
        </form>
        {successMessage && <div className="feedback-form_success-message">{successMessage}</div>}
        {errorMessage && <div className="feedback-form_error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default FeedbackForm;