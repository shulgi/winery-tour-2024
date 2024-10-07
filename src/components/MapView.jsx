import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ routes }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!routes || routes.length === 0) return;

    if (!mapInstanceRef.current) {
      // Initialize the map only if it doesn't exist
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [38.5, -122.8],
        10,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    } else {
      // If map exists, clear existing layers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
    }

    const markersGroup = L.layerGroup().addTo(mapInstanceRef.current);

    routes.forEach((dayRoute, dayIndex) => {
      const routeCoordinates = Object.values(dayRoute).map((stop) => [
        stop.lat,
        stop.lng,
      ]);

      L.polyline(routeCoordinates, {
        color: dayIndex === 0 ? "blue" : "red",
      }).addTo(mapInstanceRef.current);

      Object.values(dayRoute).forEach((stop, stopIndex) => {
        L.marker([stop.lat, stop.lng])
          .addTo(markersGroup)
          .bindPopup(
            `Day ${dayIndex + 1}, Stop ${stopIndex + 1}: ${stop.name}`,
          );
      });
    });

    const bounds = markersGroup.getBounds();
    mapInstanceRef.current.fitBounds(bounds);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [routes]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>;
};

export default MapView;
