import React, { useState, useEffect } from "react";
import { format, parse, addMinutes } from "date-fns";
import { getOptimizedRoute } from "../utils/openRouteService";
import MapView from "./MapView";

const TimeSlot = ({ time }) => (
  <div className="text-xs text-gray-400 pr-2 text-right">{time}</div>
);

const MinimizedCard = ({ winery, onClick }) => (
  <div
    className="bg-red-900 bg-opacity-50 rounded p-2 mb-1 cursor-pointer hover:bg-opacity-70 transition-all duration-300"
    onClick={onClick}
  >
    <div className="text-sm font-semibold text-red-200">{winery.name}</div>
    <div className="text-xs text-gray-300">{winery.time}</div>
  </div>
);

const MaximizedCard = ({ winery, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
      <h3 className="text-2xl font-bold text-red-500 mb-2">{winery.name}</h3>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold">Time:</span> {winery.time}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold">Wines:</span> {winery.wines.join(", ")}
      </p>
      <p className="text-gray-300 mb-1">
        <span className="font-semibold">Food:</span> {winery.food}
      </p>
      <p className="text-gray-300 mb-3">
        <span className="font-semibold">Address:</span> {winery.address}
      </p>
      <div className="flex justify-between items-center mt-4">
        <a
          href={winery.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 hover:text-red-300 transition-colors duration-300"
        >
          Visit Website
        </a>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const CalendarColumn = ({
  day,
  wineries,
  selectedWinery,
  setSelectedWinery,
}) => {
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  const getTopPosition = (time) => {
    const [start] = time.split(" - ");
    const startTime = parse(start, "h:mm aa", new Date());
    const baseTime = parse("9:00 AM", "h:mm aa", new Date());
    const diffMinutes =
      (startTime.getTime() - baseTime.getTime()) / (1000 * 60);
    return `${(diffMinutes / 30) * 40}px`;
  };

  const getHeight = (time) => {
    const [start, end] = time.split(" - ");
    const startTime = parse(start, "h:mm aa", new Date());
    const endTime = parse(end, "h:mm aa", new Date());
    const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return `${(diffMinutes / 30) * 40}px`;
  };

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Day {day}</h2>
      <div className="relative" style={{ height: "680px" }}>
        {timeSlots.map((time, index) => (
          <div
            key={index}
            className="absolute w-full h-10 border-t border-gray-700"
            style={{ top: `${index * 40}px` }}
          >
            <TimeSlot time={time} />
          </div>
        ))}
        {wineries
          .filter((w) => w.day === day)
          .map((winery, index) => (
            <div
              key={index}
              className="absolute left-16 right-0"
              style={{
                top: getTopPosition(winery.time),
                height: getHeight(winery.time),
              }}
            >
              <MinimizedCard
                winery={winery}
                onClick={() => setSelectedWinery(winery)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const CalendarView = ({ wineries }) => {
  const [selectedWinery, setSelectedWinery] = useState(null);
  const [optimizedWineries, setOptimizedWineries] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const optimizeRoutes = async () => {
      try {
        setError(null);
        const optimizedRoutes = await getOptimizedRoute(wineries);

        if (
          optimizedRoutes[0].length === 0 &&
          optimizedRoutes[1].length === 0
        ) {
          throw new Error(
            "No valid routes were returned by the optimization service.",
          );
        }

        setRoutes(optimizedRoutes);

        const assignDayAndTime = (route, day) =>
          route.map((winery, index) => ({
            ...winery,
            day,
            time: `${format(addMinutes(parse("9:00", "HH:mm", new Date()), index * 90), "h:mm aa")} - ${format(addMinutes(parse("9:00", "HH:mm", new Date()), (index + 1) * 90), "h:mm aa")}`,
          }));

        const optimized = [
          ...assignDayAndTime(optimizedRoutes[0], 1),
          ...assignDayAndTime(optimizedRoutes[1], 2),
        ];

        setOptimizedWineries(optimized);
      } catch (error) {
        console.error("Failed to optimize route:", error);
        setError("Failed to optimize the route. Please try again later.");
        setOptimizedWineries(
          wineries.map((winery, index) => ({
            ...winery,
            day: index % 2 === 0 ? 1 : 2,
            time: "9:00 AM - 10:30 AM", // Default time
          })),
        );
      }
    };

    optimizeRoutes();
  }, [wineries]);

  return (
    <div className="mb-8">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex space-x-4 mb-8">
        <CalendarColumn
          day={1}
          wineries={optimizedWineries}
          selectedWinery={selectedWinery}
          setSelectedWinery={setSelectedWinery}
        />
        <CalendarColumn
          day={2}
          wineries={optimizedWineries}
          selectedWinery={selectedWinery}
          setSelectedWinery={setSelectedWinery}
        />
      </div>
      <MapView routes={routes} />
      {selectedWinery && (
        <MaximizedCard
          winery={selectedWinery}
          onClose={() => setSelectedWinery(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;
