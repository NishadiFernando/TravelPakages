import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";
import "../styles/adminView.css";

const AdminViewPackages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get-allpackages"
        );
        console.log(response.data); // Log the response data
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages", error);
      } finally {
        setIsLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-circle"></div>
        <p className="loading-message">Loading...</p>
      </div>
    );
  }

  const handleDelete = async (packageId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/delete-package/${packageId}`
      );
      setPackages(packages.filter((pkg) => pkg._id !== packageId));
      alert("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("An error occurred while deleting the package");
    }
  };

  const handleSort = (column) => {
    const newOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortColumn(column);

    const sortedPackages = [...packages].sort((a, b) => {
      if (column === "days") {
        return newOrder === "asc"
          ? a.days.length - b.days.length
          : b.days.length - a.days.length;
      } else if (column === "activities") {
        const aActivities = a.days.reduce(
          (acc, day) => acc + day.activities.length,
          0
        );
        const bActivities = b.days.reduce(
          (acc, day) => acc + day.activities.length,
          0
        );
        return newOrder === "asc"
          ? aActivities - bActivities
          : bActivities - aActivities;
      } else if (column === "price") {
        return newOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else {
        return newOrder === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
    });

    setPackages(sortedPackages);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Packages Report", 14, 15);

    const tableColumn = ["Name", "Days", "Activities", "Price"];
    const tableRows = selectedPackages.map((pkg) => [
      pkg.name,
      pkg.days.length,
      pkg.days.reduce((acc, day) => acc + day.activities.length, 0),
      pkg.price.toFixed(2), // Assuming price is a number and you want to show 2 decimal places
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("packages_report.pdf");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectPackage = (pkg) => {
    if (selectedPackages.includes(pkg)) {
      setSelectedPackages(selectedPackages.filter((p) => p._id !== pkg._id));
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className="view-packages">
      <div className="mb-5" style={{ display: "flex", width: "100%" }}>
        <div style={{ display: "flex", width: "100%" }}>
          <h1 className="allpkg">All Packages</h1>
        </div>
        <div style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="actions">
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Quick search"
            value={searchTerm}
            onChange={handleSearch}
            className="searchInput"
          />
        </div>
        <div className="buttonContainer">
          <div className="reportdiv">
            <i className="fa-solid fa-print printer" />
            <button onClick={generateReport} className="reportbtn">
              Generate Report
            </button>
          </div>
          <div className="newpkgdiv">
            <i className="fa-solid fa-plus printer" />
            <Link to={`/create`}>
              <button className="reportbtn">Add New Packages</button>
            </Link>
          </div>
        </div>
      </div>
      {filteredPackages.length === 0 ? (
        <p>No packages available</p>
      ) : (
        <table className="packages-table">
          <thead>
            <tr>
              <th>Select</th>
              <th onClick={() => handleSort("name")}>
                Name{" "}
                {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("days")}>
                Days{" "}
                {sortColumn === "days" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("activities")}>
                Activities{" "}
                {sortColumn === "activities" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("price")}>
                Price{" "}
                {sortColumn === "price" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg, index) => (
              <tr
                key={pkg._id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedPackages.includes(pkg)}
                    onChange={() => handleSelectPackage(pkg)}
                  />
                </td>
                <td>{pkg.name}</td>
                <td className="daytd">{pkg.days.length}</td>
                <td>
                  {pkg.days.reduce(
                    (acc, day) => acc + day.activities.length,
                    0
                  )}
                </td>
                <td>{pkg.price ? pkg.price.toFixed(2) : "N/A"}</td>
                <td>
                  <Link to={`/get-package/${pkg._id}`}>
                    <button className="viewbtn">View</button>
                  </Link>
                  <button
                    className="deletebtn"
                    onClick={() => handleDelete(pkg._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminViewPackages;
