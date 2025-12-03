import React from 'react'

function AccountFormModal() {
    return (
        <div className="modal fade" id="modal_createEditAccount" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-sm modal-dialog-scrollable" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update account</h5>

                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Fullname</label>
                                <input type="text"
                                    className="form-control is_invalid" placeholder="Enter fullname"
                                    autoFocus />

                                <div className="invalid-feedback">
                                    Error
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="text"
                                    className="form-control is_invalid" placeholder="Enter email"
                                    autoFocus />

                                <div className="invalid-feedback">
                                    Error
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select className="form-select">
                                    <option selected>Default</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Moderator">Moderator</option>
                                    <option value="Customer">Customer</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        <button className="btn btn-primary ms-2">
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountFormModal