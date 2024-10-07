const WineryCard = ({ winery }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-2xl font-bold text-red-500 mb-2">{winery.name}</h3>
    <p className="text-gray-300 mb-1">
      <span className="font-semibold">Address:</span> {winery.address}
    </p>
    <p className="text-gray-300 mb-1">
      <span className="font-semibold">Wines:</span> {winery.wines.join(", ")}
    </p>
    <p className="text-gray-300 mb-3">
      <span className="font-semibold">Food:</span> {winery.food}
    </p>
    <a
      href={winery.homepage}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-400 hover:text-red-300 transition-colors duration-300"
    >
      Visit Website
    </a>
  </div>
);

export default WineryCard;
