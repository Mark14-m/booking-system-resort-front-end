import React, { useEffect, useState } from "react";
import gcashQR from "../../assets/images/gcash-qr.jpg";
import bpibankQR from "../../assets/images/bpi-bank-qr.jpg";
import axios from 'axios';

function PaymentChannelModal({ show, onClose, onPaymentDone, bookingCode, totalAmount, downpayment, adults, kids }) {
  if (!show) return null; // Don't render unless modal is open



  const [adultPrice, setAdultPrice] = useState(0);
  const [kidPrice, setKidPrice] = useState(0);

  const [selectedMethod, setSelectedMethod] = useState(""); // track selected method
  const [peopleCost, setPeopleCost] = useState(0);
  const [adultCount, setAdultCount] = useState(0);
  const [kidsCount, setKidsCountt] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [booking, setBooking] = useState({
    discountType: "",
    discountProofs: []
  });
  const [uploadedImages, setUploadedImages] = useState([]);

  // Handle multiple image uploads
  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    const imagesArray = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedImages((prevImages) => [...prevImages, ...imagesArray]);
  }

  console.log("Booking Code in Modal:", bookingCode);
  console.log("Adults in Modal:", adults);
  console.log("Kids in Modal:", kids);
  console.log("Total Amount in Modal:", totalAmount);
  console.log("Downpayment in Modal:", downpayment);
  console.log("-----");


 useEffect(() => {
    const response = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/prices/entrance-fee');
      console.log("Entrance Fee Adult Data:", res.data.adultPrice);
      console.log("Entrance Fee Kid Data:", res.data.kidPrice);
        setAdultPrice(res.data.adultPrice);
        setKidPrice(res.data.kidsPrice);
        setAdultCount(adults * res.data.adultPrice);
        setKidsCountt(kids * res.data.kidsPrice);
        setPeopleCost((adults * res.data.adultPrice) + (kids * res.data.kidsPrice));

      } catch (err) {
        console.error("Error fetching entrance fees:", err);
      }
  }
    response();
  }
, [adults, kids]);





  const handleConfirm = async () => {

    // require reference number
    if (!referenceNumber || !referenceNumber.trim()) {
      alert("Please enter a reference number before confirming the payment.");
      return;
    }

    try {
      const payload = {
        bookingCode: bookingCode,
        amount: downpayment,
        paymentMethod: selectedMethod,
        referenceNumber: referenceNumber,
        paymentDate: new Date().toISOString()
      };

      const response = await axios.post("http://localhost:8080/api/payments/payment-home-user", payload);

      console.log("Payment saved:", response.data);
      onPaymentDone(); // callback to Homepage
      window.location.reload(); // reload to reflect changes
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Error occured, Please check the room if still not full. Thank you.");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  }



  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Choose Your Payment Method</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Booking Summary */}
            <div className="alert alert-info text-center mb-4">
              <h6>Your Booking Code: <strong>{bookingCode}</strong></h6>
              <h6><strong>Total Adult Price:</strong> ₱{adultCount}</h6>
              <h6><strong>Total Kids Price:</strong> ₱{kidsCount}</h6>
              <h6><strong>Total Entrance:</strong> ₱{peopleCost}</h6>
              <h6>Total Amount: <strong>₱{Number(totalAmount).toLocaleString()}</strong></h6>
              <p className="mb-0">Minimum Downpayment (30%): <strong>₱{downpayment.toLocaleString()}</strong></p>
            </div>


            
            {/*
            ---------------------------------------
            For Discount Proof Upload
            ---------------------------------------
            Type of Discount:
            - PWD
            - Senior Citizen
            - Birthday Promo
            ---------------------------------------
              
            */}
            <div className="col-md-6">
              <label className="fw-medium d-block mb-2">Type of Discount</label>

              <div className="d-flex gap-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="discountType"
                    id="senior"
                    value="Senior Citizen"
                    checked={booking.discountType === "Senior Citizen"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="senior">
                    Senior Citizen
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="discountType"
                    id="pwd"
                    value="PWD"
                    checked={booking.discountType === "PWD"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="pwd">
                    PWD
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="discountType"
                    id="birthday"
                    value="Birthday Promo"
                    checked={booking.discountType === "Birthday Promo"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="birthday">
                    Birthday Promo
                  </label>
                </div>
              </div>
            </div>



            {/* SHOW ONLY IF SENIOR OR PWD */}
            {(booking.discountType === "Senior Citizen" ||
              booking.discountType === "Birthday Promo" ||
              booking.discountType === "PWD") && (
                <div className="col-md-6">
                  <label className="form-label fw-medium">Upload your Proof of Discount Here</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      name="images[]"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImages}
                    />
                  </div>


                </div>
              )}
            <div className="mt-3 d-flex flex-wrap gap-3">
              {uploadedImages.map((img, index) => (
                <div
                  key={index}
                  className="position-relative"
                  style={{ width: "120px", height: "120px" }}
                >
                  {/* Thumbnail */}
                  <img
                    src={img.preview}
                    alt="preview"
                    className="img-thumbnail"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{
                      transform: "translate(30%, -30%)",
                      padding: "2px 6px",
                      borderRadius: "50%",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>




            <div>
              PAYMENT GATEWAY HERE......


              Once done with the payment via paymongo, enter the reference number below and click confirm payment.
            </div>



            
            <div className="list-group">
              <div className="list-group-item">
                <h5>Enter Reference No.</h5>
                <input
                  type="text"
                  name="referenceNumber"
                  placeholder="Enter Reference No."
                  className="form-control mt-2"
                  value={referenceNumber} // ✅ controlled input
                  onChange={(e) => setReferenceNumber(e.target.value)} // ✅ update state

                />
                <p>Please enter reference number of your online transactions.</p>
              </div>
            </div>
          </div>


          <div className="modal-footer">
            <button className="btn btn-secondary rounded-pill" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleConfirm}
              disabled={!selectedMethod || referenceNumber.trim().length === 0}

            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentChannelModal;
