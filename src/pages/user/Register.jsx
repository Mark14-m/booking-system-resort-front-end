import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER'); // Default role is CUSTOMER
  const navigate = useNavigate();

    const [errorFname, setErrorFname] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");


    // Real-time full name validation while typing - FNAME
  const handleFullNameChange = (e) => {
   const value = e.target.value;
    setFullName(value);
    if (!value) {
      setErrorFname("Full Name is required");
    }else if(value.length < 3){
      setErrorFname("Full Name must be completed");
    } 
    else {
      setErrorFname("");
    };
    }

  // Real-time password validation while typing - EMAIL
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // Real-time password validation while typing - PASSWORD
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  // Real-time password validation while typing - PASSWORD
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (!value) {
      setConfirmPasswordError("Password is required");
    } else if (password != value) {
      setConfirmPasswordError("Password didnt match");
    } 
    // else if(password == value){
    //     setConfirmPasswordError("Password matched");    -- change the text & border color to green of the border if matched
    // }
     else {
      setConfirmPasswordError("");
    }
  };
  

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        fullName,  // matches backend User.fullName
        email,     // matches backend User.email
        password,   // matches backend expects "password"
        role
      });
      alert("Registration successful");
      navigate('/login');
    } catch (error) {
      alert("Registration failed. Possible user is already existing or Try again.");
      console.error(error);
    }
  };



    return (
        <div className="d-flex flex-column flex-md-row vh-100">
            {/* Left Column */}
            <div
                className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #3f3d56, #6c63ff)',
                    color: 'white',
                    padding: '40px',
                }}
            >
                <div className="text-center px-4">
                    <h1 className="display-3 fw-bold mb-4 text-white">Join Us!</h1>
                    <p className="fs-4">
                        Create an account to enjoy exclusive benefits and start your journey with Blue Belle Resort.
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6 d-flex align-items-center justify-content-center bg-light flex-grow-1">
                <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                    <h2 className="text-center mb-4 text-primary">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                            <input
                                type="text"
                                className={`form-control ${errorFname ? "is-invalid" : ""}`}
                                id="fullName"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={handleFullNameChange}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                            {errorFname && <div className="text-danger mt-1">{errorFname}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                            {emailError && <div className="text-danger mt-1">{emailError}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-semibold">Password</label>
                            <input
                                type="password"
                                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                            {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                            <input
                                type="password"
                                className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                style={{ borderRadius: '10px' }}
                            />
                            {confirmPasswordError && <div className="text-danger mt-1">{confirmPasswordError}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userRole"className="form-label fw-semibold">User Role</label>
                            <select
                                id="userRole"
                                className="form-select"
                                style={{ borderRadius: '10px' }}
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MODERATOR">Moderator</option>
                                <option value="MODERATOR">Receptionins</option>
                                <option value="MODERATOR">Staff</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                            style={{ borderRadius: '10px', fontWeight: 'bold' }}
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-center mt-3">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary fw-semibold">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
