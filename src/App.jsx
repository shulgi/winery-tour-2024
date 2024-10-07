import React, { useState } from "react";
import wineries from "./data/wineries";
import CalendarView from "./components/CalendarView";

const WineryCard = ({ winery }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-2xl font-bold text-red-500 mb-2">{winery.name}</h3>
    <div className="text-yellow-500 mb-2">{"🍷".repeat(winery.rating)}</div>
    <p className="text-gray-300 mb-1">
      <span className="font-semibold">Time:</span> {winery.time}
    </p>
    <p className="text-gray-300 mb-1">
      <span className="font-semibold">Known for:</span> {winery.knownFor}
    </p>
    <p className="text-gray-300 mb-3">
      <span className="font-semibold">Address:</span> {winery.address}
    </p>
    <a
      href={winery.website}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-400 hover:text-red-300 transition-colors duration-300"
    >
      Visit Website
    </a>
  </div>
);

const WineryListView = ({ wineries }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {wineries.map((winery, index) => (
      <WineryCard key={index} winery={winery} />
    ))}
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-8 text-center">
          Sonoma County Winery Tour Itinerary
        </h1>
        <div className="mb-8 flex justify-center">
          <button
            className={`mr-4 px-6 py-2 rounded-full transition-colors duration-300 ${
              activeTab === "calendar"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar View
          </button>
          <button
            className={`px-6 py-2 rounded-full transition-colors duration-300 ${
              activeTab === "list"
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab("list")}
          >
            Winery List
          </button>
        </div>
        {activeTab === "calendar" && <CalendarView wineries={wineries} />}
        {activeTab === "list" && <WineryListView wineries={wineries} />}
        <div className="mt-8 text-center text-gray-400">
          <p>
            Your designated driver is ready to ensure a safe and enjoyable tour
            for all.
          </p>
          <p>
            Remember to drink responsibly and savor every moment of this
            exquisite wine journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
