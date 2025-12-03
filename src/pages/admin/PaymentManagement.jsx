import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentFormModal from "../../components/FormModal/PaymentFormModal";
import BillingReceiptModal from "../../components/FormModal/BillingReceiptModal";


function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null); // For billing modal

   // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //   Fetch all payments on mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };


  

  //   Filter payments by search (Booking ID or method)
  const filteredPayments = payments.filter(
    (p) =>
      p.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(search.toLowerCase())
  );

   // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h5>Payment List</h5>

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
                data-bs-target="#modal_createEditPayment"
                onClick={() => setEditingPayment(null)} // reset for new record
              >
                + New Record
              </button>
            </div>
          </div>

          <div className="table-responsive text-nowrap">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Booking Code</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Payment Method</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {currentPayments.length > 0 ? (
                  currentPayments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.bookingCode}</td>
                      <td className="text-center">
                        ₱{Number(p.amount).toFixed(2)}
                      </td>
                      <td className="text-center">{p.paymentMethod}</td>
                      <td className="text-center">
                        {new Date(p.paymentDate).toLocaleDateString()} <br />
                        {new Date(p.paymentDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          {/* Edit button */}
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#modal_createEditPayment"
                            onClick={() => setEditingPayment(p)}
                          >
                            <i className="bx bx-edit-alt me-1"></i>
                            Edit
                          </button>

                          {/* Billing button */}
                          <button
                            type="button"
                            className="btn btn-info"
                            data-bs-toggle="modal"
                            data-bs-target="#modal_billingReceipt"
                            onClick={() =>
                              setSelectedPayment(p)
                            }
                          >
                            <i className="bx bx-receipt me-1"></i>
                            Billing
                          </button>
                        </div>
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

      {/*   Pass data + refresh callback into modal */}
      <PaymentFormModal
        fetchPayments={fetchPayments}
        editingPayment={editingPayment}
        setEditingPayment={setEditingPayment}
      />

      {/* Billing / Receipt Modal */}
      <BillingReceiptModal selectedPayment={selectedPayment} />
    </>
  );
}

export default PaymentManagement;
