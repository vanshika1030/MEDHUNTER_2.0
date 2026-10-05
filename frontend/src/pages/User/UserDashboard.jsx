import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { get } from "../../services/api";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [results, setResults] = useState([]);
  const [searchCount, setSearchCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    display: "Location not fetched yet",
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation((prev) => ({
        ...prev,
        display: "Geolocation is not supported by your browser",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          display: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        });
      },
      () => {
        setUserLocation((prev) => ({
          ...prev,
          display: "Unable to fetch location. Please allow location access.",
        }));
      }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!searchName.trim()) {
      setError("Please enter a medicine name");
      return;
    }
    if (!userLocation.lat || !userLocation.lng) {
      setError("Please fetch your location first using the button above");
      return;
    }

    setLoading(true);

    try {
      const data = await get(
        `/search?name=${encodeURIComponent(searchName.trim())}&lat=${userLocation.lat}&lng=${userLocation.lng}&maxDistance=10000`
      );
      setResults(data.results || []);
      setSearchCount(data.count || 0);

      if (!searchHistory.includes(searchName.trim())) {
        setSearchHistory((prev) => [searchName.trim(), ...prev].slice(0, 10));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (name) => {
    setSearchName(name);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#f4faf7] px-6 py-8 text-[#163832] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2d9b7d]">
              User Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Search medicines near your location
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome, <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#dff4ea] px-5 py-4">
              <p className="text-sm font-semibold text-[#1f6f5b]">
                Current Location
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {userLocation.display}
              </p>
              <button
                onClick={handleGetLocation}
                className="mt-3 rounded-full bg-[#1f6f5b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#185847]"
              >
                Use My Location
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Search Medicine</h2>
              <p className="mt-2 text-sm text-slate-600">
                Search by medicine name to see nearby stores.
              </p>

              <form onSubmit={handleSearch} className="mt-5 space-y-4">
                <input
                  type="text"
                  placeholder="Enter medicine name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#1f6f5b] px-4 py-3 font-semibold text-white transition hover:bg-[#185847] disabled:opacity-60"
                >
                  {loading ? "Searching..." : "Search Now"}
                </button>
              </form>
            </div>

            {searchHistory.length > 0 && (
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Search History</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {searchHistory.map((name, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(name)}
                      className="block w-full rounded-2xl bg-[#f4faf7] px-4 py-3 text-left transition hover:bg-[#dff4ea]"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section className="space-y-6">
            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Nearby Results</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {searchCount === null
                      ? "Search for a medicine to see nearby stores."
                      : `Showing shops that have your medicine.`}
                  </p>
                </div>

                {searchCount !== null && (
                  <div className="rounded-full bg-[#dff4ea] px-4 py-2 text-sm font-semibold text-[#1f6f5b]">
                    {searchCount} {searchCount === 1 ? "Shop" : "Shops"} Found
                  </div>
                )}
              </div>

              {results.length === 0 && searchCount !== null && (
                <div className="mt-6 rounded-2xl bg-[#f4faf7] px-4 py-8 text-center text-sm text-slate-600">
                  No nearby stores found with this medicine. Try a different
                  name or increase the search radius.
                </div>
              )}

              <div className="mt-6 grid gap-4">
                {results.map((item) => (
                  <div
                    key={item.shop._id}
                    className="rounded-3xl border border-[#e4efea] bg-[#fcfefd] p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold">
                          {item.shop.shopName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Owner: {item.shop.ownerName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Address: {item.shop.shopAddress}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Distance: {item.shop.distanceInKm} km ({item.shop.distanceInMeters}m)
                        </p>

                        <div className="mt-3 space-y-1">
                          {item.medicines.map((med) => (
                            <div
                              key={med._id}
                              className="flex flex-wrap items-center gap-3 rounded-xl bg-[#f4faf7] px-3 py-2 text-sm"
                            >
                              <span className="font-semibold">{med.name}</span>
                              <span className="text-slate-600">
                                ₹{med.price}
                              </span>
                              <span className="text-slate-500">
                                Stock: {med.stock}
                              </span>
                              {med.manufacturer && (
                                <span className="text-slate-400">
                                  by {med.manufacturer}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <span className="rounded-full bg-[#dff4ea] px-4 py-2 text-sm font-semibold text-[#1f6f5b]">
                          Available
                        </span>

                        <div className="flex flex-wrap gap-3">
                          {item.shop.contactNumber && (
                            <a
                              href={`tel:${item.shop.contactNumber}`}
                              className="rounded-full border border-[#1f6f5b] px-4 py-2 text-sm font-semibold text-[#1f6f5b] transition hover:bg-[#1f6f5b] hover:text-white"
                            >
                              Call Shop
                            </a>
                          )}
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.shop.coordinates[1]},${item.shop.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-[#1f6f5b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#185847]"
                          >
                            View Route
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
