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
          // --- FIX ---
          // Set BOTH the map center and the marker position with the detected location
          setCurrentCenter(userLocation);
          setMarkerPosition(userLocation); // This will auto-fill the form
        },
        () => {
          console.error("Could not get location. Defaulting to fallback.");
          // Alert the user and then set a fallback
          alert(
            "Could not get your location. Please ensure you have enabled location permissions for this site in your browser settings (check the lock icon in the address bar)."
          );
          setCurrentCenter(fallbackCenter);
        },
        geoOptions
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser.");
      setCurrentCenter(fallbackCenter);
    }
  }, []);


  const handleMapClick = (event) => {
    if (!event.latLng) return; 
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  
  if (!currentCenter) {
    return <LoadingView />;
  }

  // This logic remains the same, creating a marker from the markerPosition state
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
      {/* The form now receives the auto-detected location via markerPosition */}
      <FlexyForm pinnedLocation={markerPosition} />
    </div>
  );
};

export default Home;