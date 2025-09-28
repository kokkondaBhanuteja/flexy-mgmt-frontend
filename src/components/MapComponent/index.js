import { useCallback, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import HoardingDetailsPopup from '../HoardingDetailsPopup';
import './index.css';

// Define map options to ensure click handlers work correctly
const defaultMapOptions = {
  disableDoubleClickZoom: true, // Prevents default map behavior (zoom) on double click
  clickableIcons: false,        // Prevents map icons (like businesses) from capturing clicks
};

// FIX: Use plain JS object for scaledSize to avoid 'google is not defined' error
const customMarkerIcon = {
  url: 'https://res.cloudinary.com/disrq2eh8/image/upload/v1758967291/placeholder_ww4rii.png',
  scaledSize: { width: 40, height: 40 }, 
};


const MapComponent = ({ onMapClick, markers, center, directions }) => {
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedHoardingGroup, setSelectedHoardingGroup] = useState(null);

  // --- Marker Grouping Logic ---
  const groupedMarkers = markers.reduce((acc, marker) => {
    if (!marker.location || !marker.location.coordinates || marker.location.coordinates.length < 2) {
        return acc; // Skip markers without valid coordinates
    }
    const lat = marker.location.coordinates[1];
    const lng = marker.location.coordinates[0];
    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`; 

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(marker);
    return acc;
  }, {});

  const uniqueMarkerGroups = Object.values(groupedMarkers).map(group => ({
      position: { lat: group[0].location.coordinates[1], lng: group[0].location.coordinates[0] },
      hoardings: group, 
      _id: group[0]._id, 
  }));
  // --- END Grouping Logic ---

  const handleMarkerMouseOver = (hoarding) => {
    setActiveMarker(hoarding);
  };

  const handleMarkerMouseOut = () => {
    setActiveMarker(null);
  };

  const handleMarkerClick = (hoardingsArray) => {
    setSelectedHoardingGroup(hoardingsArray);
  }
  
  const handleMapDblClick = (event) => {
    if (event.stop) event.stop(); 
  }

  const onLoad = useCallback(function callback(map) {
    if (window.google) {
        if (!directions) {
            const bounds = new window.google.maps.LatLngBounds(center);
            
            if (uniqueMarkerGroups.length > 0) {
                uniqueMarkerGroups.forEach(group => {
                    bounds.extend(new window.google.maps.LatLng(group.position.lat, group.position.lng));
                });
            }
            if (directions || uniqueMarkerGroups.length > 0) { 
                map.fitBounds(bounds);
            } else if (center) {
                map.setCenter(center);
                map.setZoom(10); 
            }
        }
    }
    setMap(map);
  }, [center, directions, uniqueMarkerGroups.length]);

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
        onDblClick={handleMapDblClick} 
        options={defaultMapOptions}    
      >
        {/* Iterate over the unique marker groups */}
        {Array.isArray(uniqueMarkerGroups) && uniqueMarkerGroups.map((group) => (
            <Marker
                key={group._id} 
                position={group.position}
                icon={customMarkerIcon} 
                onMouseOver={() => handleMarkerMouseOver(group.hoardings[0])} 
                onMouseOut={handleMarkerMouseOut}
                onClick={() => handleMarkerClick(group.hoardings)} 
            >
                {/* Check if the activeMarker is the first item of this group */}
                {activeMarker === group.hoardings[0] && (
                    <InfoWindow>
                        <div>
                            {/* Show count if more than one, otherwise show name */}
                            {group.hoardings.length > 1 ? (
                                <h4>{group.hoardings.length} Hoardings here</h4>
                            ) : (
                                <h4>{group.hoardings[0].name}</h4>
                            )}
                            <img 
                                src={group.hoardings[0].imageUrl} 
                                alt={group.hoardings[0].name} 
                                style={{ width: '100px' }} 
                            />
                        </div>
                    </InfoWindow>
                )}
            </Marker>
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      {/* Pass the array of hoardings (selectedHoardingGroup) to the popup */}
      {selectedHoardingGroup && (
          <HoardingDetailsPopup
            hoardings={selectedHoardingGroup} 
            hoarding={selectedHoardingGroup.length === 1 ? selectedHoardingGroup[0] : null} 
            onClose={() => setSelectedHoardingGroup(null)}
          />
      )}
    </div>
  );
};

export default MapComponent;