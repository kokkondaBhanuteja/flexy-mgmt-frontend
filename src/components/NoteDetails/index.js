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
  // ADDED: State to hold the current marker position for editing
  const [markerPosition, setMarkerPosition] = useState(null); 

  const fetchFlexy = useCallback(async () => {
    setStatus(STATUS.LOADING);
    try {
      const response = await axios.get(`${API_URL}/hoardings/${id}`);
      const fetchedFlexy = response.data.data;
      setFlexy(fetchedFlexy);

      if (fetchedFlexy && fetchedFlexy.location && fetchedFlexy.location.coordinates) {
        const [lng, lat] = fetchedFlexy.location.coordinates;
        const location = { lat, lng };
        setMapCenter(location);
        // INIT: Set the marker position to the existing flexy's location
        setMarkerPosition(location); 
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

  // ADDED: Function to update the marker position on map click
  const handleMapClick = (event) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setMapCenter({ lat, lng }); // Also center the map on the new marker
  };

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

    // Create a marker object from the state for MapComponent
    const markersForMap = markerPosition
    ? [
        {
          ...flexy, // Spread existing flexy data
          _id: flexy._id, 
          location: {
            coordinates: [markerPosition.lng, markerPosition.lat],
          },
          // Ensure imageUrl is present for MapComponent InfoWindow logic
          imageUrl: flexy.imageUrl || 'https://res.cloudinary.com/disrq2eh8/image/upload/v1758967291/placeholder_ww4rii.png', 
        },
      ]
    : [];
    
    return (
      <div className="note-details-container">
        <MapComponent
          markers={markersForMap} 
          center={mapCenter}
          onMapClick={handleMapClick} // ADDED: Allow re-pinning the location
        />
        <FlexyForm 
          existingFlexy={flexy} 
          pinnedLocation={markerPosition} // PASS: The updatable marker position
        />
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