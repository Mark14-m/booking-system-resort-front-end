import React from 'react'
import { NavLink } from 'react-router-dom'

function AdminSidebar() {
    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo mb-2">
                <span className="app-brand-link app-brand-text fw-bolder menu-text demo text-wrap text-center">
                    Blue Belle <br /> Resort & Hotel
                </span>

                <a href="javascript:void(0);"
                    className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>

            <div className="menu-inner-shadow"></div>

            <ul className="menu-inner py-1">

                <li className="menu-header small text-uppercase"><span className="menu-header-text">Main</span></li>

                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="menu-link">
                        <i className="menu-icon tf-icons bx bxs-home"></i>
                        <div data-i18n="Basic">Dashboard</div>
                    </div>
                </NavLink>

                <li className="menu-header small text-uppercase">
                    <span className="menu-header-text">Management</span>
                </li>


                <NavLink
                    to="/admin/feedback"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="menu-link">
                        <i className="menu-icon tf-icons bx bxs-school"></i>
                        <div data-i18n="Basic">Feedback Management</div>
                    </div>
                </NavLink>

                <NavLink
                    to="/admin/book"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="menu-link">
                        <i className="menu-icon tf-icons bx bxs-folder"></i>
                        <div data-i18n="Basic">Booking Management</div>
                    </div>
                </NavLink>

                <NavLink
                    to="/admin/customer"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="menu-link">
                        <i className="menu-icon tf-icons bx bxs-detail"></i>
                        <div data-i18n="Basic">Customers Management</div>
                    </div>
                </NavLink>

                <NavLink
                    to="/admin/payment"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="menu-link">
                        <i className="menu-icon tf-icons bx bxs-wallet"></i>
                        <div data-i18n="Basic">Payment Management</div>
                    </div>
                </NavLink>
                <NavLink
                    to="/admin/room"
                    className={({ isActive }) =>
                        `menu-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="menu-link">
                        <i className="menu-icon tf-icons bx bxs-bed"></i>
                        <div data-i18n="Basic">Room Management</div>
                    </div>
                </NavLink>
            </ul>
        </aside>
    )
}

export default AdminSidebar