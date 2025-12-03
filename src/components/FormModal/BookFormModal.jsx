import axios from "axios";
import React, { useEffect, useState, useRef  } from "react";

function BookFormModal({ setBookings, bookings, editingBooking, setEditingBooking }) {

    // Helpers - local formatting instead of UTC
    const formatDate = (date) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    const formatTime = (date) => date.toTimeString().slice(0, 5); // HH:mm

    // Format for backend (ISO without milliseconds)
    const formatDateTimeForBackend = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };


  const getToday = () => formatDate(new Date());
  const getNowTime = () => formatTime(new Date());

    const parseDateTimeLocal = (dateStr, timeStr) => {
    const [y, m, d] = (dateStr || getToday()).split("-").map(Number);
    const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
    return new Date(y, m - 1, d, hh, mm, 0); // seconds = 0
    };


  const getDefaultCheckout = (checkIn) => {
    const co = new Date(checkIn);
    co.setHours(co.getHours() + 1);
    return {
      checkOutDate: formatDate(co),
      checkOutTime: formatTime(co),
    };
  };
      
   //Schedule
  const [booking, setBooking] = useState({});


const [roomAvailability, setRoomAvailability] = useState({});
const [userEmail, setUserEmail] = useState("");
const [userContact, setUserContact] = useState("");

const [customers, setCustomers] = useState([]); // fetched customers list
const [editingId, setEditingId] = useState(null);

const [roomCapacities, setRoomCapacities] = useState([]); // for capacity validation
const [maxCapacity, setMaxCapacity] = useState(null); // current selected room max capacity

const hasRun = useRef(false);


 // fetch customers once
  useEffect(() => {
    const fetchCustomerById = async () => {
    // if (!editingId) return; // skip if no ID

// if(editingBooking){
//   setEditingId(editingBooking.id)
// }

    try {
      // console.log("Fetching customer with ID:", editingBooking);
      const resp = await axios.get(`http://localhost:8080/api/customers`);

      
      // If your backend returns a single object, not an array:
      setCustomers(resp.data);
      console.log("Fetched customer:", resp);
    } catch (err) {
      console.error("Error fetching customer:", err);
      setCustomers([]);
    }
    };
    fetchCustomerById();
  }, []);


  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/rooms/room-availability");
        if (!res.ok) throw new Error("Failed to fetch room availability");
        const data = await res.json(); // expected array of arrays
        const map = {};
        data.forEach(([type, total, available]) => {
          map[type] = Number(available);
        });
        setRoomAvailability(map);
      } catch (err) {
        console.error("Error fetching room availability:", err);
      }
    };
    fetchAvailability();
  }, []);

// for adults and kids capacity validation
  useEffect(() => {
    const fetchRoomCapacities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rooms/room-capacities");
      
              // ✅ Convert array of arrays → object
      const capacityMap = Object.fromEntries(response.data);
          setRoomCapacities(capacityMap);
          

        console.log("Fetched room capacities:", response.data);
      } catch (error) {
        console.error("Error fetching room capacities:", error);
      }
    };

    fetchRoomCapacities();
  }, []);


useEffect(() => {
  if (roomCapacities && Object.keys(roomCapacities).length > 0) {
    Object.entries(roomCapacities).forEach(([type, capacity]) => {
      console.log("Checking type:", type);
      console.log("Capacity:", capacity);
    });
  }
}, [roomCapacities]);


const calculateTotalByGuests = (adults, kids) => {
  return adults * 150 + kids * 100; // <-- example formula
};



   // ✅ Iterate once the state is set
  // useEffect(() => {
  //   if (roomCapacities.length > 0) {
  //     roomCapacities.forEach(([type, capacity]) => {
  //       console.log("Checking type:", type);
  //       console.log("Capacity:", capacity);
  //     });
  //   }
  // }, [roomCapacities]);

//   useEffect(() => {
//   if (hasRun.current) return; // 👈 prevents second execution under StrictMode
//   hasRun.current = true;

//   console.log("#1 Room Capacities:", roomCapacities);
//   console.log("Selected Unit Type:", formData.unitType);


// }, []);


//   useEffect(() => {

//   console.log("#1 Room Capacities: ", roomCapacities);
//   console.log("Selected Unit Type:", formData.unitType);

//   // if (formData.unitType && roomCapacities.length > 0) {
//   //   const match = roomCapacities.find(([type]) => type === formData.unitType);
//   //   setMaxCapacity(match ? match[1] : null);
//   // }
// },
// // [formData.unitType, roomCapacities]
// );
  

  // Form state
  const [formData, setFormData] = useState({
    bookingCode: "",
    fullname: "",
    email: "",
    contactNumber: "",
    adults: 1,
    kids: 0,
    unitType: "",
    checkInDate: getToday(),
    checkInTime: getNowTime(),
    checkOutDate: getToday(),
    checkOutTime: getNowTime(),
    totalAmount: 0
  });

  // Update checkout automatically whenever check-in changes
  useEffect(() => {
    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
    setFormData((prev) => ({
      ...prev,
      checkOutDate,
      checkOutTime,
    }));
  }, [formData.checkInDate, formData.checkInTime]);

  // Update formData when editingBooking changes
  useEffect(() => {
    if (editingBooking) {

      console.log("EditingBooking id: " + editingBooking.id);
      const checkIn = new Date(editingBooking.checkIn);
      const checkOut = new Date(editingBooking.checkOut);


      // Try to find matching customer from fetched customers
      let matchedCustomer = null;

      // 1) booking may include nested customer object with id
      const bookingCustomerId = editingBooking?.customer?.id ?? editingBooking?.customerId ?? editingBooking?.customer_id;
      if (bookingCustomerId != null) {
        matchedCustomer = customers.find((c) => Number(c.id) === Number(bookingCustomerId));
      }

      // 2) match by email if present
      if (!matchedCustomer && (editingBooking?.customer?.email || editingBooking?.email)) {
        const targetEmail = (editingBooking.customer?.email || editingBooking.email || "").toString().toLowerCase();
        matchedCustomer = customers.find((c) => c.email && c.email.toLowerCase() === targetEmail);
      }

      // 3) fallback match by fullname
      if (!matchedCustomer && editingBooking?.fullname) {
        const targetName = editingBooking.fullname.toString().toLowerCase();
        matchedCustomer = customers.find((c) => c.fullname && c.fullname.toLowerCase() === targetName);
      }

      const emailVal =
        matchedCustomer?.email ??
        editingBooking.customer?.email ??
        editingBooking.email ??
        "";
      const contactVal =
        matchedCustomer?.contactNumber ??
        editingBooking.customer?.contactNumber ??
        editingBooking.contactNumber ??
        "";
   console.log("Customer:" + customers)
      console.log("Editing Booking:", editingBooking);
      console.log("email:", userEmail);
      console.log("contactNumber:", userContact);

      setFormData({
        bookingCode: editingBooking.bookingCode || "",
        fullname: editingBooking.fullname || "",
        email: emailVal,
        contactNumber: contactVal,
        adults: editingBooking.adults || 1,
        kids: editingBooking.kids || 0,
        unitType: editingBooking.unitType || "",
        checkInDate: formatDate(checkIn),
        checkInTime: formatTime(checkIn),
        checkOutDate: formatDate(checkOut),
        checkOutTime: formatTime(checkOut),
        totalAmount: editingBooking.totalAmount ?? 0
      });
      
    } else {
      const checkIn = new Date();
      const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
      setFormData({
        bookingCode: "",
        fullname: "",
        email: "",
        contactNumber: "",
        adults: 1,
        kids: 0,
        unitType: "",
        checkInDate: formatDate(checkIn),
        checkInTime: getNowTime(),
        checkOutDate,
        checkOutTime,
      });
    }
  }, [editingBooking]);



    const handleChange = (e) => {
    const { name, value } = e.target;

     // 🧠 If user is changing Adults or Kids count
  if (name === "adults" || name === "kids") {
    const nextValue = parseInt(value) || 0;

    // Compute next total guests based on current formData
    const nextData = { ...formData, [name]: nextValue };
    const total = (parseInt(nextData.adults) || 0) + (parseInt(nextData.kids) || 0);

    // Get the selected unit type and its capacity
    const selectedType = nextData.unitType;
    const max = roomCapacities[selectedType] || 99; // Default 99 if not selected yet

    if (selectedType && total > max) {
      alert(`Total guests (${total}) exceed the capacity (${max}) for ${selectedType}.`);
      return; // ❌ Stop here, don't update the state
    }


   // ⭐ UPDATE TOTAL AMOUNT ONLY WHEN ADULTS/KIDS CHANGE
  const updatedTotal = calculateTotalByGuests(nextData.adults, nextData.kids);

  console.log("Updated Total Amount:", updatedTotal);

  setFormData(prev => ({
    ...prev,
    [name]: nextValue,
    totalAmount: updatedTotal   // ⭐ update here
  }));

  return;
}


    setFormData(prev => ({ ...prev, [name]: value }));
    };



  const resetCheckout = () => {
    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const { checkOutDate, checkOutTime } = getDefaultCheckout(checkIn);
    setFormData((prev) => ({
      ...prev,
      checkOutDate,
      checkOutTime,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const checkIn = parseDateTimeLocal(formData.checkInDate, formData.checkInTime);
    const checkOut = parseDateTimeLocal(formData.checkOutDate, formData.checkOutTime);

    if (checkOut <= checkIn) {
      alert("Check-Out must be after Check-In.");
      return;
    }

    // Check overlapping bookings
    const hasOverlap = bookings.some((b) => {
      if (editingBooking && b.id === editingBooking.id) return false;
      const sameUnit = b.unitType.toLowerCase() === formData.unitType.toLowerCase();
      if (!sameUnit) return false;
      const existingCheckIn = new Date(b.checkIn);
      const existingCheckOut = new Date(b.checkOut);
      return checkIn < existingCheckOut && checkOut > existingCheckIn;
    });

    // if (hasOverlap) {
    //   alert("This booking overlaps with an existing booking for the same unit.");
    //   return;
    // }


        const selectedAvailable = roomAvailability[formData.unitType];
    if (typeof selectedAvailable !== "undefined" && selectedAvailable === 0 && !(editingBooking && editingBooking.unitType === formData.unitType)) {
      alert("Selected room type is currently unavailable. Please choose another room.");
      return;
    }

    const payload = {
      fullname: formData.fullname,
      adults: Number(formData.adults) || 1,
      kids: Number(formData.kids) || 0,
      unitType: formData.unitType,
      checkIn: formatDateTimeForBackend(checkIn),
      checkOut: formatDateTimeForBackend(checkOut),
      customer: {
        fullname: formData.fullname,
        email: formData.email,
        contactNumber: formData.contactNumber
      }
    };

    try {
      let response;

      if (editingBooking) {
        response = await fetch(`http://localhost:8080/api/bookings/${editingBooking.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

      } else {
        response = await fetch("http://localhost:8080/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
      
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        // This will show a clean alert
        alert(
          `Error response: ${errorData.error || "Failed to save booking"}`
        );
        return;
      } 
      // throw new Error("Failed to save booking");

      const savedBooking = await response.json();

      if (editingBooking) {
        setBookings(bookings.map((b) => (b.id === editingBooking.id ? savedBooking : b)));
        setEditingBooking(null);
        window.location.reload(); // Refresh page after delete
      } else {
        setBookings([...bookings, savedBooking]);
        window.location.reload(); // Refresh page after add
      }

      const modalElement = document.getElementById("modal_createEditBook");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();

    } catch (err) {
      console.error(err);
      alert("Error saving booking. Please try again.");
    }
  };


  return (
    <div className="modal fade" id="modal_createEditBook" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingBooking ? "Edit Booking" : "Add new booking"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <form className="row" onSubmit={handleSubmit}>
               {/* Booking Code (read-only, only when editing) */}
              {editingBooking && (
                <div className="col-12 mb-3">
                  <label className="form-label">Booking Code</label>
                  <input
                    className="form-control"
                    name="bookingCode"
                    value={formData.bookingCode}
                    readOnly
                  />
                </div>
              )}

              {/* User Select */}
              <div className="col-12 mb-3">
                <label className="form-label">Fullname</label>
                  <input
                    className="form-control"
                    name="fullname"
                    value={formData.fullname}
                    placeholder="Ex. Juan Dela Cruz"
                    onChange={handleChange}
                  />

                {/* <select className="form-select" name="fullname" value={formData.fullname} onChange={handleChange}>
                  <option value="">Select user</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Wick John">Wick John</option>
                  <option value="Tupe D">Tupe D</option>
                  <option value="Cassy G">Cassy G</option>
                </select> */}
              </div>

              {/* Email */}
            <div className="col-6 mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!!editingBooking} // Disable if editing
              />
                {editingBooking && (
                <small className="text-muted">
                  To update email, go to Customer Management.
                </small>
              )}
            </div>

            {/* Contact */}
          <div className="col-6 mb-3">
            <label className="form-label">Contact Number</label>
            <input
              className="form-control"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              disabled={!!editingBooking} // Disable if editing
            />
              {editingBooking && (
                <small className="text-muted">
                  To update contact number, go to Customer Management.
                </small>
              )}
          </div>

              {/* Adults */}
              <div className="col-6 mb-3">
                <label className="form-label">Adults</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData(prev => ({ ...prev, adults: Math.max(1, (parseInt(prev.adults) || 1) - 1) }))}>-</button>
                  <input type="text" className="form-control text-center" name="adults" value={formData.adults || 1} min={1} max={20} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" 
                   onClick={() =>
                    setFormData((prev) => {
                      const nextAdults = Math.min(20, (parseInt(prev.adults) || 1) + 1);
                      const total = nextAdults + (parseInt(prev.kids) || 0);

                      const selectedType = prev.unitType;
                      const max = roomCapacities[selectedType] || 99; // default large value if not selected

                      if (total > max) {
                        alert(`Total guests (${total}) exceed capacity (${max}) for ${selectedType}.`);
                        return prev; // do not update
                      }

                      return { ...prev, adults: nextAdults };
                    })
                  }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Kids */}
              <div className="col-6 mb-3">
                <label className="form-label">Kids</label>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setFormData(prev => ({ ...prev, kids: Math.max(0, (parseInt(prev.kids) || 0) - 1) }))}>-</button>
                  <input type="text" className="form-control text-center" name="kids" value={formData.kids || 0} min={1} max={20} onChange={handleChange} />
                  <button type="button" className="btn btn-outline-secondary" 
                  onClick={() =>
                    setFormData((prev) => {
                      const nextKids = Math.min(20, (parseInt(prev.kids) || 0) + 1);
                      const total = (parseInt(prev.adults) || 0) + nextKids;

                      const selectedType = prev.unitType;
                      const max = roomCapacities[selectedType] || 99;

                      if (total > max) {
                        alert(`Total guests (${total}) exceed capacity (${max}) for ${selectedType}.`);
                        return prev;
                      }

                      return { ...prev, kids: nextKids };
                    })
                  }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Unit Type */}
              {/* <div className="col-12 mb-3">
                <label className="form-label">Select Type</label>
                <select className="form-select" name="unitType" value={formData.unitType} onChange={handleChange}>
                  <option value="" disabled>Select Room</option>
                  <option value="ktv-room">KTV Room</option>
                  <option value="big-cabana">Big Cabana</option>
                  <option value="small-cabana">Small Cabana</option>
                  <option value="brown-table">Brown Table</option>
                  <option value="colored-table">Colored Table</option>
                  <option value="garden-table">Garden Table</option>
                  <option value="couple-room">Couple Room (Private)</option>
                  <option value="family-room">Family Room (Private)</option>
                </select>
              </div> */}

               <div className="col-12 mb-3">
                <label className="form-label">Select Type</label>
{/* -               <select className="form-select" name="unitType" value={formData.unitType} onChange={handleChange}>
-                  <option value="" disabled>Select Room</option>
-                  <option value="ktv-room">KTV Room</option>
-                  <option value="big-cabana">Big Cabana</option>
-                  <option value="small-cabana">Small Cabana</option>
-                  <option value="brown-table">Brown Table</option>
-                  <option value="colored-table">Colored Table</option>
-                  <option value="garden-table">Garden Table</option>
-                  <option value="couple-room">Couple Room (Private)</option>
-                  <option value="family-room">Family Room (Private)</option>
-                </select> */}
                <select className="form-select" name="unitType" value={formData.unitType} onChange={handleChange}>
                  <option value="" disabled>Select Room</option>
                  {[
                    { v: "ktv-room", l: "KTV Room" },
                    { v: "big-cabana", l: "Big Cabana" },
                    { v: "small-cabana", l: "Small Cabana" },
                    { v: "brown-table", l: "Brown Table" },
                    { v: "colored-table", l: "Colored Table" },
                    { v: "garden-table", l: "Garden Table" },
                    { v: "couple-room", l: "Couple Room (Private)" },
                    { v: "family-room", l: "Family Room (Private)" },
                  ].map(({ v, l }) => {
                    const available = roomAvailability[v];
                    const capacity = roomCapacities[v]; // ✅ get max capacity
                    const disabled =
                      typeof available !== "undefined" &&
                      available === 0 &&
                      !(editingBooking && editingBooking.unitType === v);

                    return (
                      <option key={v} value={v} disabled={disabled}>
                        {l}
                        {typeof capacity !== "undefined" ? ` — Max ${capacity} guests` : ""}
                        {typeof available !== "undefined" ? ` — ${available} available` : ""}
                        {disabled ? " (Unavailable)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
   <div className="col-md-6">
                      <label htmlFor="schedule" className="form-label fw-medium">Schedule</label>
                      <select
                        className="form-select"
                        id="schedule"
                        name="schedule"
                        value={booking.schedule}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Schedule</option>
                        <option value="Day Swimming">Day Swimming</option>
                        <option value="Night Swimming">Night Swimming</option>
                      </select>
                    </div>
              

              {/* Check In */}
              <div className="mb-3">
                <h5 className="mb-1">Check In</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input className="form-control" type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} min={getToday()} 
                    // disabled={!!editingBooking} 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input className="form-control" type="time" name="checkInTime" value={formData.checkInTime} onChange={handleChange} min={
                      !editingBooking && formData.checkInDate === getToday()
                        ? getNowTime()
                        : "00:00"
                    } 
                    // disabled={!!editingBooking} // Disable if editing
                    />
                  </div>
                </div>
              </div>

              {/* Check Out */}
              <div className="mb-3">
                <h5 className="mb-1">Check Out</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input className="form-control" type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} min={formData.checkInDate} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input className="form-control" type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} min={formData.checkOutDate === formData.checkInDate ? formData.checkInTime : "00:00"} />
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-warning" onClick={resetCheckout}>
                  Reset Checkout (Current Date & Time)
                </button>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary ms-2">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookFormModal;
