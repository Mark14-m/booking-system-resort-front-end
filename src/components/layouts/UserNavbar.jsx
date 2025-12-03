import React, {  useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getUser, getUserRole, clearUser } from "../../utils/auth";
import axios from "axios"; 
import { TailSpin } from 'react-loader-spinner';

function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const [user, setUser] = useState(() => getUser());
  const [userRole, setRole] = useState(getUserRole() || "GUEST");
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [bookings, setBookings] = useState([]); // booking history state

  const [loggedUser, setLoggedUser] = useState(null);
  // const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [searchBook, setSearchBook] = useState("");

  const [names, setNames] = useState([]);
  const [fullName, setFullName] = useState("");
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setTimeout(() => setLoading(false), 3000); // simulate API call
  }, []);
  

  // get email from localStorage
  useEffect(() => {
    const loggedUser = getUser();
    if (loggedUser && loggedUser.email) {

      console.log("!++Logged in user email found: ", loggedUser.email);
      setEmail(loggedUser.email);
    } else {
      setEmail("");
    }
  }, [user]);



  useEffect(() => {
    const fetchBookingsByEmail = async () => {
      if (!email) return; // wait until email is set

      console.log("Fetching bookings for email in Navbar: ", email);

      try {
        const requestUrl = `http://localhost:8080/api/customers/full-name/${encodeURIComponent(
          email
        )}`;
        console.log("Requesting URL:", requestUrl);
        const response = await axios.get(requestUrl);
        console.log("Fetched bookings for email:", response.data);
        // make sure names is always an array
        setNames(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(
          "Error fetching bookings by email:",
          error?.response?.data || error?.message || error
        );
        setNames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsByEmail();
  }, [email]);




useEffect(() => {
  const fetchBookingsByName = async () => {
    if (!names || names.length === 0) return;

    try {
      const allBookings = await Promise.all(
        names.map(async (name) => {
          const response = await axios.get(
             `http://localhost:8080/api/bookings/by-name?name=${encodeURIComponent(name)}`
          );
          console.log(`Fetched bookings for ${name}:`, response.data);

          // Ensure response.data is an array, otherwise fallback to empty array
          return Array.isArray(response.data) ? response.data : [];
        })
      );

      // Flatten all arrays into a single array
      setBookingHistory(allBookings.flat());
    } catch (error) {
      console.error("Error fetching bookings for names:", error);
    }
  };

  fetchBookingsByName();
}, [names]);





  // console.log("Logged User in Navbar: ", loggedUser);
  // console.log("Email in Navbar: ", email);
  // console.log("Logged User in Navbar: ", fullName);
  // console.log("Fetched Names in Navbar: ", names);


  //  useEffect(() => {
  //   const fetchCustomerAndBookings = async () => {
  //     try {
  //       // 1️⃣ Fetch customer by ID
  //       const customerResp = await axios.get(
  //         `http://localhost:8080/api/customers/${customerId}`
  //       );

  //       const customerFullName = customerResp.data.fullName;
  //       console.log("Customer full name:", customerFullName);
  //       setFullName(customerFullName);

  //       // 2️⃣ Fetch bookings by full name
  //       const bookingsResp = await axios.get(
  //         `http://localhost:8080/api/bookings/search?fullName=${encodeURIComponent(customerFullName)}`
  //       );

  //       console.log("Booking history:", bookingsResp.data);
  //       setBookings(bookingsResp.data);

  //     } catch (error) {
  //       console.error("Error while fetching:", error);
  //     }
  //   };

  //   fetchCustomerAndBookings();
  // }, [customerId]); // runs when customerId changes

  // console.log("Full Name in Navbar: ", fullName);
  // console.log("Booking History in Navbar: ", bookingHistory);

//   const handleSearchBooking = async () => {
//   if (!email) return alert("Please enter an email");

//   try {
//     const response = await fetch(`http://localhost:8080/api/bookings/email/${email}`);
//     const data = await response.json();
//     console.log("Fetched bookings for email:", data);
//     // setSearchBook(data);
//   } catch (err) {
//     console.error("Error fetching bookings:", err);
//   }
// };

// get fullname using id via customer api
// then use the fullname to get bookings via bookings api



  // useEffect(() => {

    
  // const loggedUserEmail = getUser();
  // console.log("++Checking who's email is logged in: ", loggedUserEmail.email );
  // setLoggedUser(loggedUserEmail.email.toString());

  //   const resp =  axios.get(`http://localhost:8080/api/customers/full-name/${loggedUserEmail.email}`)
  //     .then((response) => {
  //       const customerData = response.data;
  //       setFullName(customerData);
  //       console.log("++Fetched full name: ", customerData); // customer data is in array
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching customer data:", error);
  //     });

  // }, []);


  

    


  // useEffect(() => {
  //   console.log("Updating user fullName in Navbar: ", fullName)

  // const encodedFullName = encodeURIComponent(fullName);

  // const response = axios.get(`http://localhost:8080/api/bookings/by-name?name=${encodedFullName}`);
  // const bookingsData =  response.json();
  // console.log("Bookings:", bookingsData);

  // }, [fullName]);


  
  useEffect(() => {
    const handleUserChange = () => {
      const loggedUser = getUser();
      const role = getUserRole();
      if (loggedUser) {
        console.log("UserNavbar detected user change:", loggedUser);
        setUser(loggedUser);
        setRole(role);
      } else {
        setUser(null);
        setRole("GUEST");
      }
    };

    // Listen for: app-level userChange, cross-tab storage events,
    // and navigation events (back/forward & bfcache restores).
    window.addEventListener("userChange", handleUserChange);
    window.addEventListener("storage", handleUserChange);
    window.addEventListener("popstate", handleUserChange);
    window.addEventListener("pageshow", handleUserChange);

    return () => {
      window.removeEventListener("userChange", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("popstate", handleUserChange);
      window.removeEventListener("pageshow", handleUserChange);
    };
  }, []);

  useEffect(() => {
    // Only prompt to log out if there is a logged-in user.
    if (location.pathname === "/login") {
      const currentUser = getUser();
      if (!currentUser) return; // nothing to do when not logged in

      const userConfirmed = window.confirm("You are currently logged in. Do you want to log out and continue to the login page?");

      if (userConfirmed) {
        clearUser();
        setUser(null);
        setRole("GUEST");
        // notify other listeners
        window.dispatchEvent(new Event("userChange"));
        alert("You have been logged out.");
      } else {
        navigate(-1); // go back
      }
    }
  }, [location.pathname, navigate]);

  //   // ⭐ FIX 2: Always re-check auth when component becomes visible or user navigates back
  // useEffect(() => {
  //   const syncAuthState = () => {
  //     const loggedUser = getUser();
  //     const role = getUserRole();

  //     if (loggedUser) {
  //       setUser(loggedUser);
  //       setRole(role);
  //     } else {
  //       setUser(null);
  //       setRole("GUEST");
  //     }
  //   };

  //   // Back/Forward navigation
  //   window.addEventListener("popstate", syncAuthState);

  //   // When page is restored from browser cache (bfcache)
  //   window.addEventListener("pageshow", (event) => {
  //     // event.persisted = true means browser loaded cached page
  //     syncAuthState();
  //   });

  //   return () => {
  //     window.removeEventListener("popstate", syncAuthState);
  //   };
  // }, []);


  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location]); // re-run on route change

const handleLogout = () => {
  clearUser();
  setUser(null);   // 🔥 force immediate UI update
  setRole("GUEST");
  window.dispatchEvent(new Event("userChange"));
  navigate("/login", { replace: true });  // prevent going back
};

  // Handle Book Now click: show loader while navigating or scrolling
  const handleBookNow = () => {
    if (!user) {
      setLoading(true);
      // navigate to login — navbar remains mounted so spinner shows
      navigate("/login");
    } else {
      // user already logged in: scroll to booking section

      scrollToSection("booking-cta");
      // hide loader after short delay (scroll completes)
      setTimeout(() => setLoading(false), 700);
    }
  };

  // Clear loader when location changes (navigation finished)
  useEffect(() => {
    setLoading(false);
  }, [location]);


  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/"); // go to homepage first
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100); // small delay to wait for DOM
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }

    // close mobile collapse
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };
  

  return (
    <>
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.6)",
          zIndex: 9999
        }}>
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            visible={true}
          />
        </div>
      )}
      <nav className="navbar navbar-expand-xl bg-white shadow sticky-top">
        <div className="container-xxl">
          <NavLink to="/" className="navbar-brand">
            <img
              src="/assets/img/projectImgs/logo.png"
              alt="Logo"
              style={{ height: "45px", width: "150px" }}
            />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end h-100" id="navbarNav">
            <ul className="navbar-nav align-items-center h-100">
              {["hero", "about", "amenities", "gallery", "footer"].map((section) => (
                <li
                  key={section}
                  className={`nav-item ${
                    activeSection === section
                      ? "active border-bottom border-4 border-primary fw-bold text-black"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="nav-link px-3 btn btn-link border-0"
                    onClick={() => scrollToSection(section)}
                  >
                    {section === "hero"
                      ? "Home"
                      : section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  className="btn btn-primary ms-xl-3"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </li>
            </ul>

            {user && (
              <div className="nav-item dropdown ms-3">
                <button
                  type="button"
                  className="btn btn-link nav-link dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="mx-3">|</span>
                  {user?.fullName || user?.email}
                </button>

                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <div className="dropdown-item">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">|</div>
                        <div className="flex-grow-1">
                          <span className="fw-semibold d-block">
                            {user?.fullName || user?.email}
                          </span>
                          <small className="text-muted">{userRole}</small>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li><div className="dropdown-divider"></div></li>

                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setShowBookingHistory(true)}
                    >
                      <i className="bx bx-history me-2"></i> Booking History
                    </button>
                  </li>

                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      <i className="bx bx-power-off me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Booking History Modal */}
      {showBookingHistory && (
  <div
    className="modal-container"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1055,
      overflowY: "auto",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Booking History</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowBookingHistory(false)}
          ></button>
        </div>

        <div className="modal-body">

          {/* RESULTS */}
          {bookingHistory.length === 0 ? (
            <p className="text-muted text-center">No bookings found.</p>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>FullName</th>
                    <th>Booking Code</th>
                    <th>Unit Type</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Adults</th>
                    <th>Kids</th>
                    <th>No. of Days</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Booking Status</th>
                  </tr>
                </thead>
                    <tbody>
                      {bookingHistory.map((b, index) => (
                        <tr key={`${b.id}-${index}`}>
                          <td>{b.fullname}</td>
                          <td>{b.bookingCode}</td>
                          <td>{b.unitType}</td>
                          <td>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : "-"}</td>
                          <td>{b.checkOut ? new Date(b.checkOut).toLocaleDateString() : "-"}</td>
                          <td>{b.adults}</td>
                          <td>{b.kids}</td>
                          <td>{b.noOfDays}</td>
                          <td>{(b.totalAmount || 0).toLocaleString()}</td>
                          <td>{b.paymentStatus}</td>
                          <td>{b.bookStatus}</td>
                        </tr>
                      ))}
                    </tbody>

              </table>
            </div>
          )}

        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowBookingHistory(false)}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    </>
  );
}
export default UserNavbar;

