import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getUser, getUserRole, clearUser } from '../../utils/auth';

function ManagerNavbar() {
  const [user, setUser] = useState(null);
  const [userRole, setRole] = useState('GUEST');

  // ✅ Load user and role dynamically
  useEffect(() => {
    const loadUser = () => {
      const loggedUser = getUser();
      setUser(loggedUser);
      const role = getUserRole();
      setRole(role || 'GUEST');
    };

    loadUser();
    window.addEventListener('userChange', loadUser);
    window.addEventListener('storage', loadUser);

    return () => {
      window.removeEventListener('userChange', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const location = useLocation();
  const titleMap = {
    '/Manger': 'Dashboard',
    '/Manager/amenity': 'Amenities Management',
    '/Manager/book': 'Booking Management',
    '/Manager/customer': 'Customers Management',
    '/Manager/payment': 'Payment Management',
    '/Manager/room': 'Room Management',
  };

  const currentPath = Object.keys(titleMap).find(path =>
    location.pathname.startsWith(path)
  );
  const currentTitle = titleMap[currentPath] || 'Manager Panel';

  const handleLogout = () => {
    clearUser();
    window.dispatchEvent(new Event('userChange')); // 🔥 notify Navbar
    window.location.href = '/login';
  };

  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <button className="nav-item nav-link px-0 me-xl-4 btn btn-link border-0">
          <i className="bx bx-menu bx-sm"></i>
        </button>
      </div>

      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        <div className="d-flex justify-between align-middle w-100">
          <h4 className="mb-0 mt-2 w-100">{currentTitle}</h4>

          <div className="nav-item navbar-dropdown dropdown-user dropdown">
            <button
              className="nav-link dropdown-toggle hide-arrow hstack g-5 btn btn-link border-0"
              data-bs-toggle="dropdown"
            >
              <span className="mx-3">|</span>
              <span>{user?.fullName || user?.email || "Guest"}</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <div className="dropdown-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">|</div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">
                        {user?.fullName || user?.email || "Guest"}
                      </span>
                      <small className="text-muted">{userRole}</small>
                    </div>
                  </div>
                </div>
              </li>

              <li><div className="dropdown-divider"></div></li>

              <li>
                <button onClick={handleLogout} className="dropdown-item">
                  <i className="bx bx-power-off me-2"></i>
                  <span className="align-middle">Log Out</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ManegerNavbar;
