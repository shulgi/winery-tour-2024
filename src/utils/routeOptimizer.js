// src/utils/routeOptimizer.js

function calculateDistance(point1, point2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function nearestNeighbor(locations) {
  const route = [locations[0]];
  const unvisited = locations.slice(1);

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;
    const lastLocation = route[route.length - 1];

    for (let i = 0; i < unvisited.length; i++) {
      const distance = calculateDistance(lastLocation, unvisited[i]);
      if (distance < minDistance) {
        nearestIndex = i;
        minDistance = distance;
      }
    }

    route.push(unvisited[nearestIndex]);
    unvisited.splice(nearestIndex, 1);
  }

  return route;
}

function calculateVisitDuration(startTime, endTime, totalLocations) {
  const totalMinutes =
    (endTime.getHours() - startTime.getHours()) * 60 +
    (endTime.getMinutes() - startTime.getMinutes());
  const travelTime = 15 * (totalLocations - 1); // Assuming 15 minutes travel time between wineries
  return Math.floor((totalMinutes - travelTime) / totalLocations);
}

async function getOptimizedRoute(locations) {
  if (locations.length < 2) {
    throw new Error("At least two locations are required for optimization.");
  }

  try {
    // Use the nearest neighbor algorithm to optimize the route
    const optimizedRoute = nearestNeighbor(locations);
    return optimizedRoute;
  } catch (error) {
    console.error("Error in getOptimizedRoute:", error);
    throw error;
  }
}

export { getOptimizedRoute };
