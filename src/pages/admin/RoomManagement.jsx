import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');

  // 🔹 Fetch all room inventory
  const fetchRooms = () => {
    axios
      .get('http://localhost:8080/api/rooms/inventory')
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Error fetching room inventory:', err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🔹 Filter rooms by search input
  const filteredRooms = rooms.filter((room) =>
    room.roomType.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Handle increase of available rooms (+1)
  const handleIncreaseRoom = async (roomType, currentAvailable) => {
    const confirmIncrease = window.confirm(
      `Are you sure you want to increase available rooms for "${roomType}" by 1?`
    );

    if (!confirmIncrease) {
      alert('Action cancelled.');
      return;
    }

    const newAvailable = currentAvailable + 1;
    try {
      await axios.put(
        `http://localhost:8080/api/rooms/update/${roomType}?available=${newAvailable}`
      );
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomType === roomType
            ? { ...room, availableRooms: newAvailable }
            : room
        )
      );
      alert(`✅ Increased available rooms for "${roomType}" to ${newAvailable}.`);
    } catch (error) {
      console.error('Error increasing room count:', error);
      alert('❌ Failed to increase available rooms.');
    }
  };

  // 🔹 Handle decrease of available rooms (-1)
  const handleDecreaseRoom = async (roomType, currentAvailable) => {
    if (currentAvailable <= 0) {
      alert('⚠️ Available rooms cannot go below 0.');
      return;
    }

    const confirmDecrease = window.confirm(
      `Are you sure you want to decrease available rooms for "${roomType}" by 1?`
    );

    if (!confirmDecrease) {
      alert('Action cancelled.');
      return;
    }

    const newAvailable = currentAvailable - 1;
    try {
      await axios.put(
        `http://localhost:8080/api/rooms/update/${roomType}?available=${newAvailable}`
      );
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomType === roomType
            ? { ...room, availableRooms: newAvailable }
            : room
        )
      );
      alert(`✅ Decreased available rooms for "${roomType}" to ${newAvailable}.`);
    } catch (error) {
      console.error('Error decreasing room count:', error);
      alert('❌ Failed to decrease available rooms.');
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="mb-0">Room Inventory</h5>
          <input
            className="form-control w-25"
            type="text"
            placeholder="Search by room type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive text-nowrap">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Room Type</th>
                <th className="text-center">Total Rooms</th>
                <th className="text-center">Available Rooms</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <tr key={room.roomType}>
                    <td>{room.roomType}</td>
                    <td className="text-center">{room.totalRooms}</td>
                    <td className="text-center fw-bold">{room.availableRooms}</td>
                    <td className="text-center">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill me-2"
                          onClick={() =>
                            handleDecreaseRoom(room.roomType, room.availableRooms)
                          }
                        >
                          -1
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm rounded-pill"
                          onClick={() =>
                            handleIncreaseRoom(room.roomType, room.availableRooms)
                          }
                        >
                          +1
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-bg-secondary">
                  <td colSpan="4" className="text-center">
                    <div className="alert alert-light mb-0" role="alert">
                      No room inventory available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RoomManagement;
