import React, { useEffect, useState } from 'react'

function AmenityFormModal({ onAdd = () => {}, onEdit = () => {}, editAmenity = null } = {}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // populate form when editAmenity changes
  useEffect(() => {
    if (editAmenity && typeof editAmenity === 'object') {
      setName(editAmenity.name || "")
      setDescription(editAmenity.description || "")
    } else {
      setName("")
      setDescription("")
    }
  }, [editAmenity])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim() || !description.trim()) {
      alert("Please fill in all fields")
      return
    }

    if (editAmenity && editAmenity.id !== undefined) {
      onEdit({ id: editAmenity.id, name: name.trim(), description: description.trim() })
    } else {
      onAdd({ name: name.trim(), description: description.trim() })
    }

    closeModal()
  }

  const closeModal = () => {
    // Close bootstrap modal safely
    const modalEl = document.getElementById("modal_createEdiAmenity")
    if (modalEl && window.bootstrap && typeof window.bootstrap.Modal.getInstance === 'function') {
      const modalInst = window.bootstrap.Modal.getInstance(modalEl)
      if (modalInst) modalInst.hide()
    }

    // reset form
    setName("")
    setDescription("")
  }

  return (
    <div className="modal fade" id="modal_createEdiAmenity" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-sm modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editAmenity ? "Edit Amenity" : "Add New Amenity"}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Enter amenity"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary ms-2"
                >
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

export default AmenityFormModal
