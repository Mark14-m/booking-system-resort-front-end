import axios from "axios";
import React, { useEffect, useState } from "react";

function BillingReceiptModal({ selectedPayment }) {

const [bookingDetails, setBookingDetails] = useState(null);
const[paymentDetails, setPaymentDetails] = useState(null);

useEffect(() => {
  if (!selectedPayment) return;

  const fetchDetails = async () => {
    try {
      const [bookingRes, paymentRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/bookings/code/${selectedPayment.bookingCode}`),
        axios.get(`http://localhost:8080/api/payments/booking/${selectedPayment.bookingCode}`)
      ]);

      setBookingDetails(bookingRes.data);
      setPaymentDetails(paymentRes.data);
    } catch (err) {
      console.error("Error fetching details:", err);
      setBookingDetails(null);
      setPaymentDetails(null);
    }
  };

  fetchDetails();
}, [selectedPayment]);

  console.log("Selected Payment:", selectedPayment);
  console.log("Booking Details:", bookingDetails);
  console.log("Payment Details:", paymentDetails);

  
  return (
    <div
      className="modal fade"
      id="modal_billingReceipt"
      tabIndex="-1"
      aria-labelledby="billingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title" id="billingModalLabel">
              Payment Receipt
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {!bookingDetails || !paymentDetails ? (
    <p>Loading booking and payment details...</p>
  ) : (
    <div>
      <h6 className="text-center fw-bold mb-3">Booking Information</h6>
      <p><strong>Booking Code:</strong> {bookingDetails.bookingCode}</p>
      <p><strong>Full Name:</strong> {bookingDetails.fullname}</p>
      <p><strong>Room Type:</strong> {bookingDetails.unitType}</p>
      <p><strong>Check-in:</strong> {new Date(bookingDetails.checkIn).toLocaleString()}</p>
      <p><strong>Check-out:</strong> {new Date(bookingDetails.checkOut).toLocaleString()}</p>
      <p><strong>Guests:</strong> {bookingDetails.adults} Adult(s), {bookingDetails.kids} Kid(s)</p>
      <p><strong>Total Amount:</strong> ₱{bookingDetails.totalAmount.toFixed(2)}</p>
      <hr />
      <h6 className="text-center fw-bold mb-3">Payment Details</h6>
      <p><strong>Payment Method:</strong> {selectedPayment.paymentMethod}</p>
      <p><strong>Amount Paid:</strong> ₱{Number(selectedPayment.amount).toFixed(2)}</p>
      <p><strong>Reference No.:</strong> {selectedPayment.referenceNumber}</p>
      <p><strong>Date:</strong> {new Date(selectedPayment.paymentDate).toLocaleString()}</p>
      <hr />
      <p className="text-center fw-semibold text-success">Thank you for your payment!</p>
    </div>
  )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => window.print()}
            >
              <i className="bx bx-printer me-1"></i> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingReceiptModal;
