import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/feedbacks";

function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Load feedbacks on mount
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Error fetching feedbacks:", err));
  }, []);

  // 🔍 Filtering feedbacks by name, email, or message
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / itemsPerPage));

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5>Customer Feedbacks</h5>

            <input
              className="form-control w-25"
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-responsive text-nowrap">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-center">Rating</th>
                  <th>Message</th>
                  <th className="text-center">Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {currentFeedbacks.length > 0 ? (
                  currentFeedbacks.map((f) => (
                    <tr key={f.id}>
                      <td>{f.name}</td>
                      <td>{f.email}</td>
                      <td className="text-center">
                        {"⭐".repeat(f.rating)}
                      </td>
                      <td style={{ maxWidth: "350px" }}>{f.message}</td>
                      <td className="text-center">
                        {new Date(f.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-bg-secondary">
                    <td colSpan="5" className="text-center">
                      <div className="alert alert-light mb-0" role="alert">
                        There are no feedbacks available
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div id="pagination">
            <div className="demo-inline-spacing d-flex justify-content-center align-items-center pe-3 justify-content-md-end py-3">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => goToPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeedbackManagement;
