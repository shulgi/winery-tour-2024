// src/utils/routeXL.js

const ROUTEXL_API_URL = "https://api.routexl.nl/tour";

export const ROUTEXL_CONFIG = {
  username: "ronenul", // Replace with your actual username
  password: "4me2poop", // Replace with your actual password
};

async function getOptimizedRoute(locations) {
  console.log("Environment:", import.meta.env);
  const username = ROUTEXL_CONFIG.username;
  const password = ROUTEXL_CONFIG.password;

  console.log("Username:", username);
  console.log("Password:", password);

  if (!username || !password) {
    console.error("RouteXL API credentials are not set");
    return null;
  }
  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(username + ":" + password));

  try {
    const response = await fetch(ROUTEXL_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ locations }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching optimized route:", error);
    return null;
  }
}

export { getOptimizedRoute };
