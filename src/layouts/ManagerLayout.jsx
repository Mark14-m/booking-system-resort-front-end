import React from 'react'
import ManagerNavbar from '../components/layouts/manager/ManagerNavbar'
import AdminSidebar from '../components/layouts/AdminSidebar'
import { Outlet } from 'react-router-dom'

function ManagerLayout() {
  return (
    <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
            {/* <AdminSidebar /> */}

            <div className="layout-page">
                <ManagerNavbar />

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