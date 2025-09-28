import { useCallback, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import HoardingDetailsPopup from '../HoardingDetailsPopup';
import './index.css';

const MapComponent = ({ onMapClick, markers, center, directions }) => {
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedHoarding, setSelectedHoarding] = useState(null);

  // The custom icon now needs a check for `window.google`
  const customMarkerIcon = (window.google && window.google.maps) ? {
    url: 'https://res.cloudinary.com/disrq2eh8/image/upload/v1758967291/placeholder_ww4rii.png',
    scaledSize: new window.google.maps.Size(40, 40),
  } : null;

  const handleMarkerMouseOver = (marker) => {
    setActiveMarker(marker);
  };

  const handleMarkerMouseOut = () => {
    setActiveMarker(null);
  };

  const handleMarkerClick = (marker) => {
    setSelectedHoarding(marker);
  }

  const onLoad = useCallback(function callback(map) {
    if (!directions) {
      const bounds = new window.google.maps.LatLngBounds(center);
      if (markers.length > 0) {
          markers.forEach(marker => {
            bounds.extend(new window.google.maps.LatLng(marker.location.coordinates[1], marker.location.coordinates[0]));
          });
      }
      if (bounds) {
          map.fitBounds(bounds);
      }
    }
    setMap(map);
  }, [center, markers, directions]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div className="map-container-inner">
      <GoogleMap
        mapContainerClassName="map-google-container"
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        {Array.isArray(markers) && markers.map((marker) => (
            <Marker
                key={marker._id}
                position={{ lat: marker.location.coordinates[1], lng: marker.location.coordinates[0] }}
                icon={customMarkerIcon}
                onMouseOver={() => handleMarkerMouseOver(marker)}
                onMouseOut={handleMarkerMouseOut}
                onClick={() => handleMarkerClick(marker)}
            >
                {activeMarker === marker && (
                    <InfoWindow>
                        <div>
                            <h4>{marker.name}</h4>
                            <img src={marker.imageUrl} alt={marker.name} style={{ width: '100px' }} />
                        </div>
                    </InfoWindow>
                )}
            </Marker>
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      {selectedHoarding && (
          <HoardingDetailsPopup
            hoarding={selectedHoarding}
            onClose={() => setSelectedHoarding(null)}
          />
      )}
    </div>
  );
};

export default MapComponent;