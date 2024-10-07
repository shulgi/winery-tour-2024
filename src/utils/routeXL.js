// src/utils/routeXL.js

const ROUTEXL_API_URL = "https://api.routexl.com/tour";

async function getOptimizedRoute(locations) {
  console.log("Entering getOptimizedRoute function");

  const username = import.meta.env.VITE_ROUTEXL_USERNAME;
  const password = import.meta.env.VITE_ROUTEXL_PASSWORD;

  console.log("Username:", username);
  console.log("Password:", password ? "[REDACTED]" : "Not set");

  if (!username || !password) {
    console.error("RouteXL API credentials are not set");
    return null;
  }

  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(username + ":" + password));
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  console.log("Request headers:", headers);

  const formattedLocations = locations.map((location, index) => ({
    name: location.name,
    address: location.address,
    lat: location.lat.toString(),
    lng: location.lng.toString(),
    servicetime: 5, // default 5 minutes service time
  }));

  const body = new URLSearchParams({
    locations: JSON.stringify(formattedLocations),
  });

  try {
    console.log("Sending request to RouteXL API");
    const response = await fetch(ROUTEXL_API_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received data from API:", data);

    if (!data.feasible) {
      console.warn(
        "The route is not feasible. It may not meet all requirements.",
      );
    }

    return data.route;
  } catch (error) {
    console.error("Error fetching optimized route:", error);
    return null;
  }
}

export { getOptimizedRoute };
