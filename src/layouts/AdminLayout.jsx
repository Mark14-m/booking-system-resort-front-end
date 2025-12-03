import React from 'react'
import AdminNavbar from '../components/layouts/AdminNavbar'
import AdminSidebar from '../components/layouts/AdminSidebar'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
            <AdminSidebar />

            <div className="layout-page">
                <AdminNavbar />

                <div className="content-wrapper">
                    <Outlet />

                    <div className="content-backdrop fade"></div>
                </div>
            </div>
        </div>

        <div className="layout-overlay layout-menu-toggle"></div>
    </div>
  )
}

export default AdminLayout