import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ routes }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!routes || routes.length === 0) {
      console.log("No routes available yet");
      return;
    }

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [38.5, -122.8],
        10,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
    }

    const featureGroup = L.featureGroup().addTo(mapInstanceRef.current);

    routes.forEach((dayRoute, dayIndex) => {
      if (!dayRoute || !Array.isArray(dayRoute)) {
        console.error(`Invalid route for day ${dayIndex + 1}`);
        return;
      }

      const routeCoordinates = dayRoute
        .filter((stop) => stop && stop.lat && stop.lng)
        .map((stop) => [stop.lat, stop.lng]);

      if (routeCoordinates.length > 0) {
        L.polyline(routeCoordinates, {
          color: dayIndex === 0 ? "blue" : "red",
        }).addTo(featureGroup);

        dayRoute.forEach((stop, stopIndex) => {
          if (stop && stop.lat && stop.lng) {
            L.marker([stop.lat, stop.lng])
              .addTo(featureGroup)
              .bindPopup(
                `Day ${dayIndex + 1}, Stop ${stopIndex + 1}: ${stop.name}`,
              );
          }
        });
      }
    });

    const bounds = featureGroup.getBounds();
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds);
    }

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
