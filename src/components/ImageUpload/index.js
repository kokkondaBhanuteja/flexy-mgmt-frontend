import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaFileUpload } from 'react-icons/fa';
import './index.css';

const ImageUpload = ({ onImageUpload, existingImageUrl, onImageRemove }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingImageUrl) {
      setPreview(existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError('');
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {preview ? (
        <div className="image-preview">
          <img src={preview} alt="Upload Preview" />
          <button type="button" className="remove-btn" onClick={handleRemoveImage}>
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="upload-options">
          <button
            type="button"
            className="action-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FaFileUpload />
            <span>Upload Image</span>
          </button>
        </div>
      )}
      
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ImageUpload;
