// src/utils/openRouteService.js

import axios from "axios";

async function getOptimizedRoute(locations) {
  if (locations.length < 2) {
    throw new Error("At least two locations are required for optimization.");
  }

  try {
    const response = await axios.post("/api/optimizeRoute", { locations });

    if (response.data.error) {
      throw new Error(`OpenRouteService API error: ${response.data.error}`);
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
