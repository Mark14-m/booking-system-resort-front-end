import React, {useState, useEffect}from 'react'

function CustomerFormModal({ editingCustomer, onSave }) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    gender: "",
    contactNumber: ""
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        fullname: editingCustomer.fullname || "",
        email: editingCustomer.email || "",
        gender: editingCustomer.gender || "",
        contactNumber: editingCustomer.contactNumber || ""
      });
    } else {
      setFormData({
        fullname: "",
        email: "",
        gender: "",
        contactNumber: ""
      });
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);

        // 🔹 Close modal after save
    const modalEl = document.getElementById("modal_createEditCustomer");
    const modal = window.bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  };
    return (
    <div className="modal fade" id="modal_createEditCustomer" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingCustomer ? "Edit Customer" : "Add new booking"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Fullname</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter fullname"
                  autoFocus
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Select Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary ms-2">
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerFormModal