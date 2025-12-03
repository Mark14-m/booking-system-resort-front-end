import React, { useEffect, useState } from "react";
import AccountFormModal from "../../components/FormModal/AccountFormModal";
import { getUser,getUserRole } from "../../utils/auth";

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null); // for editing

  useEffect(() => {
    // Get currently logged-in user
    setLoggedUser(getUser());

    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("Error fetching accounts:", err));
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (!confirmDelete) return;

    try {
      const role = getUserRole(); 

      const res = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "role": role || "CUSTOMER", // send role header
      },
      });

      if (res.ok) {
        setAccounts((prev) => prev.filter((acc) => acc.id !== id));
        alert("Account deleted successfully!");
      } else {
        alert("Failed to delete account");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Error deleting account");
    }
  };

  // Handle Edit
  const handleEdit = (account) => {
    setSelectedAccount(account);
    // modal opens automatically because of data-bs-toggle
  };

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h5>Account List</h5>

            <div className="d-flex flex-row">
              <input
                className="form-control me-3"
                type="text"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="table-responsive text-nowrap">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Fullname</th>
                  <th>Email</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <tr key={acc.id}>
                      <td>{acc.fullName}</td>
                      <td>{acc.email}</td>
                      <td className="text-center">{acc.role}</td>
                      <td className="text-center flex items-center justify-center">
                        <button
                          type="button"
                          className="btn btn-danger me-2"
                          onClick={() => handleDelete(acc.id)}
                        >
                          <i className="bx bx-trash me-1"></i> Delete
                        </button>
                        <button
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modal_createEditAccount"
                          onClick={() => handleEdit(acc)}
                        >
                          <i className="bx bx-edit-alt me-1"></i> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-bg-secondary">
                    <td colSpan="4" className="text-center">
                      <div className="alert alert-light mb-0" role="alert">
                        There are no records available
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pass selectedAccount to modal */}
      <AccountFormModal account={selectedAccount} refreshAccounts={fetchAccounts} />
    </>
  );
}

export default AccountManagement;
