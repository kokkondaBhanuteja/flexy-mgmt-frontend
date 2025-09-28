import { useState, useEffect } from 'react';
import MapComponent from '../MapComponent';
import FlexyForm from '../FlexyForm';
import LoadingView from '../LoadingView';
import './index.css';

const fallbackCenter = {
  lat: 17.9689, 
  lng: 79.5941
};

const Home = () => {
  const [currentCenter, setCurrentCenter] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setCurrentCenter(userLocation);
          setMarkerPosition(userLocation);
        },
        () => {
          console.error("Could not get location. Defaulting to fallback.");
          setCurrentCenter(fallbackCenter);
          setMarkerPosition(fallbackCenter);
        },
        geoOptions
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentCenter(fallbackCenter);
      setMarkerPosition(fallbackCenter);
    }
  }, []);


  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  if (!currentCenter) {
    return <LoadingView />;
  }

  // Create a marker with the structure MapComponent expects
  const markersForMap = markerPosition
    ? [
        {
          _id: 'current-position', // A unique key for the marker
          location: {
            coordinates: [markerPosition.lng, markerPosition.lat],
          },
          name: 'Selected Location' // A name for the InfoWindow
        },
      ]
    : [];

  return (
    <div className="home-container">
      <MapComponent
        onMapClick={handleMapClick}
        markers={markersForMap}
        center={currentCenter}
      />
      <FlexyForm pinnedLocation={markerPosition} />
    </div>
  );
};

export default Home;