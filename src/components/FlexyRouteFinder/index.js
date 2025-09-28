import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Autocomplete } from '@react-google-maps/api';
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
import MapComponent from '../MapComponent';
import './index.css';

const API_URL = process.env.REACT_APP_BACKEND_API;

const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

const FlexyRouteFinder = () => {
  const [status, setStatus] = useState(STATUS.SUCCESS);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [radius, setRadius] = useState(15); // Default radius in km

  const sourceAutocomplete = useRef(null);
  const destinationAutocomplete = useRef(null);

  const fetchAllFlexys = useCallback(async () => {
    setStatus(STATUS.LOADING);
    try {
      const response = await axios.get(`${API_URL}/hoardings`);
      const fetchedFlexys = response.data.data.data || [];
      setMarkers(fetchedFlexys);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error("Failed to fetch flexys:", error);
      setStatus(STATUS.FAILURE);
    }
  }, []);

  useEffect(() => {
    fetchAllFlexys();
  }, [fetchAllFlexys]);

  const handleRouteSearch = async () => {
    if (!source || !destination) {
      alert("Please enter both a source and a destination.");
      return;
    }

    setStatus(STATUS.LOADING);
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const results = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: source,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              resolve(result);
            } else {
              reject(new Error(`Error fetching directions: ${status}`));
            }
          }
        );
      });

      setDirections(results);

      const sourceCoords = results.routes[0].legs[0].start_location;
      const destCoords = results.routes[0].legs[0].end_location;

      const response = await axios.post(`${API_URL}/hoardings/find-in-between`, {
        source: [sourceCoords.lng(), sourceCoords.lat()],
        destination: [destCoords.lng(), destCoords.lat()],
        radius: radius,
      });

      const alongRouteFlexys = response.data.data || [];
      setMarkers(alongRouteFlexys);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error("Error during route search:", error);
      alert("Could not find a route. Please check your source and destination.");
      setStatus(STATUS.FAILURE);
    }
  };

  const clearRoute = () => {
    setSource('');
    setDestination('');
    setDirections(null);
    setRadius(15);
    fetchAllFlexys();
  };

  const onSourceLoad = (autocomplete) => {
    sourceAutocomplete.current = autocomplete;
  };

  const onDestinationLoad = (autocomplete) => {
    destinationAutocomplete.current = autocomplete;
  };

  const onSourcePlaceChanged = () => {
    if (sourceAutocomplete.current) {
      const place = sourceAutocomplete.current.getPlace();
      setSource(place.formatted_address);
    }
  };

  const onDestinationPlaceChanged = () => {
    if (destinationAutocomplete.current) {
      const place = destinationAutocomplete.current.getPlace();
      setDestination(place.formatted_address);
    }
  };

  const renderLoadingView = () => <LoadingView />;
  const renderFailureView = () => <FailureView message="Failed to fetch flexys." onRetry={fetchAllFlexys} />;

  const renderSuccessView = () => (
    <div className="route-finder-container">
        <div className="search-container">
          <Autocomplete
            onLoad={onSourceLoad}
            onPlaceChanged={onSourcePlaceChanged}
          >
            <input
              type="text"
              placeholder="Enter starting point"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </Autocomplete>
          <Autocomplete
            onLoad={onDestinationLoad}
            onPlaceChanged={onDestinationPlaceChanged}
          >
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Autocomplete>
          <div className="range-container">
            <label htmlFor="radius">Search Radius: {radius} km</label>
            <input
              type="range"
              id="radius"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
          </div>
          <button onClick={handleRouteSearch}>Find Hoardings</button>
          <button onClick={clearRoute} className="clear-btn">Clear</button>
        </div>
        <MapComponent
          center={{ lat: 17.9689, lng: 79.5941 }}
          markers={markers}
          directions={directions}
        />
    </div>
  );

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

export default FlexyRouteFinder;