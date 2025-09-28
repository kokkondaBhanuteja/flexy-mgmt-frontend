import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const HoardingDetailsPopup = ({ hoarding, onClose }) => {
  if (!hoarding) return null;

  const {
    _id,
    name,
    address,
    width,
    height,
    status,
    consultationStatus,
    price,
    ownerName,
    ownerContactNumber,
    imageUrl,
    notes,
  } = hoarding;

  const formatText = (text) => (text ? text.replace(/_/g, ' ') : 'N/A');

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={imageUrl} alt={name || 'Hoarding'} className="popup-img" />
        <h2>{name || 'Hoarding Details'}</h2>
        <p><strong>Address:</strong> {address || 'N/A'}</p>
        <p><strong>Dimensions:</strong> {width && height ? `${width}ft x ${height}ft` : 'N/A'}</p>
        <p><strong>Availability:</strong> {status || 'N/A'}</p>
        <p><strong>Consultation Status:</strong> <span className={`status-${consultationStatus}`}>{formatText(consultationStatus)}</span></p>
        <p><strong>Price:</strong> {price ? `₹${price}/month` : 'N/A'}</p>
        <p><strong>Owner:</strong> {ownerName || 'N/A'}</p>
        <p><strong>Contact:</strong> {ownerContactNumber || 'N/A'}</p>
        <p><strong>Notes:</strong> {notes || 'N/A'}</p>
        <Link to={`/edit-flexy/${_id}`} className="edit-link">
          Edit Details
        </Link>
      </div>
    </div>
  );
};

export default HoardingDetailsPopup;