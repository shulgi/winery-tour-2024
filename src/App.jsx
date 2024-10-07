import React, { useState } from "react";
import wineries from "./data/wineries";
import CalendarView from "./components/CalendarView";

import WineryCard from "./components/WineryCard";

const WineryListView = ({ wineries }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {wineries.map((winery, index) => (
      <WineryCard key={index} winery={winery} />
    ))}
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState("list");

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
