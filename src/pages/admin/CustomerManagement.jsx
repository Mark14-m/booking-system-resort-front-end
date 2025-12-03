import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import CustomerFormModal from "../../components/FormModal/CustomerFormModal";

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null); // Track customer being edited
   const [showTooltip, setShowTooltip] = useState(null);
    // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch customers from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  // Filter customers by search text
  const filteredCustomers = customers.filter(
    (c) =>
      c.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

   // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await fetch(`http://localhost:8080/api/customers/${id}`, {
        method: "DELETE",
      });
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

    // Save new or edited customer
    const handleSave = async (customerData) => {
    if (editingCustomer) {
        // Update
        try {
        const res = await fetch(
            `http://localhost:8080/api/customers/${editingCustomer.id}`,
            {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
            }
        );
        const updated = await res.json();

        setCustomers(
            customers.map((c) => (c.id === updated.id ? updated : c))
        );
        setEditingCustomer(null); // reset AFTER modal closes
        } catch (error) {
        console.error("Error updating customer:", error);
        }
    } else {
        // Create
        try {
        const res = await fetch("http://localhost:8080/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
        });
        const newCustomer = await res.json();
        setCustomers([...customers, newCustomer]);
        } catch (error) {
        console.error("Error creating customer:", error);
        }
    }
    };


  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h5>Customer List</h5>

            <div className="d-flex flex-row">
              <input
                className="form-control me-3"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-primary text-nowrap"
                data-bs-toggle="modal"
                data-bs-target="#modal_createEditCustomer"
                onClick={() => setEditingCustomer(null)} // Reset for new record
              >
                + New Record
              </button>
            </div>
          </div>

          <div className="table-responsive text-nowrap">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Fullname</th>
                  <th>Email</th>
                  <th className="text-center">Gender</th>
                  <th className="text-center">Contact</th>
                  <th className="text-center">Created By</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {currentCustomers.length > 0 ? (
                    currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                        <td>{customer.fullname}</td>
                        <td>{customer.email}</td>
                        <td className="text-center">
                        {customer.gender || "N/A"}
                        </td>
                        <td className="text-center">
                        {customer.contactNumber}
                        </td>
                        <td className="text-center">
                        {customer.createdBy || "N/A"}
                        </td>
                        <td className="text-center flex items-center justify-center">
                               <span
                  style={{ position: "relative", display: "inline-block", cursor: "pointer" }}
                  onMouseEnter={() => setShowTooltip(customer.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <i className="bx bx-info-circle text-info"></i>
                  {showTooltip === customer.id && (
                    <small
                      className="text-muted"
                      style={{
                        position: "absolute",
                        top: "120%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#fff",
                        border: "1px solid #ccc",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        zIndex: 10,
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}
                    >
                      To delete this entry, go to Booking Management and Delete its booking entry.
                    </small>
                  )}
                </span>  
                        <button
                            type="button"
                            className="btn btn-danger me-2"
                            onClick={() => handleDelete(customer.id)}
                            disabled={true}
                            title="To delete this entry, go to Booking Management and Delete its booking entry."
                        >
                            <i className="bx bx-trash me-1"></i>
                            Delete
                        </button>
                 

                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#modal_createEditCustomer"
                            onClick={() => setEditingCustomer(customer)}
                        >
                            <i className="bx bx-edit-alt me-1"></i>
                            View / Edit
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr className="text-bg-secondary">
                    <td colSpan="5" className="text-center">
                        <div className="alert alert-light mb-0" role="alert">
                        There are no records available
                        </div>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center align-items-center py-3">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => goToPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal shared for create & edit */}
      <CustomerFormModal
        editingCustomer={editingCustomer}
        onSave={handleSave}
      />
    </>
  );
}

export default CustomerManagement;
