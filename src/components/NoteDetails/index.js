import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import FlexyForm from '../FlexyForm';
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
import MapComponent from '../MapComponent';
import axios from 'axios';
import './index.css';

const API_URL = process.env.REACT_APP_BACKEND_API;

const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

const NoteDetails = () => {
  const { id } = useParams();
  const [flexy, setFlexy] = useState(null);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [mapCenter, setMapCenter] = useState(null);

  const fetchFlexy = useCallback(async () => {
    setStatus(STATUS.LOADING);
    try {
      const response = await axios.get(`${API_URL}/hoardings/${id}`);
      const fetchedFlexy = response.data.data;
      setFlexy(fetchedFlexy);

      if (fetchedFlexy && fetchedFlexy.location && fetchedFlexy.location.coordinates) {
        const [lng, lat] = fetchedFlexy.location.coordinates;
        setMapCenter({ lat, lng });
      }
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error("Failed to fetch flexy details:", error);
      setStatus(STATUS.FAILURE);
    }
  }, [id]);

  useEffect(() => {
    fetchFlexy();
  }, [fetchFlexy]);

  const renderLoadingView = () => <LoadingView />;
  const renderFailureView = () => <FailureView message="Failed to fetch flexy details." onRetry={fetchFlexy} />;

  const renderSuccessView = () => {
    if (!flexy) {
      return (
        <div>
          <h2>Flexy not found!</h2>
          <Link to="/view-all-flexy">Back to list</Link>
        </div>
      );
    }

    return (
      <div className="note-details-container">
        <MapComponent
          markers={flexy ? [flexy] : []}
          center={mapCenter}
        />
        <FlexyForm existingFlexy={flexy} pinnedLocation={mapCenter} />
      </div>
    );
  };

  const renderView = () => {
    switch (status) {
      case STATUS.LOADING:
        return renderLoadingView();
      case STATUS.FAILURE:
        return renderFailureView();
      case STATUS.SUCCESS:
        return renderSuccessView();
      default:
        return null;
    }
  };

  return <>{renderView()}</>;
};

export default NoteDetails;