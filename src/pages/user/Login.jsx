import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../utils/auth';
import { TailSpin } from 'react-loader-spinner';

function Login() {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 Real-time email validation while typing
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

  // 🔥 Real-time password validation while typing
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (emailError || passwordError || !email || !password) {
      return; // prevent login if validation not passed
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      if (response.data) {
        const userData = {
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
        };

        setUser(userData);
        window.dispatchEvent(new Event("userChange"));

        if (userData.role === "ADMIN" || userData.role === "MODERATOR") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const isInvalid = emailError || passwordError || !email || !password;

  return (
    <>
                  {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.6)",
          zIndex: 9999
        }}>
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            visible={true}
          />
        </div>
      )}

    <div className="d-flex flex-column flex-md-row vh-100">
      {/* Left Side */}
      <div
        className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(135deg, #6c63ff, #3f3d56)',
          color: 'white',
          padding: '40px',
        }}
      >
        <div className="text-center">
          <h1 className="display-3 fw-bold mb-4 text-white">Welcome Back!</h1>
          <p className="fs-4">
            Experience luxury and comfort at Blue Belle Resort. Log in to access your account and start your journey with us.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-light flex-grow-1">
        <div className="card shadow-lg p-5" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
          <h2 className="text-center mb-4 text-primary">Login</h2>
          <form onSubmit={handleLogin}>
            
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                placeholder="Enter your email"
                style={{ borderRadius: '10px' }}
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <div className="text-danger mt-1">{emailError}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                placeholder="Enter your password"
                style={{ borderRadius: '10px' }}
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              style={{ borderRadius: "10px", fontWeight: "bold" }}
              disabled={loading || isInvalid}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary fw-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
