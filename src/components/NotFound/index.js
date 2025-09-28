import { Link } from "react-router-dom";
import "./index.css"; 

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/disrq2eh8/image/upload/v1758998416/404_error_ldtl0p.svg"
        alt="Not Found"
        className="not-found-img"
      />
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="home-btn">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
