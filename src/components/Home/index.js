import { useState, useEffect } from 'react';
// import { useJsApiLoader } from '@react-google-maps/api'; // REMOVED
import MapComponent from '../MapComponent';
import FlexyForm from '../FlexyForm';
import LoadingView from '../LoadingView';
import './index.css';

// REMOVED MAPS_API and libraries constant

const fallbackCenter = {
  lat: 17.9689, 
  lng: 79.5941
};

const Home = () => {
  const [currentCenter, setCurrentCenter] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); 

  // REMOVED: Script loader

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
        },
        () => {
          console.error("Could not get location. Defaulting to fallback.");
          setCurrentCenter(fallbackCenter);
        },
        geoOptions
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentCenter(fallbackCenter);
    }
  }, []);


  const handleMapClick = (event) => {
    if (!event.latLng) return; 
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  
  // SIMPLIFIED: Only wait for currentCenter, as map loading is handled by App.js
  if (!currentCenter) {
    return <LoadingView />;
  }

  // Create a marker with the structure MapComponent expects
  const markersForMap = markerPosition
    ? [
        {
          _id: 'current-position', 
          location: {
            coordinates: [markerPosition.lng, markerPosition.lat],
          },
          name: 'Selected Location', 
          imageUrl: 'https://res.cloudinary.com/disrq2eh8/image/upload/v1758967291/placeholder_ww4rii.png', 
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