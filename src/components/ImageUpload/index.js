import React, { useState, useEffect, useRef } from 'react';
import { FaCamera, FaTimes, FaFileUpload } from 'react-icons/fa';
import './index.css';

const ImageUpload = ({ onImageUpload, existingImageUrl, onImageRemove }) => {
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (existingImageUrl) {
      setPreview(existingImageUrl);
    }
  }, [existingImageUrl]);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const openCamera = async () => {
    setError('');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        setIsCameraOpen(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError('Could not access the camera. Please check permissions.');
        setIsCameraOpen(false);
      }
    } else {
      setError('Camera is not supported on this browser.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      // Convert canvas to a blob, then to a file
      canvas.toBlob((blob) => {
        const newFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onImageUpload(newFile);
        setPreview(URL.createObjectURL(newFile));
      }, 'image/jpeg');

      closeCamera();
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
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {isCameraOpen ? (
        <div className="camera-view">
          <video ref={videoRef} autoPlay playsInline className="camera-feed" />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="camera-controls">
            <button type="button" className="action-btn capture-btn" onClick={takePhoto}>Take Photo</button>
            <button type="button" className="action-btn close-btn-cam" onClick={closeCamera}>Close Camera</button>
          </div>
        </div>
      ) : preview ? (
        <div className="image-preview">
          <img src={preview} alt="Upload Preview" />
          <button type="button" className="remove-btn" onClick={handleRemoveImage}>
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="upload-options">
          <button type="button" className="action-btn" onClick={() => fileInputRef.current.click()}>
            <FaFileUpload />
            <span>Upload File</span>
          </button>
          <button type="button" className="action-btn" onClick={openCamera}>
            <FaCamera />
            <span>Use Camera</span>
          </button>
        </div>
      )}
      
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ImageUpload;