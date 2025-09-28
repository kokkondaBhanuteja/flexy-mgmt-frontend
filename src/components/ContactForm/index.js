import { useState } from 'react';
import axios from 'axios'; 
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
import './index.css';

const API_URL = process.env.REACT_APP_BACKEND_API;

const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR: 'error',
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(STATUS.IDLE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(STATUS.SENDING);
    try {
      await axios.post(`${API_URL}/mail/send`, formData);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error('Failed to send message:', error);
      setStatus(STATUS.ERROR);
    }
  };

  // Function to reset status to allow sending another message or retrying
  const handleRetry = () => {
    setStatus(STATUS.IDLE);
  };

  if (status === STATUS.SENDING) {
    return <LoadingView />;
  }

  if (status === STATUS.ERROR) {
    return (
      <div className="contact-form-container">
        <FailureView 
          message="Failed to send your message. Please check your connection and try again."
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  if (status === STATUS.SUCCESS) {
    return (
      <div className="contact-form-container">
        <div className="form-success-message">
          <h2>Thank you!</h2>
          <p>Your message has been sent to the admin.</p>
          <button type="button" className="submit-btn" onClick={handleRetry}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Contact Admin</h2>
        <p>Have a question or a concern? Send a message directly to the admin.</p>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;