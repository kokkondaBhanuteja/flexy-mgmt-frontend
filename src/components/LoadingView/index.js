import HashLoader from "react-spinners/HashLoader";
import './index.css';

const LoadingView = () => {
  return (
    <div className="loader-container">
      <HashLoader
        color={"#007bff"}
        loading={true}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingView;
