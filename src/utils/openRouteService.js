// src/utils/openRouteService.js

import axios from "axios";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;
const ORS_API_URL = "https://api.openrouteservice.org/v2/optimization";

async function getOptimizedRoute(locations) {
  if (locations.length < 2) {
    throw new Error("At least two locations are required for optimization.");
  }

  try {
    const vehicles = [
      {
        id: 1,
        profile: "driving-car",
        start: [locations[0].lng, locations[0].lat],
        end: [locations[0].lng, locations[0].lat], // Return to start
        time_window: [32400, 64800], // 9 AM to 6 PM (in seconds since midnight)
      },
      {
        id: 2,
        profile: "driving-car",
        start: [locations[0].lng, locations[0].lat],
        end: [locations[0].lng, locations[0].lat], // Return to start
        time_window: [118800, 151200], // 9 AM to 6 PM next day
      },
    ];

    const jobs = locations.slice(1).map((location, index) => ({
      id: index + 1,
      location: [location.lng, location.lat],
      service: 3600, // 1 hour visit time
    }));

    const data = {
      jobs: jobs,
      vehicles: vehicles,
    };

    const response = await axios.post(ORS_API_URL, data, {
      headers: {
        Authorization: ORS_API_KEY,
        Accept:
          "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    console.log("API Response:", response.data); // Log the full response for debugging

    if (response.data.error) {
      throw new Error(
        `OpenRouteService API error: ${response.data.error.message}`,
      );
    }

    // Process the optimized route
    const day1Route =
      response.data.routes
        .find((route) => route.vehicle === 1)
        ?.steps.filter((step) => step.type === "job")
        .map((step) =>
          locations.find(
            (loc) =>
              loc.lng === step.location[0] && loc.lat === step.location[1],
          ),
        ) || [];

    const day2Route =
      response.data.routes
        .find((route) => route.vehicle === 2)
        ?.steps.filter((step) => step.type === "job")
        .map((step) =>
          locations.find(
            (loc) =>
              loc.lng === step.location[0] && loc.lat === step.location[1],
          ),
        ) || [];

    return [day1Route, day2Route];
  } catch (error) {
    console.error("Error in getOptimizedRoute:", error);
    throw error;
  }
}

export { getOptimizedRoute };
