// api/optimizeRoute.js

import axios from "axios";

const ORS_API_KEY = process.env.ORS_API_KEY;
const ORS_API_URL = "https://api.openrouteservice.org/v2/optimization";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { locations } = req.body;

    if (!locations || locations.length < 2) {
      return res
        .status(400)
        .json({
          error: "At least two locations are required for optimization.",
        });
    }

    const vehicles = [
      {
        id: 1,
        profile: "driving-car",
        start: [locations[0].lng, locations[0].lat],
        end: [locations[0].lng, locations[0].lat],
        time_window: [32400, 64800],
      },
      {
        id: 2,
        profile: "driving-car",
        start: [locations[0].lng, locations[0].lat],
        end: [locations[0].lng, locations[0].lat],
        time_window: [118800, 151200],
      },
    ];

    const jobs = locations.slice(1).map((location, index) => ({
      id: index + 1,
      location: [location.lng, location.lat],
      service: 3600,
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

    const optimizedRoutes = response.data;

    res.status(200).json(optimizedRoutes);
  } catch (error) {
    console.error(
      "Error optimizing route:",
      error.response ? error.response.data : error.message,
    );
    res.status(500).json({ error: "Failed to optimize route" });
  }
}
