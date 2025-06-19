import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import ReactSlider from "react-slider";
import "../styles/userPackagesList.css";

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get-allpackages"
        );
        setPackages(response.data);
        setFilteredPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages", error);
      } finally {
        setIsLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const results = packages.filter((pkg) => {
      const searchString = searchTerm.toLowerCase();
      const priceWithinRange =
        pkg.price >= priceRange[0] && pkg.price <= priceRange[1];
      return (
        priceWithinRange &&
        ((pkg.name && pkg.name.toLowerCase().includes(searchString)) ||
          (pkg.title && pkg.title.toLowerCase().includes(searchString)) ||
          (pkg.description &&
            pkg.description.toLowerCase().includes(searchString)))
      );
    });
    setFilteredPackages(results);
  }, [searchTerm, packages, priceRange]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    setDateRange(`${formattedDate}`);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-circle"></div>
        <p className="loading-message">Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        backgroundColor: "#1C39BB",
        width: "200vh",
        height: "100%", // Optional: Set height if you want to center items vertically within the viewport
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "25px",
      }}
    >
      <div className="packages-container">
        <h1 className="page-title">Let'sTravel The World</h1>
        <p className="page-subtitle">Search low prices on travel packages</p>

        <div className="search-container">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search packages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="date-input">
            <i class="fa-solid fa-calendar-days"></i>
            <span className="dateRange">{dateRange}</span>
          </div>
          <div className="time-input">
            <span>Clock {currentTime}</span>
          </div>
        </div>

        <div className="price-filter-container">
          <label className="price-filter-label">Price Range</label>
          <div className="div-price-filter">
            <ReactSlider
              className="price-slider"
              thumbClassName="price-slider-thumb"
              trackClassName="price-slider-track"
              min={0}
              max={1000}
              value={priceRange}
              onChange={(value) => setPriceRange(value)}
              pearling
              minDistance={10}
            />
          </div>
          <div className="price-range-display">
            <span>${priceRange[0]}</span> <span>${priceRange[1]}</span>
          </div>
        </div>

        <h2 className="section-title">Available Packages</h2>
        <div className="packages-grid">
          {filteredPackages.length === 0 ? (
            <p className="no-packages">No packages available</p>
          ) : (
            filteredPackages.map((pkg) => (
              <div key={pkg._id} className="package-card">
                {pkg.days && pkg.days[0] && pkg.days[0].image && (
                  <img
                    src={`http://localhost:8000${pkg.days[0].image}`}
                    alt={pkg.name || "Package"}
                    className="package-image"
                  />
                )}
                <div className="package-details">
                  <h3 className="package-title">
                    {pkg.title || pkg.name || "Unnamed Package"}
                  </h3>
                  {pkg.name && pkg.name !== pkg.title && (
                    <p className="package-name">{pkg.name}</p>
                  )}
                  {pkg.description && (
                    <p className="package-description">{pkg.description}</p>
                  )}
                  <p className="package-price">
                    USD{" "}
                    {pkg.price ? pkg.price.toFixed(2) : "Price not available"}
                  </p>
                  <Link to={`/package-details/${pkg._id}`}>
                    <button className="view-package-button">
                      View Package
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        <Link to={`/main`}>
          <button className="btn btn-success mt-5 ">Check Todos</button>
        </Link>
        <button
          className="btn btn-danger  mt-5 position-absolute between-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PackagesList;
