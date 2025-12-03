import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getUser } from '../../utils/auth';
import axios from 'axios';

function Dashboard() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })

  // Generate last N months labels (e.g., 12 months)
  const generateLastMonths = (count = 12) => {
    const labels = []
    const today = new Date()
    for (let i = count - 1; i >= 0; i--) {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1)
      labels.push(
        dt.toLocaleString('en-US', {
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Manila'
        })
      )
    }
    return labels
  }

  // Format backend month like "2025-09" → "Sep 2025"
  const formatMonthYearFromIso = (isoMonth) => {
    const parts = (isoMonth || '').split('-')
    if (parts.length < 2) return isoMonth
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const dt = new Date(Date.UTC(y, m, 1))
    return dt.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Manila' })
  }

useEffect(() => {
  const loggedUser = getUser()
  if (loggedUser) setUser(loggedUser)

  // Initialize stats object
  setStats({
    grossRevenue: 0,
    totalBookings: 0,
    totalAccounts: 0,
    totalCustomers: 0,
    totalAmenities: 0,
    availableRooms: 0,
    billCount: 0
  })

  // Fetch gross revenue
  axios.get('http://localhost:8080/api/dashboard/gross-revenue')
    .then(res => setStats(prev => ({ ...prev, grossRevenue: res.data.grossRevenue || 0 })))
    .catch(err => console.error('Error loading gross revenue:', err))

  // Fetch total bookings
  axios.get('http://localhost:8080/api/dashboard/total-bookings')
    .then(res => setStats(prev => ({ ...prev, totalBookings: res.data.totalBookings || 0 })))
    .catch(err => console.error('Error loading total bookings:', err))

    // Fetch total customers
  axios.get('http://localhost:8080/api/dashboard/total-customers')
  .then(res => setStats(prev => ({ ...prev, totalCustomers: res.data.totalCustomers })))
  .catch(err => console.error('Error loading total customers:', err))

  // Fetch total accounts
  axios.get('http://localhost:8080/api/dashboard/total-accounts')
    .then(res => setStats(prev => ({ ...prev, totalAccounts: res.data.totalAccounts })))
    .catch(err => console.error('Error loading total accounts:', err))

  //Fetch total amenities
  axios.get('http://localhost:8080/api/dashboard/total-amenities')
    .then(res => setStats(prev => ({ ...prev, totalAmenities: res.data.totalAmenities })))
    .catch(err => console.error('Error loading total amenities:', err))

  //Fetch total Bills
  axios.get('http://localhost:8080/api/dashboard/total-bills')
    .then(res => setStats(prev => ({ ...prev, billCount: res.data.totalBills })))
    .catch(err => console.error('Error loading total bills:', err))

  // Fetch monthly revenue for chart
  axios.get('http://localhost:8080/api/dashboard/monthly-revenue')
    .then(res => {
      const monthlyData = res.data
      const last12Months = generateLastMonths(12)

      const dataMap = {}
      monthlyData.forEach(m => {
        const label = formatMonthYearFromIso(m.month)
        dataMap[label] = Number(m.total || 0)
      })

      const chartLabels = last12Months
      const chartValues = last12Months.map(lbl => dataMap[lbl] || 0)

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Gross Revenue (₱)',
            data: chartValues,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      })
    })
    .catch(err => console.error('Error loading monthly revenue:', err))

    //Fetch total rooms
    axios.get('http://localhost:8080/api/dashboard/total-rooms')
    .then(res => setStats(prev => ({ ...prev, totalRooms: res.data.totalRooms })))
    .catch(err => console.error('Error loading total rooms:', err))

    //Fetch available rooms
    axios.get('http://localhost:8080/api/dashboard/available-rooms')
    .then(res => setStats(prev => ({ ...prev, availableRooms: res.data.availableRooms })))
    .catch(err => console.error('Error loading available rooms:', err)) 

}, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Gross Revenue' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const v = context.raw ?? context.parsed?.y ?? 0
            return `₱${Number(v).toLocaleString()}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: val => `₱${Number(val).toLocaleString()}`,
        },
      },
    },
  }
  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row">
        <div className="col-lg-7 col-xl-8 mb-4 order-0">
          <div className="card h-100">
            <div className="d-flex align-items-end row">
              <div className="col-sm-7">
                <div className="card-body">
                  <h5 className="card-title text-primary"> Welcome, {user?.fullName || user?.email || "Guest"}!🌟</h5>
                  <p className="mb-4">
                    Let's improve hotel and resort operations for a top-notch vacation!
                  </p>
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img src="/assets/img/illustrations/man-with-laptop-light.png" height="140"
                    alt="View Badge User" data-app-dark-img="illustrations/man-with-laptop-dark.png"
                    data-app-light-img="illustrations/man-with-laptop-light.png" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5 col-md-4 order-1 col-xl-4 order-md-2 order-lg-1 order-lg-1">
          <div className="row h-100">
            <div className="col-lg-6 col-md-12 col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx  bx-line-chart"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Gross Revenue</span>
                  <h3 className="card-title mb-2">₱{stats?.grossRevenue?.toLocaleString()  || 0}</h3>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12 col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx bxs-user-check"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Total Bookings</span>
                  <h3 className="card-title mb-2">{stats?.totalBookings || 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="col-12 col-lg-7 col-xl-8 mb-4 order-2 order-md-3 order-lg-2">
          <div className="card h-100">
            <div className="card-body">
              <div className="card-title">
                <h5>Total Gross</h5>
              </div>
              <div id="monthly_total" className="h-100" style={{ maxHeight: '500px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8 col-lg-5 col-xl-4 order-3 order-md-1 order-lg-3">
          <div className="row">
            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx bxs-user-rectangle"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Total Accounts</span>
                  <h3 className="card-title mb-2">{stats?.totalAccounts || 0}</h3>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx bx-check-double"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Total Customers</span>
                  <h3 className="card-title mb-2">{stats?.totalCustomers || 0}</h3>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx bxs-building-house"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Total Ammenities</span>
                  <h3 className="card-title mb-2">{stats?.totalAmenities || 0}</h3>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx bx-check-double"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Total Rooms</span>
                  <h3 className="card-title mb-2">{stats?.totalRooms || 0}</h3>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx bxs-wallet"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Bill Count</span>
                  <h3 className="card-title mb-2">{stats?.billCount || 0}</h3>
                </div>
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="card-title d-flex align-items-start justify-content-between">
                    <div className="avatar flex-shrink-0">
                      <button type="button" className="btn rounded-pill btn-icon btn-primary">
                        <span className="tf-icons bx bx-check-double"></span>
                      </button>
                    </div>
                  </div>
                  <span className="fw-semibold d-block mb-1">Available Rooms</span>
                  <h3 className="card-title mb-2">{stats?.availableRooms || 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-12 col-md-6 col-lg-5 col-xl-4 order-5">
          <div className="card overflow-hidden" style="max-height: 500px; height: 500px">
            <div className="card-header">
              <h5 className="card-title m-0 me-2">Recent Transactions</h5>
            </div>
            <div className="card-body ps ps--active-y" id="vertical-2">
              <ul className="p-0 m-0">

                        @foreach ($this->getBillsHistory() as $bill)
                <li className="d-flex mb-4 pb-1">
                  <div className="avatar flex-shrink-0 me-3">
                                    @if($bill->type === 'Maintenance')
                    <img src="../assets/img/icons/unicons/cc-warning.png" alt="User"
                      className="rounded" />
                                    @elseif($bill->type === 'Monthly Rent')
                    <img src="../assets/img/icons/unicons/cc-success.png" alt="User"
                      className="rounded" />
                    @else
                    <img src="../assets/img/icons/unicons/cc-primary.png" alt="User"
                      className="rounded" />
                    @endif
                  </div>
                  <div
                    className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                      <small className="text-muted d-block mb-1">{{ $bill-> payment_method}}</small>
                      <h6 className="mb-0">{{ $bill-> type}}</h6>
                    </div>
                    <div className="user-progress d-flex align-items-center gap-1">
                      <h6 className="mb-0">₱{{ number_format($bill-> amount, 2) }}</h6>
                    </div>
                  </div>
                </li>
                @endforeach


              </ul>

              <div className="ps__rail-y" style="top: 0px; height: 432px; right: 0px;">
                <div className="ps__thumb-y" tabIndex="0" style="top: 0px; height: 25px;"></div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Dashboard